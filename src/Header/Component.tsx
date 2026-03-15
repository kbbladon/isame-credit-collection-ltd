import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeaderNav } from './Nav'
import type { Header as HeaderType } from '@/payload-types'

interface HeaderProps {
  data: HeaderType | null
  logoUrl?: string | null
}

export const Header: React.FC<HeaderProps> = ({ data, logoUrl }) => {
  console.log('Header data:', data)
  console.log('Header data in server component:', data)
  return (
    <header className="container relative z-50 bg-black/30 backdrop-blur-sm">
      <div className="py-8 flex justify-between items-center">
        <Link href="/">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Site Logo"
              width={180}
              height={40}
              priority
              className="invert dark:invert-0"
            />
          ) : (
            <span className="text-white">Default Logo</span>
          )}
        </Link>

        {data && <HeaderNav data={data} />}
      </div>
    </header>
  )
}
