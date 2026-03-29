import { useEffect, useMemo, useState } from "react";
import { api } from "./services/api";
import "./App.css";

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
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks({
        status: filterStatus,
        startDate: filterStartDate,
        endDate: filterEndDate,
      });
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      setError("Erro ao deletar tarefa.");
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

        {error && <div className="alert-error">{error}</div>}

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
                <button className="btn btn-primary" type="submit">
                  {editingTaskId ? "✓ Atualizar" : "✓ Criar"}
                </button>

                {editingTaskId && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
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
                <button
                  className="btn btn-filter"
                  type="button"
                  onClick={handleApplyFilters}
                >
                  ⏳ Filtrar
                </button>

                <button
                  className="btn btn-danger-soft"
                  type="button"
                  onClick={handleClearFilters}
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card tasks-section">
          <h2 className="tasks-title">Lista de tarefas</h2>

          <div className="task-columns">
            <div className="status-column">
              <div className="status-header pending">
                <span>▣</span>
                <span>Pendente</span>
              </div>

              {groupedTasks.pendente.length === 0 ? (
                <div className="empty-card">Sem tarefas</div>
              ) : (
                groupedTasks.pendente.map((task) => (
                  <div className="task-card" key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-date">
                      📅 {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </div>
                    <div className="task-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEditTask(task)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="status-column">
              <div className="status-header progress">
                <span>☑</span>
                <span>Em andamento</span>
              </div>

              {groupedTasks.andamento.length === 0 ? (
                <div className="empty-card">Sem tarefas</div>
              ) : (
                groupedTasks.andamento.map((task) => (
                  <div className="task-card" key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-date">
                      📅 {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </div>
                    <div className="task-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEditTask(task)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="status-column">
              <div className="status-header done">
                <span>✔</span>
                <span>Concluída</span>
              </div>

              {groupedTasks.concluida.length === 0 ? (
                <div className="empty-card">Sem tarefas</div>
              ) : (
                groupedTasks.concluida.map((task) => (
                  <div className="task-card" key={task.id}>
                    <div className="task-top">
                      <h3>{task.title}</h3>
                      <span className="done-badge">Concluída</span>
                    </div>
                    <p>{task.description}</p>
                    <div className="task-date">
                      📅 {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </div>
                    <div className="task-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEditTask(task)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;