import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'

export type AppModuleId = 'accelerator' | 'insurance' | 'arena' | 'strategies'

export type AppRouteMeta = {
  moduleId: AppModuleId | 'app'
  walletRequired: boolean
  requiredRole?: 'user' | 'admin'
}

export type AppIndexRouteObject = Omit<IndexRouteObject, 'children'> & {
  meta?: AppRouteMeta
}

export type AppNonIndexRouteObject = Omit<NonIndexRouteObject, 'children'> & {
  meta?: AppRouteMeta
  children?: AppRouteObject[]
}

export type AppRouteObject = AppIndexRouteObject | AppNonIndexRouteObject

export type AppNavItem = {
  path: string
  label: string
}

export type AppModuleManifest = {
  id: AppModuleId
  basePath: string
  routesLoader: () => Promise<AppRouteObject[]>
  navItems?: AppNavItem[]
  init?: () => void
}
