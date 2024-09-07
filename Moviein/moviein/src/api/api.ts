import axios from 'axios';

axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

var isDev = process.env.NODE_ENV === 'development';

export const baseURL = isDev ? "http://localhost:3001" : "http://3.235.135.8:3001" ;

const Api = axios.create({
    baseURL
})


Api.interceptors.request.use(
    config => {
        // Aqui você pode adicionar sua lógica de autenticação
        // Por exemplo, adicionar um token de autenticação no cabeçalho
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // Se ocorrer um erro durante a configuração da solicitação, você pode lidar com isso aqui
        return Promise.reject(error);
    }
)

export default Api;
