import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { ClipLoader } from "react-spinners";
const qs = require("qs");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      customers: [],
      index: undefined,
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      id: ""
    };
  }

  componentDidMount() {
    var self = this;

    axios
      .get("https://localhost:44354/api/Customer")
      .then(function(response) {
        if (response.data.success) {
          self.setState({ customers: response.data.data });
          ToastsStore.success(response.data.message);
        } else {
          ToastsStore.success(response.data.message);
        }

        self.setState({ loading: false });
      })
      .catch(function(error) {
        self.setState({ loading: false });
        ToastsStore.error("Something went wrong!");
        console.log(error);
      });
  }

  handleCreateCustomer = event => {
    this.setState({
      dialogTitle: "Create Customer",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      id: ""
    });
    window.$("#createModalId").modal("show");
  };

  createCustomer = event => {
    window.$("#createModalId").modal("hide");
    event.preventDefault();

    var url = "https://localhost:44354/api/customer";
    var self = this;
    var payload = {
      FirstName: this.state.firstName,
      LastName: this.state.lastName,
      Email: this.state.email,
      PhoneNumber: this.state.phoneNumber
    };

    self.setState({ loading: true });

    axios
      .post(url, qs.stringify(payload))
      .then(function(response) {
        if (response.data.success) {
          self.state.customers.push(response.data.customer);

          self.setState({
            customers: self.state.customers,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phoneNumber: undefined,
            loading: false
          });

          ToastsStore.success(response.data.message);
        } else {
          self.setState({
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phoneNumber: undefined,
            loading: false
          });

          ToastsStore.error(response.data.message);
        }
      })
      .catch(function(error) {
        self.setState({
          firstName: undefined,
          lastName: undefined,
          email: undefined,
          phoneNumber: undefined,
          loading: false
        });
        ToastsStore.error("Something went wrong!");
      });
  };

  handleUpdateCustomer = (event, index) => {
    var customer = this.state.customers[index];
    this.setState({
      dialogTitle: "Update Customer",
      index: index,
      firstName: customer.FirstName,
      lastName: customer.LastName,
      email: customer.Email,
      phoneNumber: customer.PhoneNumber,
      id: customer.Id
    });
    window.$("#createModalId").modal("show");
  };

  updateCustomer = event => {
    window.$("#createModalId").modal("hide");
    event.preventDefault();

    var url = "https://localhost:44354/api/customer";
    var self = this;
    var payload = {
      FirstName: this.state.firstName,
      LastName: this.state.lastName,
      Email: this.state.email,
      PhoneNumber: this.state.phoneNumber,
      Id: this.state.id
    };

    self.setState({ loading: true });

    axios
      .post(url, qs.stringify(payload))
      .then(function(response) {
        if (response.data.success) {
          self.state.customers[self.state.index] = response.data.customer;

          self.setState({
            customers: self.state.customers,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phoneNumber: undefined,
            id: undefined,
            loading: false
          });

          ToastsStore.success(response.data.message);
        } else {
          self.setState({
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phoneNumber: undefined,
            id: undefined,
            loading: false
          });

          ToastsStore.error(response.data.message);
        }
      })
      .catch(function(error) {
        self.setState({
          firstName: undefined,
          lastName: undefined,
          email: undefined,
          phoneNumber: undefined,
          id: undefined,
          loading: false
        });
        ToastsStore.error("Something went wrong!");
      });
  };

  handleDelete = (event, index) => {
    this.setState({ index: index });
    window.$("#deleteModalId").modal("show");
  };

  deleteCustomer = event => {
    window.$("#deleteModalId").modal("hide");

    var self = this;
    var customer = this.state.customers[this.state.index];
    var url = "https://localhost:44354/api/Customer/" + customer.Id;
    self.setState({ loading: true });

    axios
      .get(url)
      .then(function(response) {
        if (response.data.success) {
          self.state.customers.splice(self.state.index, 1);
          self.setState({ customers: self.state.customers, index: undefined });

          ToastsStore.success(response.data.message);
        } else {
          self.setState({ index: undefined });
          ToastsStore.error(response.data.message);
        }

        self.setState({ loading: false });
      })
      .catch(function(error) {
        self.setState({
          index: undefined,
          loading: false
        });
        console.log(error);
        ToastsStore.error("Something went wrong!");
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <ToastsContainer
            store={ToastsStore}
            position={ToastsContainerPosition.TOP_RIGHT}
          />
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand text-light" href="#">
              Customer Database
            </a>
            <button className="navbar-toggler" type="button">
              <span className="navbar-toggler-icon" />
            </button>

            <button
              className="btn btn-outline-primary right mr-4"
              onClick={event => {
                this.handleCreateCustomer(event);
              }}
            >
              Create
            </button>
          </nav>

          {this.state.loading ? (
            <div className="loading">
              <ClipLoader sizeUnit={"px"} size={80} color={"#0ca678"} />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped ">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Update</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.customers.map((customer, index) => (
                    <tr key={index}>
                      <th scope="row">{customer.FirstName}</th>
                      <td>{customer.LastName}</td>
                      <td>{customer.Email}</td>
                      <td>{customer.PhoneNumber}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={event => {
                            this.handleUpdateCustomer(event, index);
                          }}
                        >
                          Update
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={e => this.handleDelete(e, index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div
          className="modal fade"
          id="deleteModalId"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                  Delete
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure? you want to delete customer.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  id="deleteCustomer"
                  type="button"
                  className="btn btn-danger"
                  onClick={event => {
                    this.deleteCustomer(event);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="createModalId"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="updateModellabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateModellabel">
                  {this.state.dialogTitle}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="inputFirstName"
                    placeholder="Enter First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="inputLastName"
                    placeholder="Enter Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="inputEmail"
                    placeholder="Enter Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="inputPhoneNumber"
                    placeholder="Enter Phone Number"
                    name="phoneNumber"
                    value={this.state.phoneNumber}
                    onChange={this.handleChange}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  id="addRecord"
                  type="button"
                  className="btn btn-primary"
                  onClick={event => {
                    this.state.dialogTitle === "Update Customer"
                      ? this.updateCustomer(event)
                      : this.createCustomer(event);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
