import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import api from '@/services/api'

interface ApiGuestResponse {
  id: number
  nome_convidado: string
  tipo_convidado: string
  nome_responsavel?: string
  telefone_responsavel?: string
  confirmou_presenca: 'PENDENTE' | 'SIM' | 'NAO'
  checkin_at?: string | null
}

interface AppGuest {
  id: number
  name: string
  type: string
  guardianName?: string
  guardianPhone?: string
  status: 'PENDENTE' | 'SIM' | 'NAO'
  isCheckedIn: boolean
}

function GuestManagementPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [guests, setGuests] = useState<AppGuest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [partyName, setPartyName] = useState('')

  useEffect(() => {
    if (!eventId) {
      return
    }

    const fetchGuests = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/festa/${eventId}/convidados`)
        const mappedGuests: AppGuest[] = response.data.map((guestFromApi: ApiGuestResponse) => ({
          id: guestFromApi.id,
          name: guestFromApi.nome_convidado,
          type: guestFromApi.tipo_convidado.replace('_', ' ').toLowerCase(), // Formata para exibição
          guardianName: guestFromApi.nome_responsavel,
          guardianPhone: guestFromApi.telefone_responsavel,
          status: guestFromApi.confirmou_presenca,
          isCheckedIn: !!guestFromApi.checkin_at,
        }))
        setGuests(mappedGuests)
        const eventResponse = await api.get(`/festa/${eventId}`)
        setPartyName(eventResponse.data.nome_festa)
      } catch (error) {
        console.error('Erro ao buscar convidados:', error)
        toast.error('Não foi possível carregar a lista de convidados.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuests()
  }, [eventId])

  const handleEdit = (guestId: number) => {
    // TODO: Lógica para abrir modal de edição
    toast.info(`Funcionalidade de editar convidado ${guestId} ainda não implementada.`)
  }

  const handleDelete = (guestId: number) => {
    // TODO: Lógica para pedir confirmação e chamar a API de deleção
    toast.info(`Funcionalidade de deletar convidado ${guestId} ainda não implementada.`)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Convidados</h1>
        <p className="text-lg text-muted-foreground">
          {/* Adicione o nome da festa aqui quando a busca estiver implementada */}
          Festa com ID: {eventId}
        </p>
      </header>

      {/* TODO: Formulário para adicionar convidados virá aqui em um <Card> */}
      <div className="mb-8 p-6 bg-card border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Adicionar Novos Convidados</h2>
        <p className="text-muted-foreground">Em breve...</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Convidados</CardTitle>
          <CardDescription>Visualize e gerencie os convidados da sua festa.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : guests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Convidado</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden sm:table-cell">Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{guest.type}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {guest.guardianName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(guest.id)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(guest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhum convidado adicionado a esta festa ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default GuestManagementPage
