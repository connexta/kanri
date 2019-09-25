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
// these variables are defined during the build
/* global __ENV__ */
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { AppRoot } from './components/app-root'

// setup the area that the modules will load into and asynchronously require in each module
// so that it can render itself into the area that was just constructed for it
if (__ENV__ === 'netlify') {
  fetch('/admin/').catch().then(() => {
    ReactDom.render(<AppRoot />, document.querySelector('#root'))
  })
} else {
  ReactDom.render(<AppRoot />, document.querySelector('#root'))
}
