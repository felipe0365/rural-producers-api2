import React from 'react'
import { Card, Empty } from 'antd'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ChartDataPoint {
  name: string
  value: number
}

interface PieChartCardProps {
  title: string
  data: ChartDataPoint[]
  emptyMessage?: string
}

const COLORS = ['#4caf50', '#8bc34a', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9', '#2e7d32', '#388e3c']

const PieChartCard: React.FC<PieChartCardProps> = ({ title, data, emptyMessage = 'Nenhum dado disponível' }) => {
  if (!data || data.length === 0) {
    return (
      <Card title={title} className="chart-card">
        <Empty description={emptyMessage} />
      </Card>
    )
  }

  // Verificar se todos os valores são 0
  const allValuesZero = data.every((item) => item.value === 0)

  if (allValuesZero) {
    return (
      <Card title={title} className="chart-card">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Culturas disponíveis (sem área plantada):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card title={title} className="chart-card">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Quantidade']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default PieChartCard
