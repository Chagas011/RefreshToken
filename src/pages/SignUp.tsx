import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AuthService } from '@/services/AuthService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Digite seu nome'),
  email: z.email('Digite um email valido'),
  password: z.string().min(8, 'Sua senha precisa ter no minimo 8 Caracteres'),
});

type FormData = z.infer<typeof schema>;

export function SignUp() {
  const { signUp } = AuthService();
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const response = await signUp(data);
    console.log(response);
  });
  const { formState } = form;
  return (
    <div className="min-h-screen flex flex-col justify-center mx-auto max-w-[480px] p-6">
      <h1 className="font-semibold text-xl">Cadastre-se!</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-2">
        <div className="space-y-1">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" {...form.register('name')} />
          {formState.errors.name && (
            <p className="text-red-500 p-1">{formState.errors.name?.message}</p>
          )}
        </div>

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
        Ja tem uma conta ?{' '}
        <a href="/sign-in" className="underline">
          Faça seu login !
        </a>
      </p>
    </div>
  );
}
