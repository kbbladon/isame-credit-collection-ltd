import React from 'react'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  SerializedTextNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

// Helper to convert CSS string to React style object
const styleStringToObject = (styleString: string): React.CSSProperties => {
  if (!styleString) return {}
  const style: Record<string, string> = {}
  styleString.split(';').forEach((rule) => {
    const [key, val] = rule.split(':').map((s) => s.trim())
    if (key && val) {
      // Convert kebab-case to camelCase
      const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      style[camelKey] = val
    }
  })
  return style as React.CSSProperties
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),

  // Custom text converter to apply inline styles (color, font size, etc.)
  text: (props) => {
    const { node } = props as { node: SerializedTextNode }
    const DefaultTextConverter = defaultConverters.text

    // No style: use default converter
    if (!node.style) {
      if (typeof DefaultTextConverter === 'function') {
        return DefaultTextConverter(props)
      }
      return <span>{node.text}</span>
    }

    // Has style: parse to object and apply via cloneElement
    const styleObj = styleStringToObject(node.style)

    if (typeof DefaultTextConverter === 'function') {
      const defaultElement = DefaultTextConverter(props)
      if (React.isValidElement(defaultElement)) {
        // Clone element with style, using type assertion to bypass strict props
        return React.cloneElement(defaultElement as React.ReactElement<any>, { style: styleObj })
      }
    }

    // Fallback if no default converter
    return <span style={styleObj}>{node.text}</span>
  },

  // Block converters (unchanged)
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
