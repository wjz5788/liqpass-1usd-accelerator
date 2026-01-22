import type { AppModuleManifest } from './modules.types'

import { acceleratorManifest } from '../domains/accelerator/manifest'
import { arenaManifest } from '../domains/arena/manifest'
import { insuranceManifest } from '../domains/insurance/manifest'
import { strategiesManifest } from '../domains/stocks/manifest'

export const enabledModules: AppModuleManifest[] = [
  acceleratorManifest,
  arenaManifest,
  strategiesManifest,
  insuranceManifest,
]
