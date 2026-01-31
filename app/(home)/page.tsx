import Link from 'next/link'
import {
  BookOpen,
  Bug,
  Code,
  FileText,
  RefreshCw,
  LayoutTemplate,
  Shield,
  ClipboardList,
  TestTube,
  Sparkles,
  Terminal,
  ArrowRight,
} from 'lucide-react'

import { getAllPrompts } from '@/lib/prompts'
import { getAllSkills } from '@/lib/skills'

import type { ReactNode } from 'react'

interface CategoryItem {
  title: string
  description: string
  href: string
  icon: ReactNode
  /** Category key matching the `category` field from getAllPrompts() */
  category: string
}

const CATEGORIES: CategoryItem[] = [
  {
    title: 'Review',
    description: 'Code review, PR review, change analysis',
    href: '/docs/review',
    icon: <ClipboardList className="size-5" />,
    category: 'review',
  },
  {
    title: 'Debug',
    description: 'Error diagnosis, bug tracing, stack traces',
    href: '/docs/debug',
    icon: <Bug className="size-5" />,
    category: 'debug',
  },
  {
    title: 'Refactor',
    description: 'Code quality, extraction, modernization',
    href: '/docs/refactor',
    icon: <RefreshCw className="size-5" />,
    category: 'refactor',
  },
  {
    title: 'Testing',
    description: 'Unit tests, coverage, test case generation',
    href: '/docs/testing',
    icon: <TestTube className="size-5" />,
    category: 'testing',
  },
  {
    title: 'Documentation',
    description: 'README generation, function docs, API docs',
    href: '/docs/documentation',
    icon: <FileText className="size-5" />,
    category: 'documentation',
  },
  {
    title: 'Architecture',
    description: 'Design review, patterns, tradeoff analysis',
    href: '/docs/architecture',
    icon: <LayoutTemplate className="size-5" />,
    category: 'architecture',
  },
  {
    title: 'Security',
    description: 'Security audits, vulnerability checks',
    href: '/docs/security',
    icon: <Shield className="size-5" />,
    category: 'security',
  },
  {
    title: 'Planning',
    description: 'Project bootstrap, GitHub issue creation',
    href: '/docs/planning',
    icon: <BookOpen className="size-5" />,
    category: 'planning',
  },
]

interface LanguageItem {
  title: string
  description: string
  href: string
  /** Category key matching the `category` field from getAllPrompts() */
  category: string
}

const LANGUAGES: LanguageItem[] = [
  {
    title: 'TypeScript',
    description: 'Type safety, migration, fixing type errors',
    href: '/docs/language-specific/typescript',
    category: 'language-specific/typescript',
  },
  {
    title: 'React & Next.js',
    description: 'Components, hooks, performance, App Router',
    href: '/docs/language-specific/react-nextjs',
    category: 'language-specific/react-nextjs',
  },
  {
    title: 'Go',
    description: 'Idioms, concurrency, error handling',
    href: '/docs/language-specific/go',
    category: 'language-specific/go',
  },
  {
    title: 'Rust',
    description: 'Ownership, unsafe code, Cargo best practices',
    href: '/docs/language-specific/rust',
    category: 'language-specific/rust',
  },
  {
    title: 'Solidity',
    description: 'Smart contracts, gas optimization, testing',
    href: '/docs/language-specific/solidity',
    category: 'language-specific/solidity',
  },
]

function CategoryCard({
  href,
  icon,
  title,
  description,
  count,
}: {
  href: string
  icon: ReactNode
  title: string
  description: string
  count: number
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-fd-border p-5 transition-colors hover:border-fd-primary hover:bg-fd-accent"
    >
      <div className="flex items-center gap-3">
        <div className="text-fd-muted-foreground transition-colors group-hover:text-fd-primary">
          {icon}
        </div>
        <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-sm text-fd-muted-foreground">
        {description}
      </p>
      <span className="mt-auto pt-3 text-xs text-fd-muted-foreground">
        {count} prompts
      </span>
    </Link>
  )
}

export default function HomePage() {
  const prompts = getAllPrompts()
  const skills = getAllSkills()

  const countByCategory = new Map<string, number>()
  for (const prompt of prompts) {
    countByCategory.set(prompt.category, (countByCategory.get(prompt.category) ?? 0) + 1)
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-fd-border bg-fd-secondary/50 px-4 py-1.5 text-sm text-fd-muted-foreground">
          <Sparkles className="size-4" />
          <span>{prompts.length} prompts &middot; {skills.length} agent skills &middot; LLM-optimized</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Prompts for Coding
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground">
          A curated collection of reusable prompts and agent skills for AI coding assistants.
          Copy-paste into your workflow or access programmatically.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Browse Prompts
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/docs/skills"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
          >
            <Sparkles className="size-4" />
            Explore Skills
          </Link>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Start</h2>
        <p className="mt-2 text-fd-muted-foreground">
          Copy a prompt into your AI assistant, or reference it directly if your tool supports file paths.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
          <div className="border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground">
            <Terminal className="mr-1.5 inline size-3.5" />
            Terminal
          </div>
          <pre className="overflow-x-auto p-4 text-sm">
            <code>
              <span className="text-fd-muted-foreground"># Access a prompt via the API</span>
              {'\n'}
              <span className="text-fd-primary">curl</span>{' '}
              <span>/api/prompts/review/pr-review</span>
              {'\n\n'}
              <span className="text-fd-muted-foreground"># Fetch the full LLM context file</span>
              {'\n'}
              <span className="text-fd-primary">curl</span>{' '}
              <span>/llms-full.txt</span>
            </code>
          </pre>
        </div>
      </section>

      {/* General Purpose */}
      <section className="mt-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">General Purpose</h2>
            <p className="mt-1 text-fd-muted-foreground">
              Prompts that work across any language or framework.
            </p>
          </div>
          <Link
            href="/docs"
            className="hidden items-center gap-1 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:flex"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.href}
              href={cat.href}
              icon={cat.icon}
              title={cat.title}
              description={cat.description}
              count={countByCategory.get(cat.category) ?? 0}
            />
          ))}
        </div>
      </section>

      {/* Language Specific */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Language Specific</h2>
        <p className="mt-1 text-fd-muted-foreground">
          Targeted prompts for specific languages and frameworks.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((lang) => (
            <CategoryCard
              key={lang.href}
              href={lang.href}
              icon={<Code className="size-5" />}
              title={lang.title}
              description={lang.description}
              count={countByCategory.get(lang.category) ?? 0}
            />
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mt-20">
        <div className="rounded-lg border border-fd-border bg-fd-card p-8">
          <div className="flex items-center gap-3">
            <Sparkles className="size-6 text-fd-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Agent Skills</h2>
          </div>
          <p className="mt-3 max-w-2xl text-fd-muted-foreground">
            {skills.length} downloadable skill packs following the{' '}
            <a
              href="https://github.com/anthropics/agent-skills"
              className="text-fd-primary underline underline-offset-4 hover:text-fd-primary/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agent Skills
            </a>{' '}
            open standard. Each skill bundles prompts with reference material for deeper AI assistant capabilities.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/docs/skills"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
            >
              Browse Skills
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/api/skills"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            >
              Skills API
            </Link>
          </div>
        </div>
      </section>

      {/* LLM Access */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Programmatic Access</h2>
        <p className="mt-1 text-fd-muted-foreground">
          All content is available through LLM-optimized endpoints.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fd-border text-left">
                <th className="pb-3 pr-4 font-medium text-fd-foreground">Endpoint</th>
                <th className="pb-3 font-medium text-fd-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fd-border">
              <tr>
                <td className="py-3 pr-4">
                  <Link href="/llms.txt" className="font-mono text-fd-primary hover:underline">
                    /llms.txt
                  </Link>
                </td>
                <td className="py-3 text-fd-muted-foreground">
                  Site overview per{' '}
                  <a href="https://llmstxt.org/" className="text-fd-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    llms.txt spec
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <Link href="/llms-full.txt" className="font-mono text-fd-primary hover:underline">
                    /llms-full.txt
                  </Link>
                </td>
                <td className="py-3 text-fd-muted-foreground">
                  All prompt content in a single file for LLM context
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <Link href="/api/prompts" className="font-mono text-fd-primary hover:underline">
                    /api/prompts
                  </Link>
                </td>
                <td className="py-3 text-fd-muted-foreground">
                  JSON catalog of all prompts with metadata
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <Link href="/api/skills" className="font-mono text-fd-primary hover:underline">
                    /api/skills
                  </Link>
                </td>
                <td className="py-3 text-fd-muted-foreground">
                  JSON catalog of all agent skills
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-20 text-center">
        <p className="text-fd-muted-foreground">
          Open source under MIT.{' '}
          <a
            href="https://github.com/kethalia/promptkit/blob/main/CONTRIBUTING.md"
            className="text-fd-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contributions welcome.
          </a>
        </p>
      </section>
    </main>
  )
}
