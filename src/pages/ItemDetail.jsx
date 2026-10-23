import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api, { mensagemErro } from "../services/api"
import { Carregando, Erro } from "../components/Estado"

const formatar = (d) => (d ? d.split("-").reverse().join("/") : "—")

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [aviso, setAviso] = useState("")
  const [recebedor, setRecebedor] = useState("")
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get(`/itens/${id}`)
        setItem(data)
      } catch (err) {
        setErro(mensagemErro(err))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  async function devolver(e) {
    e.preventDefault()
    setAviso("")
    try {
      const { data } = await api.patch(`/itens/${id}/devolver`, { devolvido_para: recebedor })
      setItem(data)
      setRecebedor("")
    } catch (err) {
      setAviso(mensagemErro(err))
    }
  }

  async function excluir() {
    try {
      await api.delete(`/itens/${id}`)
      navigate("/")
    } catch (err) {
      setAviso(mensagemErro(err))
      setConfirmando(false)
    }
  }

  if (carregando) return <Carregando texto="Carregando item..." />
  if (erro) return (<><Link to="/" className="voltar">← Voltar</Link><Erro texto={erro} /></>)

  return (
    <>
      <Link to="/" className="voltar">← Voltar</Link>
      <div className="detalhe">
        <div className="linha-titulo">
          <h1>{item.nome}</h1>
          <span className={`selo ${item.status}`}>{item.status}</span>
        </div>
        <dl>
          <dt>Descrição:</dt><dd>{item.descricao}</dd>
          <dt>Categoria:</dt><dd>{item.categoria}</dd>
          <dt>Local:</dt><dd>{item.local}</dd>
          <dt>Encontrado em:</dt><dd>{formatar(item.data_encontrado)}</dd>
          <dt>Devolvido para:</dt><dd>{item.devolvido_para || "—"}</dd>
          {item.data_devolucao && (<><dt>Devolvido em:</dt><dd>{formatar(item.data_devolucao)}</dd></>)}
        </dl>

        <div className="acoes">
          <Link to={`/editar/${item.id}`} className="btn">Editar</Link>
          <button className="btn" onClick={() => setConfirmando(true)}>Excluir</button>
        </div>

        {confirmando && (
          <div className="caixa">
            <strong>Confirmação</strong>
            <p>Tem certeza que deseja excluir?</p>
            <div className="acoes">
              <button className="btn perigo" onClick={excluir}>Excluir</button>
              <button className="btn" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {aviso && <Erro texto={aviso} />}

        {item.status === "aguardando" && (
          <form className="caixa tracejada" onSubmit={devolver}>
            <strong>Marcar como devolvido</strong>
            <div className="linha-form">
              <input required placeholder="Nome de quem recebeu" value={recebedor} onChange={(e) => setRecebedor(e.target.value)} />
              <button className="btn primario">Confirmar</button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
