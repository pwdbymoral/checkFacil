import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/authContextCore'
import api from '@/services/api'

interface AppEvent {
  id: number
  name: string
  date: string
  organizerName?: string
}

interface ApiEventResponse {
  id: number
  nome_festa: string
  data_festa: string
  organizador: {
    nome: string
  }
}

const StaffDashboardPage = () => {
  const { user } = useAuth()

  const [events, setEvents] = useState<AppEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/festa/listar')
        const mappedEvents: AppEvent[] = response.data.festas.map((eventFromApi: ApiEventResponse) => ({
          id: eventFromApi.id,
          name: eventFromApi.nome_festa,
          date: eventFromApi.data_festa,
          organizerName: eventFromApi.organizador?.nome,
        }));
      setEvents(mappedEvents);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
        setError('Erro ao buscar eventos')
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const navigate = useNavigate()

  const handleCreateNewEvent = () => {
    navigate('/staff/events/newEventDraft')
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
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : events.length > 0 ? (
            <ul className="space-y-4">
              {events.map((event) => (
                <li key={event.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-muted-foreground break-words text-pretty">
                    Data: {new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </p>
                  <p className="text-muted-foreground break-words text-pretty">
                    Organizador: {event.organizerName || 'Desconhecido'}
                  </p>
                  <Button asChild className="w-full md:w-auto" size={'sm'} variant={'outline'}>
                    <Link to={`/staff/event/${event.id}`} className="text-primary hover:opacity-80">
                      Ver Detalhes
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground break-words text-pretty">
              Nenhuma festa agendada no momento. Use o botão acima para criar uma nova festa.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default StaffDashboardPage
