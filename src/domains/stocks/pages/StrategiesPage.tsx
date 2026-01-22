import React, { useState } from 'react'

// 标的列表，可以以后抽到配置里
const ASSETS = [
  { symbol: 'BTC', label: 'BTC 多仓' },
  { symbol: 'ETH', label: 'ETH 多仓' },
  { symbol: 'SOL', label: 'SOL 多仓' },
]

const LEVERAGES = [2, 3, 5, 10, 20]

// NFT 份额分润模拟器（完整实现）
// 直接复用了你在 StrategiesLayout 中的版本，颜色和排版保持一致。
const NftShareSimulator: React.FC = () => {
  const [nftPrice, setNftPrice] = useState<number>(100)
  const [units, setUnits] = useState<number>(1) // 你买几份
  const userCapital = nftPrice * units // 你的总投入

  const [poolTarget, setPoolTarget] = useState<number>(1000) // 本局目标实盘本金
  const [raisedCapital, setRaisedCapital] = useState<number>(600) // 当前已募集金额（含你）

  const [profitRate, setProfitRate] = useState<number>(30) // 假设本局整体收益率
  const [authorShare, setAuthorShare] = useState<number>(20) // 作者分润比例
  const platformShare = 5 // 平台服务费占利润比例
  const followerShare = Math.max(0, 100 - authorShare - platformShare)

  const [capitalMode, setCapitalMode] = useState<'official' | 'user'>(
    'official'
  ) // 本金谁出
  const [leverage, setLeverage] = useState<number>(10) // 杠杆倍数（示例）

  const isPositive = profitRate > 0
  const totalProfitPerNft = isPositive ? (nftPrice * profitRate) / 100 : 0
  const followerProfitPerNft = (totalProfitPerNft * followerShare) / 100
  const authorProfitPerNft = (totalProfitPerNft * authorShare) / 100
  const platformProfitPerNft = (totalProfitPerNft * platformShare) / 100

  const followerProfitAll = followerProfitPerNft * units

  const presets = [-50, 0, 30, 100]

  const canOpen = raisedCapital >= poolTarget
  const progress = poolTarget > 0 ? Math.min(1, raisedCapital / poolTarget) : 0

  const format = (v: number) => v.toFixed(2)

  return (
    <section className='mt-2 md:mt-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 space-y-4'>
      <div>
        <h3 className='text-sm md:text-base font-semibold text-slate-900 mb-1'>
          一份 100U NFT · 分润结果模拟器
        </h3>
        <p className='text-[11px] md:text-xs text-slate-500'>
          你可以把它理解成：要么你自己拿本金开仓，要么由官方出本金，你只是买几份「局内
          NFT」。下面这个模拟器帮你算清楚：在不同收益率下，一份或多份 NFT
          的投入、什么时候可以开仓、以及三方怎么分钱。
        </p>
      </div>

      {/* 模式选择：本金谁出 + 杠杆 */}
      <div className='grid gap-4 md:grid-cols-3 text-[11px] md:text-xs'>
        <div className='space-y-2'>
          <div className='text-slate-500 mb-1'>本金谁出？</div>
          <div className='inline-flex rounded-full bg-slate-100 p-1'>
            <button
              onClick={() => setCapitalMode('official')}
              className={`px-3 py-1.5 rounded-full text-xs md:text-[13px] ${
                capitalMode === 'official'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              官方出本金
            </button>
            <button
              onClick={() => setCapitalMode('user')}
              className={`px-3 py-1.5 rounded-full text-xs md:text-[13px] ${
                capitalMode === 'user'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              你自己出本金
            </button>
          </div>
          <p className='text-[11px] text-slate-400'>
            这里只切换说明文案，不改变下面的计算公式，方便先把结构讲清楚，后面再接真实策略数据。
          </p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-slate-500'>
            <span>杠杆倍数（示例）</span>
            <span className='text-slate-900 font-medium'>{leverage}x</span>
          </div>
          <input
            type='range'
            min={1}
            max={50}
            value={leverage}
            onChange={e => setLeverage(Number(e.target.value))}
            className='w-full'
          />
          <p className='text-[11px] text-slate-400'>
            杠杆越高，实际盈亏波动越大。这里暂时只当作风险感知，不直接参与计算。
          </p>
        </div>

        <div className='space-y-2'>
          <div className='text-slate-500 mb-1'>退出方式（结构说明）</div>
          {capitalMode === 'official' ? (
            <ul className='space-y-1.5'>
              <li>· 进入：你用 U 买 NFT，不直接接触实盘账户。</li>
              <li>· 结算：这一局结束后，拿 NFT 来兑回「本金 + 分润」。</li>
              <li>· 中途：可以把 NFT 转给别人，接盘人拿后续分红。</li>
            </ul>
          ) : (
            <ul className='space-y-1.5'>
              <li>
                · 进入：你的本金在你自己的实盘账户里，按 {leverage}x 开仓。
              </li>
              <li>· 结算：平仓时先结算实盘盈亏，再按分润比例拆分利润。</li>
              <li>· NFT：只是记账凭证，用来确认谁有资格拿这局的分润。</li>
            </ul>
          )}
        </div>
      </div>

      {/* 输入区：价格 + 份数 + 收益率 + 分润 */}
      <div className='grid gap-4 md:grid-cols-3 text-xs md:text-sm'>
        <div className='space-y-2'>
          <div className='text-slate-500'>单张 NFT 价格（U）</div>
          <input
            type='number'
            value={nftPrice}
            onChange={e => {
              const v = Number(e.target.value)
              setNftPrice(Number.isNaN(v) ? 0 : v)
            }}
            className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-slate-900'
          />
          <div className='mt-2 space-y-1.5'>
            <div className='flex items-center justify-between text-slate-500'>
              <span>你买几份？</span>
              <input
                type='number'
                min={1}
                value={units}
                onChange={e => {
                  const v = Number(e.target.value)
                  setUnits(Number.isNaN(v) ? 1 : Math.max(1, v))
                }}
                className='w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-xs outline-none focus:border-slate-900'
              />
            </div>
            <div className='flex items-center justify-between text-[11px] text-slate-500'>
              <span>你的总投入</span>
              <span className='font-semibold text-slate-900'>
                {format(userCapital)} U
              </span>
            </div>
          </div>
          <p className='text-[11px] text-slate-400'>
            例：单价 100U，买 3 份 = 300U 投入；分润和服务费都会按份数线性放大。
          </p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-slate-500'>
            <span>本局整体收益率（示例）</span>
            <span className='text-slate-900 font-medium'>{profitRate}%</span>
          </div>
          <input
            type='range'
            min={-100}
            max={200}
            value={profitRate}
            onChange={e => setProfitRate(Number(e.target.value))}
            className='w-full'
          />
          <div className='flex flex-wrap gap-2 text-[11px] text-slate-400'>
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setProfitRate(p)}
                className={`px-2 py-1 rounded-full border ${
                  profitRate === p
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {p > 0 ? `+${p}%` : `${p}%`}
              </button>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-slate-500'>
            <span>作者分润比例</span>
            <span className='text-slate-900 font-medium'>{authorShare}%</span>
          </div>
          <input
            type='range'
            min={0}
            max={40}
            value={authorShare}
            onChange={e => setAuthorShare(Number(e.target.value))}
            className='w-full'
          />
          <p className='text-[11px] text-slate-400'>
            利润 = 跟单者 {followerShare}% + 作者 {authorShare}% + 平台{' '}
            {platformShare}%（仅对盈利部分生效）。
          </p>
        </div>
      </div>

      {/* 开仓门槛：多少资金可以开始这一局 */}
      <div className='rounded-2xl bg-slate-50 p-3 md:p-4 text-[11px] md:text-xs space-y-2'>
        <div className='flex items-center justify-between'>
          <span className='text-slate-500'>
            本局目标实盘本金（达到后才开仓）
          </span>
          <span className='font-medium text-slate-900'>
            {format(poolTarget)} U
          </span>
        </div>
        <input
          type='range'
          min={500}
          max={5000}
          step={100}
          value={poolTarget}
          onChange={e => setPoolTarget(Number(e.target.value))}
          className='w-full'
        />
        <div className='flex items-center justify-between mt-2'>
          <span className='text-slate-500'>当前已募集（含你这笔）</span>
          <span className='font-medium text-slate-900'>
            {format(raisedCapital)} U · 大约 {Math.round(progress * 100)}%
          </span>
        </div>
        <input
          type='range'
          min={0}
          max={poolTarget || 1}
          value={Math.min(raisedCapital, poolTarget)}
          onChange={e => setRaisedCapital(Number(e.target.value))}
          className='w-full'
        />
        <p className='mt-1 text-slate-500'>
          状态：
          {canOpen ? (
            <span className='text-emerald-600 font-medium'>
              ✅ 已达标，这一局可以开仓
            </span>
          ) : (
            <span className='text-amber-600 font-medium'>
              ⏳ 尚未达标，示例规则：只有累计金额 ≥ 目标本金时才会实盘开仓
            </span>
          )}
        </p>
      </div>

      {/* 结果区：三方各拿多少 */}
      <div className='grid gap-3 md:grid-cols-3 text-[11px] md:text-xs'>
        <div className='rounded-2xl bg-slate-50 p-3 md:p-4 flex flex-col gap-1.5'>
          <div className='text-slate-500 mb-1'>
            你（持有 {units} 份 NFT 的用户）
          </div>
          <div>
            <div className='flex justify-between'>
              <span>总投入</span>
              <span className='font-medium text-slate-900'>
                {format(userCapital)} U
              </span>
            </div>
            <div className='flex justify-between mt-1'>
              <span>可分到利润（示例）</span>
              <span className='font-medium text-emerald-600'>
                {isPositive ? `${format(followerProfitAll)} U` : '本局无分润'}
              </span>
            </div>
            <div className='flex justify-between mt-1'>
              <span>结算时大约可拿</span>
              <span className='font-semibold text-slate-900'>
                {isPositive
                  ? `${format(userCapital + followerProfitAll)} U`
                  : `${format(userCapital)} U（这里只演示利润部分）`}
              </span>
            </div>
          </div>
          <p className='mt-2 text-slate-400'>
            这个数字只说明：在这个收益率下，你这 {units} 份 NFT
            大概能分到多少利润；真实结算会按链上结果执行。
          </p>
        </div>

        <div className='rounded-2xl bg-slate-50 p-3 md:p-4 flex flex-col gap-1.5'>
          <div className='text-slate-500 mb-1'>策略作者</div>
          <div className='flex justify-between'>
            <span>每份对应作者收入</span>
            <span className='font-medium text-slate-900'>
              {isPositive
                ? `${format(authorProfitPerNft)} U / 份`
                : '本局无分润'}
            </span>
          </div>
          <div className='flex justify-between mt-1'>
            <span>如果本局卖出 10 份</span>
            <span className='font-medium text-slate-900'>
              {isPositive ? `${format(authorProfitPerNft * 10)} U` : '--'}
            </span>
          </div>
          <p className='mt-2 text-slate-400'>
            卖出的份额越多，你在同样收益率下拿到的总分润就越多；这里先用「卖出
            10 份」做一个体感示例。
          </p>
        </div>

        <div className='rounded-2xl bg-slate-50 p-3 md:p-4 flex flex-col gap-1.5'>
          <div className='text-slate-500 mb-1'>平台服务费（示例）</div>
          <div className='flex justify-between'>
            <span>每份对应平台分润</span>
            <span className='font-medium text-slate-900'>
              {isPositive ? `${format(platformProfitPerNft)} U` : '本局无分润'}
            </span>
          </div>
          <div className='flex justify-between mt-1'>
            <span>如果本局卖出 10 份</span>
            <span className='font-medium text-slate-900'>
              {isPositive ? `${format(platformProfitPerNft * 10)} U` : '--'}
            </span>
          </div>
          <p className='mt-2 text-slate-400'>
            平台只在有真实盈利时，从利润里抽 {platformShare}%
            作为服务费，用于风控、清算验证和基础设施；数字可以按实际协议调整。
          </p>
        </div>
      </div>
    </section>
  )
}

const StrategiesPage: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC')
  const [selectedLeverage, setSelectedLeverage] = useState<number>(5)
  const [poolSize, setPoolSize] = useState<number>(1000) // 资金盘总额度
  const [sharePrice, setSharePrice] = useState<number>(100) // 每份 100U

  const handlePoolSizeChange = (value: string) => {
    const num = Number(value.replace(/[^0-9.]/g, ''))
    if (!Number.isNaN(num)) setPoolSize(num)
  }

  const handleSharePriceChange = (value: string) => {
    const num = Number(value.replace(/[^0-9.]/g, ''))
    if (!Number.isNaN(num)) setSharePrice(num)
  }

  const totalShares =
    poolSize && sharePrice ? Math.floor(poolSize / sharePrice) : 0

  return (
    <div className='min-h-screen w-full bg-slate-100 text-slate-900'>
      <div className='mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10'>
        {/* 顶部：标的 + 杠杆 + 宣传文案 */}
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
            {/* 左侧：标题 + 卖点文案 */}
            <div className='flex-1 space-y-4'>
              <div className='inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'>
                <span className='h-1.5 w-1.5 rounded-full bg-blue-500' />
                一只资金盘 · 统一去 DEX 永续开仓
              </div>

              <h1 className='text-2xl font-semibold leading-snug text-slate-900 md:text-3xl'>
                用一只「资金盘」，
                <span className='text-blue-600'>
                  {' '}
                  去中心化永续交易所统一开仓
                </span>
              </h1>

              <p className='text-sm leading-relaxed text-slate-600 md:text-base'>
                官方一次性注入资金，拆成一份一份的 NFT 份额。
                规则写死在合约里，开仓过程可查，
                <span className='font-medium text-slate-900'>
                  {' '}
                  按局自动结算分润 / 亏损
                </span>
                。 你只需要决定：
                <span className='text-blue-600'>
                  {' '}
                  跟哪一局 · 买几份 · 上不上架卖掉
                </span>
                。
              </p>

              <ul className='grid gap-2 text-xs text-slate-600 md:grid-cols-3 md:text-sm'>
                <li className='rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2'>
                  <div className='text-[11px] uppercase tracking-wide text-slate-400'>
                    标的
                  </div>
                  <div className='mt-1 font-medium text-slate-900'>
                    {selectedAsset} 永续 · 多仓
                  </div>
                </li>
                <li className='rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2'>
                  <div className='text-[11px] uppercase tracking-wide text-slate-400'>
                    杠杆
                  </div>
                  <div className='mt-1 font-medium text-slate-900'>
                    ×{selectedLeverage}
                  </div>
                </li>
                <li className='rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2'>
                  <div className='text-[11px] uppercase tracking-wide text-slate-400'>
                    当前一局容量
                  </div>
                  <div className='mt-1 font-medium text-slate-900'>
                    {poolSize || 0} U · {totalShares} 份
                  </div>
                </li>
              </ul>
            </div>

            {/* 右侧：标的 & 杠杆选择 + 简要参数 */}
            <div className='w-full max-w-xs space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 md:text-sm'>
              <div className='space-y-2'>
                <div className='text-[11px] font-medium uppercase tracking-wide text-slate-400'>
                  1. 选择标的
                </div>
                <div className='flex flex-wrap gap-2'>
                  {ASSETS.map(asset => {
                    const active = asset.symbol === selectedAsset
                    return (
                      <button
                        key={asset.symbol}
                        type='button'
                        onClick={() => setSelectedAsset(asset.symbol)}
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition
                          ${
                            active
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        {asset.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className='space-y-2'>
                <div className='text-[11px] font-medium uppercase tracking-wide text-slate-400'>
                  2. 选择杠杆
                </div>
                <div className='flex flex-wrap gap-2'>
                  {LEVERAGES.map(lev => {
                    const active = lev === selectedLeverage
                    return (
                      <button
                        key={lev}
                        type='button'
                        onClick={() => setSelectedLeverage(lev)}
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition
                          ${
                            active
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        ×{lev}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <label className='space-y-1'>
                  <span className='block text-[11px] font-medium uppercase tracking-wide text-slate-400'>
                    资金盘总额 (U)
                  </span>
                  <input
                    type='number'
                    min={0}
                    value={poolSize}
                    onChange={e => handlePoolSizeChange(e.target.value)}
                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-900'
                  />
                </label>
                <label className='space-y-1'>
                  <span className='block text-[11px] font-medium uppercase tracking-wide text-slate-400'>
                    每份价格 (U)
                  </span>
                  <input
                    type='number'
                    min={0}
                    value={sharePrice}
                    onChange={e => handleSharePriceChange(e.target.value)}
                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-900'
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* 中间：NFT 分润模拟器 */}
        <NftShareSimulator />

        {/* 底部：三步说明 */}
        <section className='grid gap-6 md:grid-cols-3 text-xs text-slate-600'>
          <div className='rounded-2xl border border-slate-200 bg-white p-4 md:p-5'>
            <div className='mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600'>
              1
            </div>
            <h4 className='mb-2 font-medium text-slate-900'>选择标的和杠杆</h4>
            <p className='text-[11px] leading-relaxed'>
              官方会为每个标的和杠杆组合创建一个独立的资金盘。比如 BTC 5x、ETH
              10x 都是不同的盘。
            </p>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-4 md:p-5'>
            <div className='mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600'>
              2
            </div>
            <h4 className='mb-2 font-medium text-slate-900'>买入 NFT 份额</h4>
            <p className='text-[11px] leading-relaxed'>
              用 U 买入对应资金盘的 NFT 份额。每份价格固定，比如 100U/份。
            </p>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-4 md:p-5'>
            <div className='mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600'>
              3
            </div>
            <h4 className='mb-2 font-medium text-slate-900'>等待结算或转让</h4>
            <p className='text-[11px] leading-relaxed'>
              平仓后，按份数分润。中途也可以把 NFT 转给别人，接盘人拿后续分红。
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default StrategiesPage
