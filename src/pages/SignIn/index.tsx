import React, {useState} from 'react'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Container, Logo, Form, FormTitle } from './styles'
import {useAuhth} from '../../hooks/auth'

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { signIn } = useAuhth()
  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Minha Carteira" />
        <h2>Minha Carteira</h2>
      </Logo>

      <Form onSubmit={() => signIn(email, password)}>
        <FormTitle>Entrar</FormTitle>

        <Input required type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <Input required type="password" placeholder="senha" onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit">Acessar</Button>
      </Form>
    </Container>
  )
}

export default SignIn
