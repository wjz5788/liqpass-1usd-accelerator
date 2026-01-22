import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = ''
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-700/50 ${className}`}
      style={{
        width,
        height,
        borderRadius
      }}
    />
  )
}

export default Skeleton
