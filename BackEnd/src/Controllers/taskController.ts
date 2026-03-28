import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Task } from "../entities/Task";

const taskRepository = AppDataSource.getRepository(Task);

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// CRIAR tarefa
export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, startDate, endDate, status } = req.body;

        if (!title || !description || !startDate || !endDate) {
            return res.status(400).json({
                message: "Todos os campos são obrigatórios",
            });
        }

        if (title.trim().length > 50) {
            return res.status(400).json({
                message: "O título deve ter no máximo 50 caracteres",
            });
        }

        if (description.trim().length > 100) {
            return res.status(400).json({
                message: "A descrição deve ter no máximo 100 caracteres",
            });
        }

        const today = getTodayDateString();

        if (startDate < today) {
            return res.status(400).json({
                message: "A data de início não pode ser menor que a data de hoje",
            });
        }

        if (endDate < today) {
            return res.status(400).json({
                message: "A data de fim não pode ser menor que a data de hoje",
            });
        }

        if (endDate < startDate) {
            return res.status(400).json({
                message: "A data de fim não pode ser menor que a data de início",
            });
        }

        const newTask = taskRepository.create({
            title: title.trim(),
            description: description.trim(),
            startDate,
            endDate,
            status: status || "Pendente",
            userId: 1,
        });

        await taskRepository.save(newTask);

        return res.status(201).json(newTask);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao criar tarefa",
        });
    }
};

// LISTAR tarefas
export const getTasks = async (req: Request, res: Response) => {
    try {
        const { status, startDate, endDate } = req.query;

        let query = taskRepository.createQueryBuilder("task");

        if (status) {
            query = query.andWhere("task.status = :status", {
                status,
            });
        }

        if (startDate && endDate) {
            query = query.andWhere(
                "task.startDate >= :startDate AND task.endDate <= :endDate",
                {
                    startDate,
                    endDate,
                }
            );
        }

        const tasks = await query.getMany();

        return res.json(tasks);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar tarefas",
        });
    }
};

// ATUALIZAR tarefa
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, startDate, endDate, status } = req.body;

        const task = await taskRepository.findOneBy({ id: Number(id) });

        if (!task) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        if (!title || !description || !startDate || !endDate) {
            return res.status(400).json({
                message: "Todos os campos são obrigatórios",
            });
        }

        if (title.trim().length > 50) {
            return res.status(400).json({
                message: "O título deve ter no máximo 50 caracteres",
            });
        }

        if (description.trim().length > 100) {
            return res.status(400).json({
                message: "A descrição deve ter no máximo 100 caracteres",
            });
        }

        const today = getTodayDateString();

        if (startDate < today) {
            return res.status(400).json({
                message: "A data de início não pode ser menor que a data de hoje",
            });
        }

        if (endDate < today) {
            return res.status(400).json({
                message: "A data de fim não pode ser menor que a data de hoje",
            });
        }

        if (endDate < startDate) {
            return res.status(400).json({
                message: "A data de fim não pode ser menor que a data de início",
            });
        }

        task.title = title.trim();
        task.description = description.trim();
        task.startDate = startDate;
        task.endDate = endDate;
        task.status = status ?? task.status;

        await taskRepository.save(task);

        return res.json(task);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar tarefa",
        });
    }
};

// DELETAR tarefa
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const task = await taskRepository.findOneBy({ id: Number(id) });

        if (!task) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        await taskRepository.remove(task);

        return res.json({ message: "Deletado com sucesso" });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao deletar tarefa",
        });
    }
};