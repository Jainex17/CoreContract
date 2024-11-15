import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';

import setupRoutes from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({origin: true}));

setupRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
