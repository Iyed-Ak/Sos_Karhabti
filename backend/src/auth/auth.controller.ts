import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guards';


interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

interface UserPayload {
  sub: number;
  email: string;
  role: string;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request & { user: UserPayload }) {
    const userId= req.user.sub;
    const refreshToken = req.user["refreshToken"];
     return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post("signin")
  async signin(@Body() data: AuthDto) {
    return this.authService.login(data);
  }
  @UseGuards(RefreshTokenGuard)
 @Get('logout')
  logout(@Req() req:Request & { user: UserPayload }) {
    this.authService.logout(req.user.sub);
  }

  @Post("/forgetpassword")
  forgetPassword(@Body() data: AuthDto) {
    return this.authService.forgotPassword(data.email);
  }

  @Post("/reset/:token")
  resetPassword(@Body() data: AuthDto, @Param("token") token: string) {
    return this.authService.resetPassword(token, data.password);
  }
}
