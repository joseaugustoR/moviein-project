import moment from "moment";
import jwt from 'jsonwebtoken';

export interface tokenModel {
    token?: string
    funcao: string,
    email: string,
    expiracao: Date
}

export default class tokenService {
    private static tokenKey: string = "a53b7ba2-d649-48df-88af-e4b86f6b0724";

    public static descript(token: string): tokenModel | null {
        try {
            var decoded = jwt.verify(token, this.tokenKey);
            var decodedResponse = decoded as tokenModel;
            return decodedResponse;
        } catch (err) {
            console.log(err)
            return null
        }
    }

    public static encript(email: string, funcao: string): tokenModel {

        var exp = moment().add(30, "days");
        var exp_diff = exp.diff(moment(), "seconds")

        console.log({ "exp": exp.toDate() });
        console.log({ "expir": exp.diff(moment(), "seconds") });
        var token = jwt.sign({
            funcao: funcao,
            email: email
        }, this.tokenKey, {expiresIn: "30d"});

        return {
            expiracao: exp.toDate(),
            funcao: funcao,
            email: email,
            token: token
        };
    }
}