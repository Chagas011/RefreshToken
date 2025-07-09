import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useAuth } from '@/hooks/useAuth';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const schema = z.object({
  email: z.email('Digite um email valido'),
  password: z.string().min(8, 'A senha precisa ter no minimo 8 Caracteres'),
});

type FormData = z.infer<typeof schema>;

export function SignIn() {
  const { signIn } = useAuth();
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const { formState } = form;

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    try {
      await signIn(email, password);
      toast.success('Login Realizado com sucesso');
    } catch {
      toast.error('Credenciais incorretas');
    }
  });

  return (
    <div className="min-h-screen flex flex-col justify-center mx-auto max-w-[480px] p-6">
      <h1 className="font-semibold text-xl">Acesse sua conta</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-2">
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" {...form.register('email')} />
          {formState.errors.email && (
            <p className="text-red-500 p-1">
              {formState.errors.email?.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" {...form.register('password')} />
          {formState.errors.password && (
            <p className="text-red-500 p-1">
              {formState.errors.password?.message}
            </p>
          )}
        </div>

        <Button className="mt-3">Entrar</Button>
      </form>

      <p className="p-2">
        Não tem conta ?{' '}
        <a href="/sign-up" className="underline">
          Faça seu cadastro !
        </a>
      </p>
    </div>
  );
}
