import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';



@Module({
  controllers: [AppController],
  providers: [AppService],

  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    AuthModule,
    UserModule,
  ],
})

export class AppModule {}
