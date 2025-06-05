import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/authContextCore'

const StaffDashboardPage = () => {
  const { user } = useAuth()

  const handleCreateNewEvent = () => {
    alert('Funcionalidade "Criar Novo Evento" ainda não implementada.')
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Staff</h1>
          {user && (
            <p className="text-lg text-muted-foreground">
              Bem-vindo(a), {user.name || user.email}!
            </p>
          )}
        </div>
      </header>

      <section className="mb-8">
        <div className="flex flex-col items-start gap-3 mb-4 md:justify-between md:items-center">
          <h2 className="text-2xl font-semibold text-foreground">Festas Agendadas</h2>
          <Button onClick={handleCreateNewEvent} className="w-full md:w-auto">
            🎉 Criar Nova Festa
          </Button>
        </div>
        <div className="p-6 bg-card border rounded-lg">
          <p className="text-muted-foreground break-words text-pretty">
            Nenhuma festa agendada no momento. Use o botão acima para criar uma nova festa.
          </p>
          <p className="text-muted-foreground mt-2 break-words text-pretty">
            A lista permitirá que você visualize, edite e gerencie as festas agendadas.
          </p>
          {/* TODO: Implementar componente para buscar e listar as festas da API */}
        </div>
      </section>
    </div>
  )
}

export default StaffDashboardPage
