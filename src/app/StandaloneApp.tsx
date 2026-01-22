import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { WalletProvider } from '../wallet/WalletProvider'

import { createAppRouter } from './router'

type StandaloneAppProps =
  | {
      router: 'browser'
    }
  | {
      router: 'memory'
      initialEntries?: string[]
    }

export default function StandaloneApp(props: StandaloneAppProps) {
  const [router, setRouter] = useState<Awaited<ReturnType<typeof createAppRouter>> | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const r =
        props.router === 'memory'
          ? await createAppRouter('memory', props.initialEntries)
          : await createAppRouter('browser')

      if (!cancelled) setRouter(r)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [props.router, props.router === 'memory' ? props.initialEntries : undefined])

  if (!router) return null

  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  )
}
