import "dotenv/config";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import logger from "./middleware/logger.middleware.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(logger);
app.use("/", healthRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});