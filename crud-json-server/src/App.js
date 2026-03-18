import React from "react";
import Lists from "./Lists";
import CreateList from "./CreateList";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        alldata: [],
        singledata: {
          title: "",
          author: ""
        }
      };
    }

    getLists = () => { 
      this.setState({ loading: true });
      fetch("http://localhost:5000/posts")
        .then(response => response.json())
        .then(result => {
          this.setState({ alldata: result, loading: false });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
        });
    }

    createList = (data) => {
      fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          console.log("List created:", result);
          this.getLists();
        })
        .catch(err => console.log(err));
    }

    updateList = (id, data) => {
      fetch(`http://localhost:5000/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          console.log("List updated:", result);
          this.getLists();
        })
        .catch(err => console.log(err));
    }

    deleteList = (id) => {
      fetch(`http://localhost:5000/posts/${id}`, {
        method: "DELETE"
      })
        .then(response => response.json())
        .then(result => {
          console.log("List deleted:", result);
          this.getLists();
        })
        .catch(err => console.log(err));
    }

    render() {
      const listTable = this.state.loading ? (
        <span>Loading...</span>
      ) : (
        <Lists 
          alldata={this.state.alldata}
          onUpdate={this.updateList}
          onDelete={this.deleteList}
        />
      );
      return (
        <div className="container mt-4">
            <div className="mb-3">
              <button 
                className="btn btn-primary me-2" 
                onClick={this.getLists}>
                  Get Lists
              </button>
              <CreateList onAdd={this.createList} />
            </div>
            {listTable}
        </div>
      )
    }
  }

export default App;