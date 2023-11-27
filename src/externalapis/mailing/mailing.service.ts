import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  private async setTransport(): Promise<void> {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get('REFRESH_TOKEN'),
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }
  public async sendMail(
    to: string,
    subject?: string,

    namefolder?: string,
    emailsender?: string,

    template?: string,
  ): Promise<string> {
    console.log(to, subject, namefolder, emailsender, template);

    if (!to) throw Error('Verify Email and Subject');

    await this.setTransport();
    return this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: to, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: subject, // Subject line
        template: template,
        context: {
          // Data to be sent to template engine..
          emailsender: emailsender,
          namefolder: namefolder,
        },
      })
      .then((success) => {
        return 'EMAIL SENDED';
      })
      .catch((err) => {
        console.log(err)
        return 'an error has occured';
      });
  }
}
