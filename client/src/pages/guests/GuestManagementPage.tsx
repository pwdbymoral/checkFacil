import axios from 'axios'
import { Loader2, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { AddGuestForm, type AddGuestFormValues } from '@/components/guests/AddGuestForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [partyName, setPartyName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchGuests = useCallback(async () => {
    if (!eventId) return
    try {
      const response = await api.get(`/festa/${eventId}/convidados`)
      const mappedGuests: AppGuest[] = response.data.map((guestFromApi: ApiGuestResponse) => ({
        id: guestFromApi.id,
        name: guestFromApi.nome_convidado,
        type: guestFromApi.tipo_convidado.replace(/_/g, ' ').toLowerCase(),
        guardianName: guestFromApi.nome_responsavel,
        guardianPhone: guestFromApi.telefone_responsavel,
        status: guestFromApi.confirmou_presenca,
        isCheckedIn: !!guestFromApi.checkin_at,
      }))
      setGuests(mappedGuests)
    } catch (error) {
      console.error('Erro ao buscar convidados:', error)
      toast.error('Não foi possível carregar a lista de convidados.')
    }
  }, [eventId]) // Dependência do useCallback

  // Busca os dados iniciais
  useEffect(() => {
    if (!eventId) return
    const fetchInitialData = async () => {
      setIsLoading(true)
      await fetchGuests()
      try {
        const eventResponse = await api.get(`/festa/${eventId}`)
        setPartyName(eventResponse.data.nome_festa)
      } catch {
        toast.error('Não foi possível carregar o nome da festa.')
      }
      setIsLoading(false)
    }
    fetchInitialData()
  }, [eventId, fetchGuests]) // Adicionado fetchGuests como dependência

  // Função para lidar com a submissão do formulário
  const handleAddGuestSubmit = async (data: AddGuestFormValues) => {
    // TIPO CORRIGIDO AQUI
    if (!eventId) return
    setIsSubmitting(true)
    try {
      await api.post(`/festa/${eventId}/convidados`, data)
      toast.success('Convidado adicionado com sucesso!')
      setIsDialogOpen(false)
      await fetchGuests() // Atualiza a lista
    } catch (error: unknown) {
      let errorMessage = 'Ocorreu um erro inesperado.'
      if (axios.isAxiosError(error) && error.response) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          'Erro ao processar a solicitação.'
      } else if (error instanceof Error) {
        // Se for um erro genérico do JavaScript, pegamos a mensagem
        errorMessage = error.message
      }
      toast.error('Falha ao adicionar convidado.', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Convidados</h1>
          {partyName && <p className="text-lg text-muted-foreground">{partyName}</p>}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4 sm:w-auto sm:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Convidados
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Convidado</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para adicionar um novo convidado à lista.
              </DialogDescription>
            </DialogHeader>
            <AddGuestForm onSubmit={handleAddGuestSubmit} isLoading={isSubmitting} />
          </DialogContent>
        </Dialog>
      </header>

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
