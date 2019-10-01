import * as React from 'react'
import { useAppRootContext, useRouteContext } from './app-root.pure'
import { Link } from 'react-router-dom'

import {
  BookIcon,
  InfoIcon,
  InstallerIcon,
  AppsIcon,
  CardModeIcon,
} from '@connexta/atlas/atoms/icons'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@connexta/atlas/atoms/list'

const ID_TO_ICON = {
  applications: AppsIcon,
  docs: BookIcon,
  installation: InstallerIcon,
  configurations: InfoIcon,
  setup: CardModeIcon,
} as { [key: string]: any }

export const ID_TO_NAME = {
  applications: 'Applications',
  docs: 'Documentation',
  installation: 'Installer',
  configurations: 'System',
  setup: 'Wizards',
} as { [key: string]: any }

export const Links = () => {
  const { modules } = useAppRootContext()
  const { routeProps } = useRouteContext()
  const { location } = routeProps
  return (
    <>
      <List>
        {modules.map(module => {
          const Icon = ID_TO_ICON[module.id] as any
          const url = `/admin/${ID_TO_NAME[module.id].toLowerCase()}`
          const isCurrentUrl = location.pathname.indexOf(url) !== -1

          return (
            <Link to={url} key={url}>
              <ListItem button selected={isCurrentUrl} tabIndex={-1}>
                <ListItemIcon>{Icon ? <Icon /> : <></>}</ListItemIcon>
                <ListItemText primary={ID_TO_NAME[module.id]} />
              </ListItem>
            </Link>
          )
        })}
      </List>
    </>
  )
}
