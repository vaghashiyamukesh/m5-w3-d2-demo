import React from "react";

function UpdateList({ item, onUpdate }) {

  return (
    <button type="button" className="btn btn-sm btn-info edit-btn" onClick={() => onUpdate(item)}>
      Edit
    </button>
  );
}

export default UpdateList;
