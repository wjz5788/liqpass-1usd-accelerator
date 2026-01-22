import { createElement, lazy } from 'react'
import type { AppRouteObject } from '../../app/routes/types'

const ArenaPage = lazy(() => import('./pages/ArenaPage'))

export const arenaRoutes: AppRouteObject[] = [
  {
    path: '/arena',
    element: createElement(ArenaPage),
    meta: { moduleId: 'arena', walletRequired: false },
  },
]
