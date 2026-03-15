import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const DEFAULT_LOGO = '/default-logo.svg'
const DEFAULT_FAVICON = '/favicon.ico'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  let logoUrl: string | null = null
  let headerData = null

  try {
    const payload = await getPayload({ config })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
    if (siteSettings?.logo && typeof siteSettings.logo === 'object' && 'url' in siteSettings.logo) {
      logoUrl = siteSettings.logo.url ?? null
    }

    // Fetch header global data
    headerData = await payload.findGlobal({
      slug: 'header',
      depth: 2, // Adjust depth as needed to populate nav items
    })
  } catch (error) {
    console.debug('Site settings or header not available yet, using defaults.')
  }

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <Header data={headerData} logoUrl={logoUrl ?? DEFAULT_LOGO} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getServerSideURL()
  let faviconUrl: string | undefined

  try {
    const payload = await getPayload({ config })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
    if (
      siteSettings?.favicon &&
      typeof siteSettings.favicon === 'object' &&
      'url' in siteSettings.favicon
    ) {
      faviconUrl = siteSettings.favicon.url ?? undefined
    }
  } catch (error) {
    console.debug('Site settings not available, using default favicon.')
  }

  return {
    metadataBase: new URL(baseUrl),
    icons: faviconUrl
      ? [
          { rel: 'icon', url: faviconUrl },
          { rel: 'icon', url: DEFAULT_FAVICON },
        ]
      : [{ rel: 'icon', url: DEFAULT_FAVICON }],
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: '@payloadcms',
    },
  }
}
