'use client'
import React, { useCallback, useState } from 'react'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  $insertNodes,
} from 'lexical'

// Toolbar Button Component
const GroqAIButton = () => {
  const [editor] = useLexicalComposerContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = useCallback(async () => {
    setIsLoading(true)
    let selectionText = ''

    // 1. Read selection synchronously inside editor.read()
    editor.read(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selectionText = selection.getTextContent()
      }
    })

    try {
      const prompt = selectionText
        ? `Continue writing this: ${selectionText}`
        : 'Write a compelling piece of content'

      const response = await fetch('/api/groq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error('Generation failed')
      const { text } = await response.json()

      // 2. Insert the generated text inside editor.update()
      editor.update(() => {
        const paragraph = $createParagraphNode()
        paragraph.append($createTextNode(text))
        $insertNodes([paragraph])
      })
    } catch (error) {
      console.error('AI Generation failed:', error)
      alert('Failed to generate content. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }, [editor])

  return (
    <button
      className="groq-ai-button"
      onClick={handleGenerate}
      disabled={isLoading}
      style={{
        padding: '4px 8px',
        margin: '0 4px',
        background: isLoading ? '#ccc' : '#10a37f',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontSize: '14px',
      }}
    >
      {isLoading ? '✨ Generating...' : '✨ AI Compose'}
    </button>
  )
}

// Export the client feature
export const GroqAIClientFeature = createClientFeature({
  toolbarFixed: {
    groups: [
      {
        key: 'ai',
        type: 'buttons',
        items: [
          {
            key: 'groqAI',
            order: 10,
            Component: GroqAIButton,
          },
        ],
      },
    ],
  },
})
