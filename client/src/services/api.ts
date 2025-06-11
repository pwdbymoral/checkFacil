import axios from 'axios'

/**
 * Cria uma instância do cliente HTTP Axios com a baseURL da API.
 * Adiciona um interceptor de requisição para incluir o token de acesso no cabeçalho Authorization.
 * Se o token não estiver presente, a requisição será enviada sem o cabeçalho.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
