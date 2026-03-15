import React from 'react'
import type { Page } from '@/payload-types'
import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { HeroVideo } from './Video/Component'
import { HeroSlideshow } from './Slideshow/Component'
const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  if (type === 'video') {
    return <HeroVideo {...props} />
  }
  if (type === 'slideshow') {
    return <HeroSlideshow {...props} />
  }
  const HeroToRender = heroes[type]
  if (!HeroToRender) return null
  return <HeroToRender {...props} />
}
