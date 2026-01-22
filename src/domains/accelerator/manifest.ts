import type { AppModuleManifest } from '../../app/modules.types'

export const acceleratorManifest: AppModuleManifest = {
  id: 'accelerator',
  basePath: '/accelerator',
  routesLoader: async () => (await import('./routes')).acceleratorRoutes,
}
