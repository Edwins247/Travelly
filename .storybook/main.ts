import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // 1) 실제 스토리 경로 (스크린샷 기준: src/stories/…)
  stories: ['../src/stories/**/*.stories.@(ts|tsx|mdx)'],

  // 2) 필수 애드온
  addons: [
    '@storybook/addon-essentials',  // Docs + Controls + Actions + etc.
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/nextjs',      // Webpack 빌더
    options: {},
  },
};
export default config;
