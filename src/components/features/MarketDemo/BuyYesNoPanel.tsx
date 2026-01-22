import React, { useMemo, useState } from 'react'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { parseUnits } from 'viem'

import { BASE_USDC, DEMO_MARKET_ABI, ERC20_ABI } from './abi'

const QUICK = [1, 5, 10, 20]
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const

const BuyYesNoPanel: React.FC<{ marketAddress: `0x${string}` }> = ({
  marketAddress,
}) => {
  const { address } = useAccount()
  const [side, setSide] = useState<'yes' | 'no'>('yes')
  const [amt, setAmt] = useState<string>('5')

  const amount6 = useMemo(() => {
    const n = Number(amt || '0')
    if (!Number.isFinite(n) || n <= 0) return 0n
    return parseUnits(String(n), 6)
  }, [amt])

  const allowanceEnabled =
    !!address && marketAddress.toLowerCase() !== ZERO_ADDRESS

  const { data: allowance } = useReadContract({
    address: BASE_USDC,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: allowanceEnabled ? [address, marketAddress] : undefined,
    query: {
      enabled: allowanceEnabled,
    },
  })

  const needApprove = typeof allowance === 'bigint' ? allowance < amount6 : true

  const { writeContract: writeApprove, data: approveHash, isPending: approving } =
    useWriteContract()

  const { writeContract: writeBuy, data: buyHash, isPending: buying } =
    useWriteContract()

  const { isLoading: approveMining } = useWaitForTransactionReceipt({
    hash: approveHash,
  })
  const { isLoading: buyMining } = useWaitForTransactionReceipt({ hash: buyHash })

  const busy = approving || buying || approveMining || buyMining

  const doApprove = () => {
    if (!amount6) return
    writeApprove({
      address: BASE_USDC,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [marketAddress, amount6],
    })
  }

  const doBuy = () => {
    if (!amount6) return
    writeBuy({
      address: marketAddress,
      abi: DEMO_MARKET_ABI,
      functionName: side === 'yes' ? 'buyYes' : 'buyNo',
      args: [amount6],
    })
  }

  return (
    <div>
      <div className='flex gap-2'>
        <button
          type='button'
          className={`flex-1 px-3 py-2 rounded-xl text-sm font-black border ${
            side === 'yes'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setSide('yes')}
        >
          BUY YES
        </button>
        <button
          type='button'
          className={`flex-1 px-3 py-2 rounded-xl text-sm font-black border ${
            side === 'no'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setSide('no')}
        >
          BUY NO
        </button>
      </div>

      <div className='mt-3 flex items-center gap-2'>
        <input
          value={amt}
          onChange={e => setAmt(e.target.value)}
          className='w-32 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold'
          placeholder='USDC'
          inputMode='decimal'
        />
        <div className='flex gap-2 flex-wrap'>
          {QUICK.map(q => (
            <button
              key={q}
              type='button'
              onClick={() => setAmt(String(q))}
              className='px-2.5 py-1.5 rounded-full text-xs font-bold border border-gray-200 bg-white hover:bg-gray-50'
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        {needApprove ? (
          <button
            type='button'
            disabled={!address || busy || amount6 === 0n}
            onClick={doApprove}
            className='flex-1 px-3 py-2 rounded-xl bg-stripe-900 text-white text-sm font-black disabled:opacity-50'
          >
            {busy ? '处理中…' : 'Approve USDC'}
          </button>
        ) : (
          <button
            type='button'
            disabled={!address || busy || amount6 === 0n}
            onClick={doBuy}
            className='flex-1 px-3 py-2 rounded-xl bg-stripe-900 text-white text-sm font-black disabled:opacity-50'
          >
            {busy ? '处理中…' : `Confirm ${side.toUpperCase()}`}
          </button>
        )}
      </div>

      <div className='mt-3 text-xs text-stripe-500'>
        Demo v0：买入后资金进入 YES/NO 池；Resolver 结算后赢家按比例 Claim。
      </div>
    </div>
  )
}

export default BuyYesNoPanel
