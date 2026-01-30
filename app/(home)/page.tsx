import Link from 'next/link'

const categories = [
  { name: 'Review', href: '/docs/review', description: 'Code review, PR review, change analysis', count: 3 },
  { name: 'Debug', href: '/docs/debug', description: 'Error diagnosis, bug tracing, stack trace analysis', count: 3 },
  { name: 'Refactor', href: '/docs/refactor', description: 'Code quality improvements, extraction, modernization', count: 4 },
  { name: 'Testing', href: '/docs/testing', description: 'Unit tests, test coverage, test case generation', count: 4 },
  { name: 'Documentation', href: '/docs/documentation', description: 'README generation, function docs, API docs', count: 5 },
  { name: 'Architecture', href: '/docs/architecture', description: 'Design review, patterns, tradeoff analysis', count: 3 },
  { name: 'Security', href: '/docs/security', description: 'Security audits, vulnerability checks, dependency audits', count: 3 },
  { name: 'Planning', href: '/docs/planning', description: 'Project bootstrap documentation, GitHub issue creation', count: 2 },
]

const languages = [
  { name: 'TypeScript', href: '/docs/language-specific/typescript', description: 'Type safety, migration, fixing type errors', count: 3 },
  { name: 'React & Next.js', href: '/docs/language-specific/react-nextjs', description: 'Component review, performance, hooks, App Router migration', count: 6 },
  { name: 'Go', href: '/docs/language-specific/go', description: 'Idioms, concurrency, error handling', count: 3 },
  { name: 'Rust', href: '/docs/language-specific/rust', description: 'Ownership, unsafe code, Cargo best practices', count: 3 },
  { name: 'Solidity', href: '/docs/language-specific/solidity', description: 'Smart contract audits, gas optimization, Foundry & Hardhat testing', count: 5 },
]

function CategoryCard({ name, href, description, count }: { name: string; href: string; description: string; count: number }) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border p-5 no-underline transition-colors hover:bg-fd-accent"
    >
      <h3 className="text-lg font-semibold group-hover:text-fd-primary">{name}</h3>
      <p className="mt-1 text-sm text-fd-muted-foreground">{description}</p>
      <span className="mt-3 inline-block text-xs text-fd-muted-foreground">{count} prompts</span>
    </Link>
  )
}

export default function HomePage() {
  return (
    <main className="container max-w-6xl py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">AI Prompts for Coding</h1>
        <p className="text-fd-muted-foreground">
          A curated collection of reusable prompts for AI coding assistants, optimized for{' '}
          <a href="https://opencode.ai" className="underline">opencode</a> and Claude.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/docs"
            className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Browse Prompts
          </Link>
          <Link
            href="/api/prompts"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            API Catalog
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">General Purpose</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Language Specific</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((l) => (
            <CategoryCard key={l.name} {...l} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">AI / LLM Access</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left font-medium">Endpoint</th>
                <th className="py-2 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2"><a href="/llms.txt" className="text-fd-primary underline">/llms.txt</a></td>
                <td className="py-2">Site overview following the llms.txt spec</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><a href="/llms-full.txt" className="text-fd-primary underline">/llms-full.txt</a></td>
                <td className="py-2">All prompt content in a single file for LLM context</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><a href="/api/prompts" className="text-fd-primary underline">/api/prompts</a></td>
                <td className="py-2">JSON catalog of all prompts with metadata</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><a href="/api/skills" className="text-fd-primary underline">/api/skills</a></td>
                <td className="py-2">JSON catalog of all skills with metadata</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
