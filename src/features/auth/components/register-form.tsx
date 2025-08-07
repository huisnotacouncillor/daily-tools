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

type RegisterFormData = {
  email: string;
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
};

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onError: (error: string | null) => void;
}

export function RegisterForm({ onSwitchToLogin, onError }: RegisterFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  // 表单验证模式 - 使用翻译函数并缓存
  const registerSchema = useMemo(
    () =>
      z
        .object({
          email: z.email(t('validation.email.invalid')),
          username: z
            .string()
            .min(3, t('validation.username.minLength'))
            .max(20, t('validation.username.maxLength')),
          name: z
            .string()
            .min(2, t('validation.name.minLength'))
            .max(50, t('validation.name.maxLength')),
          password: z.string().min(6, t('validation.password.minLength')),
          confirmPassword: z.string(),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: t('validation.confirmPassword.mismatch'),
          path: ['confirmPassword'],
        }),
    [t]
  );

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    onError(null);
    setIsSubmitting(true);

    try {
      await register(data.email, data.username, data.name, data.password);
    } catch (err) {
      const error = err as Error;
      onError(error.message || t('auth.register.error'));
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.username.label')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t('auth.username.placeholder')}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.name.label')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t('auth.name.placeholder')}
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.confirmPassword.label')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('auth.confirmPassword.placeholder')}
                    disabled={isSubmitting}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
              {t('auth.register.loading')}
            </>
          ) : (
            t('auth.register.title')
          )}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToLogin}
            className="text-sm text-primary hover:underline"
            disabled={isSubmitting}
          >
            {t('auth.login.switchToLogin')}
          </Button>
        </div>
      </Form>
    </div>
  );
}
