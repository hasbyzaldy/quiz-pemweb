import React, { useState } from "react";
import { Eye, Trash2, Plus, ArrowLeft, Pencil, CalendarDays } from "lucide-react";
import "./index.css";

const initialTodos = [
  {
    id: 1,
    title: "Mengerjakan Proyek Computer Vision",
    description: "Menyelesaikan proyek akhir computer vision tentang deteksi penggunaan helm.",
    status: "in progress",
    priority: "high",
    deadline: "2026-11-21"
  },
  {
    id: 2,
    title: "Mempelajari Dasar Database",
    description: "Mempelajari dasar SQL, relasi tabel, dan normalisasi database.",
    status: "in progress",
    priority: "low",
    deadline: "2026-11-25"
  },
  {
    id: 3,
    title: "Membuat Website Portfolio",
    description: "Membuat halaman portfolio sederhana menggunakan React.js.",
    status: "in progress",
    priority: "medium",
    deadline: "2026-11-20"
  },
  {
    id: 4,
    title: "Mempelajari React Hooks",
    description: "Mempelajari penggunaan useState dan useEffect pada React.",
    status: "todo",
    priority: "low",
    deadline: "2026-11-19"
  }
];

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "low",
  deadline: ""
};

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [page, setPage] = useState("list");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [modal, setModal] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");

  const showNotice = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const statusLabel = (status) => {
    if (status === "todo") return "To do";
    if (status === "in progress") return "In progress";
    return "Done";
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setModal("add");
  };

  const openDetail = (todo) => {
    setSelectedTodo(todo);
    setPage("detail");
  };

  const openEditModal = () => {
    setForm({
      title: selectedTodo.title,
      description: selectedTodo.description,
      status: selectedTodo.status,
      priority: selectedTodo.priority,
      deadline: selectedTodo.deadline
    });
    setModal("edit");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    if (modal === "edit") {
      const updatedTodo = {
        ...selectedTodo,
        ...form,
        title: form.title.trim()
      };

      setTodos((current) =>
        current.map((todo) =>
          todo.id === selectedTodo.id ? updatedTodo : todo
        )
      );
      setSelectedTodo(updatedTodo);
      setModal("");
      showNotice("Tugas berhasil diperbarui.");
    } else {
      const newTodo = {
        id: Date.now(),
        ...form,
        title: form.title.trim()
      };

      setTodos((current) => [...current, newTodo]);
      setModal("");
      showNotice("Tugas berhasil ditambahkan.");
    }
  };

  const handleDelete = (id) => {
    const todo = todos.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus "${todo?.title}"?`
    );

    if (!confirmed) return;

    setTodos((current) => current.filter((item) => item.id !== id));

    if (page === "detail") {
      setPage("list");
      setSelectedTodo(null);
    }

    showNotice("Tugas berhasil dihapus.");
  };

  return (
    <div className="app">
      <main className="main-container">
        {page === "list" ? (
          <>
            <section className="page-heading">
              <div>
                <p className="eyebrow">KEGIATAN SAYA</p>
                <h1>To-Do List</h1>
                <p className="heading-description">
                  Catat dan kelola tugas yang perlu diselesaikan.
                </p>
              </div>

              <button className="add-button" onClick={openAddModal}>
                <Plus size={16} />
                Tambah Todo
              </button>
            </section>

            <section className="todo-panel">
              <div className="panel-heading">
                <div>
                  <h2>Daftar Tugas</h2>
                  <p>Berikut tugas yang sudah kamu catat.</p>
                </div>
                <span className="total-label">{todos.length} tugas</span>
              </div>

              <div className="table-scroll">
                <table className="todo-table">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Status</th>
                      <th>Prioritas</th>
                      <th>Deadline</th>
                      <th className="action-heading">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.map((todo) => (
                      <tr key={todo.id}>
                        <td className="title-column">
                          <strong>{todo.title}</strong>
                          <span>{todo.description}</span>
                        </td>
                        <td>
                          <span className={`status ${todo.status.replace(" ", "-")}`}>
                            {statusLabel(todo.status)}
                          </span>
                        </td>
                        <td>
                          <span className={`priority ${todo.priority}`}>
                            {todo.priority}
                          </span>
                        </td>
                        <td className="deadline">
                          <CalendarDays size={14} />
                          {formatDate(todo.deadline)}
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="icon-button detail-action"
                              title="Lihat detail"
                              onClick={() => openDetail(todo)}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="icon-button delete-action"
                              title="Hapus tugas"
                              onClick={() => handleDelete(todo.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {todos.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          Belum ada tugas. Tekan tombol Tambah Todo untuk membuat tugas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <section className="detail-page">
            <button className="back-button" onClick={() => setPage("list")}>
              <ArrowLeft size={15} />
              Kembali ke daftar
            </button>

            <div className="detail-card">
              <div className="detail-card-heading">
                <div>
                  <p className="eyebrow">RINCIAN KEGIATAN</p>
                  <h1>Detail Todo</h1>
                </div>
                <span className="task-id">ID: {selectedTodo.id}</span>
              </div>

              <div className="detail-grid">
                <div className="detail-main">
                  <div className="detail-item">
                    <label>Judul</label>
                    <h2>{selectedTodo.title}</h2>
                  </div>
                  <div className="detail-item">
                    <label>Deskripsi</label>
                    <p>{selectedTodo.description || "Tidak ada deskripsi."}</p>
                  </div>
                </div>

                <div className="detail-info">
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={`status ${selectedTodo.status.replace(" ", "-")}`}>
                      {statusLabel(selectedTodo.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Prioritas</label>
                    <span className={`priority ${selectedTodo.priority}`}>
                      {selectedTodo.priority}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Deadline</label>
                    <p>{formatDate(selectedTodo.deadline)}</p>
                  </div>
                </div>
              </div>

              <div className="detail-footer">
                <button className="update-button" onClick={openEditModal}>
                  <Pencil size={14} />
                  Update Todo
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {modal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal("");
          }}
        >
          <div className="todo-modal">
            <div className="modal-heading">
              <div>
                <p className="eyebrow">{modal === "add" ? "TUGAS BARU" : "EDIT KEGIATAN"}</p>
                <h2>{modal === "add" ? "Tambah Todo" : "Update Todo"}</h2>
              </div>
              <button className="close-button" onClick={() => setModal("")}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Judul</label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Masukkan judul tugas"
                required
              />

              <label>Deskripsi</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Masukkan deskripsi tugas"
              />

              <div className="form-row">
                <div>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option value="todo">To do</option>
                    <option value="in progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label>Prioritas</label>
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <label>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(event) =>
                  setForm({ ...form, deadline: event.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setModal("")}
                >
                  Batal
                </button>
                <button type="submit" className="save-button">
                  {modal === "add" ? "Tambah" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && <div className="notice">{notice}</div>}
    </div>
  );
}

export default App;
