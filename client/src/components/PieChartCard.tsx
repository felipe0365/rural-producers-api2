import React from 'react'
import { Card } from 'antd'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ChartDataPoint {
  name: string
  value: number
}

interface PieChartCardProps {
  title: string
  data: ChartDataPoint[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B']

const PieChartCard: React.FC<PieChartCardProps> = ({ title, data }) => {
  const formatTooltip = (value: any, name: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const percentage = ((value / total) * 100).toFixed(1)
    return [`${value} (${percentage}%)`, name]
  }

  return (
    <Card title={title} style={{ height: '100%' }}>
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
          <Tooltip formatter={formatTooltip} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default PieChartCard
