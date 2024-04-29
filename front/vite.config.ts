import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "configure-response-headers", // 플러그인 이름 지정
      configureServer: (server) => {
        // vite 서버가 시작될 때 호출
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // COEP 활성화
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin"); // COOP 활성화
          next();
        });
      },
    },
  ],
  server: {
    port: 3000,
  },
});
