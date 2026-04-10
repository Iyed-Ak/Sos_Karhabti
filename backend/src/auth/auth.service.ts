import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import* as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import* as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {

constructor(private userService: UserService ,private jwtService: JwtService,private configService: ConfigService,private MailerService:MailerService) {}

async login(data: AuthDto){
  const user = await this.userService.findByEmail(data.email);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  const matchingPassword = await argon2.verify(user.password, data.password);
  if(!matchingPassword){
    throw new Error('Mot de passe incorrect');
  }
  const Tokens = await this.getTokens(user.id, user.email, user.role);
  await this.updateRefreshToken(user.id, Tokens.refreshToken);
  return{user,Tokens}

}

async logout(userId: number) {
    return this.userService.update(userId, {
      refreshToken: null,
    });
  }

  async forgotPassword(email: string) {
    try {
      const existing = await this.userService.findByEmail(email);
      if (!existing) {
        throw new NotFoundException('user not found');
      } else {
        const token = await this.jwtService.sign(
          {
            id: existing.id,
          },
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '10m',
          },
        );
        await this.userService.updateToken(existing.id, token);
        const options = {
          to: existing.email,
          subject: 'forget password',
         html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    
    <h2 style="color: #2c3e50;">Password Reset Request</h2>
    
    <p>Hello ${existing.email},</p>
    
    <p>
      We received a request to reset your password. 
      If you made this request, please click the button below to set a new password.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:3001/auth/reset/${token}" 
         style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
         Reset My Password
      </a>
    </div>

    <p>
      This link will expire in <strong>10 minutes</strong> for security reasons.
    </p>

    <p>
      If you did not request a password reset, please ignore this email.
      Your password will remain unchanged.
    </p>

    <hr style="margin: 30px 0;" />

    <p style="font-size: 12px; color: gray;">
      This is an automated message. Please do not reply to this email.
    </p>

  </div>
`,
        };
        await this.MailerService.sendMail(options);
        return {
          success: true,
          message: 'You can change password',
        };
      }
    } catch (error) {
      return 'erreur'+error.message;
    }
  }
async hashData(data: string) {
  const saltRounds = 10;
  return bcrypt.hash(data, saltRounds);
}


async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
}
async refreshTokens(userId: number, refreshToken: string) {
    const user= await this.userService.findOne(userId);
    if (!user|| !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
            refreshToken,

      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email,user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }


  async resetPassword(token: string, password: string) {
    try {
      const verifiedToken = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      if (!verifiedToken) {
        throw new UnauthorizedException('Invalid or expired');
      } else {
        const user= await this.userService.findOne(
          verifiedToken.id,
        );
        if (!user) {
          throw new NotFoundException('User not found');
        }
        user.password= password;
        user.refreshToken = null;
        await this.userService.saveUser(user);
        return {
          success: true,
          message: 'Password changed successfully',
        };
      }
    } catch (error) {
      throw new UnauthorizedException(`Unvalid or expired token , ${error}`);
    }
  }

async getTokens(userId: number, email: string , role:string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
role
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
role
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  
}









  

