import React, { useEffect, useState } from "react";

function CreateList({ heading, submitLabel, initialValues, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initialValues?.title || "");
    setAuthor(initialValues?.author || "");
    setError("");
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Both fields are required");
      return;
    }

    try {
      setError("");
      await onSubmit({ title: title.trim(), author: author.trim() });
    } catch (err) {
      setError(err.message || "Unable to save book");
    }
  };

  return (
    <div>
      <h1 className="page-title">{heading}</h1>
      <form className="book-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label form-label-large">
            Book Title
          </label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label form-label-large">
            Author
          </label>
          <input
            id="author"
            type="text"
            className="form-control"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateList;
