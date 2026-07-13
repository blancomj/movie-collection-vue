import axios from 'axios'

const client = axios.create({
  baseURL: '/peliculas/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

client.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.success === false) {
      return Promise.reject(new Error(data.error || 'API Error'))
    }
    return data
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network Error'
    return Promise.reject(new Error(message))
  }
)

export default client