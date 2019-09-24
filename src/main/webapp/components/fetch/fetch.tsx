import fetch, { FetchProps } from '@connexta/atlas/functions/fetch'
import { ConfigurationType, FeatureType } from '../app-root/app-root.pure'

/**
 * Handy place for all our backend interaction information
 */

export type URL_SHAPES = {
  FACTORY: {
    ADD: undefined
  }
  SERVICES: {
    LIST: {
      SPECIFIC: {
        arguments: [
          /**
           * should be the id of the app to get services for
           */
          string
        ]
      }
      ALL: {
        arguments: []
      }
    }
  }
  CONFIGURATION: {
    EDIT: {
      arguments: [
        /**
         *  should be the id of the config to edit (this is the one with the uuid if a factory!)
         *  if not a factory, just the service.id
         */
        string,
        /**
         * should be the map of properties for the config and their values
         */
        {
          /**
           *  really just service.id, this should be the same as service.pid
           */
          'service.factoryPid'?: string
          /**
           * the service id
           */
          'service.pid': string
          [key: string]:
            | string
            | string[]
            | number
            | number[]
            | boolean
            | boolean[]
            | undefined
        }
      ]
      mbean: 'org.codice.ddf.ui.admin.api.ConfigurationAdmin:service=ui,version=2.3.0'
      operation: 'update'
      type: 'EXEC'
    }
  }
}

export const URLS = {
  SESSION: {
    INVALIDATE: '/services/internal/session/invalidate?service=',
    RENEW: '/services/internal/session/renew',
    EXPIRY: '/services/internal/session/expiry',
  },
  FEATURES: {
    ALL:
      '/admin/jolokia/read/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/AllFeatures',
    /**
     * Get with the feature name on end to install
     */
    INSTALL:
      '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/installFeature(java.lang.String)/',
    /**
     * Get with the feature name on end to uninstall
     */
    UNINSTALL:
      '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/uninstallFeature(java.lang.String)/',
  },
  FACTORY: {
    /*
        adding a service id to the end and doing a get will create a new configuration and return a unique id as the value
        you can then use that id to send a post that updates the configuration to the values you want
    */
    ADD:
      '/admin/jolokia/exec/org.codice.ddf.ui.admin.api.ConfigurationAdmin:service=ui,version=2.3.0/createFactoryConfiguration',
  },
  SERVICES: {
    /*
      adding an app to the end and doing a get will list all the app services
    */
    APP:
      '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/getServices',
    ALL:
      '/admin/jolokia/exec/org.codice.ddf.ui.admin.api.ConfigurationAdmin:service=ui,version=2.3.0/listServices',
  },
  CONFIGURATION: {
    /*
        sending a post with shape this as the body:
            {
                arguments: [
                    "ddf.catalog.transformer.html.categories.9efff015-a0f9-4009-b356-56b059284676",
                    {
                        service.factoryPid: "ddf.catalog.transformer.html.categories", // only if it's a factory!
                        service.pid: "ddf.catalog.transformer.html.categories",
                        //any other property of the metatype
                    }]
                mbean: "org.codice.ddf.ui.admin.api.ConfigurationAdmin:service=ui,version=2.3.0"
                operation: "update"
                type: "EXEC"
            }
        allows you to update any configuration in the system (factory or not), 
        just note that service.factoryPid is left out for non factory
        The response might not be parseable as JSON (use parseJolokiaJSON to get around this)
    */
    EDIT:
      '/admin/jolokia/exec/org.codice.ddf.ui.admin.api.ConfigurationAdmin:service=ui,version=2.3.0/add',
    /**
     * Add the /id on the end to delete a configuration
     */
    DELETE:
      '/admin/jolokia/exec/org.codice.ddf.ui.admin.api.ConfigurationAdmin:service=ui,version=2.3.0/delete',
  },
}

export const COMMANDS = {
  FETCH: ((url, options) => {
    return fetch(url, options)
  }) as FetchProps,
  SESSION: {
    RENEW: () => {
      return COMMANDS.FETCH(URLS.SESSION.RENEW)
        .then(response => response.json())
        .then(data => {
          return data
        })
        .catch(response => {
          // see why this is null pointer exception on master
          return response
        })
    },
    EXPIRY: () => {
      return COMMANDS.FETCH(URLS.SESSION.EXPIRY)
        .then(response => response.json())
        .then(data => {
          return data as number
        })
    },
  },
  FEATURES: {
    INSTALL: ({ name }: { name: string }) => {
      return COMMANDS.FETCH(URLS.FEATURES.INSTALL + name)
        .then(response => response.json())
        .then(data => {
          return data
        })
    },
    UNINSTALL: ({ name }: { name: string }) => {
      return COMMANDS.FETCH(URLS.FEATURES.UNINSTALL + name)
        .then(response => response.json())
        .then(data => {
          if (data.status !== 200) {
            return {
              success: false,
              message: data.error,
            }
          }
          return {
            success: true,
          }
        })
    },
    LIST: () => {
      return COMMANDS.FETCH(URLS.FEATURES.ALL)
        .then(response => response.json())
        .then(data => {
          const features = data.value as FeatureType[]
          return features.sort((a, b) => {
            if (a.name < b.name) {
              return -1
            } else {
              return 1
            }
          })
        })
    },
  },
  SERVICES: {
    LIST: ({ appName }: { appName?: string }) => {
      let urlToUse = appName
        ? `${URLS.SERVICES.APP}/${appName}`
        : URLS.SERVICES.ALL
      return COMMANDS.FETCH(urlToUse)
        .then(text => text.text())
        .then(parseJolokiaJSON)
        .then(data => {
          const servicesData = data.value as ConfigurationType[]
          servicesData
            .sort((a: ConfigurationType, b: ConfigurationType) => {
              if (a.name < b.name) {
                return -1
              } else {
                return 1
              }
            })
            .forEach(service => {
              // apache felix declarative service implementation and other high level patches for convenience, also the long standing jolokia bug with serialization being borked
              service.metatype.forEach(meta => {
                if (meta.optionLabels === null) {
                  meta.optionLabels = []
                }
                if (meta.optionValues === null) {
                  meta.optionValues = []
                }
                if (meta.cardinality > 0 && meta.defaultValue === null) {
                  meta.defaultValue = []
                }
                if (meta.cardinality === 0 && meta.defaultValue === null) {
                  meta.defaultValue = ['']
                }
              })
              if (service.configurations) {
                service.configurations.forEach(config => {
                  config.service = service
                  service.metatype.forEach(meta => {
                    if (
                      config.properties[meta.id] === null ||
                      config.properties[meta.id] === undefined
                    ) {
                      config.properties[meta.id] = meta.defaultValue
                    }
                    if (
                      meta.cardinality > 0 &&
                      !(config.properties[meta.id] instanceof Array)
                    ) {
                      let propval = config.properties[meta.id] as string
                      config.properties[meta.id] = [propval]
                    }
                  })
                })
              }
            })
          return servicesData
        })
    },
  },
  FACTORY: {
    ADD: ({ serviceId }: { serviceId: string }) => {
      return COMMANDS.FETCH(`${URLS.FACTORY.ADD}/${serviceId}`)
        .then(text => text.text())
        .then(parseJolokiaJSON)
        .then(response => {
          return {
            success: response.status === 200,
            id: response.value,
            error: (response.error as string | undefined) || '',
            error_type: (response.error_type as string | undefined) || '',
            stacktrace: (response.stacktrace as string | undefined) || '',
          }
        })
        .catch(() => {
          return {
            success: false,
            id: undefined,
            error: 'Something went wrong',
          }
        })
    },
  },
  CONFIGURATION: {
    DELETE: (id: string) => {
      return COMMANDS.FETCH(`${URLS.CONFIGURATION.DELETE}/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.status !== 200) {
            // warn?
          }
        })
    },
    EDIT: ({ body }: { body: URL_SHAPES['CONFIGURATION']['EDIT'] }) => {
      return COMMANDS.FETCH(URLS.CONFIGURATION.EDIT, {
        method: 'POST',
        body: JSON.stringify(body),
      })
        .then(text => text.text())
        .then(parseJolokiaJSON)
        .then(response => {
          return {
            success: response.status === 200,
            error: (response.error as string | undefined) || '',
            error_type: (response.error_type as string | undefined) || '',
            stacktrace: (response.stacktrace as string | undefined) || '',
          }
        })
        .catch(() => {
          return {
            success: false,
            error: 'Something went wrong',
          }
        })
    },
  },
}

// https://codice.atlassian.net/browse/DDF-1642
// this works around an issue in json-simple where the .toString() of an array
// is returned in the arguments field of configs with array attributes,
// causing the JSON string from jolokia to be unparseable, so we remove it,
// since we don't care about the arguments for our parsing needs
export const parseJolokiaJSON = (text: string) => {
  try {
    return JSON.parse(text.toString().trim())
  } catch (e) {
    text = text.replace(/\[L[\w.;@]*/g, '""')
    return JSON.parse(text.toString().trim())
  }
}
