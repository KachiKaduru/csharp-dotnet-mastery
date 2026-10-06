import parse from 'html-react-parser'
import { useMemo } from 'react'
import { lessonParserOptions } from '../lib/htmlParserOptions'

export function LessonBody({ html }: { html: string }) {
  const content = useMemo(() => parse(html, lessonParserOptions), [html])
  return <>{content}</>
}
