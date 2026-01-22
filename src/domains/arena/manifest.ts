import type { AppModuleManifest } from '../../app/modules.types'

export const arenaManifest: AppModuleManifest = {
  id: 'arena',
  basePath: '/arena',
  routesLoader: async () => (await import('./routes')).arenaRoutes,
}
