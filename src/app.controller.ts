import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './modules/iam/api/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API ping' })
  getStatus() {
    return this.appService.getStatus();
  }
}
