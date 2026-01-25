import React from 'react'

const AwardsPage: React.FC = () => {
  const awards = [
    {
      name: 'OP Stack Season 8',
      time: '2025-12',
      result: '入选',
      link: 'https://gov.optimism.io/t/cycle-46-and-season-8-final-grants-report/10503',
      description: 'Optimism 生态资助计划第8季入选项目'
    },
   
  ]

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-8'>Grants / Awards</h1>
      
      <div className='space-y-6'>
        {awards.map((award, index) => (
          <div key={index} className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
            <div className='flex flex-col md:flex-row md:items-center justify-between mb-3'>
              <h2 className='text-xl font-semibold mb-2 md:mb-0'>{award.name}</h2>
              <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>{award.result}</span>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-1'>时间</h3>
                <p>{award.time}</p>
              </div>
              <div className='md:col-span-2'>
                <h3 className='text-sm font-medium text-gray-500 mb-1'>描述</h3>
                <p>{award.description}</p>
              </div>
            </div>
            
            <div>
              <a 
                href={award.link} 
                target='_blank' 
                rel='noopener noreferrer' 
                className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors'
              >
                查看证明
                <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AwardsPage
