import parse from 'html-react-parser'

/** Renders a short, trusted HTML fragment (course content) as React elements. */
export function Html({ html }: { html: string }) {
  return <>{parse(html)}</>
}
