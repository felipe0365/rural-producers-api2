interface ChartDataPoint {
  name: string
  value: number
}

export class DashboardResponseDto {
  totalFarms: number
  totalArea: number
  byState: ChartDataPoint[]
  byCulture: ChartDataPoint[]
  byLandUse: {
    arableArea: number
    vegetationArea: number
  }
}
