import { useEffect, useState } from "react";
import { api } from "./services/api";

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

    if (title.trim().length > 10) {
      setError("O título deve ter no máximo 10 caracteres.");
      return;
    }

    if (description.trim().length > 30) {
      setError("A descrição deve ter no máximo 30 caracteres.");
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

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
        CRUD de Tarefas
      </h1>

      {error && (
        <div
          style={{
            backgroundColor: "#ffe5e5",
            color: "#b00020",
            border: "1px solid #ffb3b3",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {editingTaskId ? "Editar tarefa" : "Criar tarefa"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div>
            <input
              maxLength={10}
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <small>{title.length}/10</small>
          </div>

          <div>
            <input
              maxLength={30}
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <small>{description.length}/30</small>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            >
              <option value="Pendente">Pendente</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {editingTaskId ? "Atualizar" : "Criar"}
            </button>

            {editingTaskId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "10px 16px",
                  marginLeft: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Filtros</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          >
            <option value="">Todos os status</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
          </select>

          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />

          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleApplyFilters}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>

        <button
          type="button"
          onClick={handleClearFilters}
          style={{
            padding: "10px 16px",
            marginLeft: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Limpar filtros
        </button>
      </div>

      <h2>Lista de tarefas</h2>

      {tasks.length === 0 && <p>Nenhuma tarefa encontrada.</p>}

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{task.title}</h3>
          <p>
            <strong>Descrição:</strong> {task.description}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Usuário:</strong> {task.userId}
          </p>
          <p>
            <strong>Início:</strong> {task.startDate}
          </p>
          <p>
            <strong>Fim:</strong> {task.endDate}
          </p>

          <button
            onClick={() => handleEditTask(task)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Editar
          </button>

          <button
            onClick={() => handleDeleteTask(task.id)}
            style={{
              padding: "8px 12px",
              marginLeft: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;