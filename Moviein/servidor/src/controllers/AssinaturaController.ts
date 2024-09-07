import { FastifyPluginCallback } from "fastify";
import Auth from "../middlewares/Auth";
import { prismaClient } from "../server";
import RegistroAssinaturaDTO_Req from "../models/DTOs/RegistroAssinaturaDTO_Req";
import AsaasService from "../services/AsaasService/AsaasService";
import { MD5 } from "crypto-js";
import AsaasWebHookPayment from '../models/AsaasWebHookPayment'
import jwt from 'jsonwebtoken';

const AssinaturaController: FastifyPluginCallback = (instance, opts, done) => {

    instance.post("Registrar", { preHandler: Auth }, async (req, res) => {
        const { email } = req.user;
        const { assinatura, periodo, preco } = req.body as RegistroAssinaturaDTO_Req;

        const user = await prismaClient.usuario.findFirst({
            include: {
                assinatura: true,
                usuarioInformacao: true
            },
            where: {
                email: email
            }
        });

        if (user === null || user === undefined)
            return res.badRequest("Usuário não encontrado");


        //em seguida, criar um cliente do usuário ao asaas.
        if (user.usuarioInformacao?.cpf === undefined)
            return res.badRequest("É necessário preencher o CPF para concluir a assinatura.")

        try {

            var asaasClientId = await AsaasService.RegistrarCliente({
                name: user.nome!,
                cpfCnpj: user.usuarioInformacao?.cpf,
                email: user.email
            });


            await prismaClient.usuario.update({
                where: {
                    email: email
                },
                data: {
                    asaasClienteId: asaasClientId,
                    funcao: assinatura
                }
            })

            //Criar uma assinatura
            const nextDueDate = new Date();
            nextDueDate.setDate(nextDueDate.getDate() + 2);

            var data = {
                customer: asaasClientId!,
                billingType: "UNDEFINED",
                cycle: periodo,
                value: preco,
                nextDueDate: nextDueDate
            }

            var asaasAssinaturaId = await AsaasService.RegistrarAssinatura(data);

            //Cadastrar nova assinatura
            var novaAssinatura = await prismaClient.assinatura.create({
                data: {
                    preco: preco,
                    tipo: periodo,
                    asaasAssinaturaId: asaasAssinaturaId?.id!,
                    usuarioId: user.id,
                    assinatura: assinatura
                }
            });

            var payments = await AsaasService.ColetarPagamento({
                subscription: asaasAssinaturaId?.id!
            });

            await prismaClient.log.create({
                data: {
                  criadoEm: new Date,
                  email: user.email,
                  mensagem: `Usuário selecionou um plano de assinatura`,
                  nome: user.nome ?? "" 
                }
              })

            return res.ok(payments?.data[0].invoiceUrl);

        } catch (error) {
            var e = error as string;
            return res.badRequest(e.toString().replace("Error: ", ""));
        }
    })

    instance.post("WebhookAsaas", async (req, res) => {
        const asaas = req.body as AsaasWebHookPayment;

    })

    instance.get("permitido", { preHandler: Auth }, async (req, res) => {
        const { filmeId } = req.query as { filmeId: string };
        const { email } = req.user;

        const assinatura = await prismaClient.assinatura.findFirst({
            include: {
                Usuario: true
            },
            where: {
                Usuario: {
                    email: email
                }
            }
        });

        const seteDiasADiante = new Date();
        seteDiasADiante.setDate(seteDiasADiante.getDate() + 7);

        if (assinatura !== null) {
            if (assinatura?.expiradoEm === null || assinatura?.expiradoEm === undefined || (assinatura?.expiradoEm && new Date(assinatura.expiradoEm) < seteDiasADiante)) {

                var filmeCrypto = jwt.sign({
                    filmeId: filmeId
                }, "crypto", {expiresIn: "30d"});
                
                return res.ok({
                    validado: true,
                    filmeCripto: filmeCrypto
                })
            } else {
                return res.ok(
                    {
                        validado: false
                    }
                )
            }
        } else {
            return res.ok(
                {
                    validado: false
                }
            )
        }

    })

    done();
};

export default AssinaturaController;