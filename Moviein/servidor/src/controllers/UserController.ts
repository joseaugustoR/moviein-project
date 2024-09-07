import { FastifyPluginCallback } from 'fastify';
import RegisterUserDTO_Req from '../models/DTOs/RegisterUserDTO_Req';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prismaClient } from '../server';
import MD5 from "crypto-js/md5";
import TokenService from '../services/tokenService';
import Auth from '../middlewares/Auth';
import SendEMailService from '../services/SendEmailService';

const UserController: FastifyPluginCallback = (instance, opts, done) => {

  instance.post("login", {}, async (req, res) => {
    const { email, senha } = req.body as LoginDTO_Req

    var user = await prismaClient.usuario.findUnique({
      where: {
        email: email
      }
    });

    if (user === null)
      return res.badRequest("Usuário com esse email não encontrado.")

    if (user.deletadoEm !== null)
      return res.badRequest("Usuário removido do sistema.");

    var senhaEncr = MD5(senha).toString();
    if (senhaEncr !== user.senha)
      // return res.status(400).send({ mensagem: "Senha inválida." });
      return res.badRequest("Senha inválida.");
    var token = TokenService.encript(user.email, user.funcao);

    let code;

    await prismaClient.log.create({
      data: {
        criadoEm: new Date,
        nome: user.nome ?? "",
        email: user.email,
        mensagem: "Usuário logou no sistema",
        /* nome: user.nome ?? "" */
      }
    })

    if (user.Auth2) {
      const randomNumber = Math.floor(10000 + Math.random() * 90000);

      await SendEMailService.Enviar({
        conteudo: `Seu código de autenticação de 2 fatores é: <b>${randomNumber}</b>`,
        email: email,
        titulo: "Moviein: Código de 2 fatores."
      });
      code = randomNumber;

      return res.ok({
        token: null,
        funcao: null,
        expiracao: null,
        autenticacao2fatores: user.Auth2,
        code: code
      })
    } else {
      return res.ok({
        token: token.token,
        funcao: token.funcao,
        expiracao: token.expiracao,
        autenticacao2fatores: user.Auth2,
        code: null
      })
    }
  });

  instance.post("DoisFatoresValidado", async (req, res) => {
    const { email } = req.body as LoginDTO_Req

    var user = await prismaClient.usuario.findUnique({
      where: {
        email: email
      }
    });

    if (user === null)
      return res.badRequest("Usuário com esse email não encontrado.")


    var token = TokenService.encript(user.email, user.funcao);

    return res.ok({
      token: token.token,
      funcao: token.funcao,
      expiracao: token.expiracao,
      autenticacao2fatores: user.Auth2,
      code: null
    })
  });


  instance.get("listar", async (req, res) => {
    const users = await prismaClient.usuario.findMany();
    return res.ok(users);
  });


  instance.post("registro", async (req, res) => {
    var data = req.body as RegisterUserDTO_Req;
    var senhaEncr = MD5(data.senha).toString();

    try {
      const newUser = await prismaClient.usuario.create({
        data: {
          email: data.email,
          senha: senhaEncr,
          funcao: "cliente",
          nome: data.nomeCompleto,
          usuarioInformacao: {
            create: {
              bairro: data.bairro,
              cep: data.cep,
              cidade: data.cidade,
              complemento: data.complemento,
              cpf: data.cpf,
              dataNascimento: new Date(data.dataNascimento).toISOString(),
              estado: data.estado,
              genero: data.genero,
              nomeMaterno: data.nomeMaterno,
              numero: data.numero,
              pais: data.pais,
              telefone: data.telefone
            }
          }
        }
      })

      await prismaClient.log.create({
        data: {
          criadoEm: new Date,
          nome: newUser.nome ?? "",
          email: newUser.email,
          mensagem: `Novo usuário cadastrado no sistema! ${newUser.email}`,
          /* nome: newUser.nome ?? ""  */
        }
      })

      return res.ok(null);

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(400).send({
          message: 'Já existe um usuário criado com esse email.',
        });
      }
      return res.status(400).send({
        ErrorMessage: error
      });

    }
  });


  instance.get("get", { preHandler: Auth }, async (req, res) => {
    const usuario = await prismaClient.usuario.findFirst({
      where: {
        email: req.user.email
      }
    });
    if (usuario != null) {
      return res.send({
        nome: usuario.nome,
        email: usuario.email,
        thumb: usuario.thumb,
        funcao: usuario.funcao,
        auth2: usuario.Auth2
      })
    }
  });

  instance.post("updateThumb", { preHandler: Auth }, async (req, res) => {
    const { thumb } = req.body as ThumbnailDTO_Req;
    const usuario = await prismaClient.usuario.findFirst({
      where: {
        email: req.user.email,
      }
    });
    if (usuario == undefined)
      return res.badRequest("Usuário não encontrado.");

    await prismaClient.usuario.update({
      where: { email: req.user.email },
      data: {
        thumb: thumb
      }
    })
  });


  instance.post("resetPasswordCode", async (req, res) => {
    const { email } = req.body as { email: string }

    const usuario = await prismaClient.usuario.findFirst({
      where: {
        email: email
      }
    });

    if (usuario == null)
      return res.badRequest("Usuário com esse email não existe.");

    const randomNumber = Math.floor(10000 + Math.random() * 90000);

    await SendEMailService.Enviar({
      conteudo: `Seu código de redefinição de senha é: <b>${randomNumber}</b>`,
      email: email,
      titulo: "Moviein: Código de redefinição de senha."
    });

    return res.ok({
      code: randomNumber.toString()
    })
  })

  instance.post("resetPassword", async (req, res) => {
    const { senha, email } = req.body as RedefinirSenhaDTO_Req
    const usuario = await prismaClient.usuario.findFirst({
      where: {
        email: email
      }
    });
    if (usuario === null)
      // return res.code(400).send("Usuário não encontrado.");
      return res.badRequest("Usuário não encontrado.");

    var novaSenha = MD5(senha).toString();

    try {
      var user = await prismaClient.usuario.update({
        where: {
          email: email
        },
        data: {
          senha: novaSenha
        }
      });

      await prismaClient.log.create({
        data: {
          criadoEm: new Date,
          email: user.email,
          nome: user.nome ?? "",
          mensagem: 'Usuário redefiniu a senha',
          /* nome: user.nome ?? null  */
        }
      })
      return res.ok(null, "Senha redefinida com sucesso!")
    } catch (error) {
      var errormessage = error as string;
      return res.badRequest(errormessage);
    }
  })


  instance.get("toggleAuth2", { preHandler: Auth }, async (req, res) => {
    const usuario = await prismaClient.usuario.findFirst({
      where: {
        email: req.user.email!
      }
    })
    if (usuario != undefined) {
      await prismaClient.usuario.update({
        where: {
          email: usuario.email
        },
        data: {
          Auth2: !usuario.Auth2
        }
      })

      return res.ok(null);
    }
  })

  instance.get("temAssinatura", { preHandler: Auth }, async (req, res) => {
    const { email } = req.user;

    var usuario = await prismaClient.usuario.findFirst({
      where: {
        email
      }
    })

    if (usuario === null)
      return res.badRequest("Usuário não encontrado.");

    var assinatura = await prismaClient.assinatura.findFirst({
      where: {
        usuarioId: usuario.id
      }
    })

    if (assinatura !== null) {
      var resp = {
        Assinatura: assinatura.assinatura,
        preco: assinatura.preco,
        periodo: assinatura.tipo
      }
      return res.ok(resp)
    } else {
      return res.ok(null)
    }
  })


  instance.get("ConsultarUsuarios", { preHandler: Auth }, async (req, res) => {
    const { email, nome } = req.query as { email: string, nome: string };

    const user = await prismaClient.usuario.findMany({
      include:
      {
        usuarioInformacao: true
      },
      where: {
        deletadoEm: null
      }
    });

    const userFilter = user.filter(d =>
      (email !== "" && email !== undefined) ? d.email === email : true &&
        (nome !== "" && nome !== undefined) ? d.nome === nome : true
    );

    var resp = userFilter?.map(d => ({
      id: d?.id,
      nome: d?.nome,
      email: d?.email,
      cpf: d?.usuarioInformacao?.cpf,
      funcao: d?.funcao,
      thumb: d?.thumb,
      auth: d?.Auth2
    }))

    return res.ok(resp);
  })

  instance.post("RemoverUsuario", { preHandler: Auth }, async (req, res) => {
    const { usuarioId } = req.body as { usuarioId: string }

    const usuario = await prismaClient.usuario.findFirst({
      where: {
        id: parseInt(usuarioId)
      }
    })

    if (usuario!.funcao === "admin")
      return res.badRequest("Não é permitido um admin remover outro admin.")

    await prismaClient.usuario.update({
      where: {
        id: parseInt(usuarioId),
      },
      data: {
        deletadoEm: new Date()
      }
    })

    return res.ok("");
  })

  done();
}

export default UserController;