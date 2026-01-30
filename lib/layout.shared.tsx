import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'AI Prompts',
    },
    githubUrl: 'https://github.com/kethalia/ai-prompts',
    links: [
      {
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
    ],
  }
}
