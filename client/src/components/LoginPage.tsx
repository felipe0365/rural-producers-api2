import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  UserOutlined,
  LockOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import './LoginPage.css'

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null
    message: string
    description: string
  } | null>(null)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const showNotification = (type: 'success' | 'error', message: string, description: string) => {
    setNotification({ type, message, description })
    setTimeout(() => setNotification(null), 5000) // Auto-hide after 5 seconds
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulário submetido:', { isLogin, formData })
    setIsLoading(true)

    try {
      if (isLogin) {
        console.log('Tentando fazer login...')
        await login(formData.username, formData.password)
        console.log('Login realizado com sucesso!')

        showNotification('success', 'Login realizado com sucesso!', 'Bem-vindo ao sistema de gestão rural.')

        setTimeout(() => navigate('/'), 1000) // Redireciona após 1 segundo
      } else {
        console.log('Tentando fazer registro...')
        if (formData.password !== formData.confirmPassword) {
          showNotification('error', 'Erro na validação', 'As senhas não coincidem. Tente novamente.')
          setIsLoading(false)
          return
        }
        await register(formData.name, formData.username, formData.password)
        console.log('Registro realizado com sucesso!')

        showNotification(
          'success',
          'Conta criada com sucesso!',
          'Sua conta foi criada e você já pode acessar o sistema.',
        )

        setTimeout(() => navigate('/'), 1000) // Redireciona após 1 segundo
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error)

      // Capturar a mensagem de erro do backend
      let errorMessage = 'Ocorreu um erro. Tente novamente.'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      console.log('Mensagem de erro capturada:', errorMessage)

      showNotification('error', 'Erro na autenticação', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', username: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="login-container">
      {/* Background com gradiente suave */}
      <div className="login-background" />

      {/* Notificação customizada */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`custom-notification ${notification.type}`}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="notification-icon">
              {notification.type === 'success' ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.message}</div>
              <div className="notification-description">{notification.description}</div>
            </div>
            <button className="notification-close" onClick={() => setNotification(null)}>
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Ícone do cabeçalho */}
        <motion.div
          className="icon-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        >
          <UserOutlined className="header-icon" />
        </motion.div>

        {/* Título */}
        <motion.h1
          className="login-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          className="login-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {isLogin ? 'Entre com suas credenciais para acessar o sistema' : 'Preencha os dados para criar sua conta'}
        </motion.p>

        {/* Formulário */}
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="form-group"
              >
                <div className="input-container">
                  <UserOutlined className="input-icon" />
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                    className="form-input"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-group">
            <div className="input-container">
              <UserOutlined className="input-icon" />
              <input
                type="text"
                placeholder="Nome de usuário"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <LockOutlined className="input-icon" />
              <input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="confirm-password-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="form-group"
              >
                <div className="input-container">
                  <LockOutlined className="input-icon" />
                  <input
                    type="password"
                    placeholder="Confirmar senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required={!isLogin}
                    className="form-input"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão de ação principal */}
          <motion.button
            type="submit"
            className="primary-button"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : isLogin ? (
              'Entrar'
            ) : (
              'Criar conta'
            )}
          </motion.button>
        </motion.form>

        {/* Separador */}
        <motion.div
          className="separator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span>ou</span>
        </motion.div>

        {/* Botão de alternância */}
        <motion.button
          type="button"
          className="toggle-button"
          onClick={toggleMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <UserAddOutlined className="toggle-icon" />
          {isLogin ? 'Criar nova conta' : 'Já tenho uma conta'}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default LoginPage
