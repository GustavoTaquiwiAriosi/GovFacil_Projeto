import app from "./app";
import { AppDataSource } from "./database/data-source";

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado com sucesso!");

        app.listen(3000, () => {
            console.log("Servidor rodando");
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar no banco:", error);
    });