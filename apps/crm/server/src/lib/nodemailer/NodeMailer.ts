import type { SendMailOptions } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

import nodemailer from 'nodemailer';

import { BadRequestError } from '#Utils/errors/index.js';

import { EMAIL_TEMPLATE_PASSWORD_RESET } from './templates/PasswordResetEmailTemplate.js';
import { EMAIL_TEMPLATE_VERIFICATION } from './templates/VerificationEmailTemplate.js';

const {
  NODE_ENV,
  NODEMAILER_DEV_EMAIL,
  NODEMAILER_HOST,
  NODEMAILER_PASSWORD,
  NODEMAILER_PORT,
  NODEMAILER_SECURE,
  NODEMAILER_USERNAME,
} = process.env;

const senderDev = { name: 'CRM Server: Development', address: 'admin@techexpo-crm.org' };
const senderProd = { name: 'CRM Server: Production', address: 'admin@techexpo-crm.org' };

const SMTPDefaultConfig: SMTPTransport.Options = {
  authMethod: 'PLAIN',
  host: NODEMAILER_HOST,
  port: Number(NODEMAILER_PORT),
  secure: NODEMAILER_SECURE === 'true',
  auth: {
    pass: NODEMAILER_PASSWORD as string,
    type: 'login',
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

  sendMail(mailOptions: SendMailOptions) {
    const defaultOptions: SendMailOptions = {
      from: this.sender,
      sender: this.sender,
      subject: 'Default Subject',
      to: mailOptions.to,
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
    this.sendMail({ headers, html, subject, to: userEmail }).catch((error) => {
      throw new BadRequestError({
        code: 500,
        context: { error },
        logging: true,
        message: 'Internal error sending reset email',
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

    await this.sendMail({ headers, html, subject, to: userEmail }).catch((error) => {
      throw new BadRequestError({ context: { error }, message: 'Nodemailer Error' });
    });
  }
}

export default new NodeMailer();
