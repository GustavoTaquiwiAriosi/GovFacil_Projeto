import { FaCalendarAlt } from "react-icons/fa";
import type { ReactNode } from "react";
import { Button } from "./Button";

type Task = {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    status: string;
    userId: number;
};

type TaskColumnProps = {
    title: string;
    icon: ReactNode;
    headerClass: string;
    tasks: Task[];
    formatDate: (date: string) => string;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    showDoneBadge?: boolean;
};

export function TaskColumn({
    title,
    icon,
    headerClass,
    tasks,
    formatDate,
    onEdit,
    onDelete,
    showDoneBadge = false,
}: TaskColumnProps) {
    return (
        <div className="status-column">
            <div className={`status-header ${headerClass}`}>
                <span>{icon}</span>
                <span>{title}</span>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-card">Sem tarefas</div>
            ) : (
                tasks.map((task) => (
                    <div className="task-card" key={task.id}>
                        {showDoneBadge ? (
                            <div className="task-top">
                                <h3>{task.title}</h3>
                                <span className="done-badge">Concluída</span>
                            </div>
                        ) : (
                            <h3>{task.title}</h3>
                        )}

                        <p>{task.description}</p>

                        <div className="task-date">
                            <FaCalendarAlt /> {formatDate(task.startDate)} - {formatDate(task.endDate)}
                        </div>

                        <div className="task-buttons">
                            <Button variant="edit" onClick={() => onEdit(task)}>
                                Editar
                            </Button>

                            <Button variant="delete" onClick={() => onDelete(task.id)}>
                                Excluir
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}