import * as React from 'react'
import { FeatureType } from '../app-root/app-root.pure'
import { Grid } from '@connexta/atlas/atoms/grid'
import { Button } from '@connexta/atlas/atoms/button'
import { Typography } from '@connexta/atlas/atoms/typography'
import { COMMANDS } from '../fetch/fetch'
import { useFeaturesContext } from './features.pure'
import { LinearProgress } from '@connexta/atlas/atoms/progress'
import {
  useSnackbar,
  generateDismissSnackbarAction,
} from '@connexta/atlas/atoms/snackbar'

type Props = {
  feature: FeatureType
}

export const Feature = ({ feature }: Props) => {
  const { fetchFeatures } = useFeaturesContext()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(false)
  return (
    <Grid
      container
      alignItems="center"
      justify="space-between"
      spacing={3}
      wrap="nowrap"
    >
      <Grid
        item
        style={{
          opacity: feature.status === 'Installed' ? 1 : 0.5,
        }}
        xs={6}
      >
        <Typography variant="body1">{feature.name}</Typography>
        <Typography variant="body1">{feature.version}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Button
          color={feature.status === 'Installed' ? 'secondary' : 'primary'}
          onClick={async () => {
            setLoading(true)
            if (feature.status === 'Installed') {
              const response = await COMMANDS.FEATURES.UNINSTALL({
                name: feature.name,
              })
              if (response.success === false) {
                enqueueSnackbar(response.message, {
                  variant: 'error',
                  persist: true,
                  action: generateDismissSnackbarAction({ closeSnackbar }),
                })
              } else {
                await fetchFeatures()
              }
              setLoading(false)
            } else {
              await COMMANDS.FEATURES.INSTALL({ name: feature.name })
              await fetchFeatures()
              setLoading(false)
            }
          }}
          disabled={loading}
          style={{ position: 'relative' }}
        >
          <>
            {loading ? (
              <LinearProgress
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  opacity: 0.5,
                }}
              />
            ) : null}
            {feature.status === 'Installed' ? 'Uninstall' : 'Install'}
          </>
        </Button>
      </Grid>
    </Grid>
  )
}
