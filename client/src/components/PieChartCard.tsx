import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartDataPoint {
  name: string
  value: number
}

interface PieChartCardProps {
  data: ChartDataPoint[]
  title: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919']

export function PieChartCard({ data, title }: PieChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>{title}</h3>
        <p>Não há dados para exibir</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={'value'}
            nameKey={'name'}
            label={({ name, percent }) =>
              `${name.length > 10 ? name.substring(0, 10) + '...' : name} ${((percent || 0) * 100).toFixed(0)}%`
            }
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
