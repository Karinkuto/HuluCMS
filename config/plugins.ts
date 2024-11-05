export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => ({
  email: {
    config: {
      provider: '@strapi/provider-email-nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'sandbox.smtp.mailtrap.io'),
        port: env('SMTP_PORT', '2525'),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: 'your-email@example.com',
        defaultReplyTo: 'your-email@example.com',
      },
    },
  },
});
  