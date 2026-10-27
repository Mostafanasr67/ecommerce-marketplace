import "dotenv/config";
import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

import errorHandler from "./middleware/error.middleware.js";
import logger from "./middleware/logger.middleware.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(logger);
app.use("/", healthRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

