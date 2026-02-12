import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { VehiculeModule } from './vehicule/vehicule.module';
import { DriverModule } from './driver/driver.module';
import { ClientModule } from './client/client.module';

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
  }), UserModule, VehiculeModule, DriverModule, ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
