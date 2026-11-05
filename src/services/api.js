import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://word-to-pdf-api-production-c67b.up.railway.app'

const baseURL = API_URL.startsWith('http') ? API_URL : `https://${API_URL}`

const api = axios.create({
  baseURL: baseURL
})

export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/convert', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const getHistory = async () => {
  const response = await api.get('/api/history')
  return response.data
}

export const downloadFile = (downloadUrl) => {
  window.open(downloadUrl, '_blank')
}
