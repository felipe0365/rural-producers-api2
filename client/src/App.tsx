import { useEffect, useState } from 'react'
import './App.css'
import { getDashboardData, type DashboardData } from './services/api.services'
import { PieChartCard } from './components/PieChartCard'

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (err) {
        setError('Falha ao buscar os dados do dashboard. Verifique se a API está rodando.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <h1>Carregando...</h1>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="container">
        <h1>{error || 'Não foi possível carregar os dados.'}</h1>
      </div>
    )
  }

  const landUseChartData = [
    { name: 'Agricultável', value: dashboardData.byLandUse.arableArea },
    { name: 'Vegetação', value: dashboardData.byLandUse.vegetationArea },
  ]

  return (
    <div className="container">
      <h1>Dashboard do Produtor Rural</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{dashboardData.totalFarms}</h2>
          <p>Total de Fazendas</p>
        </div>
        <div className="stat-card">
          <h2>{dashboardData.totalArea.toLocaleString('pt-BR')} ha</h2>
          <p>Área Total em Hectares</p>
        </div>
      </div>

      <div className="charts-grid">
        <PieChartCard title="Fazendas por Estado" data={dashboardData.byState} />
        <PieChartCard title="Culturas por Área Plantada" data={dashboardData.byCulture} />
        <PieChartCard title="Uso do Solo" data={landUseChartData} />
      </div>
    </div>
  )
}

export default App
