import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Obter dados do dashboard',
    description: 'Retorna estatísticas e dados agregados para o dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do dashboard retornados com sucesso',
  })
  getDashboardData() {
    return this.dashboardService.getDashboardData()
  }
}
