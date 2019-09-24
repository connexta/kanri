import * as React from 'react'

import { ServicesContextProvider } from './services.pure'
import { ConfigurationType } from '../app-root/app-root.pure'
import { ApplicationType } from '../../types/App'
import { COMMANDS } from '../fetch/fetch'

type Props = {
  app?: ApplicationType
  children: any
}

export const ExtractedServicesProvider = ({ app, children }: Props) => {
  const [services, setServices] = React.useState([] as ConfigurationType[])
  const fetchServices = async () => {
    const serviceData = await COMMANDS.SERVICES.LIST({
      appName: app ? app.name : undefined,
    })
    setServices(serviceData)
  }
  React.useEffect(() => {
    fetchServices()
  }, [])
  return (
    <ServicesContextProvider
      value={{
        services,
        fetchServices,
      }}
    >
      {children}
    </ServicesContextProvider>
  )
}
