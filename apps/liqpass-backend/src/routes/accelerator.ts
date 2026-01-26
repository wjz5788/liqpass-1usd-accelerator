import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ethers, isAddress } from 'ethers';
import { env } from '../env.js';
import { getMarketState } from '../domains/accelerator/marketState.js';
import { nextNonce } from '../domains/accelerator/nonceRepo.js';
import { lmsrCostDelta, lmsrPayoutDelta } from '../domains/accelerator/lmsrMath.js';
import { signQuote } from '../domains/accelerator/signQuote.js';
import { pool } from '../db/pool.js';

type BuyQuoteBody = {
  user: string;
  market: string;
  shares: string; // 最小单位
  isYes: boolean;
};

type SellQuoteBody = {
  user: string;
  market: string;
  shares: string; // 最小单位
  isYes: boolean;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function parseBuyBody(body: unknown): BuyQuoteBody {
  if (!isRecord(body)) throw new Error('Invalid JSON body');

  if (!isNonEmptyString(body.user)) throw new Error('user is required');
  if (!isAddress(body.user)) throw new Error('user must be an address');
  if (!isNonEmptyString(body.market)) throw new Error('market is required');
  if (!isAddress(body.market)) throw new Error('market must be an address');
  if (!isNonEmptyString(body.shares)) throw new Error('shares is required');
  if (typeof body.isYes !== 'boolean') throw new Error('isYes must be a boolean');

  return {
    user: body.user,
    market: body.market,
    shares: body.shares,
    isYes: body.isYes
  };
}

function parseSellBody(body: unknown): SellQuoteBody {
  if (!isRecord(body)) throw new Error('Invalid JSON body');

  if (!isNonEmptyString(body.user)) throw new Error('user is required');
  if (!isAddress(body.user)) throw new Error('user must be an address');
  if (!isNonEmptyString(body.market)) throw new Error('market is required');
  if (!isAddress(body.market)) throw new Error('market must be an address');
  if (!isNonEmptyString(body.shares)) throw new Error('shares is required');
  if (typeof body.isYes !== 'boolean') throw new Error('isYes must be a boolean');

  return {
    user: body.user,
    market: body.market,
    shares: body.shares,
    isYes: body.isYes
  };
}

function requireQuoteEnv(): { signerPk: string; baseRpc: string } {
  const signerPk = env.QUOTE_SIGNER_PK;
  const baseRpc = env.BASE_RPC;
  if (!signerPk) throw new Error('Missing env var QUOTE_SIGNER_PK');
  if (!baseRpc) throw new Error('Missing env var BASE_RPC');
  return { signerPk, baseRpc };
}

export async function registerAcceleratorRoutes(
  app: FastifyInstance
): Promise<void> {
  // 项目相关路由
  app.get(
    '/accelerator/projects',
    async (req: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send([]);
    }
  );

  app.get(
    '/accelerator/projects/:id',
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = req.params;
      return reply.code(200).send({ id, name: 'Test Project', ticker: 'TEST' });
    }
  );

  app.post(
    '/accelerator/projects',
    async (req: FastifyRequest, reply: FastifyReply) => {
      return reply.code(201).send({ id: '1', name: 'New Project', ticker: 'NEW' });
    }
  );

  app.post(
    '/api/quote/buy',
    async (req: FastifyRequest<{ Body: BuyQuoteBody }>, reply: FastifyReply) => {
      let body: BuyQuoteBody;
      try {
        body = parseBuyBody(req.body);
      } catch (e) {
        return reply.code(400).send({ error: (e as Error).message });
      }

      const { signerPk, baseRpc } = requireQuoteEnv();
      const provider = new ethers.JsonRpcProvider(baseRpc);
      const signer = new ethers.Wallet(signerPk, provider);

      // 1. 获取市场状态
      let marketState;
      try {
        marketState = await getMarketState(provider, body.market);
      } catch (e) {
        return reply.code(500).send({ error: `Failed to get market state: ${(e as Error).message}` });
      }

      // 2. 获取用户 nonce
      let nonce;
      try {
        nonce = await nextNonce(body.user);
      } catch (e) {
        return reply.code(500).send({ error: `Failed to get nonce: ${(e as Error).message}` });
      }

      // 3. 计算成本
      const sharesSmallest = BigInt(body.shares);
      let cost;
      try {
        cost = lmsrCostDelta({
          b: marketState.b,
          qYes: marketState.qYes,
          qNo: marketState.qNo,
          dq: sharesSmallest,
          addToYes: body.isYes
        });
      } catch (e) {
        return reply.code(500).send({ error: `Failed to calculate cost: ${(e as Error).message}` });
      }

      // 4. 签名报价
      const expiry = Math.floor(Date.now() / 1000) + 5 * 60; // 5分钟过期
      let sigResult;
      try {
        sigResult = await signQuote({
          signer,
          provider,
          verifyingContract: body.market,
          user: body.user,
          isBuy: true,
          isYes: body.isYes,
          sharesSmallest,
          amountSmallest: cost,
          expiry,
          nonce
        });
      } catch (e) {
        return reply.code(500).send({ error: `Failed to sign quote: ${(e as Error).message}` });
      }

      // 5. 记录审计日志
      try {
        await pool.query(
          `INSERT INTO accelerator_quote_audit (
            user_address, market_address, is_buy, is_yes, 
            shares_amount, quote_amount, expiry, nonce, sig
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            body.user,
            body.market,
            true,
            body.isYes,
            sharesSmallest.toString(),
            cost.toString(),
            expiry,
            nonce.toString(),
            sigResult.sig
          ]
        );
      } catch (e) {
        return reply.code(500).send({ error: `Failed to save quote audit: ${(e as Error).message}` });
      }

      return reply.code(200).send({
        quote: {
          user: sigResult.value.user,
          isBuy: sigResult.value.isBuy,
          isYes: sigResult.value.isYes,
          shares: sigResult.value.shares,
          amount: sigResult.value.amount,
          expiry: sigResult.value.expiry,
          nonce: sigResult.value.nonce
        },
        sig: sigResult.sig
      });
    }
  );

  app.post(
    '/api/quote/sell',
    async (req: FastifyRequest<{ Body: SellQuoteBody }>, reply: FastifyReply) => {
      let body: SellQuoteBody;
      try {
        body = parseSellBody(req.body);
      } catch (e) {
        return reply.code(400).send({ error: (e as Error).message });
      }

      const { signerPk, baseRpc } = requireQuoteEnv();
      const provider = new ethers.JsonRpcProvider(baseRpc);
      const signer = new ethers.Wallet(signerPk, provider);

      // 1. 获取市场状态
      let marketState;
      try {
        marketState = await getMarketState(provider, body.market);
      } catch (e) {
        return reply.code(500).send({ error: `Failed to get market state: ${(e as Error).message}` });
      }

      // 2. 获取用户 nonce
      let nonce;
      try {
        nonce = await nextNonce(body.user);
      } catch (e) {
        return reply.code(500).send({ error: `Failed to get nonce: ${(e as Error).message}` });
      }

      // 3. 计算收益
      const sharesSmallest = BigInt(body.shares);
      let payout;
      try {
        payout = lmsrPayoutDelta({
          b: marketState.b,
          qYes: marketState.qYes,
          qNo: marketState.qNo,
          dq: sharesSmallest,
          sellYes: body.isYes
        });
      } catch (e) {
        return reply.code(500).send({ error: `Failed to calculate payout: ${(e as Error).message}` });
      }

      // 4. 签名报价
      const expiry = Math.floor(Date.now() / 1000) + 5 * 60; // 5分钟过期
      let sigResult;
      try {
        sigResult = await signQuote({
          signer,
          provider,
          verifyingContract: body.market,
          user: body.user,
          isBuy: false,
          isYes: body.isYes,
          sharesSmallest,
          amountSmallest: payout,
          expiry,
          nonce
        });
      } catch (e) {
        return reply.code(500).send({ error: `Failed to sign quote: ${(e as Error).message}` });
      }

      // 5. 记录审计日志
      try {
        await pool.query(
          `INSERT INTO accelerator_quote_audit (
            user_address, market_address, is_buy, is_yes, 
            shares_amount, quote_amount, expiry, nonce, sig
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            body.user,
            body.market,
            false,
            body.isYes,
            sharesSmallest.toString(),
            payout.toString(),
            expiry,
            nonce.toString(),
            sigResult.sig
          ]
        );
      } catch (e) {
        return reply.code(500).send({ error: `Failed to save quote audit: ${(e as Error).message}` });
      }

      return reply.code(200).send({
        quote: {
          user: sigResult.value.user,
          isBuy: sigResult.value.isBuy,
          isYes: sigResult.value.isYes,
          shares: sigResult.value.shares,
          amount: sigResult.value.amount,
          expiry: sigResult.value.expiry,
          nonce: sigResult.value.nonce
        },
        sig: sigResult.sig
      });
    }
  );
}
