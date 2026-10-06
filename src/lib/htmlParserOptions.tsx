import { attributesToProps, Element, Text, type DOMNode, type HTMLReactParserOptions } from 'html-react-parser'
import type { CSSProperties } from 'react'
import { CodeBlock } from '../components/CodeBlock'

function textOf(node: DOMNode): string {
  if (node instanceof Text) return node.data
  if (node instanceof Element) return node.children.map((child) => textOf(child as DOMNode)).join('')
  return ''
}

/**
 * Lesson bodies are authored as plain HTML. Everything renders as ordinary React
 * elements, except `<pre><code class="language-x">` which becomes a highlighted <CodeBlock>.
 */
export const lessonParserOptions: HTMLReactParserOptions = {
  replace(node) {
    if (!(node instanceof Element) || node.name !== 'pre') return undefined

    const code = node.children.find((child): child is Element => child instanceof Element && child.name === 'code')
    if (!code) return undefined

    const language = /language-([\w-]+)/.exec(code.attribs.class ?? '')?.[1]
    const style = attributesToProps(node.attribs).style as CSSProperties | undefined
    return <CodeBlock code={textOf(code).replace(/\n$/, '')} language={language} style={style} />
  },
}
