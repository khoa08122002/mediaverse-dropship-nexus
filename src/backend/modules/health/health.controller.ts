import { Controller, Get, Injectable } from '@nestjs/common';
import { Public } from '../../modules/auth/decorators/public.decorator';
import { HealthService } from './health.service';

@Injectable()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  async check() {
    return this.healthService.check();
  }
} 