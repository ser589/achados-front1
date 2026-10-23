import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import api from "./services/api"
import Home from "./pages/Home"
import ItemDetail from "./pages/ItemDetail"
import ItemForm from "./pages/ItemForm"

export default function App() {
  const [dono, setDono] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get("/eu")
        setDono(data)
      } catch (err) {
        setDono(null)
      }
    }
    carregar()
  }, [])

  return (
    <>
      <header className="topo">
        <Link to="/" className="marca">
          <span className="furo" aria-hidden="true" />
          Caixa de Achados
        </Link>
        <span className="saudacao">
          {dono ? `Olá, ${dono.nome}` : "Olá"}
          {dono?.total_itens !== undefined && <small> · {dono.total_itens} itens</small>}
        </span>
      </header>
      <main className="pagina">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/novo" element={<ItemForm />} />
          <Route path="/editar/:id" element={<ItemForm />} />
        </Routes>
      </main>
    </>
  )
}
