import express from "express";

// import { connect } from "./schemas/index.js";
import productsRouter from "./routes/products.router.js";

const app = express();
// connect();
const port = 4000;
app.use(express.json());

app.use("/api", productsRouter);

app.listen(port, () => {
  console.log(`listening on port${port}!!!`);
});
