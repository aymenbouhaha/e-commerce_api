import {GatewayTimeoutException, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class MailService {

    constructor(
        private readonly mailerService: MailerService,
        private configService: ConfigService
    ) {
    }


    sendVerificationCode(email: string, verifCode: string) {
        try {
            this.mailerService.sendMail({
                from: this.configService.get("MAIL_USER"),
                to: email,
                subject: 'Verification Code',
                html: `
                <h1>Welcome to our Elegent</h1>
                <p>Here is your verification code ${verifCode}</p>
                `
            });
        } catch (e) {
            throw new GatewayTimeoutException("Email was not sent but you're account was created")
        }

    }
}
