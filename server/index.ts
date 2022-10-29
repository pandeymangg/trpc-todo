import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./appRouter";

const app = express();
const port = 8080;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
