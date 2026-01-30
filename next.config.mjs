import nextra from 'nextra'

const withNextra = nextra({
  // Pagefind search enabled by default
  // Code block indexing enabled by default
})

export default withNextra({
  output: 'standalone',
})
