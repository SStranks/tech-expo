import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { BadRequestError } from '#Utils/errors';
import { EMAIL_TEMPLATE_VERIFICATION } from './templates/VerificationEmailTemplate';
import { EMAIL_TEMPLATE_PASSWORD_RESET } from './templates/PasswordResetEmailTemplate';

const { NODE_ENV, NODEMAILER_USERNAME, NODEMAILER_PASSWORD, NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_DEV_EMAIL } =
  process.env;

const senderDev = { address: 'mailtrap@demomailtrap.com', name: 'CRM Server: Development' };
const senderProd = { address: 'mailtrap@demomailtrap.com', name: 'CRM Server: Development' };

const SMTPDefaultConfig: SMTPTransport.Options = {
  host: NODEMAILER_HOST,
  port: Number(NODEMAILER_PORT),
  authMethod: 'PLAIN',
  auth: {
    type: 'login',
    pass: NODEMAILER_PASSWORD as string,
    user: NODEMAILER_USERNAME as string,
  },
};

class NodeMailer {
  private readonly smtpConfig;
  private readonly transport;
  private readonly sender;

  constructor(smtpConfig?: SMTPTransport.Options) {
    this.smtpConfig = smtpConfig || SMTPDefaultConfig;
    this.transport = nodemailer.createTransport(this.smtpConfig);
    this.sender = NODE_ENV === 'development' ? senderDev : senderProd;
  }

  sendMail(mailOptions: Mail.Options) {
    const defaultOptions: Mail.Options = {
      from: this.sender,
      sender: this.sender,
      to: mailOptions.to,
      subject: 'Default Subject',
    };

    const options = Object.assign({}, defaultOptions, mailOptions);
    if (NODE_ENV === 'development') options.to = NODEMAILER_DEV_EMAIL;

    return this.transport.sendMail(options);
  }

  async sendPasswordResetEmail(userEmail: string, resetURL: string) {
    const subject = 'CRM Password Reset';
    const html = EMAIL_TEMPLATE_PASSWORD_RESET.replaceAll('{PASSWORD_RESET_URL}', resetURL).replace(
      '{USER_EMAIL}',
      userEmail
    );

    let headers = {};
    if (NODE_ENV === 'development') headers = { 'X-MT-Category': 'CRM Server: PasswordReset' };
    this.sendMail({ to: userEmail, subject, html, headers }).catch((error) => {
      throw new BadRequestError({
        code: 500,
        message: 'Internal error sending reset email',
        context: { error },
        logging: true,
      });
    });
  }

  async sendAccountVerificationEmail(userEmail: string, verificationCode: string, verificationExpiry: Date) {
    const subject = 'CRM Account Verification';
    const html = EMAIL_TEMPLATE_VERIFICATION.replace('{VERIFICATION_CODE}', verificationCode).replace(
      '{VERIFICATION_EXPIRY}',
      verificationExpiry.toDateString()
    );
    let headers = {};
    if (NODE_ENV === 'development') headers = { 'X-MT-Category': 'CRM Server: PasswordReset' };

    await this.sendMail({ to: userEmail, subject, html, headers }).catch((error) => {
      throw new BadRequestError({ message: 'Nodemailer Error', context: { error } });
    });
  }
}

export default new NodeMailer();
