import React from 'react'
import { MdDashboard, MdArrowDownward, MdArrowUpward, MdExitToApp } from 'react-icons/md'
import { Container, Header, LogImg, MenuContainer, MenuItemLink, Title, MenuItemButton } from './styles'

import logoImg from '../../assets/logo.svg'
import { useAuhth } from '../../hooks/auth'

const Aside: React.FC = () => {
  const {signOut} = useAuhth()
  return (
    <Container>
      <Header>
        <LogImg src={logoImg} alt="Logo Minha Carteira" />
        <Title>Minha Carteira</Title>
      </Header>

      <MenuContainer>
        <MenuItemLink href="/">
          <MdDashboard />
          Dashboard
        </MenuItemLink>

        <MenuItemLink href="/list/entry-balance">
          <MdArrowDownward />
          Entradas
        </MenuItemLink>

        <MenuItemLink href="/list/exit-balance">
          <MdArrowUpward />
          Saídas
        </MenuItemLink>

        <MenuItemButton onClick={signOut} >
          <MdExitToApp />
          Sair
        </MenuItemButton>
      </MenuContainer>
    </Container>
  )
}

export default Aside
