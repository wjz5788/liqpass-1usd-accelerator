import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LotteryRound {
  id: string;
  roundNumber: number;
  prizePool: number;
  ticketPrice: number;
  ticketsSold: number;
  endTime: string;
  status: 'active' | 'ended' | 'upcoming';
  winners?: {
    address: string;
    prize: number;
    position: number;
  }[];
}

const mockLotteryRounds: LotteryRound[] = [
  {
    id: '1',
    roundNumber: 42,
    prizePool: 25000,
    ticketPrice: 1,
    ticketsSold: 25000,
    endTime: '2024-01-15T20:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    roundNumber: 41,
    prizePool: 18500,
    ticketPrice: 1,
    ticketsSold: 18500,
    endTime: '2024-01-08T20:00:00Z',
    status: 'ended',
    winners: [
      { address: '0x1234...5678', prize: 9250, position: 1 },
      { address: '0x8765...4321', prize: 5550, position: 2 },
      { address: '0xabcd...efgh', prize: 3700, position: 3 }
    ]
  },
  {
    id: '3',
    roundNumber: 43,
    prizePool: 0,
    ticketPrice: 1,
    ticketsSold: 0,
    endTime: '2024-01-22T20:00:00Z',
    status: 'upcoming'
  }
];

const LotteryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRound, setSelectedRound] = useState<string>('1');
  const [ticketCount, setTicketCount] = useState<number>(1);

  const currentRound = mockLotteryRounds.find(r => r.id === selectedRound);

  const handleBuyTickets = () => {
    console.log(`Buying ${ticketCount} tickets for round ${currentRound?.roundNumber}`);
  };

  const formatTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return '已结束';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时 ${minutes}分钟`;
    return `${minutes}分钟`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'ended': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/accelerator')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回加速器
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎲 抽奖区 · Lottery
          </h1>
          <p className="text-gray-600">
            每周开奖，1U 一张票，50% 进入奖池，50% 支持项目。公开透明，链上可查。
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-white p-4 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide">当前奖池</p>
            <p className="text-lg font-semibold text-gray-900">${currentRound?.prizePool.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide">已售票数</p>
            <p className="text-lg font-semibold text-gray-900">{currentRound?.ticketsSold.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide">票价</p>
            <p className="text-lg font-semibold text-gray-900">${currentRound?.ticketPrice}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide">剩余时间</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatTimeLeft(currentRound?.endTime || '')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Round */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Round */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  第 {currentRound?.roundNumber} 期
                </h2>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(currentRound?.status || '')}`}>
                  {currentRound?.status === 'active' && '进行中'}
                  {currentRound?.status === 'ended' && '已结束'}
                  {currentRound?.status === 'upcoming' && '即将开始'}
                </span>
              </div>

              {currentRound?.status === 'active' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white text-center">
                    <p className="text-sm opacity-90">当前奖池</p>
                    <p className="text-3xl font-bold">${currentRound.prizePool.toLocaleString()}</p>
                    <p className="text-sm opacity-90 mt-1">
                      已售 {currentRound.ticketsSold.toLocaleString()} 张票
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        购买票数
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={ticketCount}
                          onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)}
                          className="w-16 text-center border border-gray-300 rounded-lg py-2"
                          min="1"
                        />
                        <button
                          onClick={() => setTicketCount(ticketCount + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">总计</p>
                      <p className="text-lg font-semibold">${(ticketCount * (currentRound?.ticketPrice || 1)).toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyTickets}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl py-3 font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                  >
                    购买彩票
                  </button>

                  <div className="text-center text-xs text-gray-500">
                    剩余时间: {formatTimeLeft(currentRound.endTime)}
                  </div>
                </div>
              )}

              {currentRound?.status === 'ended' && currentRound.winners && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">中奖结果</h3>
                  <div className="space-y-3">
                    {currentRound.winners.map((winner, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">
                            {winner.position}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{winner.address}</p>
                            <p className="text-xs text-gray-500">第 {winner.position} 名</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${winner.prize.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">奖金</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Round History */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">历史开奖</h3>
              <div className="space-y-3">
                {mockLotteryRounds.map((round) => (
                  <div
                    key={round.id}
                    onClick={() => setSelectedRound(round.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRound === round.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        第 {round.roundNumber} 期
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(round.status)}`}>
                        {round.status === 'active' && '进行中'}
                        {round.status === 'ended' && '已结束'}
                        {round.status === 'upcoming' && '即将开始'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>奖池: ${round.prizePool.toLocaleString()}</p>
                      <p>票数: {round.ticketsSold.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">抽奖规则</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>每张票 $1，50% 进入奖池，50% 支持项目</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>每周开奖一次，随机抽取 3 名中奖者</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>奖金分配: 第1名 50%，第2名 30%，第3名 20%</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>所有抽奖过程链上可查，公开透明</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryPage;