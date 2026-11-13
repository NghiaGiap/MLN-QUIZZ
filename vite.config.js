import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "questions", test: /src\/data\/questions\.json/ },
            { name: "vendor", test: /node_modules/ },
          ],
        },
      },
    },
  },
});
