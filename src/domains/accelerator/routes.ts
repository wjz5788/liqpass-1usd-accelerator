import { createElement, lazy } from 'react'
import type { AppRouteObject } from '../../app/routes/types'

const AcceleratorHomePage = lazy(() => import('./pages/AcceleratorHomePage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const LotteryPage = lazy(() => import('./pages/LotteryPage'))
const MarketsPage = lazy(() => import('./pages/MarketsPage'))
const TransparencyPage = lazy(() => import('./pages/TransparencyPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const SubmitProjectPage = lazy(() => import('./pages/SubmitProjectPage'))
const ShortsWallPage = lazy(() => import('./pages/ShortsWallPage'))
const MyTicketsPage = lazy(() => import('./pages/MyTicketsPage'))
const AdminProjectsPage = lazy(() => import('./pages/AdminProjectsPage'))
const MemeBoardPage = lazy(() => import('./pages/MemeBoardPage'))
const HeatRankPage = lazy(() => import('./pages/HeatRankPage'))
const OneDollarProjectPage = lazy(() => import('./pages/OneDollarProjectPage'))
const LotteryProjectBoardPage = lazy(() => import('./pages/cz'))
const MarketDemoPage = lazy(() => import('./pages/MarketDemoPage'))
const LiqPassCheckoutPage = lazy(() => import('../../pages/Accelerator/LiqPassCheckoutPage'))

export const acceleratorRoutes: AppRouteObject[] = [
  {
    path: '/accelerator',
    element: createElement(AcceleratorHomePage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/projects',
    element: createElement(ProjectsPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/lottery',
    element: createElement(LotteryPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/markets',
    element: createElement(MarketsPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/transparency',
    element: createElement(TransparencyPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/projects/:id',
    element: createElement(ProjectDetailPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/submit',
    element: createElement(SubmitProjectPage),
    meta: { moduleId: 'accelerator', walletRequired: true },
  },
  {
    path: '/accelerator/shorts',
    element: createElement(ShortsWallPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/tickets',
    element: createElement(MyTicketsPage),
    meta: {
      moduleId: 'accelerator',
      walletRequired: true,
      requiredRole: 'user',
    },
  },
  {
    path: '/accelerator/admin',
    element: createElement(AdminProjectsPage),
    meta: {
      moduleId: 'accelerator',
      walletRequired: true,
      requiredRole: 'admin',
    },
  },
  {
    path: '/accelerator/meme-board',
    element: createElement(MemeBoardPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/heat-rank',
    element: createElement(HeatRankPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/meme-project/:id',
    element: createElement(OneDollarProjectPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/1usd',
    element: createElement(MemeBoardPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/lottery-board',
    element: createElement(LotteryProjectBoardPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/market/:id',
    element: createElement(MarketDemoPage),
    meta: { moduleId: 'accelerator', walletRequired: false },
  },
  {
    path: '/accelerator/checkout-demo',
    element: createElement(LiqPassCheckoutPage),
    meta: { moduleId: 'accelerator', walletRequired: true },
  },
]
