import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/authContextCore'
import { cn } from '@/lib/utils'
import api from '@/services/api'

const createDraftFormSchema = z.object({
  organizerName: z.string().min(1, 'Nome do contratante é obrigatório.'),
  organizerEmail: z
    .string()
    .min(1, 'Email do contratante é obrigatório.')
    .email('Formato de email inválido.'),
  organizerPhone: z.string().min(10, 'Telefone do contratante é obrigatório (com DDD).'),

  partyName: z.string().min(1, 'Um nome para a festa é obrigatório.'),
  partyDate: z.date({ required_error: 'Data da festa é obrigatória.' }),
  packageType: z.enum(
    ['KIDS', 'KIDS_MAIS_PARK', 'PLAY', 'PLAY_MAIS_PARK', 'SUPER_FESTA_COMPLETA'],
    { required_error: 'Você precisa selecionar um tipo de pacote.' },
  ),
  contractedChildren: z.coerce.number().int().positive({ message: 'Deve ser um número positivo.' }),
  contractedAdults: z.coerce.number().int().positive({ message: 'Deve ser um número positivo.' }),
})

type CreateDraftFormValues = z.infer<typeof createDraftFormSchema>

function CreateDraftEventPage() {
  const [isLoading, setIsLoading] = useState(false)
  useAuth()
  const navigate = useNavigate()

  const form = useForm<CreateDraftFormValues>({
    resolver: zodResolver(createDraftFormSchema),
    defaultValues: {
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      partyName: '',
      partyDate: new Date(),
      packageType: 'KIDS',
      contractedChildren: 0,
      contractedAdults: 0,
    },
  })

  async function onSubmit(values: CreateDraftFormValues) {
    setIsLoading(true)

    const payload = {
      dadosFesta: {
        nome_festa: values.partyName,
        data_festa: format(values.partyDate, 'yyyy-MM-dd'),
        pacote_escolhido: values.packageType,
        numero_criancas_contratado: values.contractedChildren,
        numero_adultos_contratado: values.contractedAdults,
      },
      dadosCliente: {
        nome: values.organizerName,
        email: values.organizerEmail,
        telefone: values.organizerPhone,
      },
    }

    try {
      // eslint-disable-next-line no-console
      console.info('Enviando dados para /festa/criar:', payload)

      await api.post('/festa/criar', payload)

      toast.success('Agendamento iniciado com sucesso!', {
        description: `Um link de acesso será enviado para o WhatsApp de ${values.organizerName}.`,
      })
      navigate('/staff/dashboard')
    } catch (error: unknown) {
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.'
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error('Falha ao criar agendamento', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Novo Agendamento</CardTitle>
          <CardDescription>
            Preencha os dados essenciais para criar o rascunho da festa e o acesso do contratante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4 border-b pb-2">Dados do Contratante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormField
                    control={form.control}
                    name="organizerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contratante</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organizerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do Contratante</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@contratante.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organizerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp do Contratante</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormDescription className="text-left">
                          Usado para enviar o link de acesso.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium my-4 border-b pb-2">
                  Dados Essenciais da Festa
                </h3>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="partyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Festa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aniversário de 5 anos do Léo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partyDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data da Festa</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP', { locale: ptBR })
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pacote da Festa</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um pacote..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="KIDS">Festa Kids</SelectItem>
                            <SelectItem value="KIDS_MAIS_PARK">Festa Kids + Park</SelectItem>
                            <SelectItem value="PLAY">Festa Play</SelectItem>
                            <SelectItem value="PLAY_MAIS_PARK">Festa Play + Park</SelectItem>
                            <SelectItem value="SUPER_FESTA_COMPLETA">
                              Super Festa Completa
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      control={form.control}
                      name="contractedAdults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº de Adultos</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ex: 50"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? null : +e.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contractedChildren"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº de Crianças</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ex: 30"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? null : +e.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Salvando...' : 'Criar Agendamento e Enviar Acesso'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateDraftEventPage
