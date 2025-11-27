import dotenv from "dotenv";
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { rateLimit } from "express-rate-limit";

const app = express();

import cors from "cors";

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 60 * 1000, // Intervalo: 1 minuto
  limit: 20, // Máximo de 20 requisições
});
/**
 * API4:2023 - Consumo irrestrito de recursos
 * Está vulnerabilidade foi evitada no código realizando uma verificação da quantidade de requisições por minuto, com o limite de 20.
 * Utilizamos a bibliotece express-rate-limiter. Também podemos fazer a verificação por IP que esté enviando as requisições.
 *
 */
app.use(limiter);

/*********** ROTAS DA API **************/

import carsRouter from "./routes/cars.js";
app.use("/cars", carsRouter);

import customersRouter from "./routes/customers.js";
app.use("/customers", customersRouter);

import usersRouter from "./routes/users.js";
app.use("/users", usersRouter);

/**
  API2:2023 - Falha na autenticação
  Este middleware intercepta todas as rotas e verifica
  se um token de autorização foi enviado junto com a
  requisição. Impedindo que alguem não logado ou permitido acesse partes API que não podia. Também tem o cokkie como not-http, fazendo com que fique salvo no backend.
  Não sendo possível acessar pelo client.
*/
import auth from "./middleware/auth.js";
app.use(auth);

export default app;
