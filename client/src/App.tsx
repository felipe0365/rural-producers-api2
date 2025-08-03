import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import ProducersList from './components/ProducersList'
import ProducerForm from './components/ProducerForm'
import ProducerDetails from './components/ProducerDetails'
import './App.css'

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtores" element={<ProducersList />} />
            <Route path="/produtores/novo" element={<ProducerForm />} />
            <Route path="/produtores/editar/:id" element={<ProducerForm />} />
            <Route path="/produtores/detalhes/:id" element={<ProducerDetails />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App
