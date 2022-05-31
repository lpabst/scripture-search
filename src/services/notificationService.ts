import { SendEmailDTO } from "../types/emails/SendEmailDTO";
import sendgrid from "@sendgrid/mail";
import { Context } from "../context";
import { ServerError } from "../middleware/errorHandler";

export default class NotificationService {
  private ctx: Context;
  private sendgridSender: string;

  constructor(ctx: Context) {
    if (!process.env.SENDGRID_KEY || !process.env.SENDGRID_SENDER) {
      console.log(
        `Cant init notification service due to missing env vars. apiKey: ${process.env.SENDGRID_KEY}, sender: ${process.env.SENDGRID_SENDER}`
      );
      throw ServerError(`Unable to initialize notification service`);
    }

    sendgrid.setApiKey(process.env.SENDGRID_KEY);
    this.sendgridSender = process.env.SENDGRID_SENDER;
    this.ctx = ctx;
  }

  private async sendEmail(sendgridOptions: SendEmailDTO) {
    const result = await sendgrid.send(sendgridOptions).catch((e) => {
      console.log("Error sending email to sendgrid");
      console.log(e);
      throw e;
    });

    // log some details about the sendgrid response...
    console.log(`Sendgrid response code: ${result[0].statusCode}`);
    if (result[0].statusCode && result[0].statusCode >= 400) {
      console.log(result);
    }
  }

  public async sendEmailVerificationEmail(to: string) {
    return this.sendEmail({
      to: to,
      from: this.sendgridSender,
      subject: "Please Verify Your Email",
      text: "Please verify your email address",
      html: "<p style='border: 1px solid red;'>Please verify your email address</p>",
    });
  }
}
