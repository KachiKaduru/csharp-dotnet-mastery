import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import csharp from 'highlight.js/lib/languages/csharp'
import json from 'highlight.js/lib/languages/json'
import plaintext from 'highlight.js/lib/languages/plaintext'
import xml from 'highlight.js/lib/languages/xml'
import { useMemo, type CSSProperties } from 'react'
import 'highlight.js/styles/github-dark.min.css'

hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('plaintext', plaintext)

interface CodeBlockProps {
  code: string
  /** Language name from the `language-*` class, e.g. "csharp". Unknown names render as plain text. */
  language?: string
  style?: CSSProperties
}

export function CodeBlock({ code, language, style }: CodeBlockProps) {
  // highlight.js escapes the source itself, so its output is safe to inject.
  const highlighted = useMemo(() => {
    if (!language || language === 'text' || !hljs.getLanguage(language)) return null
    return hljs.highlight(code, { language, ignoreIllegals: true }).value
  }, [code, language])

  return (
    <pre style={style}>
      {highlighted === null ? (
        <code className="hljs language-text">{code}</code>
      ) : (
        <code className={`hljs language-${language ?? 'text'}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
      )}
    </pre>
  )
}
