import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api, { mensagemErro } from "../services/api"
import { Carregando, Erro, Vazio } from "../components/Estado"

export const valor = (o) => (typeof o === "string" ? o : o.nome ?? o.name ?? String(o.id))

export default function Home() {
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function listas() {
      try {
        const [c, l] = await Promise.all([api.get("/categorias"), api.get("/locais")])
        setCategorias(c.data)
        setLocais(l.data)
      } catch (err) {
        setErro(mensagemErro(err))
      }
    }
    listas()
  }, [])

  useEffect(() => {
    const espera = setTimeout(async () => {
      setCarregando(true)
      setErro("")
      try {
        const params = {}
        if (busca) params.busca = busca
        if (status) params.status = status
        if (categoria) params.categoria = categoria
        if (local) params.local = local
        const { data } = await api.get("/itens", { params })
        setItens(data)
      } catch (err) {
        setErro(mensagemErro(err))
      } finally {
        setCarregando(false)
      }
    }, 300)
    return () => clearTimeout(espera)
  }, [busca, status, categoria, local])

  return (
    <>
      <div className="linha-titulo">
        <h1>Itens encontrados</h1>
        <Link to="/novo" className="btn primario">+ Novo item</Link>
      </div>

      <div className="filtros">
        <input placeholder="Buscar por nome ou descrição..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="aguardando">aguardando</option>
          <option value="devolvido">devolvido</option>
        </select>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Categoria</option>
          {categorias.map((c) => <option key={valor(c)} value={valor(c)}>{valor(c)}</option>)}
        </select>
        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Local</option>
          {locais.map((l) => <option key={valor(l)} value={valor(l)}>{valor(l)}</option>)}
        </select>
      </div>

      {carregando && <Carregando />}
      {!carregando && erro && <Erro texto={erro} />}
      {!carregando && !erro && itens.length === 0 && <Vazio />}
      {!carregando && !erro && itens.length > 0 && (
        <div className="grade">
          {itens.map((i) => (
            <Link key={i.id} to={`/item/${i.id}`} className={`etiqueta ${i.status}`}>
              <span className="furo" aria-hidden="true" />
              <strong>{i.nome}</strong>
              <p>{i.descricao}</p>
              <small>{i.categoria} · {i.local}</small>
              <span className={`selo ${i.status}`}>{i.status}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
