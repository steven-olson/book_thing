import { defineConfig } from "orval";

export default defineConfig({
  backend: {
    input: {
      target: process.env.ORVAL_API_URL || "http://localhost:8000/openapi.json",
    },
    output: {
      mode: "tags-split",
      target: "./src/api/endpoints",
      schemas: "./src/api/models",
      client: "swr",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/api/custom-fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
