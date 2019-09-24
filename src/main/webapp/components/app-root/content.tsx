import * as React from 'react'
import Applications from '../applications/applications'
import { System } from '../system'
import { Installer } from '../installer/installer'
import { Typography } from '@connexta/atlas/atoms/typography'
import { useAppRootContext } from '../app-root/app-root.pure'
import { Route, Switch } from 'react-router-dom'
import { InstanceRouteContextProvider } from './route'
import { Iframe } from '../iframe/iframe'

const Docs = () => {
  const { modules } = useAppRootContext()
  const docsModule = modules.filter(
    module => module.name === 'Documentation'
  )[0]
  if (docsModule === undefined) {
    return <div>Docs not yet available</div>
  }
  const srcUrl = docsModule.iframeLocation
  return <Iframe url={srcUrl} />
}

const HomeMatch = () => {
  const { modules } = useAppRootContext()
  const applicationsInstalled =
    modules.filter(module => module.name === 'Applications')[0] !== undefined
  const installerInstalled =
    modules.filter(module => module.name === 'Setup')[0] !== undefined
  if (applicationsInstalled) {
    return <Applications />
  } else if (installerInstalled) {
    return <Installer />
  }
  return <div>Please contact support.</div>
}

const NoMatch = () => {
  return (
    <>
      <Typography variant="h4">
        Could not find what you're looking for.
      </Typography>
      <Typography variant="h5">
        It's possible the url is wrong, or the place you're looking for
        currently isn't available on the system.
      </Typography>
    </>
  )
}

export const Content = () => {
  const { modules } = useAppRootContext()

  return (
    <Switch>
      <Route
        path="/admin/:moduleId"
        render={routeProps => {
          const currentModule = modules.filter(
            module =>
              module.name.toLowerCase() === routeProps.match.params.moduleId
          )[0]
          if (currentModule !== undefined) {
            switch (currentModule.name) {
              case 'System':
                return (
                  <InstanceRouteContextProvider>
                    <System />
                  </InstanceRouteContextProvider>
                )
              case 'Applications':
                return (
                  <InstanceRouteContextProvider>
                    <Applications />
                  </InstanceRouteContextProvider>
                )
              case 'Documentation':
                return <Docs />
              case 'Setup':
                return (
                  <InstanceRouteContextProvider>
                    <Installer />
                  </InstanceRouteContextProvider>
                )
            }
          }
          return <NoMatch />
        }}
      />
      <Route component={HomeMatch} />
    </Switch>
  )
}
