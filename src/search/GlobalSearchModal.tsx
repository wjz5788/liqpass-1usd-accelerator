import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

import { searchItems } from './searchCore'
import type { Scope } from './searchCore'
import { typeLabel } from './searchIndex'
import type { SearchItem, SearchType } from './searchIndex'

const scopes: { key: Scope; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'project', label: 'Projects' },
  { key: 'market', label: 'Markets' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'page', label: 'Pages' },
]

export function GlobalSearchModal() {
  const nav = useNavigate()
  const loc = useLocation()

  const [open, setOpen] = useState(false)
  const [scope, setScope] = useState<Scope>('all')
  const [q, setQ] = useState('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k'
      const mod = e.metaKey || e.ctrlKey
      if (mod && isK) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  useEffect(() => {
    if (open) setOpen(false)
  }, [loc.key])

  const res = useMemo(() => searchItems(q, scope, 4), [q, scope])

  const go = (item: SearchItem) => {
    nav(item.href)
  }

  if (!open) {
    return (
      <button
        type='button'
        className='h-9 gap-2 inline-flex items-center px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-stripe-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200'
        onClick={() => setOpen(true)}
        aria-label='Search'
        title='Search (⌘K)'
      >
        <Search className='h-4 w-4 text-stripe-500' />
        <span className='hidden sm:inline'>Search</span>
        <span className='ml-1 hidden rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-stripe-400 sm:inline'>
          ⌘K
        </span>
      </button>
    )
  }

  return (
    <div className='fixed inset-0 z-[80]'>
      <div
        className='absolute inset-0 bg-black/40'
        onClick={() => setOpen(false)}
      />

      <div className='absolute left-1/2 top-[12vh] w-[92vw] max-w-2xl -translate-x-1/2'>
        <div className='card overflow-hidden border border-gray-200 bg-white shadow-stripe'>
          <div className='flex items-center gap-2 px-4 py-3'>
            <Search className='h-4 w-4 text-stripe-400' />
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder='Search projects, markets, evidence…'
              className='h-10 w-full border-0 bg-transparent text-stripe-900 placeholder:text-stripe-400 outline-none'
            />
            <button
              type='button'
              className='h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-bold text-stripe-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200'
              onClick={() => setOpen(false)}
            >
              Esc
            </button>
          </div>

          <div className='border-t border-gray-100' />

          <div className='flex flex-wrap gap-2 px-4 py-3'>
            {scopes.map(s => (
              <button
                key={s.key}
                type='button'
                className={`h-8 px-3 rounded-full text-xs font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 ${
                  scope === s.key
                    ? 'bg-stripe-900 text-white border-stripe-900'
                    : 'bg-white text-stripe-600 border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setScope(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className='border-t border-gray-100' />

          <div className='max-h-[52vh] overflow-auto px-2 py-2'>
            {scope === 'all' ? (
              <div className='space-y-3 px-2 pb-2'>
                <Group
                  title='Projects'
                  items={res.limited.project}
                  total={res.counts.project}
                  onPick={go}
                />
                <Group
                  title='Markets'
                  items={res.limited.market}
                  total={res.counts.market}
                  onPick={go}
                />
                <Group
                  title='Evidence'
                  items={res.limited.evidence}
                  total={res.counts.evidence}
                  onPick={go}
                />
                <Group
                  title='Pages'
                  items={res.limited.page}
                  total={res.counts.page}
                  onPick={go}
                />
                {!q.trim() ? (
                  <div className='rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-stripe-500'>
                    输入关键词，例如：
                    <span className='font-semibold text-stripe-900'>
                      coomer
                    </span>
                    、
                    <span className='font-semibold text-stripe-900'>
                      hackathon
                    </span>
                    、
                    <span className='font-semibold text-stripe-900'>证据</span>
                    。
                  </div>
                ) : null}
              </div>
            ) : (
              <div className='space-y-2 px-2 pb-2'>
                <div className='px-2 text-xs text-stripe-400'>
                  {res.groups[scope as SearchType].length} results
                </div>
                {res.groups[scope as SearchType].map(it => (
                  <Row key={it.id} item={it} onPick={go} />
                ))}
              </div>
            )}
          </div>

          <div className='border-t border-gray-100' />

          <div className='flex items-center justify-between px-4 py-3 text-xs text-stripe-400'>
            <div>Enter to open</div>
            <div>⌘K / Ctrl+K</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Group({
  title,
  items,
  total,
  onPick,
}: {
  title: string
  items: SearchItem[]
  total: number
  onPick: (it: SearchItem) => void
}) {
  if (!items.length) return null
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between px-2'>
        <div className='text-xs font-bold text-stripe-600'>{title}</div>
        <div className='text-xs text-stripe-400'>{total}</div>
      </div>
      <div className='space-y-1'>
        {items.map(it => (
          <Row key={it.id} item={it} onPick={onPick} />
        ))}
      </div>
    </div>
  )
}

function Row({
  item,
  onPick,
}: {
  item: SearchItem
  onPick: (it: SearchItem) => void
}) {
  return (
    <button
      className='flex w-full items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-left transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200'
      type='button'
      onClick={() => onPick(item)}
    >
      <div className='min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-[10px] font-bold tracking-wide rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-stripe-600'>
            {typeLabel(item.type)}
          </span>
          <div className='truncate text-sm font-semibold text-stripe-900'>
            {item.title}
          </div>
        </div>
        {item.subtitle ? (
          <div className='mt-1 line-clamp-1 text-xs text-stripe-500'>
            {item.subtitle}
          </div>
        ) : null}
      </div>

      <div className='shrink-0 text-xs text-stripe-400'>↵</div>
    </button>
  )
}
