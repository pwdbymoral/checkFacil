import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth, type StaffUser } from '@/contexts/authContextCore'

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'O email é obrigatório.' })
    .email({ message: 'Por favor, insira um email válido.' }),
  password: z
    .string()
    .min(1, { message: 'A senha é obrigatória.' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
})
type LoginFormValues = z.infer<typeof loginFormSchema>

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/staff/dashboard', { replace: true })
    }
  }, [auth.isAuthenticated, navigate])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setLoginError(null)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email: values.email,
        senha: values.password,
      })

      const { usuario, token, mensagem } = response.data

      // eslint-disable-next-line no-console
      console.info(mensagem || 'Login API bem-sucedido:', { usuario, token })

      const staffUserData: StaffUser = {
        id: usuario.id.toString(),
        email: usuario.email,
        name: usuario.nome,
      }
      auth.login(staffUserData, token)
      navigate('/staff/dashboard', { replace: true })
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Erro na chamada de API de login:', error)

      if (axios.isAxiosError(error) && error.response) {
        setLoginError(
          error.response.data.error ||
            error.response.data.message ||
            `Erro ${error.response.status}: Falha ao fazer login.`,
        )
      } else if (error instanceof Error) {
        setLoginError(
          error.message ||
            'Falha ao tentar fazer login. Verifique sua conexão ou contate o suporte.',
        )
      } else {
        setLoginError('Ocorreu um erro desconhecido ao tentar fazer login.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (auth.isAuthenticated && !isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Redirecionando...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login Staff</CardTitle>
          <CardDescription>Acesse o painel de gerenciamento do CheckFacil.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Sua senha"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && <p className="text-sm font-medium text-destructive">{loginError}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Problemas para acessar? Contate o administrador.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
