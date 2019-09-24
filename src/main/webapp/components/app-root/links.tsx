import * as React from 'react'
import { useAppRootContext, useRouteContext } from './app-root.pure'
import { Link } from 'react-router-dom'

import {
  BookIcon,
  InfoIcon,
  InstallerIcon,
  AppsIcon,
} from '@connexta/atlas/atoms/icons'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@connexta/atlas/atoms/list'

const NAME_TO_ICON = {
  Applications: AppsIcon,
  Documentation: BookIcon,
  Setup: InstallerIcon,
  System: InfoIcon,
} as { [key: string]: any }

export const Links = () => {
  const { modules } = useAppRootContext()
  const { routeProps } = useRouteContext()
  const { location } = routeProps
  return (
    <>
      <List>
        {modules.map(module => {
          const Icon = NAME_TO_ICON[module.name] as any
          const url = `/admin/${module.name.toLowerCase()}`
          const isCurrentUrl = location.pathname.indexOf(url) !== -1

          return (
            <Link to={url} key={url}>
              <ListItem button selected={isCurrentUrl} tabIndex={-1}>
                <ListItemIcon>{Icon ? <Icon /> : <></>}</ListItemIcon>
                <ListItemText primary={module.name} />
              </ListItem>
            </Link>
          )
        })}
      </List>
    </>
  )
}
