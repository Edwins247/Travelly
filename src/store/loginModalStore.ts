import { create } from 'zustand';

interface LoginModalState {
  open: boolean;
  shouldAutoOpen: boolean; // 자동으로 모달을 열어야 하는지 여부
  wasClosedByUser: boolean; // 사용자가 로그인 없이 모달을 닫았는지 여부
  openModal: () => void;
  closeModal: () => void;
  setShouldAutoOpen: (should: boolean) => void;
  setWasClosedByUser: (closed: boolean) => void;
}

export const useLoginModal = create<LoginModalState>(set => ({
  open: false,
  shouldAutoOpen: true, // 기본적으로는 자동 오픈 허용
  wasClosedByUser: false, // 기본적으로는 사용자가 닫지 않음
  openModal:  () => set({ open: true, wasClosedByUser: false }),
  closeModal: () => set({ open: false, wasClosedByUser: true }),
  setShouldAutoOpen: (should: boolean) => set({ shouldAutoOpen: should }),
  setWasClosedByUser: (closed: boolean) => set({ wasClosedByUser: closed }),
}));
