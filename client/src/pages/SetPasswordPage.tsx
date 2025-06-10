import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/authContextCore'
import api from '@/services/api'

import type { StaffUser } from '@/contexts/authContextCore'

const setPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string().min(6, { message: 'A confirmação de senha é obrigatória.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'], // O erro aparecerá no campo de confirmação de senha
  })

type SetPasswordFormValues = z.infer<typeof setPasswordSchema>

export function SetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useParams<{ token: string }>() // Pega o token da URL
  const navigate = useNavigate()
  const auth = useAuth()

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: SetPasswordFormValues) {
    setIsLoading(true)

    // eslint-disable-next-line no-console
    console.log({
      message: 'Dados a serem enviados para o backend:',
      token,
      password: values.password,
    })

    // Lógica REAL da API (a ser implementada quando o backend estiver pronto)
    /*
    try {
      const response = await api.post('/auth/set-password', {
        token: token,
        newPassword: values.password
      });

      const { usuario, token: jwtToken } = response.data;

      // Loga o usuário automaticamente
      auth.login(usuario as StaffUser, jwtToken);

      toast.success("Senha definida com sucesso!", {
        description: "Você será redirecionado para completar os detalhes da sua festa."
      });

      // TODO: Redirecionar para a página de detalhamento da festa
      // navigate(`/contratante/evento/${idDaFesta}/detalhes`);
      navigate('/'); // Redireciona para home por enquanto
      
    } catch (error: unknown) {
      let errorMessage = 'Ocorreu um erro inesperado.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error("Falha ao definir a senha", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
    */

    // Lógica SIMULADA por enquanto
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success('Senha definida com sucesso! (Simulação)', {
      description: 'Você será redirecionado em breve.',
    })
    setIsLoading(false)
    navigate('/login') // Após definir a senha, leva para o login por enquanto
  }

  // 4. Estrutura da UI
  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Defina sua Senha</CardTitle>
          <CardDescription>Crie uma nova senha para acessar o painel da sua festa.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme a Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Salvando...' : 'Definir Senha e Acessar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
