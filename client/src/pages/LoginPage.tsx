import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/contexts/AuthContext'

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

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const navigate = useNavigate()
  const auth = useAuth()

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
    console.log('Tentando logar com:', values)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (values.email === 'staff@espacocriar.com' && values.password === 'password123') {
        const simulatedUserData = {
          id: 'staff1',
          email: values.email,
          name: 'Staff User',
        }
        const simulatedToken = 'fake-jwt-token'

        auth.login(simulatedUserData, simulatedToken)

        console.log('Login bem-sucedido:', simulatedUserData)
        navigate('/')
      } else {
        throw new Error('Email ou senha inválidos. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setLoginError(error instanceof Error ? error.message : 'Ocorreu um erro ao fazer login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login Staff</CardTitle>
          <CardDescription>Bem-vindo(a) de volta! Faça login para continuar.</CardDescription>
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
                      <Input type="email" placeholder="seu@email.com" {...field} />
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
                      <Input type="password" placeholder="Sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loginError && <p className="text-sm font-medium text-destructive">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Precisa de ajuda? Contate o administrador.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
