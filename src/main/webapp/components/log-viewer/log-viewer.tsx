import * as React from 'react'
// @ts-ignore
import AdminLogViewer from '@connexta/logviewer/src/main/webapp/js/main'
import { useAppRootContext } from '../app-root/app-root.pure'

export const LogViewer = () => {
  const { theme } = useAppRootContext()

  return (
    <div
      style={{
        color: 'black', // emulates dark mode
        filter: theme === 'dark' ? 'invert(100%) hue-rotate(180deg)' : '', //emulates dark mode
      }}
    >
      <AdminLogViewer />
    </div>
  )
}
