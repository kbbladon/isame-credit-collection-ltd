'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Globe, Menu } from 'lucide-react'

import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  logoUrl?: string | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, logoUrl }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [isScrolled, setIsScrolled] = useState(false)

  // Admin settings with defaults
  const stickyEnabled = data.stickyHeader ?? true
  const transparentOnTop = data.transparentOnTop ?? true
  const scrollThreshold = data.scrollThreshold ?? 50
  const blurIntensity = data.blurIntensity ?? 8
  const overlayHero = data.overlayHero ?? true

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'))
  }

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  // Scroll effect
  useEffect(() => {
    if (!stickyEnabled || !transparentOnTop) {
      setIsScrolled(true)
      return
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [stickyEnabled, transparentOnTop, scrollThreshold])

  const cta = data.ctaButton || { label: 'Get Started', url: '/contact' }
  const headerBgColor = data.backgroundColor || 'rgba(0,0,0,0.3)'
  const textColor = data.textColor || '#ffffff'
  const hoverColor = data.hoverColor || '#D4AF37'

  // Determine background based on scroll state and settings
  let backgroundColor = headerBgColor
  if (stickyEnabled && transparentOnTop && !isScrolled) {
    backgroundColor = 'transparent'
  }

  const headerStyle = {
    backgroundColor,
    backdropFilter: blurIntensity > 0 && isScrolled ? `blur(${blurIntensity}px)` : 'none',
    transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
    '--header-text-color': textColor,
    '--header-hover-color': hoverColor,
  } as React.CSSProperties

  // Determine header positioning class
  const headerClass = overlayHero
    ? 'fixed top-0 left-0 w-full z-50'
    : `w-full ${stickyEnabled ? 'sticky top-0' : 'relative'} z-50`

  const headerHeight = 80 // matches h-20

  // 🐛 DEBUG LOGS – will appear in browser console
  console.log('--- Header Debug ---')
  console.log('Header data:', data)
  console.log('overlayHero:', overlayHero)
  console.log('stickyEnabled:', stickyEnabled)
  console.log('transparentOnTop:', transparentOnTop)
  console.log('scrollThreshold:', scrollThreshold)
  console.log('blurIntensity:', blurIntensity)
  console.log('headerBgColor:', headerBgColor)
  console.log('textColor:', textColor)
  console.log('hoverColor:', hoverColor)
  console.log('backgroundColor (current):', backgroundColor)
  console.log('isScrolled:', isScrolled)
  console.log('headerClass:', headerClass)

  return (
    <>
      <header
        className={headerClass}
        style={headerStyle}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {logoUrl ? (
                <Logo loading="eager" priority className="invert dark:invert-0" src={logoUrl} />
              ) : (
                <span
                  className="text-3xl"
                  style={{ fontFamily: "'Playfair Display', serif", color: hoverColor }}
                >
                  Isame
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <HeaderNav data={data} showSearch={false} />

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1 rounded-full border transition-colors"
                style={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: textColor,
                }}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">{language === 'en' ? 'ES' : 'EN'}</span>
              </button>

              {/* CTA Button */}
              <Link
                href={cta.url}
                className="px-6 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: hoverColor, color: '#1A1A1A' }}
              >
                {cta.label}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{ color: textColor }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg p-4 flex flex-col space-y-4">
            {data.navItems?.map(({ link }) => {
              const url = link?.url
              if (!url) return null
              return (
                <Link
                  key={url}
                  href={url}
                  style={{ color: pathname === url ? hoverColor : '#1A1A1A' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link?.label || 'Untitled'}
                </Link>
              )
            })}
            <hr />
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#A7A9AC] self-start"
              style={{ color: '#1A1A1A' }}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'ES' : 'EN'}</span>
            </button>
            <Link
              href={cta.url}
              className="px-6 py-2 rounded-lg text-center"
              style={{ backgroundColor: hoverColor, color: '#1A1A1A' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {cta.label}
            </Link>
          </div>
        )}
      </header>

      {/* Spacer when header overlays hero */}
      {overlayHero && <div style={{ height: headerHeight }} aria-hidden="true" />}
    </>
  )
}
