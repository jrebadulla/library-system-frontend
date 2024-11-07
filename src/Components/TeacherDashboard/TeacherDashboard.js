import { React, useState, useEffect } from "react";
import "./TeacherDashboard.css";
import { Table, Input, message, Modal, Button, Form } from "antd";
import { db } from "../Connection/firebaseConfig";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";

const TeacherDashboard = () => {
  const userType = localStorage.getItem("user_type");
  const userId = localStorage.getItem("user_id");
  const { Search } = Input;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const booksCollection = collection(db, "books");
      const booksSnapshot = await getDocs(booksCollection);

      const booksList = booksSnapshot.docs.map((doc) => ({
        ...doc.data(),
        key: doc.id,
      }));

      setBooks(booksList);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch books. Please try again.");
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedBook) return;
    try {
      const bookRef = doc(db, "books", selectedBook.key);
      await updateDoc(bookRef, {
        borrowed: true,
        borrowedBy: userId,
      });
      const bookRequestRef = collection(db, "book-request");
      await addDoc(bookRequestRef, {
        bookId: selectedBook.key,
        title: selectedBook.title,
        author: selectedBook.author,
        isbn: selectedBook.isbn,
        userId: userId,
        status: "pending", 
        requestedAt: new Date(),
      });

      message.success("Book borrowed successfully and request recorded!");
      setIsModalVisible(false);
      fetchBooks();
    } catch (error) {
      message.error("Failed to borrow the book. Please try again.");
    }
  };

  const showBookDetails = (book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBook(null);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Date Added",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date.seconds * 1000).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <a onClick={() => showBookDetails(record)}>Borrow</a>
      ),
    },
  ];

  return (
    <div className="teacher-container">
      {userType === "College Staff" && (
        <>
          <div className="search-container">
            <Search
              className="custom-search"
              placeholder="Search book here..."
              allowClear
              size="large"
            />
          </div>
          <Table
            columns={columns}
            dataSource={books}
            pagination={{ pageSize: 5 }}
          />
          <Modal
            title="Book Details"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              layout="vertical"
              onFinish={handleBorrow}
              initialValues={{
                title: selectedBook?.title,
                author: selectedBook?.author,
                isbn: selectedBook?.isbn,
                dateAdded: selectedBook
                  ? new Date(
                      selectedBook.createdAt.seconds * 1000
                    ).toLocaleDateString()
                  : "",
              }}
            >
              <Form.Item label="Title" name="title">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Author" name="author">
                <Input disabled />
              </Form.Item>
              <Form.Item label="ISBN" name="isbn">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Date Added" name="dateAdded">
                <Input disabled />
              </Form.Item>

              <Form.Item>
                <Button className="confirm" type="primary" htmlType="submit">
                  Confirm Borrow
                </Button>
                <Button style={{ marginLeft: 9 }} onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
