import { useParams } from 'react-router-dom'

function GuestManagementPage() {
  const { eventId } = useParams<{ eventId: string }>()

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">
          Gerenciar Convidados
          <p className="text-lg tex-muted-foreground">Festa com ID: {eventId}</p>{' '}
        </h2>
      </header>
      <section>
        {/* TODO: Formulário para adicionar convidados virá aqui */}
        <div className="mb-8 p-6 bg-card border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Adicionar Novos Convidados</h2>
          <p className="text-muted-foreground">Em breve...</p>
        </div>

        {/* TODO: Tabela para listar convidados virá aqui */}
        <div className="p-6 bg-card border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Lista de Convidados</h2>
          <p className="text-muted-foreground">Carregando lista...</p>
        </div>
      </section>
    </div>
  )
}

export default GuestManagementPage
