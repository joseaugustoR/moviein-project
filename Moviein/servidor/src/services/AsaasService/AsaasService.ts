import axios, { AxiosError } from "axios";
import AsaasClientReturn from "./Models/AsaasClientReturn";
import AsaasClient from "./Models/AsaasClient";
import AsaasAssinaturaRegistrar from "./Models/AsaasAssinaturaRegistrar";
import AsaasAssinaturaRegistrarReturn from "./Models/AsaasAssinaturaRegistrarReturn";
import AsaasColetarPagamento from "./Models/AsaasColetarPagamento";
import AsaasColetarPagamentosReturn from "./Models/AsaasColetarPagamentosReturn";

type AsaasErrorType = {
    errors: { code: string, description: string }[]
}

class AsaasService {
    private baseUrl: string = "https://sandbox.asaas.com/api/v3/";

    async RegistrarCliente(data: AsaasClient): Promise<string | undefined> {
        try {
            var client = await axios.post<AsaasClientReturn>(
                this.baseUrl + "customers",
                data,
                {
                    headers: {
                        "access_token": `${process.env.ASAAS_API_KEY}`,
                        'content-type': 'application/json',
                        "accept": "application/json"
                    }
                });

            if (client.status === 200 || client.status === 201) {
                return client.data.id;
            }
        } catch (error) {
            const { response } = error as AxiosError<AsaasErrorType>;
            throw new Error(response?.data.errors[0].description);
        }
    }

    async RegistrarAssinatura(data: AsaasAssinaturaRegistrar): Promise<AsaasAssinaturaRegistrarReturn | null> {
        try {
            var assinatura = await axios.post<AsaasAssinaturaRegistrarReturn>(
                this.baseUrl + "subscriptions",
                data,
                {
                    headers: {
                        "access_token": `${process.env.ASAAS_API_KEY}`,
                        'content-type': 'application/json',
                        "accept": "application/json"
                    }
                }
            );

            if (assinatura.status === 200 || assinatura.status === 201) {
                return assinatura.data;
            } else {
                return null;
            }
        } catch (error) {
            const { response } = error as AxiosError<AsaasErrorType>;
            throw new Error(response?.data.errors[0].description);
        }
    }

    async ColetarPagamento(data: AsaasColetarPagamento): Promise<AsaasColetarPagamentosReturn | null> {
        try {
            var assinatura = await axios.get<AsaasColetarPagamentosReturn>(
                this.baseUrl + `payments?subscription=${data.subscription}`,
                {
                    headers: {
                        "access_token": `${process.env.ASAAS_API_KEY}`,
                        'content-type': 'application/json',
                        "accept": "application/json"
                    }
                }
            );
            if (assinatura.status === 200 || assinatura.status === 201) {
                console.log(assinatura.data.data[0]);
                return assinatura.data;
            } else {
                return null;
            }
        } catch (error) {
            const { response } = error as AxiosError<AsaasErrorType>;
            throw new Error(response?.data.errors[0].description);
        }
    }
}

export default new AsaasService();