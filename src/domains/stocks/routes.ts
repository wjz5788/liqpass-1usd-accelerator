import { createElement, lazy } from 'react'
import type { AppRouteObject } from '../../app/routes/types'

const StrategiesPage = lazy(() => import('./pages/StrategiesPage'))
const StrategySimulatorPage = lazy(
  () => import('./pages/StrategySimulatorPage')
)

export const stocksRoutes: AppRouteObject[] = [
  {
    path: '/strategies',
    element: createElement(StrategiesPage),
    meta: { moduleId: 'strategies', walletRequired: false },
  },
  {
    path: '/strategies/simulator',
    element: createElement(StrategySimulatorPage),
    meta: { moduleId: 'strategies', walletRequired: false },
  },
]
