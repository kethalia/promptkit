---
title: "App Router Migration"
---
# App Router Migration

Guide to migrating from Next.js Pages Router to App Router.

## Migration Overview

### Key Differences

| Aspect | Pages Router | App Router |
|--------|--------------|------------|
| Directory | `pages/` | `app/` |
| Routing | `pages/about.js` → `/about` | `app/about/page.tsx` → `/about` |
| Layouts | `_app.js`, `_document.js` | `layout.tsx` (nested) |
| Data Fetching | `getServerSideProps`, `getStaticProps` | `async` Server Components |
| Loading | Manual | `loading.tsx` |
| Error | `_error.js` | `error.tsx` |
| Not Found | `404.js` | `not-found.tsx` |
| Metadata | `<Head>` | `metadata` export |
| Default | Client Components | Server Components |

### Migration Strategy

```
1. Enable App Router (coexists with Pages)
2. Migrate layouts first
3. Migrate pages incrementally
4. Update data fetching
5. Remove Pages Router files
```

## File Structure Migration

### Before (Pages Router)

```
pages/
├── _app.tsx
├── _document.tsx
├── index.tsx
├── about.tsx
├── blog/
│   ├── index.tsx
│   └── [slug].tsx
└── api/
    └── users.ts
```

### After (App Router)

```
app/
├── layout.tsx          # Root layout (replaces _app + _document)
├── page.tsx            # Home page
├── about/
│   └── page.tsx
├── blog/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── api/
    └── users/
        └── route.ts
```

## Layout Migration

### Before: _app.tsx + _document.tsx

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/theme';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### After: layout.tsx

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/contexts/theme';
import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'My app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Layout>
            {children}
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Page Migration

### Before: Page with getServerSideProps

```tsx
// pages/users/[id].tsx
import { GetServerSideProps } from 'next';

interface Props {
  user: User;
}

export default function UserPage({ user }: Props) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const res = await fetch(`https://api.example.com/users/${params?.id}`);
  const user = await res.json();

  if (!user) {
    return { notFound: true };
  }

  return { props: { user } };
};
```

### After: Server Component

```tsx
// app/users/[id]/page.tsx
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function UserPage({ params }: Props) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Before: Page with getStaticProps + getStaticPaths

```tsx
// pages/blog/[slug].tsx
export default function BlogPost({ post }: Props) {
  return <article>{post.content}</article>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPost(params?.slug as string);
  return { props: { post }, revalidate: 60 };
};
```

### After: Static Generation

```tsx
// app/blog/[slug]/page.tsx

// Generate static params
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Revalidation
export const revalidate = 60;

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
```

## Data Fetching Migration

### Client-side Fetching (useEffect → unchanged or use hooks)

```tsx
// Can still use client-side fetching
'use client';

import useSWR from 'swr';

export default function Dashboard() {
  const { data, error } = useSWR('/api/stats', fetcher);
  
  if (error) return <div>Error</div>;
  if (!data) return <div>Loading...</div>;
  
  return <Stats data={data} />;
}
```

### Server Actions (New in App Router)

```tsx
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.posts.create({ title });
  revalidatePath('/posts');
}

// app/posts/new/page.tsx
import { createPost } from '../actions';

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Metadata Migration

### Before: Head component

```tsx
// pages/about.tsx
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn about us" />
        <meta property="og:title" content="About Us" />
      </Head>
      <main>About content</main>
    </>
  );
}
```

### After: Metadata export

```tsx
// app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about us',
  openGraph: {
    title: 'About Us',
  },
};

export default function About() {
  return <main>About content</main>;
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
  };
}
```

## API Routes Migration

### Before: API Route

```tsx
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const users = await getUsers();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### After: Route Handler

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await createUser(body);
  return NextResponse.json(user, { status: 201 });
}
```

## Loading & Error States

### Loading

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
```

### Error

```tsx
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Not Found

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find the requested resource</p>
    </div>
  );
}
```

## Migration Checklist

```markdown
### Preparation
- [ ] Update Next.js to 13.4+ (or 14+)
- [ ] Review breaking changes in release notes
- [ ] Plan incremental migration

### Layout Migration
- [ ] Create app/layout.tsx from _app + _document
- [ ] Move global styles import
- [ ] Move providers to layout
- [ ] Update metadata

### Page Migration
- [ ] Create page.tsx files
- [ ] Convert getServerSideProps to async components
- [ ] Convert getStaticProps to async + generateStaticParams
- [ ] Update imports (next/navigation vs next/router)

### Feature Migration
- [ ] Add loading.tsx files
- [ ] Add error.tsx files
- [ ] Update API routes to route handlers
- [ ] Convert to Server Actions where appropriate

### Cleanup
- [ ] Remove pages/ directory
- [ ] Remove unused dependencies
- [ ] Update documentation
```

## Common Gotchas

| Issue | Solution |
|-------|----------|
| `useRouter` import | Use `next/navigation` not `next/router` |
| `router.query` | Use `useSearchParams()` or `params` prop |
| `router.push` | Still works, or use `redirect()` server-side |
| Client hooks in Server Component | Add `'use client'` directive |
| Cookies/headers | Use `cookies()` and `headers()` from `next/headers` |
