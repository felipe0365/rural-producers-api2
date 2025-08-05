import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import ProducersList from './components/ProducersList'
import ProducerForm from './components/ProducerForm'
import ProducerDetails from './components/ProducerDetails'
import './App.css'

function App() {
  const theme = {
    token: {
      colorPrimary: '#4caf50',
      colorSuccess: '#66bb6a',
      colorWarning: '#ff9800',
      colorError: '#f44336',
      colorInfo: '#8bc34a',
      borderRadius: 6,
    },
  }

  return (
    <ConfigProvider locale={ptBR} theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/produtores"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProducersList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/produtores/novo"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProducerForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/produtores/editar/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProducerForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/produtores/detalhes/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProducerDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
