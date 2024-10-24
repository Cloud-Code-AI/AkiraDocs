import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const SidebarContainer = styled.nav`
  width: 250px;
  padding: 20px;
  background-color: #f5f5f5;
`

const NavItem = styled.li`
  margin-bottom: 10px;
`

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  &:hover {
    text-decoration: underline;
  }
`

interface NavigationItem {
  title: string;
  path: string;
  items?: Record<string, NavigationItem>;
}

interface SidebarProps {
  navigationItems: Record<string, NavigationItem>;
}

const renderNavItems = (items: Record<string, NavigationItem>) => {
  return (
    <ul>
      {Object.entries(items).map(([key, item]) => (
        <NavItem key={key}>
          <NavLink href={item.path}>{item.title}</NavLink>
          {item.items && renderNavItems(item.items)}
        </NavItem>
      ))}
    </ul>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ navigationItems }) => {
  return (
    <SidebarContainer>
      {renderNavItems(navigationItems)}
    </SidebarContainer>
  )
}

export default Sidebar