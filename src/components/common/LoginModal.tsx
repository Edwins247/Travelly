// src/components/common/LoginModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useLoginModal } from '@/store/loginModalStore';
import { useAuthStore } from '@/store/authStore';
import {
  signInOrSignUpEmail,
  signInWithGoogle,
} from '@/services/auth';

interface FormValues {
  email: string;
  password: string;
}

export function LoginModal() {
  const { open, closeModal } = useLoginModal();
  const { loading, error }   = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
      console.log('▶ form values:', { email, password });
    try {
      await signInOrSignUpEmail(email, password);
      closeModal();
    } catch {
      // error는 useAuthStore.error로 표시됩니다
    }
  });

  return (
    <Dialog open={open} onOpenChange={v => !v && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>
            이메일로 로그인 / 없으면 자동 회원가입 됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="이메일"
              type="email"
              {...register('email', { required: '이메일을 입력하세요' })}
            />
            {errors.email && (
              <p className="text-destructive text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="비밀번호"
              type="password"
              {...register('password', { required: '비밀번호를 입력하세요' })}
            />
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-destructive text-sm">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '로딩…' : '로그인 / 회원가입'}
          </Button>
        </form>

        <div className="relative my-4 h-[1px] bg-border">
          <span className="absolute inset-0 -top-2 bg-background px-2 text-xs text-muted-foreground left-1/2 -translate-x-1/2">
            또는
          </span>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await signInWithGoogle();
              closeModal();
            }}
            disabled={loading}
          >
            Google 계정으로 계속
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
