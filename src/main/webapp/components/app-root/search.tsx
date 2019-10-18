import * as React from 'react'
import FilledInput from '@material-ui/core/FilledInput'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useTheme } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles'
import { useServicesContext } from '../services/services.pure'
import { ConfigurationType } from './app-root.pure'
import Popper from '@material-ui/core/Popper'
import { Paper } from '@connexta/atlas/atoms/paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Link, useHistory } from 'react-router-dom'
import { Typography } from '@material-ui/core'
export const Search = () => {
  const anchorRef = React.useRef<null | HTMLElement>(null)
  const selectedRef = React.useRef<null | any>(null)
  const history = useHistory()
  const popperInstanceRef = React.useRef<null | any>(null)
  const [selected, setSelected] = React.useState(0 as number)
  const [value, setValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const { services } = useServicesContext()
  const [suggestions, setSuggestions] = React.useState([] as {
    why: ConfigurationType['metatype'][0]
    what: ConfigurationType
  }[])
  const theme = useTheme()

  React.useEffect(() => {
    if (value.length > 2) {
      setOpen(true)
    } else {
      setOpen(false)
    }
    setSelected(0)
  }, [value])

  React.useEffect(() => {
    if (open === true) {
      const possibles = services
        .filter(service => {
          return service.metatype.some(metatype => {
            let concat = metatype.id + metatype.description
            if (metatype.name !== null) concat += metatype.name
            return concat.toLowerCase().includes(value.toLowerCase())
          })
        })
        .map(service => {
          return {
            why: service.metatype.filter(metatype => {
              let concat = metatype.id + metatype.description
              if (metatype.name !== null) concat += metatype.name
              return concat.toLowerCase().includes(value.toLowerCase())
            })[0],
            what: service,
          }
        })
      setSuggestions(possibles.slice(0, 10))
    }
  }, [open, value])

  React.useEffect(() => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.update()
    }
    if (selectedRef.current) {
      //@ts-ignore
      selectedRef.current.scrollIntoViewIfNeeded()
    }
  })

  return (
    <>
      <FilledInput
        ref={anchorRef}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        inputProps={{
          style: {
            padding: '10px',
          },
        }}
        value={value}
        onChange={e => {
          setValue(e.target.value)
        }}
        placeholder="Search ..."
        margin="dense"
        style={{
          background: lighten(theme.palette.primary.light, 0.4),
        }}
        onKeyDown={e => {
          if (e.keyCode === 38) {
            //up
            e.preventDefault()
            setSelected(Math.max(0, selected - 1))
          } else if (e.keyCode === 40) {
            //down
            e.preventDefault()
            setSelected(Math.min(selected + 1, suggestions.length - 1))
          } else if (e.keyCode === 13) {
            e.preventDefault()
            const toLoad = suggestions[selected]
            history.push(`/admin/system/Configuration/${toLoad.what.name}`)
            setOpen(false)
          }
        }}
      />
      <Popper
        popperRef={popperInstanceRef}
        open={open}
        anchorEl={anchorRef.current}
      >
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false)
          }}
        >
          <Paper style={{ maxHeight: '50vh', overflow: 'auto' }}>
            {suggestions.map((suggestion, index) => {
              const isSelected = index === selected
              return (
                <Link
                  to={`/admin/system/Configuration/${suggestion.what.name}`}
                  onClick={() => {
                    setOpen(false)
                  }}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  onMouseEnter={e => {
                    setSelected(index)
                    //@ts-ignore
                    e.target.scrollIntoViewIfNeeded()
                  }}
                  ref={isSelected ? selectedRef : null}
                >
                  <div
                    style={{
                      padding: '10px',
                      width: '400px',
                      background: isSelected ? 'yellow' : 'inherit',
                    }}
                  >
                    <Typography variant="h6">{suggestion.what.name}</Typography>
                    <Typography variant="body2" style={{ opacity: 0.9 }}>
                      {suggestion.why.name || suggestion.why.id}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontSize: '12px', opacity: 0.9 }}
                    >
                      {suggestion.why.description
                        ? suggestion.why.description.substring(0, 100)
                        : ''}
                    </Typography>
                  </div>
                </Link>
              )
            })}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
