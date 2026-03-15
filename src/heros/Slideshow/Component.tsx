'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
} from 'swiper/modules'
import Image from 'next/image'

import type { Page, Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-flip'

type SlideshowImage = {
  image: Media | string
  caption?: string | null
  hasLink?: boolean | null // 👈 new toggle
  link?: {
    type?: 'reference' | 'custom' | null
    reference?: { relationTo: string; value: any } | null
    url?: string | null
    label?: string | null
    newTab?: boolean | null
  } | null
  id?: string | null
}

type Props = Page['hero'] & {
  slideshowImages?: SlideshowImage[] | null
  slideshowEffect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | null
  slideshowSpeed?: number | null
  slideshowNavigation?: boolean | null
  slideshowPagination?: boolean | null
  slideshowUseMobileImages?: boolean | null
  slideshowMobileImages?: SlideshowImage[] | null
  slideshowMobileHeight?: string | null
}

export const HeroSlideshow: React.FC<Props> = ({
  slideshowImages,
  slideshowEffect = 'slide',
  slideshowSpeed = 5000,
  slideshowNavigation = true,
  slideshowPagination = true,
  slideshowUseMobileImages,
  slideshowMobileImages,
  slideshowMobileHeight,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const desktopSwiperRef = useRef<any>(null)
  const mobileSwiperRef = useRef<any>(null)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  const hasDesktopImages = slideshowImages && slideshowImages.length > 0
  const hasMobileImages =
    slideshowUseMobileImages && slideshowMobileImages && slideshowMobileImages.length > 0

  if (!hasDesktopImages) return null

  // Effect handling
  const effect = slideshowEffect || 'slide'
  const modules = [Autoplay, Navigation, Pagination]
  const effectModule = {
    slide: undefined,
    fade: EffectFade,
    cube: EffectCube,
    coverflow: EffectCoverflow,
    flip: EffectFlip,
  }[effect]
  if (effectModule) modules.push(effectModule)

  const effectParams = {
    slide: {},
    fade: { crossFade: true },
    cube: { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 },
    coverflow: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
    flip: { limitRotation: true, slideShadows: true },
  }[effect]

  // Height handling
  const desktopHeight = 'h-screen'
  const mobileHeight =
    slideshowMobileHeight && typeof slideshowMobileHeight === 'string'
      ? slideshowMobileHeight.replace('min-h-', 'h-')
      : 'h-screen'

  // Base Swiper props
  const baseSwiperProps = {
    modules,
    spaceBetween: 0,
    slidesPerView: 1,
    navigation: slideshowNavigation || false,
    pagination: slideshowPagination ? { clickable: true } : false,
    autoplay: slideshowSpeed ? { delay: slideshowSpeed, disableOnInteraction: false } : false,
    effect: effect !== 'slide' ? effect : undefined,
    ...effectParams,
    className: 'w-full h-full',
  }

  // Render a single slide with optional link (controlled by hasLink)
  const renderSlide = (item: SlideshowImage, index: number) => {
    // Debug: log the image data
    console.log(`Slide ${index} image:`, item.image)

    // Safely extract image URL
    let imageUrl: string | undefined
    if (item.image && typeof item.image === 'object') {
      imageUrl = item.image.url
    } else if (typeof item.image === 'string') {
      // Fallback for string IDs (shouldn't happen with depth)
      imageUrl = `/api/media/file/${item.image}`
      console.warn(`Slide ${index} image is string ID, using fallback URL:`, imageUrl)
    }

    if (!imageUrl) {
      console.error(`Slide ${index} has no valid image URL`)
      return null
    }

    const slideContent = (
      <>
        <Image
          src={imageUrl}
          alt={item.caption || `Slide ${index + 1}`}
          fill
          className="object-cover"
          priority={index === 0}
        />
        {item.caption && (
          <div className="absolute bottom-10 left-0 right-0 text-center text-white bg-black/50 py-2 px-4 mx-auto max-w-fit rounded">
            {item.caption}
          </div>
        )}
      </>
    )

    // Only wrap with CMSLink if hasLink is true and link data is valid
    if (
      item.hasLink &&
      item.link &&
      (item.link.type === 'reference' || item.link.type === 'custom')
    ) {
      const linkProps = {
        type: item.link.type,
        reference: item.link.reference as
          | { relationTo: 'pages' | 'posts'; value: any }
          | null
          | undefined,
        url: item.link.url ?? undefined,
        label: item.link.label ?? 'Learn more',
        newTab: item.link.newTab ?? undefined,
      }
      return (
        <CMSLink {...linkProps} className="block w-full h-full">
          {slideContent}
        </CMSLink>
      )
    }

    // No link: return just the content inside a full-height div
    return <div className="relative w-full h-full">{slideContent}</div>
  }

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* If mobile images exist, show both responsive Swipers */}
      {hasMobileImages && (
        <>
          {/* Desktop Swiper (hidden on mobile) */}
          <div className={`hidden md:block ${desktopHeight}`}>
            <Swiper
              {...baseSwiperProps}
              loop={slideshowImages ? slideshowImages.length > 1 : false}
              onSwiper={(swiper) => (desktopSwiperRef.current = swiper)}
            >
              {slideshowImages!.map((item, index) => (
                <SwiperSlide key={item.id || `desktop-${index}`}>
                  {renderSlide(item, index)}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile Swiper (hidden on desktop) */}
          <div className={`block md:hidden ${mobileHeight}`}>
            <Swiper
              {...baseSwiperProps}
              loop={slideshowMobileImages ? slideshowMobileImages.length > 1 : false}
              onSwiper={(swiper) => (mobileSwiperRef.current = swiper)}
            >
              {slideshowMobileImages!.map((item, index) => (
                <SwiperSlide key={item.id || `mobile-${index}`}>
                  {renderSlide(item, index)}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}

      {/* If no mobile images, show a single Swiper for all devices */}
      {!hasMobileImages && hasDesktopImages && (
        <div className={`block ${desktopHeight}`}>
          <Swiper
            {...baseSwiperProps}
            loop={slideshowImages ? slideshowImages.length > 1 : false}
            onSwiper={(swiper) => (desktopSwiperRef.current = swiper)}
          >
            {slideshowImages!.map((item, index) => (
              <SwiperSlide key={item.id || `fallback-${index}`}>
                {renderSlide(item, index)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  )
}
