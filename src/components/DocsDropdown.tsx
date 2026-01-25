import React, { useState, useRef, useEffect } from 'react'
import { BookOpen, Trophy, Github, Sigma, Route, Rocket, ArrowUpRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'

// 菜单项类型定义
type MenuItem = {
  title: string
  desc: string
  href: string
  icon: React.ReactNode
  external?: boolean
}

// 文档菜单项
const docsItems: MenuItem[] = [
  {
    title: '快速开始',
    desc: '3 分钟跑通 Demo 与核心流程',
    href: '/docs/quickstart',
    icon: <Rocket className="h-4 w-4 text-stripe-500" />
  },
  {
    title: '机制与公式',
    desc: 'LMSR 定价、参数化保费、理赔判定',
    href: '/docs/mechanism',
    icon: <Sigma className="h-4 w-4 text-stripe-500" />
  },
  {
    title: '路线图',
    desc: 'V1 Demo → V2 可用 → V3 增长',
    href: '/docs/roadmap',
    icon: <Route className="h-4 w-4 text-stripe-500" />
  }
]

// 资源菜单项
const resourcesItems: MenuItem[] = [
  {
    title: '获奖 / 资助',
    desc: 'OP Season 8 等资助进度与材料',
    href: '/docs/awards',
    icon: <Trophy className="h-4 w-4 text-stripe-500" />
  },
  {
    title: 'GitHub',
    desc: '源码仓库与部署说明',
    href: 'https://github.com/wjz5788/liqpass-1usd-accelerator',
    icon: <Github className="h-4 w-4 text-stripe-500" />,
    external: true
  }
]

// 菜单分组组件
function MenuSection({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <div className="space-y-2">
      <div className="px-3 text-xs font-semibold text-stripe-500">{label}</div>
      <div className="grid gap-1">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noreferrer' : undefined}
            className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-stripe-100"
          >
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-stripe-50">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium text-stripe-900">
                <span className="truncate">{item.title}</span>
                {item.external && (
                  <ArrowUpRight className="h-3.5 w-3.5 text-stripe-400" />
                )}
              </div>
              <div className="mt-0.5 line-clamp-1 text-xs text-stripe-500">
                {item.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default function DocsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${location.pathname.startsWith('/docs')
          ? 'text-accent-600 bg-accent-50'
          : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-50'}`}
      >
        <BookOpen
          className={`h-4 w-4 ${location.pathname.startsWith('/docs') ? 'text-accent-500' : 'text-stripe-400 group-hover:text-stripe-600'}`}
        />
        <span>文档</span>
      </button>

      {/* 下拉菜单内容 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[400px] rounded-2xl border border-stripe-200 bg-white shadow-lg shadow-stripe-100/40 z-50">
          <div className="p-3 space-y-4">
            {/* 文档分组 */}
            <MenuSection label="DOCS" items={docsItems} />
            
            {/* 分隔线 */}
            <div className="h-px bg-stripe-100" />
            
            {/* 资源分组 */}
            <MenuSection label="RESOURCES" items={resourcesItems} />
          </div>
        </div>
      )}
    </div>
  )
}
