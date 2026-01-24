import React, { createElement, Suspense } from 'react'
import {
  Outlet,
  createBrowserRouter,
  createMemoryRouter,
} from 'react-router-dom'

import type { AppRouteObject } from './routes/types'

import ErrorBoundary from '../components/common/ErrorBoundary'
import Layout from '../components/Layout'
import RequireRole from './guards/RequireRole'
import RequireWallet from './guards/RequireWallet'

import { useSyncWalletToStore } from '../wallet/useSyncWalletToStore'

import { enabledModules } from './modules'

const HomePage = React.lazy(() => import('../pages/HomePage'))
const RewardHallPage = React.lazy(() => import('../pages/RewardHallPage'))
const AcceleratorDashboardPage = React.lazy(
  () => import('../pages/AcceleratorDashboardPage')
)
const ProjectResearchPage = React.lazy(
  () => import('../domains/stocks/pages/ProjectResearchPage')
)
const LoginRequiredPage = React.lazy(() => import('./pages/LoginRequiredPage'))
const ForbiddenPage = React.lazy(() => import('./pages/ForbiddenPage'))

const DesignSystemPage = React.lazy(() => import('../pages/DesignSystemPage'))
const LMSRLandingPage = React.lazy(() => import('../pages/LmsrSimulator'))

// Docs Pages
const DocsIntroPage = React.lazy(() => import('../pages/docs/IntroPage'))
const DocsQuickstartPage = React.lazy(() => import('../pages/docs/QuickstartPage'))
const DocsMechanismPage = React.lazy(() => import('../pages/docs/MechanismPage'))
const DocsRoadmapPage = React.lazy(() => import('../pages/docs/RoadmapPage'))
const DocsAwardsPage = React.lazy(() => import('../pages/docs/AwardsPage'))

const LoadingSpinner = () => (
  <div className='flex items-center justify-center min-h-[400px]'>
    <div className='w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
  </div>
)

function RootShell() {
  useSyncWalletToStore()

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

function applyRouteGuards(routes: AppRouteObject[]): AppRouteObject[] {
  return routes.map(route => {
    const guardedElement = (() => {
      if (!route.element) return route.element

      let el = route.element
      const meta = route.meta

      if (meta?.walletRequired) {
        el = <RequireWallet>{el}</RequireWallet>
      }

      if (meta?.requiredRole) {
        el = <RequireRole role={meta.requiredRole}>{el}</RequireRole>
      }

      return el
    })()

    if ('children' in route && Array.isArray(route.children)) {
      return {
        ...route,
        element: guardedElement,
        children: applyRouteGuards(route.children),
      }
    }

    return {
      ...route,
      element: guardedElement,
    }
  })
}

async function composeRoutes(): Promise<AppRouteObject[]> {
  const crossDomainRoutes: AppRouteObject[] = [
    {
      path: '/',
      element: createElement(HomePage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/reward-hall',
      element: createElement(RewardHallPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/accelerator/dashboard',
      element: createElement(AcceleratorDashboardPage),
      meta: { moduleId: 'accelerator', walletRequired: true },
    },
    {
      path: '/p/:id',
      element: createElement(ProjectResearchPage),
      meta: { moduleId: 'strategies', walletRequired: false },
    },
    {
      path: '/design',
      element: createElement(DesignSystemPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/login',
      element: createElement(LoginRequiredPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/403',
      element: createElement(ForbiddenPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/lmsr',
      element: createElement(LMSRLandingPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    // Docs Routes
    {
      path: '/docs/intro',
      element: createElement(DocsIntroPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/quickstart',
      element: createElement(DocsQuickstartPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/mechanism',
      element: createElement(DocsMechanismPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/roadmap',
      element: createElement(DocsRoadmapPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/awards',
      element: createElement(DocsAwardsPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
  ]

  enabledModules.forEach(m => {
    if (typeof m.init === 'function') m.init()
  })

  const moduleRoutes = (
    await Promise.all(enabledModules.map(m => m.routesLoader()))
  ).flat()

  const children: AppRouteObject[] = [...crossDomainRoutes, ...moduleRoutes]

  return [
    {
      element: <RootShell />,
      children: applyRouteGuards(children),
    },
  ]
}

type AppRouter = ReturnType<typeof createBrowserRouter>

export async function createAppRouter(
  kind: 'browser' | 'memory',
  initialEntries?: string[]
): Promise<AppRouter> {
  const routes = await composeRoutes()

  if (kind === 'memory') {
    return createMemoryRouter(routes, { initialEntries })
  }

  return createBrowserRouter(routes)
}
