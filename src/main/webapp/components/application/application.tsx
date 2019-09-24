import * as React from 'react'
import { Paper } from '@connexta/atlas/atoms/paper'
import { Grid } from '@connexta/atlas/atoms/grid'
import { Typography } from '@connexta/atlas/atoms/typography'
import { Tabs, Tab } from '@connexta/atlas/atoms/tabs'
import { Services } from '../services/services'
import { CircularProgress } from '@connexta/atlas/atoms/progress'
import fetch from '@connexta/atlas/functions/fetch'
import { ApplicationType, getDisplayName } from '../../types/App'
import { useRouteContext } from '../app-root/app-root.pure'
import { Iframe } from '../iframe/iframe'

const DYNAMIC_PLUGINS_URL =
  '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/getPluginsForApplication(java.lang.String)/'

type Props = {
  app: ApplicationType
}

type TabType = {
  displayName: string
  iframeLocation?: string
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const TabContent = ({
  app,
  value,
  collectionJSON,
}: {
  app: ApplicationType
  value: string
  collectionJSON: TabType[]
}) => {
  switch (value) {
    case 'Info':
      return (
        <Grid item style={{ maxWidth: '600px', padding: '20px' }}>
          <Typography variant="body1">
            {app.description.split('::')[0]}
          </Typography>
        </Grid>
      )
    case 'Configuration':
      return <Services app={app} />
    default:
      const srcUrl = collectionJSON.filter(tab => tab.displayName === value)[0]
        .iframeLocation
      return <Iframe url={srcUrl} />
  }
}

const Application = ({ app }: Props) => {
  const { routeProps } = useRouteContext()
  const { history, location } = routeProps
  const [loading, setLoading] = React.useState(true)
  const [collection, setCollection] = React.useState([] as TabType[])
  React.useEffect(() => {
    fetch(DYNAMIC_PLUGINS_URL + app.name)
      .then(response => response.json())
      .then(data => {
        const plugins = [
          {
            displayName: 'Info',
          },
          {
            displayName: 'Configuration',
          },
        ].concat(data.value)
        setCollection(plugins)
        setLoading(false)
      })
  }, [])

  let value = location.pathname.split(`${app.name}/`)[1]
  if (value !== undefined) {
    value = value.split('/')[0]
  } else {
    value = 'Info'
  }
  function handleChange(_event: React.ChangeEvent<{}>, newValue: string) {
    history.push(`/admin/applications/${app.name}/${newValue}`)
  }
  return (
    <Paper style={{ padding: '20px' }}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Typography variant="h4">{getDisplayName(app)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
              >
                {collection.map(tab => {
                  return (
                    <Tab
                      key={tab.displayName}
                      label={tab.displayName}
                      value={tab.displayName}
                      {...a11yProps(tab.displayName)}
                    />
                  )
                })}
              </Tabs>
              <TabContent app={app} value={value} collectionJSON={collection} />
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Application
