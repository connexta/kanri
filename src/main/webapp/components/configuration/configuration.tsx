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
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { ExistingConfigurationType } from '../app-root/app-root.pure'
import { useServicesContext } from '../services/services.pure'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import CloseIcon from '@material-ui/icons/Close'
import { COMMANDS } from '../fetch/fetch'
import {
  useSnackbar,
  generateDismissSnackbarAction,
} from '../snackbar/snackbar.provider'
const getHintName = ({
  configuration,
}: {
  configuration: ExistingConfigurationType
}) => {
  if (configuration.service === undefined) {
    return null
  }
  switch (configuration.fpid) {
    case 'org.codice.ddf.catalog.content.monitor.ContentDirectoryMonitor':
      const currentProcessingMechanism =
        configuration.properties.processingMechanism
      const processingMechanism = configuration.service.metatype.reduce(
        (name, meta) => {
          if (meta.id === 'processingMechanism') {
            const index = meta.optionValues.findIndex(
              opt => opt === currentProcessingMechanism
            )
            return meta.optionLabels[index]
          }
          return name
        },
        ''
      )
      return (
        processingMechanism +
        ' | ' +
        configuration.properties.monitoredDirectoryPath
      )
    default:
      return null
  }
}

const generateUrl = (displayName: string, hash: boolean) => {
  const firstPart = hash
    ? location.hash.split('/Configuration')[0].substring(1)
    : location.pathname.split('/Configuration')[0]
  return `${firstPart}/Configuration/${encodeURIComponent(displayName)}`
}

export const Configuration = ({
  configuration,
}: {
  configuration: ExistingConfigurationType
}) => {
  const { fetchServices } = useServicesContext()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const displayName = configuration.fpid ? configuration.id : configuration.name
  const hintName = getHintName({ configuration })
  const url = generateUrl(displayName, true)
  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      style={{
        padding: '10px',
        marginLeft: '10px',
      }}
      spacing={3}
      wrap="nowrap"
    >
      <Grid item md={6}>
        <Link to={url}>
          <Button style={{ wordBreak: 'break-all' }}>
            {hintName !== null ? hintName : displayName}
          </Button>
        </Link>
      </Grid>
      <Grid item md={3} zeroMinWidth>
        <Typography style={{ wordBreak: 'break-all' }}>
          {configuration.fpid ? configuration.fpid : null}
        </Typography>
      </Grid>
      <Grid item md="auto">
        {configuration.fpid ? (
          <Button
            fullWidth
            color="secondary"
            onClick={async () => {
              var question =
                'Are you sure you want to remove the configuration: ' +
                displayName +
                '?'
              //@ts-ignore
              var confirmation = window.confirm(question)
              if (confirmation) {
                await COMMANDS.CONFIGURATION.DELETE(configuration.id)
                await fetchServices()
                enqueueSnackbar(`${configuration.id} deleted`, {
                  variant: 'success',
                  action: generateDismissSnackbarAction({ closeSnackbar }),
                })
              }
            }}
          >
            <CloseIcon />
          </Button>
        ) : null}
      </Grid>
    </Grid>
  )
}
