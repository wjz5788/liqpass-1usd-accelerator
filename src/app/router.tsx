import React, { createElement, Suspense } from 'react'
import {
  Outlet,
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
} from 'react-router-dom'

import type { AppRouteObject } from './routes/types'

import ErrorBoundary from '../components/common/ErrorBoundary'
import Layout from '../components/Layout'
import RequireRole from './guards/RequireRole'
import RequireWallet from './guards/RequireWallet'

import { useSyncWalletToStore } from '../wallet/useSyncWalletToStore'

import { enabledModules } from './modules'

const ComingSoonPage = React.lazy(() => import('../pages/ComingSoonPage'))
const LmsrSimulator = React.lazy(() => import('../pages/LmsrSimulator'))
const IntroPage = React.lazy(() => import('../pages/docs/IntroPage'))
const AwardsPage = React.lazy(() => import('../pages/docs/AwardsPage'))
const MechanismPage = React.lazy(() => import('../pages/docs/MechanismPage'))
const QuickstartPage = React.lazy(() => import('../pages/docs/QuickstartPage'))
const RoadmapPage = React.lazy(() => import('../pages/docs/RoadmapPage'))
const LoginRequiredPage = React.lazy(() => import('./pages/LoginRequiredPage'))

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
  // 只初始化保留的模块
  enabledModules.forEach(m => {
    if (typeof m.init === 'function') m.init()
  })

  // 加载所有模块路由
  const moduleRoutes = (
    await Promise.all(enabledModules.map(m => m.routesLoader()))
  ).flat()

  // 基础路由
  const baseRoutes: AppRouteObject[] = [
    {
      path: '/lmsr',
      element: createElement(LmsrSimulator),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs',
      element: createElement(IntroPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/intro',
      element: createElement(IntroPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/awards',
      element: createElement(AwardsPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/mechanism',
      element: createElement(MechanismPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/quickstart',
      element: createElement(QuickstartPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/docs/roadmap',
      element: createElement(RoadmapPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    {
      path: '/coming-soon',
      element: createElement(ComingSoonPage),
      meta: { moduleId: 'app', walletRequired: false },
    },
    // 登录/连接钱包页面
      {
        path: '/login',
        element: createElement(LoginRequiredPage),
        meta: { moduleId: 'app', walletRequired: false },
      },
      // 默认路由指向 AcceleratorHomePage
      {
        path: '/',
        element: <Navigate to="/accelerator" replace />,
        meta: { moduleId: 'app', walletRequired: false },
      },
      // 通配符路由，匹配所有未定义的路由
      {
        path: '*',
        element: <Navigate to="/coming-soon" replace />,
        meta: { moduleId: 'app', walletRequired: false },
      },
  ]

  const children: AppRouteObject[] = [...baseRoutes, ...moduleRoutes]

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
