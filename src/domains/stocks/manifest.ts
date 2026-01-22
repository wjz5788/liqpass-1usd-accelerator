import type { AppModuleManifest } from '../../app/modules.types'

export const strategiesManifest: AppModuleManifest = {
  id: 'strategies',
  basePath: '/strategies',
  routesLoader: async () => (await import('./routes')).stocksRoutes,
}
