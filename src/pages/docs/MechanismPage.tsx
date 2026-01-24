import React from 'react'

const MechanismPage: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-8'>机制与公式</h1>
      
      <div className='space-y-8'>
        <section>
          <h2 className='text-xl font-semibold mb-4'>核心机制</h2>
          
          <div className='space-y-4'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-3'>1 美元预测市场</h3>
              <p className='mb-4'>用户只需支付 1 美元即可参与 Yes/No 预测市场，预测某个事件是否会发生。</p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700'>
                <li>低门槛参与，降低用户进入成本</li>
                <li>简单的 Yes/No 选择，降低决策复杂度</li>
                <li>透明的市场机制，所有交易公开可查</li>
              </ul>
            </div>
            
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-3'>价格即概率</h3>
              <p className='mb-4'>市场价格反映了参与者对事件发生概率的共识。</p>
              <div className='bg-blue-50 p-4 rounded-lg mb-4'>
                <p className='font-medium'>公式：</p>
                <p className='mt-2'>事件发生概率 = 市场价格（美元）</p>
              </div>
              <ul className='list-disc pl-6 space-y-2 text-gray-700'>
                <li>价格为 0.75 美元表示市场认为事件有 75% 的概率发生</li>
                <li>价格为 0.25 美元表示市场认为事件有 25% 的概率发生</li>
                <li>价格会随着新信息的出现而动态调整</li>
              </ul>
            </div>
            
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-3'>收益计算</h3>
              <p className='mb-4'>如果预测正确，用户将获得 1 美元的回报；如果预测错误，用户将损失全部本金。</p>
              <div className='bg-blue-50 p-4 rounded-lg mb-4'>
                <p className='font-medium'>公式：</p>
                <p className='mt-2'>收益 = （1 - 购买价格）× 参与数量（如果预测正确）</p>
                <p className='mt-2'>损失 = 购买价格 × 参与数量（如果预测错误）</p>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <p className='font-medium mb-2'>示例：</p>
                <p className='mb-2'>用户以 0.75 美元的价格购买了 1 个 Yes 仓位</p>
                <ul className='list-disc pl-6 space-y-1 text-gray-700'>
                  <li>如果事件发生（Yes）：收益 = （1 - 0.75）× 1 = 0.25 美元</li>
                  <li>如果事件不发生（No）：损失 = 0.75 × 1 = 0.75 美元</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className='text-xl font-semibold mb-4'>市场机制</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-3'>流动性提供</h3>
              <p className='mb-3'>市场创建者或流动性提供者可以为市场提供流动性，赚取交易手续费。</p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700'>
                <li>流动性提供者获得交易手续费分成</li>
                <li>流动性越深，市场价格越稳定</li>
                <li>流动性提供者承担一定的市场风险</li>
              </ul>
            </div>
            
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-3'>市场结算</h3>
              <p className='mb-3'>当事件结果确定后，市场将自动结算，根据实际结果分配资金。</p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700'>
                <li>事件结果需要可信的数据源提供</li>
                <li>结算过程透明可查</li>
                <li>结算后资金将自动返还给用户</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className='text-xl font-semibold mb-4'>激励机制</h2>
          
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-medium mb-3'>市场创建者激励</h3>
            <p className='mb-3'>市场创建者可以获得以下激励：</p>
            <ul className='list-disc pl-6 space-y-2 text-gray-700'>
              <li>市场交易手续费分成</li>
              <li>市场曝光和关注</li>
              <li>获取真实用户反馈</li>
            </ul>
            
            <h3 className='text-lg font-medium mt-6 mb-3'>参与者激励</h3>
            <p className='mb-3'>参与者可以获得以下激励：</p>
            <ul className='list-disc pl-6 space-y-2 text-gray-700'>
              <li>通过正确预测获得收益</li>
              <li>获取有价值的信息和信号</li>
              <li>参与社区讨论和决策</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MechanismPage
