import React from 'react'
import { Layout as AntLayout, Menu, Typography } from 'antd'
import { DashboardOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Content, Sider } = AntLayout
const { Title } = Typography

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

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
          }}
        >
          <Title level={3} style={{ margin: '16px 0', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            🌱 Sistema de Gestão de Produtores Rurais
          </Title>
        </Header>
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
