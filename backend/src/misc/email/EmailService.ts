import * as nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;

    public constructor(transporter: nodemailer.Transporter) {
        this.transporter = transporter;
    }

    public static async createEmailService(): Promise<EmailService> {
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("As variáveis de ambiente do serviço de email não estão configuradas.");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        try {
            await transporter.verify();
            console.log('Serviço de email conectado e pronto para enviar mensagens.');
        } catch (error) {
            console.error("Falha ao conectar com o serviço de email:", error);
            throw new Error("Não foi possível conectar ao servidor SMTP. Verifique as credenciais e a configuração.");
        }

        return new EmailService(transporter);
    }

    public async enviarEmail(destinatario: string, assunto: string, corpo: string): Promise<void> {
        try {
            const mailOptions = {
                from: `<${process.env.EMAIL_USER}>`,
                to: destinatario,
                subject: assunto,
                text: corpo,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Mensagem enviada com sucesso: %s', info.messageId);
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw new Error('Falha no envio do email.');
        }
    }
}