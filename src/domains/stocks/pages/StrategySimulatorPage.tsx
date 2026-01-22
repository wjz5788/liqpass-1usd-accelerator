import React, { useState } from 'react';
import { Calculator, TrendingUp, Users, Zap, Target } from 'lucide-react';

interface ProfitDistribution {
  user: number;
  platform: number;
  nftHolder: number;
}

const StrategySimulatorPage: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(10000);
  const [leverage, setLeverage] = useState<number>(10);
  const [mode, setMode] = useState<'principal' | 'leverage'>('principal');
  const [returnRate, setReturnRate] = useState<number>(15);

  // 计算收益和分润
  const calculateProfit = (): ProfitDistribution => {
    const baseAmount = mode === 'principal' ? principal : principal * leverage;
    const totalProfit = baseAmount * (returnRate / 100);
    
    // 分润比例：用户70%，平台20%，NFT持有者10%
    return {
      user: totalProfit * 0.7,
      platform: totalProfit * 0.2,
      nftHolder: totalProfit * 0.1
    };
  };

  const profitDistribution = calculateProfit();
  const totalProfit = profitDistribution.user + profitDistribution.platform + profitDistribution.nftHolder;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">策略模拟器</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            NFT分润模拟器 - 体验不同本金、杠杆和收益率下的三方分润效果
          </p>
        </div>

        {/* 模拟器主面板 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* 左侧：输入控制面板 */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">模拟参数</h2>
              
              {/* 模式选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  本金模式
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMode('principal')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'principal'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    本金模式
                  </button>
                  <button
                    onClick={() => setMode('leverage')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'leverage'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    杠杆模式
                  </button>
                </div>
              </div>

              {/* 本金输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  本金金额 (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="100"
                    step="100"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">USD</span>
                </div>
              </div>

              {/* 杠杆倍数 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  杠杆倍数
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-semibold text-gray-700 min-w-[3rem]">
                    {leverage}x
                  </span>
                </div>
              </div>

              {/* 收益率 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预期收益率 (%)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="-50"
                    max="200"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className={`text-lg font-semibold min-w-[4rem] ${
                    returnRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {returnRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：结果展示面板 */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">收益分析</h2>
              
              {/* 总收益概览 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">总收益</h3>
                    <p className="text-sm text-gray-600">基于当前参数计算</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-600">
                      实际交易金额: ${(mode === 'principal' ? principal : principal * leverage).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 分润详情 */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">三方分润详情</h4>
                
                {/* 用户收益 */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">用户收益</div>
                      <div className="text-sm text-gray-600">70% 分润比例</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      ${profitDistribution.user.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* 平台收益 */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">平台收益</div>
                      <div className="text-sm text-gray-600">20% 分润比例</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      ${profitDistribution.platform.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* NFT持有者收益 */}
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">NFT持有者收益</div>
                      <div className="text-sm text-gray-600">10% 分润比例</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-purple-600">
                      ${profitDistribution.nftHolder.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">选择模式</h4>
              <p className="text-sm text-gray-600">本金模式或杠杆模式，体验不同交易策略</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">调整参数</h4>
              <p className="text-sm text-gray-600">设置本金、杠杆和预期收益率</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">查看分润</h4>
              <p className="text-sm text-gray-600">实时查看用户、平台、NFT持有者的收益分配</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategySimulatorPage;