import React from "react";

function DeleteList({ item, onDelete }) {
  const handleDelete = () => {
    const shouldDelete = window.confirm(`Delete "${item.title}" by ${item.author}?`);
    if (shouldDelete) {
      onDelete(item.id);
    }
  };

  return (
    <button type="button" className="btn btn-sm btn-warning delete-btn" onClick={handleDelete}>
      Delete
    </button>
  );
}

export default DeleteList;
