import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  title: {
    default: 'AI Prompts for Coding',
    template: '%s – AI Prompts',
  },
  description:
    'A curated collection of reusable AI coding prompts optimized for opencode and Claude.',
}

const navbar = (
  <Navbar
    logo={<b>AI Prompts</b>}
    projectLink="https://github.com/kethalia/ai-prompts"
  />
)

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} – AI Prompts for Coding
  </Footer>
)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/kethalia/ai-prompts/tree/main/content"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
