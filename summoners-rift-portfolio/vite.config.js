import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // aqui indicamos la ruta de nuestro repositorio en github
  base: '/summoner-portfolio/',

  plugins: [react()],
})