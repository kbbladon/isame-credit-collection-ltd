import React from 'react'
import { HeaderClient } from './Component.client'
import type { Header as HeaderType } from '@/payload-types'

interface HeaderProps {
  data: HeaderType | null
  logoUrl?: string | null
}

export const Header: React.FC<HeaderProps> = ({ data, logoUrl }) => {
  console.log('Header data:', data)
  console.log('Header data in server component:', data)
  return <HeaderClient data={data} logoUrl={logoUrl} />
}
