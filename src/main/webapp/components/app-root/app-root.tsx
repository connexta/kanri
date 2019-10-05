import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { AppRootContextProvider } from './app-root.pure'
import { HashRouter as Router } from 'react-router-dom'
import { SnackbarProvider } from '@connexta/atlas/atoms/snackbar'
import { Shell } from './shell'
import { Theme } from './theme'

setConfig({ logLevel: 'debug' })

const PLATFORM_CONFIG_URL = '/services/platform/config/ui'
const ADMIN_CONFIG_URL = '/services/admin/config'
const ALERTS_GET_URL =
  '/admin/jolokia/read/org.codice.ddf.ui.admin.api:type=AdminAlertMBean/Alerts'
const MODULES_URL =
  '/admin/jolokia/exec/org.codice.ddf.ui.admin.api.ConfigurationAdmin:service=ui,version=2.3.0/listModules'
const APPLICATIONS_URL =
  '/admin/jolokia/read/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/Applications/'
import {
  PlatformConfigType,
  AdminConfigType,
  AlertType,
  ModuleType,
  ApplicationType,
  ApplicationTheme,
} from './app-root.pure'
import { SessionRefresher } from '../session-refresher/session-refresher'
import { SessionTimeout } from '../session-timeout/session-timeout'
import { SystemUsage } from '../system-usage/system-usage'
import CssBaseline from '@material-ui/core/CssBaseline'
import { COMMANDS } from '../fetch/fetch'

const AppRoot = () => {
  const [theme, setTheme] = React.useState('light' as ApplicationTheme)
  const [platformConfig, setPlatformConfig] = React.useState(
    {} as PlatformConfigType
  )
  const [adminConfig, setAdminConfig] = React.useState({} as AdminConfigType)
  const [alerts, setAlerts] = React.useState([] as AlertType[])
  const [modules, setModules] = React.useState([] as ModuleType[])
  const [applications, setApplications] = React.useState(
    [] as ApplicationType[]
  )
  const fetchAlerts = () => {
    return COMMANDS.FETCH(ALERTS_GET_URL)
      .then(response => response.json())
      .then(data => {
        setAlerts(data.value)
      })
  }
  const fetchModules = () => {
    return COMMANDS.FETCH(MODULES_URL)
      .then(response => response.json())
      .then(data => {
        setModules(data.value)
      })
  }
  const fetchApplications = () => {
    return COMMANDS.FETCH(APPLICATIONS_URL)
      .then(response => response.json())
      .then(data => {
        setApplications(data.value)
      })
  }
  React.useEffect(() => {
    COMMANDS.FETCH(PLATFORM_CONFIG_URL)
      .then(response => response.json())
      .then(data => {
        setPlatformConfig(data)
      })
    COMMANDS.FETCH(ADMIN_CONFIG_URL)
      .then(response => response.json())
      .then(data => {
        setAdminConfig(data)
      })
    fetchAlerts()
    fetchModules()
    fetchApplications()
    // todo, add this into all fetch calls
    // $(document).ajaxError(function(_, jqxhr) {
    //   if (jqxhr.status === 401 || jqxhr.status === 403) {
    //     setAlerts(
    //       alerts.concat([
    //         {
    //           details: [
    //             'An error was received while trying to contact the server, which indicates that you might no longer be logged in.',
    //           ],
    //           title:
    //             'Your session has expired. Please <a href="/login/index.html?prevurl=/admin/">log in</a> again.',
    //         },
    //       ])
    //     )
    //   }
    // })
    const previousTheme = localStorage.getItem(
      'theme'
    ) as ApplicationTheme | null
    const currentTheme = previousTheme !== null ? previousTheme : 'light'
    setTheme(currentTheme)
  }, [])
  return (
    <Router>
      <AppRootContextProvider
        value={{
          platformConfig,
          adminConfig,
          alerts,
          fetchAlerts,
          modules,
          fetchModules,
          applications,
          fetchApplications,
          theme,
          setTheme: (theme: ApplicationTheme) => {
            localStorage.setItem('theme', theme)
            setTheme(theme)
          },
        }}
      >
        <Theme>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Shell />
            <SessionRefresher />
            <SessionTimeout />
            <SystemUsage />
          </SnackbarProvider>
        </Theme>
      </AppRootContextProvider>
    </Router>
  )
}

export default hot(AppRoot)
