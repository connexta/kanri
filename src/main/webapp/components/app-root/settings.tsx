import * as React from 'react'
import { TextField, MenuItem } from '@connexta/atlas/atoms/input'
import { Typography } from '@connexta/atlas/atoms/typography'
import { useAppRootContext, ApplicationTheme } from './app-root.pure'

export const Settings = () => {
  const { theme, setTheme } = useAppRootContext()
  return (
    <>
      <Typography variant="h4" align="center">
        Settings
      </Typography>
      <TextField
        select
        label="Theme"
        value={theme}
        onChange={e => {
          const value = e.target.value as ApplicationTheme
          setTheme(value)
        }}
      >
        <MenuItem value="dark">Dark</MenuItem>
        <MenuItem value="light">Light</MenuItem>
      </TextField>
    </>
  )
}
