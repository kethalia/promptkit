import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'PromptKit',
    },
    githubUrl: 'https://github.com/kethalia/promptkit',
    links: [
      {
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
    ],
  }
}
