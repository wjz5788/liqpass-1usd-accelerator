import type { SearchItem, SearchType } from './searchIndex'
import { SEARCH_INDEX } from './searchIndex'

export type Scope = 'all' | SearchType

function normalize(s: string) {
  return s.trim().toLowerCase()
}

export function searchItems(query: string, scope: Scope, limitPerGroup = 4) {
  const q = normalize(query)
  if (!q) return groupItems([], limitPerGroup)

  const hits = SEARCH_INDEX.filter(it => {
    if (scope !== 'all' && it.type !== scope) return false

    const hay = [it.title, it.subtitle ?? '', (it.tags ?? []).join(' ')].join(
      ' '
    )
    return normalize(hay).includes(q)
  })

  const priority: Record<SearchType, number> = {
    project: 0,
    market: 1,
    evidence: 2,
    page: 3,
  }

  hits.sort((a, b) => {
    const pa = priority[a.type]
    const pb = priority[b.type]
    if (pa !== pb) return pa - pb
    return a.title.localeCompare(b.title)
  })

  return groupItems(hits, limitPerGroup)
}

function groupItems(items: SearchItem[], limitPerGroup: number) {
  const groups: Record<SearchType, SearchItem[]> = {
    project: [],
    market: [],
    evidence: [],
    page: [],
  }

  for (const it of items) groups[it.type].push(it)

  return {
    groups,
    limited: {
      project: groups.project.slice(0, limitPerGroup),
      market: groups.market.slice(0, limitPerGroup),
      evidence: groups.evidence.slice(0, limitPerGroup),
      page: groups.page.slice(0, limitPerGroup),
    },
    counts: {
      project: groups.project.length,
      market: groups.market.length,
      evidence: groups.evidence.length,
      page: groups.page.length,
    },
  }
}
