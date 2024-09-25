import React, { useState } from "react";
import { Table, Modal, Form, Input, message, Descriptions } from "antd";
import { db } from "../Connection/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "./ManageBook.css";

const ManageBook = ({ dataSource, columns }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");

  const showModal = (type, book) => {
    setCurrentBook(book);
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (modalType === "add" || modalType === "edit") {
      try {
        const values = await form.validateFields();
        if (modalType === "add") {
          await addDoc(collection(db, "books"), {
            ...values,
            createdAt: new Date(),
          });
          message.success("Book added successfully!");
        } else {
          await updateDoc(doc(db, "books", currentBook.key), values);
          message.success("Book updated successfully!");
        }
        form.resetFields();
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error adding/updating book:", error);
        message.error("Failed to add/update book. Please try again.");
      }
    } else {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (book) => {
    try {
      await deleteDoc(doc(db, "books", book.key));
      message.success("Book deleted successfully!");
    } catch (error) {
      message.error("Error deleting book: " + error.message);
    }
  };

  const [form] = Form.useForm();

  const modifiedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <a onClick={() => showModal("edit", record)}>Edit</a> |
          <a onClick={() => handleDelete(record)}>Delete</a> |
          <a onClick={() => showModal("view", record)}>View</a>
        </span>
      ),
    },
  ];

  return (
    <div>
      <button className="add-book" onClick={() => showModal("add", null)}>
        Add Books
      </button>
      <Table
        dataSource={dataSource}
        columns={modifiedColumns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={
          modalType === "add"
            ? "Add a New Book"
            : modalType === "edit"
            ? "Edit Book"
            : "View Book Details"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalType === "view" ? "Close" : "Submit"}
        cancelText="Cancel"
      >
        {modalType === "view" ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              {currentBook?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Author">
              {currentBook?.author}
            </Descriptions.Item>
            <Descriptions.Item label="ISBN">
              {currentBook?.isbn}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical" initialValues={currentBook}>
            <Form.Item
              label="Book Title"
              name="title"
              rules={[
                { required: true, message: "Please input the book title!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Author"
              name="author"
              rules={[{ required: true, message: "Please input the author!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="ISBN"
              name="isbn"
              rules={[{ required: true, message: "Please input the ISBN!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ManageBook;
