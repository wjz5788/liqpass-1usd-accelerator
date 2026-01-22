import type { AppModuleManifest } from '../../app/modules.types'

export const insuranceManifest: AppModuleManifest = {
  id: 'insurance',
  basePath: '/insurance',
  routesLoader: async () => (await import('./routes')).insuranceRoutes,
}
