import nodemailer from 'nodemailer';
import EnviarType from '../models/EnviarType';

class SendEmailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "eduardolimaoliveira@souunisuam.com.br",
            pass: "ditn sgzt zsmi fngu"
        }
    });

    private transforterVerify() {
        this.transporter.verify(function (error, success) {
            if (error) {
                console.error('Erro na configuração do transporter:', error);
            } else {
                console.log('Transporte configurado com sucesso:', success);
            }
        });
    }

    public async Enviar(s: EnviarType): Promise<string> {
        this.transforterVerify();

        const info = await this.transporter.sendMail({
            from: 'eduardolimaoliveira@souunisuam.com.br',
            to: s.email,
            subject: s.titulo,
            html: s.conteudo
        });

        return info.messageId;
    }
}


export default new SendEmailService();