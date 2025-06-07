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

// Define a schema for the form using zod
const createDraftFormSchema = z.object({
  organizerName: z.string().min(1, 'Nome do contratante é obrigatório.'),
  organizerEmail: z
    .string()
    .min(1, 'Email do contratante é obrigatório.')
    .email('Formato de email inválido.'),
  organizerPhone: z.string().min(10, 'Telefone do contratante é obrigatório (com DDD).'),
  organizerPassword: z.string().min(6, 'Senha inicial deve ter no mínimo 6 caracteres.'),

  partyName: z.string().min(1, 'Um nome para a festa é obrigatório.'),
  partyDate: z.date({ required_error: 'Data da festa é obrigatória.' }),
  packageType: z.enum(
    ['KIDS', 'KIDS_MAIS_PARK', 'PLAY', 'PLAY_MAIS_PARK', 'SUPER_FESTA_COMPLETA'],
    { required_error: 'Você precisa selecionar um tipo de pacote.' },
  ),
  contractedChildren: z.coerce.number().int().positive({ message: 'Deve ser um número positivo.' }),
  contractedAdults: z.coerce.number().int().positive({ message: 'Deve ser um número positivo.' }),
})

// Define TypeScript types for form values
type CreateDraftFormValues = z.infer<typeof createDraftFormSchema>

// Component for creating a draft event
function CreateDraftEventPage() {
  const [isLoading, setIsLoading] = useState(false)
  useAuth()
  const navigate = useNavigate()

  // Initialize the form with react-hook-form and zod
  const form = useForm<CreateDraftFormValues>({
    resolver: zodResolver(createDraftFormSchema),
    defaultValues: {
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      organizerPassword: '',
      partyName: '',
      partyDate: new Date(),
      packageType: 'KIDS',
      contractedChildren: 0,
      contractedAdults: 0,
    },
  })

  // Function to handle form submission
  async function onSubmit(values: CreateDraftFormValues) {
    const contratantePayload = {
      nome: values.organizerName,
      email: values.organizerEmail,
      senha: values.organizerPassword,
      telefone: values.organizerPhone,
    }
    try {
      // Log the payload being sent
      console.info(
        'Enviando dados do contratante para /auth/register/admFesta:',
        contratantePayload,
      )
      const responseContratante = await api.post('/auth/register/admFesta', contratantePayload)

      const novoContratante = responseContratante.data.usuario
      if (!novoContratante || !novoContratante.id) {
        throw new Error('Falha ao obter ID do contratante recém-criado.')
      }

      const festaPayload = {
        // Map form fields to API fields
        nome_festa: values.partyName,
        data_festa: format(values.partyDate, 'yyyy-MM-dd'), // Format the date
        pacote_escolhido: values.packageType,
        numero_criancas_contratado: values.contractedChildren,
        numero_adultos_contratado: values.contractedAdults,
        id_organizador: novoContratante.id, // Use ID returned from first API call
      }
      console.info('Enviando dados da festa para /festa/criar-festa:', festaPayload)
      await api.post('/festa/criar-festa', festaPayload)

      // Success notification
      toast.success('Agendamento iniciado com sucesso!', {
        description: `O acesso foi enviado para ${values.organizerEmail}.`,
      })
      navigate('/staff/dashboard') // Redirect back to staff dashboard
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
              {/* Section: Organizer Details */}
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
                  <FormField
                    control={form.control}
                    name="organizerPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Inicial para o Contratante</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Senha de acesso" {...field} />
                        </FormControl>
                        <FormDescription className="text-left">
                          Pode ser alterada por ele depois.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Essential Party Details */}
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
