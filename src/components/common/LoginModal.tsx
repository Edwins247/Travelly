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
import { signInOrSignUpEmail, signInWithGoogle } from '@/services/auth';
import { toast } from '@/store/toastStore';

interface FormValues {
  email: string;
  password: string;
}

export function LoginModal() {
  const { open, closeModal, openModal } = useLoginModal();
  const { loading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    if (process.env.NODE_ENV === 'development') console.log('Form Values:', {email, password});
    try {
      closeModal(); // 로그인 시도 시 모달 먼저 닫기
      await signInOrSignUpEmail(email, password);
      // signInOrSignUpEmail()에서 새로고침이 일어남
    } catch {
      // error는 useAuthStore.error로 표시됩니다
      // 에러 발생 시 모달 다시 열기
      setTimeout(() => openModal(), 100);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeModal()}>
      <DialogContent className="w-[90vw] max-w-md p-4 sm:w-full sm:p-6">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>이메일로 로그인 / 없으면 자동 회원가입 됩니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="이메일"
              type="email"
              {...register('email', { required: '이메일을 입력하세요' })}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="비밀번호"
              type="password"
              {...register('password', { required: '비밀번호를 입력하세요' })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '로딩…' : '로그인 / 회원가입'}
          </Button>
        </form>

        <div className="relative my-4 h-[1px] bg-border">
          <span className="absolute inset-0 -top-2 left-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
            또는
          </span>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              try {
                closeModal(); // Google 로그인 시도 시 모달 먼저 닫기
                await signInWithGoogle();
                // signInWithGoogle()에서 새로고침이 일어남
              } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                  console.log('Google 로그인 취소 또는 실패');
                  console.log(error);
                }
                // 에러 발생 시에만 여기 도달 (팝업 취소 등)
                toast.error('구글 로그인 오류가 발생했습니다', '잠시 후 다시 시도해주세요.');
                // 에러 발생 시 모달 다시 열기
                setTimeout(() => openModal(), 100);
              }
            }}
            disabled={loading}
          >
            {loading ? '로그인 중...' : 'Google 계정으로 계속'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
