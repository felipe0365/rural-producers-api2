import { Controller, Get } from '@nestjs/common'
import { DashboardResponseDto } from './dto/dashboard-response.dto'
import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboardData(): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboardData()
  }
}
