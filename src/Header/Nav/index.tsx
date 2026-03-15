'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronDown } from 'lucide-react'

export const HeaderNav: React.FC<{
  data: HeaderType
  showSearch?: boolean
}> = ({ data, showSearch = true }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map((item, i) => {
        const link = item.link
        const children = item.children || []
        const hasChildren = children.length > 0

        // Regular link – no dropdown
        if (!hasChildren) {
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className={`transition-colors duration-200 ${
                pathname === link?.url
                  ? 'text-[var(--header-hover-color)]'
                  : 'text-[var(--header-text-color)]'
              } hover:text-[var(--header-hover-color)]`}
            />
          )
        }

        // Dropdown parent
        const isActive = link?.url && (pathname === link.url || pathname.startsWith(link.url))
        return (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setOpenDropdown(i)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 transition-colors duration-200 ${
                isActive ? 'text-[var(--header-hover-color)]' : 'text-[var(--header-text-color)]'
              } hover:text-[var(--header-hover-color)]`}
            >
              {link?.label || 'Menu'}
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === i && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                {children.map((child, j) => (
                  <CMSLink
                    key={j}
                    {...child.link}
                    appearance="link"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
      {showSearch && (
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 transition-colors duration-200 text-[var(--header-text-color)] hover:text-[var(--header-hover-color)]" />
        </Link>
      )}
    </nav>
  )
}
