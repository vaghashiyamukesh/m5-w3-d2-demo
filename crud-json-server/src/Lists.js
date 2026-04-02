import React from "react";
import UpdateList from "./UpdateList";
import DeleteList from "./DeleteList";

function Lists(props) {
    let listrows = [];
    props.alldata.forEach((element) => {
        listrows.push(
            <tr key={element.id}>
                <td>{element.title}</td>
                <td>{element.author}</td>
                <td>
                    <div className="action-row">
                        <UpdateList item={element} onUpdate={props.onUpdate} />
                        <DeleteList item={element} onDelete={props.onDelete} />
                    </div>
                </td>
            </tr>
        );
    });

    if (props.alldata.length === 0) {
        listrows.push(
            <tr key="empty">
                <td colSpan="3" className="empty-row">
                    No books found.
                </td>
            </tr>
        );
    }

    return (
        <table className="table table-striped table-book-list">
            <thead>
                <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {listrows}
            </tbody>
        </table>
    )
}

export default Lists;