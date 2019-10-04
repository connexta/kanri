import {
  createMuiTheme,
  MuiThemeProvider as ThemeProvider,
  darken,
  Theme as ThemeInterface,
  createStyles,
  lighten,
} from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'
import * as React from 'react'
import { useAppRootContext } from './app-root.pure'
import { createGlobalStyle } from 'styled-components'

type Props = {
  children?: any
}

const GlobalStyles = createGlobalStyle<ThemeInterface>`
  a {
    color: ${props => props.palette.primary.dark};
  }
  .MuiToolbar-root a,
  .MuiToolbar-root .MuiBreadcrumbs-separator {
    color: ${props =>
      props.palette.getContrastText(props.palette.primary.main)};
  }
  .MuiDrawer-root a {
    color: ${props =>
      props.palette.getContrastText(props.palette.background.paper)};
  }
  @media (min-width: 600px) {
    .MuiListItemIcon-root {
      margin-left: 8px;
    }
  }
`

export const Theme = ({ children }: Props) => {
  const { theme } = useAppRootContext()
  const muiTheme = createMuiTheme({
    palette: {
      type: theme,
      primary: {
        main: theme === 'light' ? blue[700] : lighten(blue[200], 0.2),
      },
      secondary: {
        main: theme === 'light' ? darken(pink.A400, 0.1) : pink[200],
      },
      background: {
        default: theme === 'light' ? '#fff' : '#121212',
      },
    },
    typography: {
      body2: {
        fontSize: '.75rem',
        fontWeight: 'lighter',
      },
    },
    overrides: {
      MuiTooltip: createStyles({
        tooltip: {
          fontSize: '1rem',
        },
      }),
    },
  })
  return (
    <>
      <GlobalStyles {...muiTheme} />
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </>
  )
}
