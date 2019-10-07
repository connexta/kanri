import * as React from 'react'
import { Button, IconButton, Badge } from '@connexta/atlas/atoms/button'
import { Grid } from '@connexta/atlas/atoms/grid'
import { Route, Switch, RouteComponentProps, Link } from 'react-router-dom'
import { NotificationsIcon, SettingsIcon } from '@connexta/atlas/atoms/icons'
import { ControlledDrawer } from '@connexta/atlas/atoms/drawer'
import { Settings } from './settings'
import { Breadcrumbs } from '@connexta/atlas/atoms/breadcrumbs'
import { Alerts } from '../alerts/alerts'
import { useAppRootContext } from './app-root.pure'
import { setType } from '@connexta/atlas/typescript'
import Tune from '@material-ui/icons/Tune'
import { DeveloperSettings } from '../developer/settings'

const generateBreadcrumbs = ({ location }: RouteComponentProps) => {
  const crumbs = location.pathname
    .substring(1)
    .split('/')
    .map((bit: string) => bit.replace(/\//g, ''))
  return (
    <Breadcrumbs maxItems={2} itemsAfterCollapse={2} itemsBeforeCollapse={0}>
      {crumbs.map(crumb => {
        const crumbPath = location.pathname.split(crumb)[0]
        const crumbUrl = `${crumbPath}${crumb}`
        return (
          <Link
            key={crumbUrl}
            to={crumbUrl}
            style={{
              maxWidth: '200px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {crumb}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

const NotificationsComp = ({ setOpen }: { setOpen: setType<boolean> }) => {
  const { alerts } = useAppRootContext()
  return (
    <Badge
      badgeContent={alerts.length}
      color="secondary"
      variant="standard"
      overlap="circle"
    >
      <IconButton
        color="inherit"
        onClick={() => {
          setOpen(true)
        }}
      >
        <NotificationsIcon />
      </IconButton>
    </Badge>
  )
}

export const Header = () => {
  return (
    <Grid container alignItems="center" spacing={3} wrap="nowrap">
      <Grid item>
        <Switch>
          <Route component={generateBreadcrumbs} />
        </Switch>
      </Grid>
      <Grid item style={{ marginLeft: 'auto', flexShrink: 0 }}>
        {__ENV__ === 'mocks' ? (
          <ControlledDrawer
            drawerProps={{
              variant: 'temporary',
              anchor: 'right',
              PaperProps: {
                style: {
                  minWidth: '400px',
                  maxWidth: '70vw',
                  padding: '20px',
                  overflow: 'hidden',
                },
              },
            }}
            drawerChildren={() => {
              return <DeveloperSettings />
            }}
          >
            {({ setOpen }) => {
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  <Tune />
                  Developer
                </Button>
              )
            }}
          </ControlledDrawer>
        ) : (
          ''
        )}
        <ControlledDrawer
          drawerProps={{
            variant: 'temporary',
            anchor: 'right',
            PaperProps: {
              style: {
                minWidth: '400px',
                maxWidth: '70vw',
                padding: '20px',
                overflow: 'hidden',
              },
            },
          }}
          drawerChildren={() => {
            return <Settings />
          }}
        >
          {({ setOpen }) => {
            return (
              <IconButton
                color="inherit"
                onClick={() => {
                  setOpen(true)
                }}
              >
                <SettingsIcon />
              </IconButton>
            )
          }}
        </ControlledDrawer>

        <ControlledDrawer
          drawerProps={{
            variant: 'temporary',
            anchor: 'right',
            PaperProps: {
              style: {
                minWidth: '400px',
                maxWidth: '70vw',
                padding: '20px',
                overflow: 'hidden',
              },
            },
          }}
          drawerChildren={() => {
            return <Alerts />
          }}
        >
          {({ setOpen }) => {
            return <NotificationsComp setOpen={setOpen} />
          }}
        </ControlledDrawer>

        <Button
          onClick={() => {
            window.location.href = '/logout?service=' + window.location.href
          }}
          variant="text"
          color="inherit"
        >
          Log out
        </Button>
      </Grid>
    </Grid>
  )
}
