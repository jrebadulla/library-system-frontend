import React, { useState } from "react";
import { Table, Modal, Form, Input, message } from "antd";
import { db } from "../Connection/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "./ManageBook.css";

const { Search } = Input;

const ManageBook = (props) => {
  const { dataSource, columns } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await addDoc(collection(db, "books"), {
        title: values.title,
        author: values.author,
        isbn: values.isbn,
        createdAt: new Date(),
      });

      message.success("Book added successfully!");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding book:", error);
      message.error("Failed to add book. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="search-add-container">
        <button className="add-book" onClick={showModal}>
          Add Books
        </button>
        <Search
          className="custom-search"
          placeholder="Search Book..."
          enterButton
          allowClear
          style={{ width: 300 }}
        />
      </div>

      <Modal
        title="Add a New Book"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Book Title"
            name="title"
            rules={[
              { required: true, message: "Please input the book title!" },
            ]}
          >
            <Input placeholder="Enter book title" />
          </Form.Item>

          <Form.Item
            label="Author"
            name="author"
            rules={[{ required: true, message: "Please input the author!" }]}
          >
            <Input placeholder="Enter author name" />
          </Form.Item>

          <Form.Item
            label="ISBN"
            name="isbn"
            rules={[{ required: true, message: "Please input the ISBN!" }]}
          >
            <Input placeholder="Enter ISBN" />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ManageBook;
