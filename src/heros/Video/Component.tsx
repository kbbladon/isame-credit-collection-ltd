'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Image from 'next/image'

import type { Page, Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = Page['hero'] & {
  videoType?: 'youtube' | 'mp4' | null
  youtubeUrl?: string | null
  mp4Video?: Media | string | null
  placeholderImage?: Media | string | null
  contentAlignment?: 'left' | 'center' | 'right' | null
  animationPreset?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'skew' | null
  overlayColor?: string | null
  overlayOpacity?: number | null
  videoHeight?: string | null
  linkAlignment?: 'left' | 'center' | 'right' | null
  linkGap?: '2' | '4' | '6' | null
}

// Helper to extract YouTube video ID
const getYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

// YouTube thumbnail URL (maxres default, fallback to hqdefault)
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// Helper to convert hex + opacity to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  const cleanHex = hex.replace('#', '')

  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16)
    const g = parseInt(cleanHex[1] + cleanHex[1], 16)
    const b = parseInt(cleanHex[2] + cleanHex[2], 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return hex
}

export const HeroVideo: React.FC<Props> = ({
  links,
  richText,
  videoType,
  youtubeUrl,
  mp4Video,
  placeholderImage,
  contentAlignment = 'center',
  animationPreset = 'fade',
  overlayColor,
  overlayOpacity = 40,
  videoHeight = 'min-h-screen',
  linkAlignment = 'center',
  linkGap = '4',
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  // Determine alignment class for the content container
  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[contentAlignment || 'center']

  // Determine link alignment class
  const linkAlignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[linkAlignment || 'center']

  // Map linkGap to Tailwind gap classes (ensures they are included in the build)
  const gapClass = {
    '2': 'gap-2',
    '4': 'gap-4',
    '6': 'gap-6',
  }[linkGap || '4']

  // Define animation variants based on preset
  const getVariants = (): { container: Variants; item: Variants } => {
    switch (animationPreset) {
      case 'slide-left':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.3 },
            },
          },
          item: {
            hidden: { x: -100, opacity: 0 },
            visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          },
        }
      case 'slide-right':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.3 },
            },
          },
          item: {
            hidden: { x: 100, opacity: 0 },
            visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          },
        }
      case 'slide-up':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.3 },
            },
          },
          item: {
            hidden: { y: 100, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          },
        }
      case 'skew':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.3 },
            },
          },
          item: {
            hidden: { skewX: 10, opacity: 0 },
            visible: { skewX: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          },
        }
      case 'fade':
      default:
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.3 },
            },
          },
          item: {
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          },
        }
    }
  }

  const variants = getVariants()

  // Safely get video URL from mp4Video (could be object or string)
  const mp4Url = mp4Video && typeof mp4Video === 'object' ? mp4Video.url : undefined
  // Safely get placeholder URL
  const placeholderUrl =
    placeholderImage && typeof placeholderImage === 'object' ? placeholderImage.url : undefined

  // Determine placeholder source
  let placeholderSrc: string | undefined
  if (placeholderUrl) {
    placeholderSrc = placeholderUrl
  } else if (videoType === 'youtube' && youtubeUrl) {
    const videoId = getYouTubeId(youtubeUrl)
    if (videoId) placeholderSrc = getYouTubeThumbnail(videoId)
  }

  // Compute overlay background
  let overlayBackground: string | undefined
  if (overlayColor) {
    if (overlayColor.startsWith('#')) {
      overlayBackground = hexToRgba(overlayColor, (overlayOpacity ?? 40) / 100)
    } else {
      overlayBackground = overlayColor
    }
  }

  return (
    <div
      className={`relative flex items-center justify-center text-white overflow-hidden ${videoHeight || 'min-h-screen'}`}
    >
      {/* Background container */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* Placeholder image (fades out when video loads) */}
        <AnimatePresence>
          {!videoLoaded && placeholderSrc && (
            <motion.div
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Image
                src={placeholderSrc}
                alt="Video placeholder"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video */}
        {videoType === 'youtube' && youtubeUrl && (
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(youtubeUrl)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(youtubeUrl)}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`}
            className="absolute w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onLoad={() => setVideoLoaded(true)}
          />
        )}
        {videoType === 'mp4' && mp4Url && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source src={mp4Url} type="video/mp4" />
          </video>
        )}

        {/* Custom overlay */}
        {overlayBackground && (
          <div className="absolute inset-0" style={{ backgroundColor: overlayBackground }} />
        )}
      </div>

      {/* Content with animations and alignment */}
      <motion.div
        className={`container mb-8 z-10 relative flex items-center ${alignmentClass}`}
        variants={variants.container}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-[36.5rem]">
          {richText && (
            <motion.div variants={variants.item}>
              <RichText className="mb-6" data={richText} enableGutter={false} />
            </motion.div>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <motion.ul
              className={`flex flex-wrap items-center ${gapClass} ${linkAlignmentClass}`}
              variants={variants.item}
            >
              {links.map(({ link }, i) => (
                <motion.li key={i} variants={variants.item}>
                  <CMSLink {...link} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </motion.div>
    </div>
  )
}
