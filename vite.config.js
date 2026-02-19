import { defineConfig } from 'vite'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isUserPageRepo = repository.endsWith('.github.io')
const base = process.env.GITHUB_ACTIONS
  ? isUserPageRepo
    ? '/'
    : `/${repository}/`
  : '/'

export default defineConfig({
  base,
})