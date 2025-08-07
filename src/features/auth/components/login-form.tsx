import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { useAuth } from '@/hooks';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@ui/form';

type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onError: (error: string | null) => void;
}

export function LoginForm({ onSwitchToRegister, onError }: LoginFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  // 表单验证模式 - 使用翻译函数并缓存
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.email(t('validation.email.invalid')),
        password: z.string().min(6, t('validation.password.minLength')),
      }),
    [t]
  );

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    onError(null);
    setIsSubmitting(true);

    try {
      await login(data.email, data.password);
    } catch (err) {
      const error = err as Error;
      const errorMessage = JSON.parse(error.message) || t('auth.login.error');
      onError(errorMessage?.message || t('auth.login.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email.label')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t('auth.email.placeholder')}
                  disabled={isSubmitting}
                  {...field}
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
              <FormLabel>{t('auth.password.label')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password.placeholder')}
                    disabled={isSubmitting}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.login.loading')}
            </>
          ) : (
            t('auth.login.title')
          )}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToRegister}
            className="text-sm text-primary hover:underline"
            disabled={isSubmitting}
          >
            {t('auth.login.switchToRegister')}
          </Button>
        </div>
      </Form>
    </div>
  );
}
