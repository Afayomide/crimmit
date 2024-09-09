import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
// import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';



@Module({
  imports: [
    JwtModule.register({
      secret: 'my_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  // providers: [AuthService],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

