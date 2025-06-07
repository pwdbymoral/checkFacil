import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const PartyPackageEnum = z.enum(
  ['KIDS', 'KIDS_MAIS_PARK', 'PLAY', 'PLAY_MAIS_PARK', 'SUPER_FESTA_COMPLETA'],
  { message: 'Pacote inválido.' },
)

const GuestNotInListPolicyEnum = z.enum(['PERMITIR_ANOTAR', 'CHAMAR_ANFITRIAO'], {
  message: 'Procedimento inválido.',
})

const createEventFormSchema = z.object({
  organizerName: z.string().min(1, 'Nome do contratante é obrigatório.'),
  organizerEmail: z.string().min(1, 'Email do contratante é obrigatório.').email('Email inválido.'),
  organizerPhone: z
    .string()
    .min(10, 'Telefone do contratante inválido.')
    .optional()
    .or(z.literal('')),
  organizerPassword: z.string().min(6, 'Senha do contratante deve ter no mínimo 6 caracteres.'),

  partyName: z.string().min(1, 'Nome da festa é obrigatório.'),
  partyDate: z.date({ required_error: 'Data da festa é obrigatória.' }),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM).')
    .optional()
    .or(z.literal('')),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM).')
    .optional()
    .or(z.literal('')),
  partyLocation: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),

  packageType: PartyPackageEnum.optional().or(z.literal('')),
  contractedAdults: z.coerce
    .number()
    .int()
    .positive('Deve ser um número positivo.')
    .optional()
    .nullable(),
  contractedChildren: z.coerce
    .number()
    .int()
    .positive('Deve ser um número positivo.')
    .optional()
    .nullable(),

  birthdayPersonName: z.string().min(1, 'Nome do aniversariante é obrigatório.'),
  birthdayPersonAge: z.coerce.number().int().positive('Idade inválida.').optional().nullable(),

  partyTheme: z.string().optional().or(z.literal('')),
  isDropOffParty: z.boolean().optional().default(false),
  allowsImageUse: z.boolean().optional().default(false),
  clientInstagram: z.string().optional().or(z.literal('')),
  guestNotInListPolicy: GuestNotInListPolicyEnum.optional().or(z.literal('')),
  spotifyPlaylistLink: z.string().url('URL inválida.').optional().or(z.literal('')),
  partyObservations: z.string().optional().or(z.literal('')),
})

type CreateEventFormValues = z.infer<typeof createEventFormSchema>

const CreateEventPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  // const auth = useAuth()
  // const navigate = useNavigate()

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      organizerPassword: '',

      partyName: '',
      partyDate: new Date(),
      startTime: '',
      endTime: '',
      partyLocation: '',
      description: '',

      packageType: undefined,
      contractedAdults: null,
      contractedChildren: null,

      birthdayPersonName: '',
      birthdayPersonAge: null,

      partyTheme: '',
      isDropOffParty: false,
      allowsImageUse: false,
      clientInstagram: '',
      guestNotInListPolicy: undefined,
      spotifyPlaylistLink: '',
      partyObservations: '',
    },
  })

  async function onSubmit(values: CreateEventFormValues) {
    setIsLoading(true)
    // eslint-disable-next-line no-console
    console.log('Dados do formulário para criar evento:', values)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      {' '}
      {/* Limita a largura para formulários longos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Criar Nova Festa</CardTitle>
          <CardDescription>
            Preencha os detalhes abaixo para agendar uma nova festa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Seção: Dados do Contratante */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Dados do Contratante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:items-start">
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
                        <FormLabel>Telefone do Contratante</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormDescription className="text-left">
                          Opcional, mas recomendado para contato rápido.
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
                        <FormLabel>Senha para o Contratante</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Senha de acesso" {...field} />
                        </FormControl>
                        <FormDescription className="text-left">
                          Será usada para o contratante acessar a lista de convidados.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Dados da Festa */}
              <div>
                <h3 className="text-lg font-semibold my-4 border-b pb-2">Dados da Festa</h3>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="partyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Festa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aniversário do(a) Joãozinho" {...field} />
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
                              disabled={
                                (date: Date) =>
                                  date < new Date(new Date().setDate(new Date().getDate() - 1)) // Desabilita datas passadas
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {' '}
                    {/* Para horários lado a lado */}
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Início</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormDescription className="text-left">
                            Formato HH:MM (ex: 14:00)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Término</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormDescription className="text-left">
                            Formato HH:MM (ex: 18:00)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="packageType" // Corresponde a 'pacote_escolhido' na API
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pacote da Festa</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um pacote" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Os valores aqui devem ser as chaves do seu PartyPackageEnum */}
                            <SelectItem value="KIDS">Festa Kids</SelectItem>
                            <SelectItem value="KIDS_MAIS_PARK">Festa Kids + Park</SelectItem>
                            <SelectItem value="PLAY">Festa Play</SelectItem>
                            <SelectItem value="PLAY_MAIS_PARK">Festa Play + Park</SelectItem>
                            <SelectItem value="SUPER_FESTA_COMPLETA">
                              Super Festa Completa
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-left">
                          Escolha o pacote contratado (conforme &quot;Pacote de Festas&quot;).
                        </FormDescription>
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
                          <FormLabel>Nº de Adultos Contratados</FormLabel>
                          <FormControl>
                            {/* React Hook Form lida bem com type="number" retornando número ou string vazia */}
                            {/* O coerce.number() do Zod ajuda a converter */}
                            <Input
                              type="number"
                              placeholder="Ex: 50"
                              {...field}
                              value={field.value ?? ''}
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
                          <FormLabel>Nº de Crianças Contratadas</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ex: 30"
                              {...field}
                              value={field.value ?? ''}
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

                  <FormField
                    control={form.control}
                    name="birthdayPersonName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Aniversariante</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do(a) aniversariante" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthdayPersonAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade a Comemorar (Aniversariante)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 7"
                            {...field}
                            value={field.value ?? ''}
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
                    name="partyTheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema da Festa (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Super Heróis, Princesas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description" // Campo de descrição da festa
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição da Festa (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detalhes adicionais sobre a festa..."
                            className="resize-y" // Permite redimensionamento vertical
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Checkboxes */}
                  <FormField
                    control={form.control}
                    name="isDropOffParty" // corresponde a 'festa_deixa_e_pegue'
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Festa no modelo &quot;Deixa e Pega&quot;?</FormLabel>
                          <FormDescription className="text-left">
                            Marque se as crianças podem ficar desacompanhadas (conforme regras de
                            idade do Espaço Criar).
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowsImageUse" // corresponde a 'autoriza_uso_imagem'
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Contratante autoriza uso de imagem?</FormLabel>
                          <FormDescription className="text-left">
                            Permissão para o Espaço Criar usar imagens do evento para divulgação.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientInstagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram do Cliente (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/usuario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guestNotInListPolicy" // corresponde a 'procedimento_convidado_nao_cadastrado'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Procedimento para Convidados Não Cadastrados</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="contact">Entrar em contato</SelectItem>
                            <SelectItem value="register">Registrar convidado</SelectItem>
                            <SelectItem value="deny">Negar entrada</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spotifyPlaylistLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link da Playlist do Spotify (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://open.spotify.com/playlist/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partyObservations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações Adicionais (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre a festa..."
                            className="resize-y" // Permite redimensionamento vertical
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Salvando Festa...' : 'Criar Festa'}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter>
          <p>Rodapé do card, se necessário.</p>
        </CardFooter> */}
      </Card>
    </div>
  )
}

export default CreateEventPage
