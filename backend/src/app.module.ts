import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { VehiculeModule } from './vehicule/vehicule.module';
import { DriverModule } from './driver/driver.module';
import { ClientModule } from './client/client.module';
import { EntretienModule } from './entretien/entretien.module';
import { CamionModule } from './camion/camion.module';
import { MissionSOSModule } from './mission-sos/mission-sos.module';
import { PlageHoraireModule } from './plage_horaire/plage_horaire.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '0000',
    database: 'sos_vehicules',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    dropSchema: true, // 👈 ajoute ça temporairement
    
  }),MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "iyadakrimi2@gmail.com",
          pass:"vjpo ryxa rjpm awrf",
        },
      },
      // defaults: {
      //   from: process.env.MAIL_FROM,
      // },
    }), ConfigModule.forRoot({isGlobal:true}),UserModule, VehiculeModule, DriverModule, ClientModule, EntretienModule, CamionModule, MissionSOSModule, PlageHoraireModule, AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
