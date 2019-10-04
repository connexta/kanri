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
import { Typography } from '@connexta/atlas/atoms/typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    shortName: {
      transition: theme.transitions.create(['opacity', 'transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  })
)

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

export const ID_TO_SHORT_NAME = {
  applications: 'Apps',
  docs: 'Docs',
  installation: 'Installer',
  configurations: 'System',
  setup: 'Wizards',
} as { [key: string]: any }

export const Links = ({ open }: { open: boolean }) => {
  const classes = useStyles()
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
              <ListItem
                button
                selected={isCurrentUrl}
                tabIndex={-1}
                style={{ position: 'relative' }}
              >
                <ListItemIcon>
                  {Icon ? (
                    <>
                      <Icon
                        className={classes.shortName}
                        style={{
                          transform: open ? 'none' : 'translateY(-6px)',
                        }}
                      />
                      <Typography
                        className={classes.shortName}
                        style={{
                          opacity: open ? 0 : 1,
                          fontSize: '.8rem',
                          position: 'absolute',
                          bottom: '2px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        {ID_TO_SHORT_NAME[module.id]}
                      </Typography>
                    </>
                  ) : (
                    <></>
                  )}
                </ListItemIcon>
                <ListItemText primary={ID_TO_NAME[module.id]} />
              </ListItem>
            </Link>
          )
        })}
      </List>
    </>
  )
}
