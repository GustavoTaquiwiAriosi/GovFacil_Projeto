import { useEffect, useMemo, useState } from "react";
import { FaFilter, } from "react-icons/fa";
import { FaFilterCircleXmark, FaClock } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FiLoader } from "react-icons/fi";
import { api } from "./services/api";
import "./App.css";
import { TaskColumn } from "./components/TaskColumn";
import { Button } from "./components/Button";
import Swal from "sweetalert2";

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

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Pendente");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  async function fetchTasks(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const params: Record<string, string> = {};

      if (filters?.status) params.status = filters.status;
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;

      const response = await api.get("/tasks", { params });
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setError("Erro ao buscar tarefas.");
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setStatus("Pendente");
    setEditingTaskId(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !startDate || !endDate) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (title.trim().length > 50) {
      setError("O título deve ter no máximo 50 caracteres.");
      return;
    }

    if (description.trim().length > 100) {
      setError("A descrição deve ter no máximo 100 caracteres.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (startDate < today) {
      setError("A data de início não pode ser menor que a data de hoje.");
      return;
    }

    if (endDate < today) {
      setError("A data de fim não pode ser menor que a data de hoje.");
      return;
    }

    if (endDate < startDate) {
      setError("A data de fim não pode ser menor que a data de início.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
      status,
    };

    try {
      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      resetForm();
      fetchTasks({
        status: filterStatus,
        startDate: filterStartDate,
        endDate: filterEndDate,
      });
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      setError("Erro ao salvar tarefa.");
    }
  }

  function handleEditTask(task: Task) {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStartDate(task.startDate);
    setEndDate(task.endDate);
    setStatus(task.status);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteTask(id: number) {
    const result = await Swal.fire({
      title: "Confirmar exclusão?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      draggable: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/tasks/${id}`);

        await Swal.fire({
          title: "Excluído!",
          text: "A tarefa foi removida com sucesso.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchTasks({
          status: filterStatus,
          startDate: filterStartDate,
          endDate: filterEndDate,
        });
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);

        Swal.fire({
          title: "Erro",
          text: "Não foi possível excluir a tarefa.",
          icon: "error",
        });
      }
    }
  }

  function handleApplyFilters() {
    fetchTasks({
      status: filterStatus,
      startDate: filterStartDate,
      endDate: filterEndDate,
    });
  }

  function handleClearFilters() {
    setFilterStatus("");
    setFilterStartDate("");
    setFilterEndDate("");
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupedTasks = useMemo(() => {
    return {
      pendente: tasks.filter((task) => task.status === "Pendente"),
      andamento: tasks.filter((task) => task.status === "Em andamento"),
      concluida: tasks.filter((task) => task.status === "Concluída"),
    };
  }, [tasks]);

  function formatDate(date: string) {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="page">
      <div className="overlay" />

      <main className="container">
        <header className="hero">
          <h1>CRUD de Tarefas</h1>
          <p>Gerencie suas tarefas facilmente</p>
        </header>

        {error && (
          <div className="alert-error">
            <span>{error}</span>

            <button
              className="alert-close"
              onClick={() => setError("")}
            >
              <IoIosClose size={28} />
            </button>
          </div>
        )}

        <section className="top-grid">
          <div className="glass-card">
            <h2>{editingTaskId ? "Editar tarefa" : "Criar tarefa"}</h2>

            <form className="task-form" onSubmit={handleSubmit}>
              <div className="field">
                <div className="input-with-counter">
                  <input
                    maxLength={50}
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <span>{title.length}/50</span>
                </div>
              </div>

              <div className="field">
                <div className="textarea-with-counter">
                  <textarea
                    maxLength={100}
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                  <span>{description.length}/100</span>
                </div>
              </div>

              <div className="field-label">Data início</div>

              <div className="row two-columns">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="field">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>

              <div className="actions">
                <Button type="submit" variant="primary">
                  {editingTaskId ? (
                    <>
                      <VscVerifiedFilled /> Atualizar
                    </>
                  ) : (
                    <>
                      <VscVerifiedFilled /> Criar
                    </>
                  )}
                </Button>

                {editingTaskId && (
                  <Button variant="secondary" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="glass-card">
            <h2>Filtros</h2>

            <div className="task-form">
              <div className="field">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>

              <div className="field-label">Data de início</div>
              <div className="row two-columns">
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </div>

              <div className="field-label">Data de fim</div>

              <div className="actions">
                <Button variant="filter" onClick={handleApplyFilters}>
                  <FaFilter /> Filtrar
                </Button>

                <Button variant="danger-soft" onClick={handleClearFilters}>
                  <FaFilterCircleXmark /> Limpar filtros
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card tasks-section">
          <h2 className="tasks-title">Lista de tarefas</h2>

          <div className="task-columns">
            <TaskColumn
              title="Pendente"
              icon={<FaClock />}
              headerClass="pending"
              tasks={groupedTasks.pendente}
              formatDate={formatDate}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />

            <TaskColumn
              title="Em andamento"
              icon={<FiLoader />}
              headerClass="progress"
              tasks={groupedTasks.andamento}
              formatDate={formatDate}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />

            <TaskColumn
              title="Concluída"
              icon={<VscVerifiedFilled />}
              headerClass="done"
              tasks={groupedTasks.concluida}
              formatDate={formatDate}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              showDoneBadge
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;