'use server';

import { authenticateAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export interface LoginFormState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginFormState | null,
  formData: FormData
): Promise<LoginFormState> {
  const email = (formData.get('email') as string) || '';
  const password = (formData.get('password') as string) || '';

  const result = await authenticateAdmin(email, password);

  if (!result.success) {
    return {
      error: 'E-posta veya şifre hatalı',
    };
  }

  redirect('/admin');
}
