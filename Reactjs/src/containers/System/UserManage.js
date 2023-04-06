import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import { getAllUsers, createNewUserService, deleteUserService} from "../../services/userService";
import ModalUser from "./ModelUser";
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isOpenModalUser: false,
    };
  }

  state = {};

  async componentDidMount() {
    this.getAllUsersFromReact();
  }

  getAllUsersFromReact = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
      });
    }
  }

  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };

  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };

  createNewUser = async (data) => {
    try{
      let response = await createNewUserService(data);
      if(response && response.errCode != 0) {
        alert(response.errMessage);
      } else {
        await this.getAllUsersFromReact();
      }
      console.log('response create user: ', response);
    } catch(err) {
      console.log(err);
    }
    console.log('check data from child: ', data )
  }

  handleDeleteUser = async (user) => {
    console.log('delete user', user);
    try {
      let response = await deleteUserService(user.id);
      if(response && response.errCode == 0) {
        await this.getAllUsersFromReact();
      } else {
        alert(response.errMessage);
      }
    } catch(err) {
      console.log(err);
    }
  }

  /** Life cycle
   *  Run component
   * 1. Run construct -> init state
   * 2. Did mount
   * 3. Render
   * @returns
   */

  render() {
    console.log("check render", this.state);
    let arrUsers = this.state.arrUsers;
    return (
      <div className="users-container">
        <ModalUser 
            isOpen={this.state.isOpenModalUser}
            toggleFromParent = {this.toggleUserModal}
            createNewUser ={this.createNewUser}
        ></ModalUser>
        <div className="title text-center">Manage users</div>
        <div className="mx-1">
          <button
            className="btn btn-primary px-3"
            onClick={this.handleAddNewUser}
          >
            <i className="fas fa-plus px-1"></i>Add new users
          </button>
        </div>
        <div className="users-table mt-3 mx-1">
          <table id="customers">
            <thead>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
            </thead>

            <tbody>
              
              
              {arrUsers &&
                arrUsers.map((user, index) => {
                  return (
                    <tr>
                      <td>{user.email}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.address}</td>
                      <td>
                        <button className="btn-edit">
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button className="btn-delete" onClick = {() => {this.handleDeleteUser(user)}}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
