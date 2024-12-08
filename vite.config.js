export default {
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'terser'
  },
  server: {
    port: 3000,
    open: true
  },
  base: '/'
}
