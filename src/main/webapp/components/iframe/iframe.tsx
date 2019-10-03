import * as React from 'react'
// @ts-ignore
import { iframeResizer } from 'iframe-resizer'
import { useAppRootContext } from '../app-root/app-root.pure'
import { handleReverseProxy } from '../fetch/fetch'
type Props = {
  url?: string
}

export const Iframe = ({ url }: Props) => {
  const { theme } = useAppRootContext()

  React.useLayoutEffect(() => {
    iframeResizer(null, 'iframe')
  })
  let fixedUrl = url ? `/admin${url.substring(1)}` : ''
  return (
    <iframe
      src={handleReverseProxy(fixedUrl)}
      width="100%"
      scrolling="no"
      style={{
        border: 'none',
        filter: theme === 'dark' ? 'invert(100%) hue-rotate(180deg)' : '', //emulates dark mode for iframes
      }}
    >
      <p>Your browser does not support iframes.</p>
    </iframe>
  )
}
