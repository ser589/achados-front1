import axios from "axios"

const api = axios.create({
  baseURL: "https://api-achados.jefersonqueiroga.com.br",
  headers: { "X-API-Key": import.meta.env.VITE_API_KEY },
})

export function mensagemErro(err) {
  const detail = err.response?.data?.detail
  if (err.response?.status === 401) return "Chave ausente ou inválida. Verifique o arquivo .env."
  if (err.response?.status === 404) return "Item não encontrado."
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg || JSON.stringify(d)).join("; ")
  return "Não foi possível completar a ação. Verifique sua conexão e sua chave."
}

export default api
