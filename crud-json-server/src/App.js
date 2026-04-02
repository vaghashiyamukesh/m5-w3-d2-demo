import React, { useEffect, useMemo, useState } from "react";
import Lists from "./Lists";
import CreateList from "./CreateList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("list");
  const [editingBook, setEditingBook] = useState(null);

  const isFormView = useMemo(() => view === "create" || view === "edit", [view]);

  const getLists = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Unable to fetch books");
      }

      const result = await response.json();
      setBooks(result);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLists();
  }, []);

  const createList = async (data) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Unable to create book");
    }

    await getLists();
    setView("list");
  };

  const updateList = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Unable to update book");
    }

    await getLists();
    setEditingBook(null);
    setView("list");
  };

  const deleteList = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete book");
    }

    await getLists();
  };

  const handleCreate = async (payload) => {
    try {
      setError("");
      await createList(payload);
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingBook) {
      return;
    }

    try {
      setError("");
      await updateList(editingBook.id, payload);
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteList(id);
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };

  return (
    <main className="page-shell">
      <section className="book-card">
        {isFormView ? (
          <CreateList
            heading={view === "edit" ? "Update Book" : "Add Book"}
            submitLabel={view === "edit" ? "Save" : "Save"}
            initialValues={editingBook || { title: "", author: "" }}
            onSubmit={view === "edit" ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditingBook(null);
              setView("list");
            }}
          />
        ) : (
          <>
            <button className="btn btn-primary add-book-btn" onClick={() => setView("create")}>
              Add Book
            </button>
            <h1 className="page-title">Book List</h1>
            {loading ? <p className="status-text">Loading books...</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
            {!loading ? (
              <Lists
                alldata={books}
                onUpdate={(book) => {
                  setEditingBook(book);
                  setView("edit");
                }}
                onDelete={handleDelete}
              />
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}

export default App;