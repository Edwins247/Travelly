// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs';   // ← 여기만 수정!

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo'   → 결과를 테스트 UI에서만 확인
      // 'error'  → CI 실패 처리
      // 'off'    → 체크 건너뜀
      test: 'todo',
    },
  },
};

export default preview;
