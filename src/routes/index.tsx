import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import {useAuhth} from '../hooks/auth'
import App from './app.routes'
import Auth from './auth.routes'

const Routes: React.FC = () => {
  const { logged } = useAuhth()

  return (
    <BrowserRouter>
    { logged? <App/> : <Auth /> }
    </BrowserRouter>
    )
}

export default Routes
