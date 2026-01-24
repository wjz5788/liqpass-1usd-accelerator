import React, { useState, useRef, useEffect } from 'react'

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

interface DropdownMenuItemProps {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

interface DropdownMenuSeparatorProps {
  className?: string
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

// DropdownMenuContext for internal communication
const DropdownMenuContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  align: 'start' | 'end'
} | null>(null)

export function DropdownMenu({ trigger, children, align = 'start', className = '' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Handle trigger click to toggle dropdown
  const handleTriggerClick = () => {
    setOpen(!open)
  }

  // Clone the trigger element and add click event
  const triggerWithClick = React.cloneElement(trigger as React.ReactElement, {
    onClick: handleTriggerClick
  })

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, align }}>
      <div ref={ref} className={`relative inline-block ${className}`}>
        {triggerWithClick}
        {open && children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild = false, children }: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenuTrigger must be used within DropdownMenu')
  }

  const { setOpen } = context

  const handleClick = () => {
    setOpen(true)
  }

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    })
  }

  return <button onClick={handleClick}>{children}</button>
}

export function DropdownMenuContent({ children, align = 'start', className = '' }: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenuContent must be used within DropdownMenu')
  }

  const alignClasses = align === 'end' ? 'right-0' : 'left-0'

  return (
    <div
      className={`absolute mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 ${alignClasses} ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ asChild = false, children, className = '' }: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenuItem must be used within DropdownMenu')
  }

  const { setOpen } = context
  const childElement = children as React.ReactElement

  // Handle click - when asChild is true, we need to preserve original onClick if it exists
  const handleClick = (e: React.MouseEvent) => {
    // Call original onClick if it exists
    if (childElement.props.onClick) {
      childElement.props.onClick(e)
    }
    setOpen(false)
  }

  if (asChild) {
    return React.cloneElement(childElement, {
      onClick: handleClick,
      className: `${childElement.props.className || ''} ${className}`.trim()
    })
  }

  return (
    <button
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className = '' }: DropdownMenuSeparatorProps) {
  return <div className={`h-px bg-gray-200 my-1 ${className}`}></div>
}
