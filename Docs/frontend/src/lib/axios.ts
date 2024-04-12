import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const baseUrl = 'http://localhost:8081/'
console.log(baseUrl)

// Create an instance of Axios with custom configuration
const axio: AxiosInstance = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
  timeout: 5000, // Set a timeout value in milliseconds
  headers: {
    'Content-Type': 'application/json', // Set the default content type
  },
  validateStatus: () => {
    return true // I'm always okay with the result (status code)
  },
})

// Define a request interceptor
axio.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  },
)

// Define a response interceptor
axio.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can modify the response data here (e.g., transform the data)
    return response
  },
  (error) => {
    // Handle response error
    return Promise.reject(error)
  },
)

export default axio
