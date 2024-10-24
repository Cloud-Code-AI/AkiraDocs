import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const TopbarContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  &:hover {
    text-decoration: underline;
  }
`

const Topbar: React.FC = () => {
  return (
    <TopbarContainer>
      <Logo>
        <Link href="/">Your Logo</Link>
      </Logo>
      <Nav>
        <NavLink href="/docs">Docs</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Nav>
    </TopbarContainer>
  )
}

export default Topbar