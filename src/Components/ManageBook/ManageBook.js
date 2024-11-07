import { React, useState, useEffect } from "react";
import "./ManageBook.css";
import { Input, Table, Spin, Modal, Form, Button, Descriptions } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { fetchBooks, addBook, updateBook, deleteBook } from "./BookServices"; // Import CRUD functions

const { Search } = Input;

const ManageBook = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); 
  const [viewingBook, setViewingBook] = useState(null); 
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadBooks();
  }, []);

  // Fetch books and set loading state
  const loadBooks = async () => {
    setLoading(true);
    const bookList = await fetchBooks();
    setBooks(bookList);
    setFilteredBooks(bookList); 
    setLoading(false);
  };

  // Handle add book
  const handleAddBook = async (values) => {
    await addBook(values);
    loadBooks();
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle edit book
  const handleEditBook = async (values) => {
    await updateBook(editingBook.id, values);
    loadBooks();
    setIsModalOpen(false);
    setEditingBook(null);
    form.resetFields();
  };

  // Open modal for adding/editing
  const openModal = (book = null) => {
    setIsModalOpen(true);
    if (book) {
      setEditingBook(book);
      form.setFieldsValue(book);
    } else {
      setEditingBook(null);
      form.resetFields();
    }
  };

  // Open modal for viewing
  const viewBook = (book) => {
    setViewingBook(book);
    setIsViewModalOpen(true);
  };

  // Handle delete book
  const handleDeleteBook = async (bookId) => {
    await deleteBook(bookId);
    loadBooks();
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books); 
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Genre", dataIndex: "genre", key: "genre" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => openModal(record)}
            style={{ marginRight: 12 }}
          >
            Edit
          </Button>
          <span className="divider">|</span>
          <Button type="link" onClick={() => viewBook(record)}>
            View
          </Button>
          <span className="divider">|</span>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteBook(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="manage-user-container">
      <div className="search-container">
        <button className="add-book" onClick={() => openModal()}>
          <PlusCircleOutlined className="plus-icon" /> Add New Book
        </button>
        <Search
          className="custom-search"
          placeholder="Search book here..."
          allowClear
          size="large"
          onSearch={onSearch}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <Spin
          className="custom-spin"
          tip="Loading books..."
          style={{ display: "block", textAlign: "center", marginTop: 20 }}
        />
      ) : (
        <Table dataSource={filteredBooks} columns={columns} rowKey="id" />
      )}

      <Modal
        title={editingBook ? "Edit Book" : "Add New Book"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingBook ? handleEditBook : handleAddBook}
        >
          <Form.Item
            label="Title"
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
            label="Genre"
            name="genre"
            rules={[{ required: true, message: "Please input the genre!" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            {editingBook ? "Save Changes" : "Add Book"}
          </Button>
          <Button
            onClick={() => {
              setIsModalOpen(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Book Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={
          <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
        }
      >
        {viewingBook && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              {viewingBook?.title}
            </Descriptions.Item>

            <Descriptions.Item label="Author">
              {viewingBook?.author}
            </Descriptions.Item>

            <Descriptions.Item label="Genre">
              {viewingBook?.genre}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ManageBook;
