import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { formatUnits } from 'viem'
import { CHECKOUT_ABI, ERC20_ABI, BASE_USDC } from './liqpass-checkout-abi'

const LEVERAGE_OPTS = [40, 50, 60, 70, 80, 90, 100]
const INST_OPTS = ['BTC-USDT-SWAP', 'BTC-USDC-SWAP']
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const

interface QuoteResponse {
  quote: {
    buyer: string
    instId: string
    leverage: number
    principalUSDC: string
    payoutUSDC: string
    premiumUSDC: string
    expiry: number
    orderId: `0x${string}`
  }
  sig: `0x${string}`
  priced: {
    instId: string
    leverage: number
    principalUSDC: number
    payoutUSDC: number
    premiumUSDC: number
    p_liq_24h: number
    ratio: number
  }
}

const LiqPassCheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { address } = useAccount()

  const [instId, setInstId] = useState(INST_OPTS[0])
  const [leverage, setLeverage] = useState(50)
  const [principal, setPrincipal] = useState('100')
  const [quoteData, setQuoteData] = useState<QuoteResponse | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [quoteError, setQuoteError] = useState('')

  const checkoutAddress =
    (import.meta.env.VITE_CHECKOUT_CONTRACT as `0x${string}`) || ZERO_ADDRESS

  // --- Wagmi Hooks ---

  // 1. Check Allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: BASE_USDC,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args:
      address && checkoutAddress !== ZERO_ADDRESS
        ? [address, checkoutAddress]
        : undefined,
    query: {
      enabled: !!address && checkoutAddress !== ZERO_ADDRESS,
    },
  })

  // 2. Approve
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApproving,
  } = useWriteContract()

  const { isLoading: isApproveMining } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  // 3. Buy Policy
  const {
    writeContract: writeBuy,
    data: buyHash,
    isPending: isBuying,
  } = useWriteContract()

  const { isLoading: isBuyMining, isSuccess: isBuySuccess } =
    useWaitForTransactionReceipt({
      hash: buyHash,
    })

  // --- Logic ---

  const needApprove = useMemo(() => {
    if (!quoteData) return false
    const requiredAmount = BigInt(quoteData.quote.premiumUSDC) // User pays premium
    const currentAllowance = allowance || 0n
    return currentAllowance < requiredAmount
  }, [allowance, quoteData])

  const fetchQuote = async () => {
    if (!address) return
    setLoadingQuote(true)
    setQuoteError('')
    setQuoteData(null)

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: address,
          instId,
          leverage,
          principalUSDC: principal,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Failed to fetch quote')
      }

      const data: QuoteResponse = await res.json()
      setQuoteData(data)
    } catch (err: any) {
      console.error(err)
      setQuoteError(err.message || 'Error fetching quote')
    } finally {
      setLoadingQuote(false)
    }
  }

  const handleApprove = () => {
    if (!quoteData) return
    writeApprove({
      address: BASE_USDC,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [checkoutAddress, BigInt(quoteData.quote.premiumUSDC)],
    })
  }

  const handleBuy = () => {
    if (!quoteData) return
    const q = quoteData.quote
    const quoteTuple = {
      buyer: q.buyer as `0x${string}`,
      instId: q.instId,
      leverage: q.leverage,
      principalUSDC: BigInt(q.principalUSDC),
      payoutUSDC: BigInt(q.payoutUSDC),
      premiumUSDC: BigInt(q.premiumUSDC),
      expiry: BigInt(q.expiry),
      orderId: q.orderId,
    }

    writeBuy({
      address: checkoutAddress,
      abi: CHECKOUT_ABI,
      functionName: 'buyPolicy',
      args: [quoteTuple, quoteData.sig],
    })
  }

  const isBusy = isApproving || isApproveMining || isBuying || isBuyMining

  React.useEffect(() => {
    if (!isApproveMining && approveHash) {
      refetchAllowance()
    }
  }, [isApproveMining, approveHash, refetchAllowance])

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900 font-sans'>
      <div className='bg-white border-b border-gray-200 sticky top-0 z-40'>
        <div className='max-w-5xl mx-auto px-4 py-3 flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate('/accelerator')}
            className='flex items-center gap-2 text-sm font-bold text-stripe-600 hover:text-stripe-900 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Accelerator
          </button>

          <div className='text-sm font-black tracking-tight'>
            LiqPass <span className='text-stripe-500'>Checkout Demo</span>
          </div>

          <div className='text-xs font-bold px-2 py-1 rounded-full border bg-gray-50 text-gray-700'>
            Base Mainnet
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
            <div className='text-lg font-black mb-5 flex items-center gap-2'>
              <span className='bg-stripe-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'>
                1
              </span>
              Configure Policy
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide'>
                  Instrument
                </label>
                <div className='flex gap-2'>
                  {INST_OPTS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setInstId(opt)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                        instId === opt
                          ? 'bg-stripe-50 border-stripe-200 text-stripe-800'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide'>
                  Leverage
                </label>
                <div className='flex flex-wrap gap-2'>
                  {LEVERAGE_OPTS.map(lev => (
                    <button
                      key={lev}
                      onClick={() => setLeverage(lev)}
                      className={`py-1.5 px-3 rounded-lg border text-sm font-bold transition-all ${
                        leverage === lev
                          ? 'bg-stripe-50 border-stripe-200 text-stripe-800'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {lev}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide'>
                  Principal (USDC)
                </label>
                <input
                  type='number'
                  value={principal}
                  onChange={e => setPrincipal(e.target.value)}
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 text-lg font-bold focus:ring-2 focus:ring-stripe-100 focus:border-stripe-300 outline-none transition-all'
                  placeholder='100'
                />
              </div>

              <div className='pt-2'>
                <button
                  onClick={fetchQuote}
                  disabled={
                    !address || loadingQuote || parseFloat(principal) <= 0
                  }
                  className='w-full py-3 rounded-xl bg-stripe-900 text-white font-black text-sm hover:bg-stripe-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
                >
                  {loadingQuote && <Loader2 className='w-4 h-4 animate-spin' />}
                  Get Quote
                </button>
                {!address && (
                  <div className='text-center mt-2 text-xs text-red-500 font-bold'>
                    Please connect wallet first
                  </div>
                )}
                {quoteError && (
                  <div className='mt-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2'>
                    <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
                    {quoteError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {quoteData && (
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <div className='text-lg font-black mb-5 flex items-center gap-2'>
                <span className='bg-stripe-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'>
                  2
                </span>
                Review & Checkout
              </div>

              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div className='p-3 bg-gray-50 rounded-xl border border-gray-100'>
                  <div className='text-xs text-gray-500 font-medium mb-1'>
                    Premium (Cost)
                  </div>
                  <div className='text-xl font-black text-gray-900'>
                    {formatUnits(BigInt(quoteData.quote.premiumUSDC), 6)}{' '}
                    <span className='text-sm text-gray-500 font-bold'>
                      USDC
                    </span>
                  </div>
                </div>
                <div className='p-3 bg-green-50 rounded-xl border border-green-100'>
                  <div className='text-xs text-green-600 font-medium mb-1'>
                    Potential Payout
                  </div>
                  <div className='text-xl font-black text-green-800'>
                    {formatUnits(BigInt(quoteData.quote.payoutUSDC), 6)}{' '}
                    <span className='text-sm text-green-600 font-bold'>
                      USDC
                    </span>
                  </div>
                </div>
                <div className='col-span-2 flex justify-between px-2 text-sm text-gray-500'>
                  <span>Liquidation Price (24h)</span>
                  <span className='font-mono'>
                    {(
                      Number(quoteData.quote.premiumUSDC) /
                      Number(quoteData.quote.payoutUSDC)
                    ).toFixed(4)}{' '}
                    ratio
                  </span>
                </div>
              </div>

              <div className='flex gap-3'>
                {needApprove ? (
                  <button
                    onClick={handleApprove}
                    disabled={isBusy}
                    className='flex-1 py-3 rounded-xl bg-stripe-900 text-white font-black hover:bg-stripe-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2'
                  >
                    {(isApproving || isApproveMining) && (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    )}
                    {isApproving
                      ? 'Approving...'
                      : isApproveMining
                        ? 'Mining Approval...'
                        : 'Approve USDC'}
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={isBusy}
                    className='flex-1 py-3 rounded-xl bg-green-600 text-white font-black hover:bg-green-700 disabled:opacity-50 transition-all shadow-green-200 shadow-lg flex items-center justify-center gap-2'
                  >
                    {(isBuying || isBuyMining) && (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    )}
                    {isBuying
                      ? 'Confirming...'
                      : isBuyMining
                        ? 'Mining Transaction...'
                        : 'Buy Policy Now'}
                  </button>
                )}
              </div>

              {(approveHash || buyHash) && (
                <div className='mt-4 pt-4 border-t border-gray-100 space-y-2'>
                  {approveHash && (
                    <div className='flex items-center gap-2 text-xs'>
                      <div
                        className={`w-2 h-2 rounded-full ${isApproveMining ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}
                      />
                      <span className='text-gray-500'>Approve Tx:</span>
                      <a
                        href={`https://basescan.org/tx/${approveHash}`}
                        target='_blank'
                        rel='noreferrer'
                        className='font-mono text-stripe-600 hover:underline'
                      >
                        {approveHash.slice(0, 8)}...
                      </a>
                    </div>
                  )}
                  {buyHash && (
                    <div className='flex items-center gap-2 text-xs'>
                      <div
                        className={`w-2 h-2 rounded-full ${isBuyMining ? 'bg-yellow-400 animate-pulse' : isBuySuccess ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                      <span className='text-gray-500'>Buy Tx:</span>
                      <a
                        href={`https://basescan.org/tx/${buyHash}`}
                        target='_blank'
                        rel='noreferrer'
                        className='font-mono text-stripe-600 hover:underline'
                      >
                        {buyHash.slice(0, 8)}...
                      </a>
                    </div>
                  )}
                </div>
              )}

              {isBuySuccess && (
                <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800'>
                  <CheckCircle2 className='w-6 h-6' />
                  <div>
                    <div className='font-black'>Policy Purchased!</div>
                    <div className='text-xs opacity-80'>
                      Your insurance policy is now active on-chain.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className='lg:col-span-1 space-y-4'>
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
            <div className='text-sm font-black mb-3 text-gray-900'>
              Environment
            </div>
            <div className='space-y-3'>
              <div>
                <div className='text-[10px] uppercase font-bold text-gray-400'>
                  Checkout Contract
                </div>
                <div className='font-mono text-xs text-stripe-600 break-all bg-gray-50 p-2 rounded border border-gray-100 mt-1'>
                  {checkoutAddress}
                </div>
              </div>
              <div>
                <div className='text-[10px] uppercase font-bold text-gray-400'>
                  USDC Address
                </div>
                <div className='font-mono text-xs text-stripe-600 break-all bg-gray-50 p-2 rounded border border-gray-100 mt-1'>
                  {BASE_USDC}
                </div>
              </div>
            </div>
          </div>

          <div className='bg-blue-50 rounded-2xl p-6 border border-blue-100 text-blue-900'>
            <div className='text-sm font-black mb-2 flex items-center gap-2'>
              <AlertCircle className='w-4 h-4' />
              How it works
            </div>
            <p className='text-xs leading-relaxed opacity-80'>
              1. Select your instrument and leverage.
              <br />
              2. Enter principal amount to insure.
              <br />
              3. Backend generates a signed EIP-712 quote.
              <br />
              4. You approve USDC and call the smart contract.
              <br />
              5. The contract verifies the signature and mints your policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiqPassCheckoutPage
