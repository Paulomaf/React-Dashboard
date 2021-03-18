import React from 'react'
import { Container, ToggleLabel, ToggleSelector } from './styles'

const Toggle: React.FC = () => {
  return (
    <Container>
      <ToggleLabel>Light</ToggleLabel>
      <ToggleSelector checked onChange={() => console.log('mudou')} 
              uncheckedIcon={false} checkedIcon={false}/>
      <ToggleLabel>Dark</ToggleLabel>
    </Container>
  )
}

export default Toggle
