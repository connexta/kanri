/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import * as React from 'react'
import styled from 'styled-components'
import { Service } from '../service/service'
import { ExtractedServicesProvider } from './services.provider'
import { useServicesContext } from './services.pure'
import { ApplicationType } from '../../types/App'
import { Route } from 'react-router-dom'
import { ServiceRoute } from '../service/service.route'
import { ConfigurationType } from '../app-root/app-root.pure'
import { CircularProgress } from '@connexta/atlas/atoms/progress'
import { Typography } from '@connexta/atlas/atoms/typography'

type Props = {
  app?: ApplicationType
}

const Header = styled.div`
  text-align: center;
`

const MemoServices = React.memo(
  ({ services }: { services: ConfigurationType[] }) => {
    return (
      <>
        {services.length === 0 ? (
          <Header>
            <CircularProgress />
            <Typography variant="h5">Loading Configurations</Typography>
          </Header>
        ) : (
          services.map(service => {
            /**
             *  todo Look into why we have a Schematron Validation Services that's a factory and one that isn't
             */
            return (
              <Service key={service.id + service.factory} service={service} />
            )
          })
        )}
      </>
    )
  }
)

const Subservices = () => {
  const { services } = useServicesContext()
  return <MemoServices services={services} />
}

export const Services = ({ app }: Props) => {
  const path = app
    ? `/admin/applications/${app.name}/Configuration/:configurationId`
    : `/admin/system/Configuration/:configurationId`
  return (
    <ExtractedServicesProvider app={app}>
      <Route path={path} component={ServiceRoute} />
      <Subservices />
    </ExtractedServicesProvider>
  )
}
