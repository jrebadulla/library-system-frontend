import React, { useState, useEffect } from "react";
import "./ManageUser.css";
import { Table, Spin, Input, Modal, Button, Form, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { addUser, fetchUsers, updateUser, deleteUser } from "./FirebaseCRUD";

const ManageUser = () => {
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    setLoading(true);
    fetchUsers().then((userList) => {
      setUsers(userList);
      setFilteredUsers(userList);
      setLoading(false);
    });
  }, []);

  // Open modal for adding a new user
  const showAddUserModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Close modal and reset form fields
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Add or update user
  const handleSaveUser = async (values) => {
    setLoading(true);
    if (editingUser) {
      await updateUser(editingUser.id, values);
    } else {
      await addUser(values);
    }
    fetchUsers().then((userList) => {
      setUsers(userList);
      setLoading(false);
      handleCloseModal();
    });
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    await deleteUser(userId);
    setUsers(users.filter((user) => user.id !== userId));
    setLoading(false);
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter(
        (user) =>
          user.full_name.toLowerCase().includes(query.toLowerCase()) ||
          user.user_type.toLowerCase().includes(query.toLowerCase()) ||
          user.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "full_name", key: "full_nameame" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
    { title: "Designation", dataIndex: "user_type", key: "user_type" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            type="link"
            onClick={() => {
              setEditingUser(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <span className="divider">|</span>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
          <span className="divider">|</span>
          <Button
            type="link"
            onClick={() => {
              setEditingUser(record);
              setIsModalOpen(true);
            }}
          >
            View
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="manage-user-container">
      <div className="search-container">
        <button className="add-book" onClick={showAddUserModal}>
          <PlusCircleOutlined className="plus-icon" /> Add New User
        </button>
        <Search
          className="custom-search"
          placeholder="Search user here..."
          allowClear
          size="large"
          onSearch={onSearch}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <Spin
          tip="Loading users..."
          className="custom-spin"
          style={{ display: "block", textAlign: "center", marginTop: 20 }}
        />
      ) : (
        <Table dataSource={filteredUsers} columns={columns} rowKey="id" />
      )}
      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <UserForm
          initialValues={editingUser || {}}
          onFinish={handleSaveUser}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

const UserForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [initialValues, onCancel]);

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={(values) => {
        form.resetFields();
        onFinish(values);
      }}
      layout="vertical"
    >
      <Form.Item
        name="full_name"
        label="Full Name"
        rules={[
          { required: true, message: "Please input the user's full name!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please input the user's email!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone_number"
        label="Phone Number"
        rules={[
          { required: true, message: "Please input the user's phone number!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[
          { required: true, message: "Please input the user's address!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="username"
        label="User Name"
        rules={[
          { required: true, message: "Please input the user's username!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="user_type"
        label="User Type"
        rules={[{ required: true, message: "Please select the user's type!" }]}
      >
        <Select placeholder="Select user type">
          <Select.Option value="College">College Staff</Select.Option>
          <Select.Option value="Basic">Basic Staff</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues.id ? "Update User" : "Add User"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ManageUser;
