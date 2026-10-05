import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from '../application/login.use-case';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@ApiTags('iam')
@Controller()
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post('auth/login')
  @ApiOperation({ summary: 'Login JWT' })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }
}
