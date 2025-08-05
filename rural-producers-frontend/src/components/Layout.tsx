import React from 'react'
import { Layout as AntLayout, Menu, Typography, Button, Dropdown, Avatar } from 'antd'
import { DashboardOutlined, UserOutlined, PlusOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const { Header, Content, Sider } = AntLayout
const { Title } = Typography

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      key: '/produtores',
      icon: <UserOutlined />,
      label: 'Produtores Rurais',
      onClick: () => navigate('/produtores'),
    },
    {
      key: '/produtores/novo',
      icon: <PlusOutlined />,
      label: 'Novo Produtor',
      onClick: () => navigate('/produtores/novo'),
    },
  ]

  const getSelectedKey = () => {
    if (location.pathname === '/') return '/'
    if (location.pathname.startsWith('/produtores/novo')) return '/produtores/novo'
    if (location.pathname.startsWith('/produtores')) return '/produtores'
    return '/'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
      onClick: () => console.log('Perfil'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configurações',
      onClick: () => console.log('Configurações'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            margin: '16px',
            borderRadius: '8px',
          }}
        >
          <Title level={4} style={{ margin: 0, color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            🌾 Produtores Rurais
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ borderRight: 0, background: 'transparent' }}
          theme="dark"
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
            padding: '0 24px',
            borderBottom: '1px solid #2e7d32',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={3} style={{ margin: '16px 0', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            🌱 Sistema de Gestão de Produtores Rurais
          </Title>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Button
              type="text"
              style={{
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 'auto',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Avatar size="small" style={{ backgroundColor: '#ffffff', color: '#4caf50' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <span style={{ color: '#ffffff' }}>{user?.name || 'Usuário'}</span>
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
