export function Carregando({ texto = "Carregando itens..." }) {
  return (
    <div className="estado" role="status">
      <span className="giro" aria-hidden="true" />
      {texto}
    </div>
  )
}
export function Vazio({ texto = "Nenhum item encontrado." }) {
  return <div className="estado">{texto}</div>
}
export function Erro({ texto }) {
  return <div className="estado erro" role="alert">{texto}</div>
}
