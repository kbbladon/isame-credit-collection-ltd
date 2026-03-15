import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
  src?: string | null
}

export const Logo = (props: Props) => {
  const { className, loading, priority = false, src } = props

  const imageSrc =
    src ||
    'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg'

  return (
    <Image
      alt="Site Logo"
      width={193}
      height={34}
      loading={loading}
      priority={priority}
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={imageSrc}
    />
  )
}
