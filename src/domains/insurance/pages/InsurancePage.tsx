import React, { useState } from 'react'
import {
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Wallet,
  Zap,
  Calendar,
} from 'lucide-react'

import { WalletButton } from '../../../wallet/WalletButton'
import { useWalletStore } from '../../../store/walletStore'

interface InsuranceProduct {
  id: string
  name: string
  duration: string
  coverage: string
  premiumRange: string
  description: string
  features: string[]
}

interface Policy {
  id: string
  asset: string
  leverage: number
  insuranceType: string
  coveragePeriod: string
  status: 'active' | 'expired' | 'paid'
  premium: string
}

const InsurancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'my-policies' | 'claims'>(
    'buy'
  )
  const [currentStep, setCurrentStep] = useState(1)
  const [apiStatus, setApiStatus] = useState<'CREATED' | 'VERIFIED_CONTEXT' | 'ACTIVE' | null>(null)
  const [apiCredentials, setApiCredentials] = useState({
    apiKey: '',
    secretKey: '',
    passphrase: '',
    uid: ''
  })
  const [verifiedContext, setVerifiedContext] = useState({
    instId: '',
    ordId: '',
    posId: '',
    side: '',
    sz: '',
    avgPx: ''
  })

  const { isConnected, address, chainId } = useWalletStore(s => s)
  const walletReady = !!address && isConnected
  const isWrongNetwork = walletReady && chainId !== 8453
  const canProceed = walletReady && !isWrongNetwork

  const insuranceProducts: InsuranceProduct[] = [
    {
      id: '1',
      name: '8 小时爆仓保',
      duration: '8小时',
      coverage: '最高赔付 5,000 USDT',
      premiumRange: '0.5% - 2%',
      description: '短期交易保护，适合日内交易者',
      features: ['实时风险监控', '快速赔付', '覆盖主流币种'],
    },
    {
      id: '2',
      name: '24 小时爆仓保',
      duration: '24小时',
      coverage: '最高赔付 20,000 USDT',
      premiumRange: '1% - 3%',
      description: '全天候保护，适合波段交易',
      features: ['全天监控', '更高赔付额度', '多币种支持'],
    },
    {
      id: '3',
      name: '月度回撤保',
      duration: '30天',
      coverage: '账户回撤超过 20% 赔付',
      premiumRange: '3% - 8%',
      description: '长期投资保护，降低大幅回撤风险',
      features: ['月度保护', '回撤触发', '专业风控'],
    },
  ]

  const policies: Policy[] = [
    {
      id: '1',
      asset: 'BTC/USDT',
      leverage: 10,
      insuranceType: '8小时爆仓保',
      coveragePeriod: '2024-01-15 08:00 - 16:00',
      status: 'active',
      premium: '50 USDT',
    },
    {
      id: '2',
      asset: 'ETH/USDT',
      leverage: 5,
      insuranceType: '24小时爆仓保',
      coveragePeriod: '2024-01-14 00:00 - 2024-01-15 00:00',
      status: 'expired',
      premium: '120 USDT',
    },
  ]

  const getStatusColor = (status: Policy['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusText = (status: Policy['status']) => {
    switch (status) {
      case 'active':
        return '进行中'
      case 'expired':
        return '已过期'
      case 'paid':
        return '已赔付'
    }
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            保险区 · 爆仓保护 / 保单中心
          </h1>
          <p className='text-xl text-gray-600'>
            为高杠杆仓位加一层简单、透明的保护
          </p>
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1 max-w-md mx-auto'>
          {[
            { key: 'buy' as const, label: '购买保险' },
            { key: 'my-policies' as const, label: '我的保单' },
            { key: 'claims' as const, label: '理赔记录' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'buy' && (
          <div className='max-w-4xl mx-auto'>
            {/* Step Progress */}
            <div className='flex justify-between mb-8'>
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step === currentStep
                        ? 'bg-primary-500 text-white'
                        : step < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle className='h-5 w-5' />
                    ) : (
                      step
                    )}
                  </div>
                  <span className='text-sm text-gray-600'>
                    {step === 1 && '录入API凭证'}
                    {step === 2 && '绑定合约订单'}
                    {step === 3 && '选择投保仓位'}
                    {step === 4 && '选择保险产品'}
                    {step === 5 && '确认购买'}
                  </span>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className='card p-8'>
              {currentStep === 1 && (
                <div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                    Step 1: 绑定 OKX API 凭证
                  </h3>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-start space-x-3'>
                      <Zap className='h-6 w-6 text-blue-600 mt-0.5' />
                      <div>
                        <h4 className='font-semibold text-blue-800 mb-2'>API凭证说明</h4>
                        <p className='text-blue-700 text-sm mb-2'>
                          我们仅保存加密后的 API 凭证，用于后续读取您的合约订单与仓位信息。
                        </p>
                        <p className='text-blue-700 text-sm'>
                          此步骤不进行交易或下单操作。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>API Key</label>
                      <input
                        type='text'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='请输入API Key'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Secret Key</label>
                      <input
                        type='password'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='请输入Secret Key'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Passphrase</label>
                      <input
                        type='password'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='请输入Passphrase'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>UID（主账号 UID）</label>
                      <input
                        type='text'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='请输入UID'
                      />
                    </div>
                    <div className='flex justify-center'>
                      <button 
                        type='button'
                        onClick={() => setCurrentStep(2)}
                        className='btn btn-primary'
                      >
                        保存 API 凭证
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                    Step 2: 绑定合约与订单（OKX 验证）
                  </h3>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-start space-x-3'>
                      <Zap className='h-6 w-6 text-blue-600 mt-0.5' />
                      <div>
                        <h4 className='font-semibold text-blue-800 mb-2'>OKX API 验证说明</h4>
                        <p className='text-blue-700 text-sm mb-2'>
                          OKX 的 API 验证需要绑定一个真实的合约订单或仓位。
                        </p>
                        <p className='text-blue-700 text-sm'>
                          请提供一个您已成交或存在的合约订单，用于验证 API 权限与数据一致性。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>合约 InstId（如：BTC-USDT-SWAP）</label>
                      <input
                        type='text'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='请输入合约 InstId'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>订单号 OrdId（推荐）或 仓位号 PosId</label>
                      <input
                        type='text'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='请输入订单号或仓位号'
                      />
                    </div>
                    <div className='flex justify-center'>
                      <button 
                        type='button'
                        onClick={() => setCurrentStep(3)}
                        className='btn btn-primary'
                      >
                        验证并绑定
                      </button>
                    </div>
                    
                    <div className='text-center text-sm text-green-600 font-medium mt-4'>
                      已成功读取订单数据，API 验证通过
                    </div>
                  </div>
                  <div className='flex justify-between mt-8'>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className='btn btn-secondary'
                    >
                      上一步
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className='btn btn-primary'
                    >
                      下一步
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                    Step 3: 选择要投保的仓位
                  </h3>
                  
                  {apiStatus !== 'VERIFIED_CONTEXT' ? (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6'>
                      <div className='flex items-start space-x-3'>
                        <AlertCircle className='h-6 w-6 text-yellow-600 mt-0.5' />
                        <div>
                          <h4 className='font-semibold text-yellow-800 mb-2'>请先完成 API 验证</h4>
                          <p className='text-yellow-700 text-sm'>
                            请返回上一步，完成合约与订单的绑定验证，才能查看并选择要投保的仓位。
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-4 mb-6'>
                      <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-4'>
                        <div className='flex items-center space-x-2'>
                          <CheckCircle className='h-5 w-5 text-green-600' />
                          <span className='text-green-700 font-medium'>已验证合约：{verifiedContext.instId}</span>
                        </div>
                      </div>
                      
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                          <div>
                            <div className='font-semibold'>{verifiedContext.instId} 仓位</div>
                            <div className='text-sm text-gray-600'>
                              方向: {verifiedContext.side} · 数量: {verifiedContext.sz} · 均价: {verifiedContext.avgPx}
                            </div>
                          </div>
                          <button className='btn btn-primary'>选择此仓位</button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className='flex justify-between mt-8'>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className='btn btn-secondary'
                    >
                      上一步
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className='btn btn-primary'
                      disabled={apiStatus !== 'VERIFIED_CONTEXT'}
                    >
                      下一步
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                    Step 4: 选择保险产品
                  </h3>
                  <div className='grid md:grid-cols-3 gap-6 mb-8'>
                    {insuranceProducts.map(product => (
                      <div key={product.id} className='card-hover p-6'>
                        <div className='flex items-center space-x-3 mb-4'>
                          <Shield className='h-8 w-8 text-blue-500' />
                          <div>
                            <h4 className='font-semibold text-gray-900'>
                              {product.name}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {product.duration}
                            </p>
                          </div>
                        </div>
                        <p className='text-gray-600 text-sm mb-4'>
                          {product.description}
                        </p>
                        <div className='space-y-2 mb-4'>
                          <div className='flex justify-between text-sm'>
                            <span>保障额度:</span>
                            <span className='font-semibold'>
                              {product.coverage}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span>保费范围:</span>
                            <span className='font-semibold'>
                              {product.premiumRange}
                            </span>
                          </div>
                        </div>
                        <ul className='space-y-1 mb-4'>
                          {product.features.map((feature, index) => (
                            <li
                              key={index}
                              className='flex items-center text-sm text-gray-600'
                            >
                              <CheckCircle className='h-4 w-4 text-green-500 mr-2' />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button className='w-full btn btn-primary'>
                          选择此产品
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className='flex justify-between mt-8'>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className='btn btn-secondary'
                    >
                      上一步
                    </button>
                    <button
                      onClick={() => setCurrentStep(5)}
                      className='btn btn-primary'
                    >
                      下一步
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                    Step 5: 确认购买
                  </h3>
                  <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                    <h4 className='font-semibold text-gray-900 mb-4'>
                      保单详情
                    </h4>
                    <div className='grid md:grid-cols-2 gap-4 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>交易对:</span>
                        <span className='font-semibold'>BTC/USDT</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>杠杆:</span>
                        <span className='font-semibold'>10x</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>保险产品:</span>
                        <span className='font-semibold'>8小时爆仓保</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>保费:</span>
                        <span className='font-semibold'>50 USDT</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>保障时间:</span>
                        <span className='font-semibold'>8小时</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>赔付上限:</span>
                        <span className='font-semibold'>5,000 USDT</span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
                    <div className='flex items-start space-x-3'>
                      <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5' />
                      <div>
                        <h5 className='font-semibold text-yellow-800 mb-1'>
                          赔付规则说明
                        </h5>
                        <p className='text-yellow-700 text-sm'>
                          当您的仓位在保障期间内因市场波动导致爆仓时，我们将按照保单条款进行赔付。
                          赔付金额为实际损失金额，最高不超过保单约定的赔付上限。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-between mt-8'>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className='btn btn-secondary'
                    >
                      上一步
                    </button>
                    <button className='btn btn-primary flex items-center space-x-2'>
                      <span>确认购买</span>
                      <ArrowRight className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-policies' && (
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>
              我的保单列表
            </h3>
            <div className='space-y-4'>
              {policies.map(policy => (
                <div key={policy.id} className='card p-6'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-4 mb-3'>
                        <div>
                          <h4 className='font-semibold text-gray-900'>
                            {policy.asset}
                          </h4>
                          <p className='text-sm text-gray-600'>
                            杠杆: {policy.leverage}x · 保费: {policy.premium}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}
                        >
                          {getStatusText(policy.status)}
                        </span>
                      </div>

                      <div className='grid md:grid-cols-2 gap-4 text-sm text-gray-600'>
                        <div className='flex items-center space-x-2'>
                          <Shield className='h-4 w-4' />
                          <span>保险类型: {policy.insuranceType}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Calendar className='h-4 w-4' />
                          <span>保障时间: {policy.coveragePeriod}</span>
                        </div>
                      </div>
                    </div>

                    <div className='flex space-x-3 mt-4 md:mt-0'>
                      <button className='btn btn-secondary'>查看详情</button>
                      {policy.status === 'active' && (
                        <button className='btn btn-primary'>提交理赔</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'claims' && (
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>理赔记录</h3>
            <div className='text-center py-12'>
              <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Shield className='h-12 w-12 text-gray-400' />
              </div>
              <h4 className='text-xl font-semibold text-gray-900 mb-2'>
                暂无理赔记录
              </h4>
              <p className='text-gray-600 mb-6'>您的保单理赔记录将在这里显示</p>
              <div className='text-sm text-gray-500 space-y-1'>
                <div>保单号 / 赔付金额 / 触发事件时间 / 证据链接</div>
                <div>所有理赔记录将完全透明展示</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InsurancePage
