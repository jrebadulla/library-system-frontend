import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Descriptions,
  Spin,
  Popconfirm,
  Button,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { db } from "../Connection/firebaseConfig";
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import "./ManageBook.css";

const BookModal = ({
  visible,
  onCancel,
  onOk,
  modalType,
  form,
  currentBook,
}) => (
  <Modal
    title={
      modalType === "add"
        ? "Add a New Book"
        : modalType === "edit"
        ? "Edit Book"
        : "View Book Details"
    }
    visible={visible}
    onOk={onOk}
    onCancel={onCancel}
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
        <Descriptions.Item label="ISBN">{currentBook?.isbn}</Descriptions.Item>
      </Descriptions>
    ) : (
      <Form form={form} layout="vertical" initialValues={currentBook}>
        <Form.Item
          label="Book Title"
          name="title"
          rules={[{ required: true, message: "Please input the book title!" }]}
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
);

const ManageBook = ({ columns }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const { Search } = Input;
  const userType = localStorage.getItem("user_type");

  const showModal = useCallback(
    (type, book) => {
      setCurrentBook(book);
      setModalType(type);
      form.resetFields();
      setIsModalVisible(true);
    },
    [form]
  );

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const booksCollection = collection(db, "books");
      const booksSnapshot = await getDocs(booksCollection);
      const booksList = booksSnapshot.docs.map((doc) => ({
        ...doc.data(),
        key: doc.id,
      }));
      setBooks(booksList);
    } catch (error) {
      message.error("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddBook = async () => {
    setSubmitting(true);
    try {
      const values = await form.validateFields();
      const newBookRef = doc(collection(db, "books"));
      await setDoc(newBookRef, {
        ...values,
        book_id: newBookRef.id,
        createdAt: new Date(),
      });

      message.success("Book added successfully!");
      fetchBooks();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding book:", error);
      message.error("Failed to add book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBook = async () => {
    setSubmitting(true);
    try {
      if (currentBook && currentBook.key) {
        const values = await form.validateFields();
        await updateDoc(doc(db, "books", currentBook.key), values);
        message.success("Book updated successfully!");
        fetchBooks();
        setIsModalVisible(false);
      } else {
        message.error("No book selected for updating.");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      message.error("Failed to update book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOk = () => {
    if (modalType === "add") {
      handleAddBook();
    } else if (modalType === "edit") {
      handleUpdateBook();
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
      fetchBooks();
    } catch (error) {
      message.error("Error deleting book: " + error.message);
    }
  };

  const modifiedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span className="span">
          <Button
            type="link"
            onClick={() => showModal("edit", record)}
            style={{ padding: 0 }}
            aria-label="Edit book details"
          >
            Edit
          </Button>
          <span className="divider">|</span>
          <Popconfirm
            title="Are you sure you want to delete this book?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger style={{ padding: 0 }} aria-label="Delete book">
              Delete
            </Button>
          </Popconfirm>
          <span className="divider">|</span>
          <Button
            type="link"
            onClick={() => showModal("view", record)}
            style={{ padding: 0 }}
            aria-label="View book details"
          >
            View
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="login-container">
      {userType === "Librarian" && (
        <>
          <div className="search-container">
            <button className="add-book" onClick={() => showModal("add", null)}>
              <PlusCircleOutlined className="plus-icon" /> Add New Book
            </button>
            <Search
              className="custom-search"
              placeholder="Search book here..."
              allowClear
              size="large"
            />
          </div>
          {loading ? (
            <Spin
              tip="Loading books..."
              style={{ display: "block", textAlign: "center", marginTop: 20 }}
            />
          ) : (
            <Table
              dataSource={books}
              columns={modifiedColumns}
              pagination={{ pageSize: 5 }}
            />
          )}
          <BookModal
            visible={isModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            modalType={modalType}
            form={form}
            currentBook={currentBook}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(ManageBook);
