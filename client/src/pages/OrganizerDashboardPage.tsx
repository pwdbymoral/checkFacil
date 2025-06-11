import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/authContextCore'
import api from '@/services/api'

interface AppEvent {
  id: string
  name: string
  date: string
  status: string
}

interface ApiEventResponse {
  id: number
  nome_festa: string
  data_festa: string
  status: string
}

export default function OrganizerDashboardPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<AppEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/festa/listar')
        const mappedEvents: AppEvent[] = response.data.festas.map(
          (eventFromApi: ApiEventResponse) => ({
            id: eventFromApi.id,
            name: eventFromApi.nome_festa,
            date: eventFromApi.data_festa,
            status: eventFromApi.status,
          }),
        )
        setEvents(mappedEvents)
      } catch (error) {
        console.error('Erro ao buscar eventos do contratante:', error)
        toast.error('Não foi possível carregar seus eventos.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizerEvents()
  }, [])

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Meu Painel</h1>
        {user && <p className="text-lg text-muted-foreground">Bem-vindo(a), {user.name}!</p>}
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Meus Eventos Agendados</h2>
        <div className="p-6 bg-card border rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : events.length > 0 ? (
            <ul className="space-y-4">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="border-b last:border-b-0 pb-4 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Data: {new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="font-medium">{event.status}</span>
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button asChild className="w-full sm:w-auto" variant={'outline'}>
                      <Link to={`/organizer/event/${event.id}/details`}>
                        {event.status === 'RASCUNHO' ? 'Completar Detalhes' : 'Ver/Editar Detalhes'}
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center">
              Você ainda não possui eventos agendados.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
