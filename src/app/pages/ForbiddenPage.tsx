import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='card p-8'>
          <h1 className='text-2xl font-bold text-gray-900'>无权限访问</h1>
          <p className='text-gray-600 mt-3'>
            你没有访问该页面所需的权限。如需访问请联系管理员。
          </p>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => navigate('/accelerator')}
              className='btn btn-primary'
            >
              返回 Accelerator
            </button>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='btn btn-secondary'
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
