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
import { Configuration } from '../configuration/configuration'
import { Divider } from '@connexta/atlas/atoms/divider'
import { Button } from '@connexta/atlas/atoms/button'
import { ConfigurationType } from '../app-root/app-root.pure'
import { Link } from 'react-router-dom'
type Props = {
  service: ConfigurationType
}

const generateUrl = (displayName: string, hash: boolean) => {
  const firstPart = hash
    ? location.hash.split('/Configuration')[0].substring(1)
    : location.pathname.split('/Configuration')[0]
  return `${firstPart}/Configuration/${encodeURIComponent(displayName)}`
}

export const Service = ({ service }: Props) => {
  const { name, configurations } = service

  const url = generateUrl(name, true)

  return (
    <div style={{ padding: '10px' }}>
      <Link to={url}>
        <Button>{name}</Button>
      </Link>
      <Divider />
      {configurations
        ? configurations.map(configuration => {
            return (
              <Configuration
                key={configuration.id}
                configuration={configuration}
              />
            )
          })
        : null}
    </div>
  )
}
