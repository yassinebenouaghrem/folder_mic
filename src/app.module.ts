import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailingService } from './externalapis/mailing/mailing.service';
import { MailingModule } from './externalapis/mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  imports: [PrismaModule,MailingModule, ConfigModule.forRoot({
    isGlobal: true,
  }),
  MailerModule.forRoot({
    transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    template: {
      dir: process.cwd() + '/src/externalapis/mailing',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
],
  controllers: [AppController],
  providers: [AppService,MailingService],
})
export class AppModule {}
