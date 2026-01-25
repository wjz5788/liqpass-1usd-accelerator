import { createElement, lazy } from 'react'
import type { AppRouteObject } from '../../app/routes/types'

const InsurancePage = lazy(() => import('./pages/InsurancePage'))

export const insuranceRoutes: AppRouteObject[] = [
  {
    path: '/insurance',
    element: createElement(InsurancePage),
    meta: { moduleId: 'insurance', walletRequired: false },
  },
  {
    path: '/liqpass',
    element: createElement(InsurancePage),
    meta: { moduleId: 'insurance', walletRequired: false },
  },
]
