import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api, { mensagemErro } from "../services/api"
import { Carregando } from "../components/Estado"
import { valor } from "./Home"

const vazio = { nome: "", descricao: "", categoria: "", local: "", data_encontrado: "" }

export default function ItemForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(vazio)
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [msg, setMsg] = useState({ tipo: "", texto: "" })

  useEffect(() => {
    async function carregar() {
      try {
        const [c, l] = await Promise.all([api.get("/categorias"), api.get("/locais")])
        setCategorias(c.data)
        setLocais(l.data)
        if (editando) {
          const { data } = await api.get(`/itens/${id}`)
          setForm({
            nome: data.nome, descricao: data.descricao, categoria: data.categoria,
            local: data.local, data_encontrado: data.data_encontrado,
          })
        }
      } catch (err) {
        setMsg({ tipo: "erro", texto: mensagemErro(err) })
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id, editando])

  const mudar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function salvar(e) {
    e.preventDefault()
    setEnviando(true)
    setMsg({ tipo: "", texto: "" })
    try {
      if (editando) await api.put(`/itens/${id}`, form)
      else await api.post("/itens", form)
      setMsg({ tipo: "ok", texto: "Item salvo com sucesso." })
      setTimeout(() => navigate("/"), 700)
    } catch (err) {
      setMsg({ tipo: "erro", texto: mensagemErro(err) })
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) return <Carregando texto="Carregando formulário..." />

  return (
    <form className="formulario" onSubmit={salvar}>
      <h1>{editando ? "Editar item" : "Novo item"}</h1>
      <label>Nome<input name="nome" value={form.nome} onChange={mudar} required /></label>
      <label>Descrição<textarea name="descricao" rows="3" value={form.descricao} onChange={mudar} /></label>
      <label>Categoria
        <select name="categoria" value={form.categoria} onChange={mudar} required>
          <option value="">Selecione</option>
          {categorias.map((c) => <option key={valor(c)} value={valor(c)}>{valor(c)}</option>)}
        </select>
      </label>
      <label>Local
        <select name="local" value={form.local} onChange={mudar} required>
          <option value="">Selecione</option>
          {locais.map((l) => <option key={valor(l)} value={valor(l)}>{valor(l)}</option>)}
        </select>
      </label>
      <label>Data em que foi encontrado
        <input type="date" name="data_encontrado" value={form.data_encontrado} onChange={mudar} required />
      </label>
      {msg.texto && <div className={`mensagem ${msg.tipo}`} role="alert">{msg.texto}</div>}
      <div className="acoes">
        <button className="btn primario" disabled={enviando}>{enviando ? "Salvando..." : "Salvar"}</button>
        <button type="button" className="btn" onClick={() => navigate(-1)}>Cancelar</button>
      </div>
    </form>
  )
}
