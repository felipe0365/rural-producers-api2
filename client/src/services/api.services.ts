import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface ChartDataPoint {
  name: string
  value: number
}

export interface DashboardData {
  totalFarms: number
  totalArea: number
  byState: ChartDataPoint[]
  byCulture: ChartDataPoint[]
  byLandUse: {
    arableArea: number
    vegetationArea: number
  }
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get('/dashboard')
  return response.data
}
