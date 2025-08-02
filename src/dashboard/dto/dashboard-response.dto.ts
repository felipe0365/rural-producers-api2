import { ApiProperty } from '@nestjs/swagger'

interface ChartDataPoint {
  name: string
  value: number
}

export class DashboardResponseDto {
  @ApiProperty({
    description: 'Total de fazendas cadastradas',
    example: 150,
  })
  totalFarms: number

  @ApiProperty({
    description: 'Área total em hectares',
    example: 15000.5,
  })
  totalArea: number

  @ApiProperty({
    description: 'Dados de fazendas por estado',
    example: [
      { name: 'SP', value: 50 },
      { name: 'MG', value: 30 },
      { name: 'PR', value: 20 },
    ],
    isArray: true,
  })
  byState: ChartDataPoint[]

  @ApiProperty({
    description: 'Dados de área plantada por cultura',
    example: [
      { name: 'Soja', value: 8000 },
      { name: 'Milho', value: 5000 },
      { name: 'Café', value: 2000 },
    ],
    isArray: true,
  })
  byCulture: ChartDataPoint[]

  @ApiProperty({
    description: 'Dados de uso do solo',
    example: {
      arableArea: 12000,
      vegetationArea: 3000,
    },
  })
  byLandUse: {
    arableArea: number
    vegetationArea: number
  }
}
