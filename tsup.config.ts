import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [ 'src/index.ts' ],
  format: [ 'esm', 'cjs' ],
  dts: true,
  clean: true,
  outExtension: ({ format }) =>
    format === 'esm' ? { js: '.mjs' } : { js: '.cjs' },
})
