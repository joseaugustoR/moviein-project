import { FastifyPluginCallback } from "fastify";
import Auth from "../middlewares/Auth";
import { prismaClient } from "../server";
import LogItemDTO_Res from "../models/DTOs/LogItemDTO_Res";
import moment from 'moment';

const LogController: FastifyPluginCallback = (instance, opts, done) => {

    instance.get("Consultar", { preHandler: Auth }, async (req, res) => {
        const { data, email, nome } = req.query as { nome?: string, email?: string, data?: string };

        const logs = await prismaClient.log.findMany({
            orderBy: {
                criadoEm: "desc"
            }
        });
        
        const logFilter = logs.filter(d =>
            (data !== "" && data !== undefined) ? moment(d.criadoEm).format("DD/MM/yyyy") === moment(data).format("DD/MM/yyyy") : true &&
            (email !== "" && email !== undefined) ? d.email === email : true &&
            (nome !== "" && nome !== undefined) ? d.nome === nome : true
        );

        const logReturn: LogItemDTO_Res[] = logFilter.map(e => ({
            email: e.email,
            dataHora: e.criadoEm.toString(),
            descricao: e.mensagem
        }));

        return res.ok(logReturn)
    })

    done();
};

export default LogController;