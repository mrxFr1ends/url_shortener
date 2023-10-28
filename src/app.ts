import express from "express";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import appRouter from "./routers/shortUrl.router";
const app = express();

app.use(express.json());
app.use(appRouter);
app.use(errorHandlerMiddleware);

export default app;
