import * as React from 'react'
import clsx from 'clsx'
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'

import { WrappedDrawer as Drawer } from '@connexta/atlas/atoms/drawer/drawer'
import { WrappedAppBar as AppBar } from '@connexta/atlas/atoms/appbar/appbar'
import { WrappedToolbar as Toolbar } from '@connexta/atlas/atoms/toolbar/toolbar'
import { Typography } from '@connexta/atlas/atoms/typography'
import { Divider } from '@connexta/atlas/atoms/divider'
import { IconButton } from '@connexta/atlas/atoms/button'
import {
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@connexta/atlas/atoms/icons'
import { Header } from './header'
import { Links } from './links'
import { Content } from './content'
import { useAppRootContext } from './app-root.pure'
import { InstanceRouteContextProvider } from './route'
import { Grid } from '@connexta/atlas/atoms/grid'
import { BannerHeader, BannerFooter } from '../banners/banners'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1),
      marginLeft: '16px',
      [theme.breakpoints.down('sm')]: {
        marginLeft: '8px',
      },
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    branding: {
      transition: theme.transitions.create(['width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  })
)

export const Shell = () => {
  const { platformConfig, adminConfig, theme } = useAppRootContext()
  let previousData = localStorage.getItem('shell.drawer')
  let defaultOpen = true
  if (previousData !== null) {
    defaultOpen = previousData === 'true'
  }
  const classes = useStyles()
  const [open, setOpen] = React.useState(defaultOpen)

  function handleDrawerOpen() {
    localStorage.setItem('shell.drawer', 'true')
    setOpen(true)
  }

  function handleDrawerClose() {
    localStorage.setItem('shell.drawer', 'false')
    setOpen(false)
  }

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      wrap="nowrap"
      style={{ height: '100%', width: '100%', overflow: 'hidden' }}
    >
      <Grid item style={{ width: '100%' }}>
        <BannerHeader />
      </Grid>
      <Grid
        item
        style={{
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        <div className={classes.root} style={{ height: '100%', width: '100%' }}>
          <AppBar
            position="absolute"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar style={{ height: '64px' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Header />
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
            PaperProps={{
              style: {
                position: 'absolute',
              },
            }}
            open={open}
          >
            <div className={classes.toolbar}>
              <Grid container direction="column">
                <Grid item>
                  <Typography>{adminConfig.branding}</Typography>
                </Grid>
                <Grid item>
                  <Typography>Admin Console</Typography>
                </Grid>
              </Grid>

              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <InstanceRouteContextProvider>
              <Links open={open} />
            </InstanceRouteContextProvider>

            <Divider />
            <div style={{ marginTop: 'auto', padding: '10px' }}>
              <a href="../">
                <img
                  className={classes.branding}
                  style={{
                    width: open ? `${drawerWidth - 20}px` : '52px',
                    filter:
                      theme === 'dark' ? 'invert(100%) hue-rotate(180deg)' : '',
                  }}
                  src={`data:image/png;base64,${platformConfig.productImage}`}
                />
              </a>
            </div>
          </Drawer>
          <main
            className={classes.content}
            style={{ overflow: 'auto', height: '100%' }}
          >
            <div className={classes.toolbar} />

            <Content />
          </main>
        </div>
      </Grid>
      <Grid item style={{ width: '100%' }}>
        <BannerFooter />
      </Grid>
    </Grid>
  )
}
