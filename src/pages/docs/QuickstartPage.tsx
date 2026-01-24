import React from 'react'

const QuickstartPage: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-8'>快速开始</h1>
      
      <div className='space-y-8'>
        <section>
          <h2 className='text-xl font-semibold mb-4'>前端启动</h2>
          
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-medium mb-2'>安装依赖</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto'>
                <code>npm install</code>
              </div>
            </div>
            
            <div>
              <h3 className='text-lg font-medium mb-2'>配置环境变量</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto mb-2'>
                <code>cp .env.example .env</code>
              </div>
              <p className='text-sm text-gray-600'>根据实际情况修改 .env 文件中的配置项。</p>
            </div>
            
            <div>
              <h3 className='text-lg font-medium mb-2'>启动开发服务器</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto mb-2'>
                <code>npm run dev</code>
              </div>
              <p className='text-sm text-gray-600'>访问 <a href='http://localhost:3000' className='text-blue-600 hover:underline'>http://localhost:3000</a></p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className='text-xl font-semibold mb-4'>后端启动</h2>
          
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-medium mb-2'>进入后端目录</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto'>
                <code>cd apps/liqpass-backend</code>
              </div>
            </div>
            
            <div>
              <h3 className='text-lg font-medium mb-2'>安装依赖</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto'>
                <code>npm install</code>
              </div>
            </div>
            
            <div>
              <h3 className='text-lg font-medium mb-2'>配置环境变量</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto mb-2'>
                <code>cp .env.example .env</code>
              </div>
              <p className='text-sm text-gray-600'>根据实际情况修改 .env 文件中的配置项，包括数据库连接、API密钥等。</p>
            </div>
            
            <div>
              <h3 className='text-lg font-medium mb-2'>启动开发服务器</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto'>
                <code>npm run dev</code>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className='text-xl font-semibold mb-4'>合约本地/测试网部署与验证</h2>
          
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-medium mb-2'>进入合约目录</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto'>
                <code>cd contracts</code>
              </div>
            </div>
            
            <div>
              <h3 className='text-lg font-medium mb-2'>安装依赖</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto'>
                <code>forge install</code>
              </div>
            </div>
            
            <div>
              <h3 className='text-lg font-medium mb-2'>编译合约</h3>
              <div className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto'>
                <code>forge build</code>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default QuickstartPage
