import express from "express";
import cors from "cors";
import taskRoutes from "./Routes/taskRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ message: "API funcionando" });
});

app.use("/tasks", taskRoutes);

export default app;