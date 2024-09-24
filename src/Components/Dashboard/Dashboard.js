import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, message } from "antd";
import { db } from "../Connection/firebaseConfig";
import ManageBook from "./ManageBook";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("manageBook");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
  ];

  const fetchBooks = async () => {
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
      console.error("Error fetching books: ", error);
      message.error("Failed to fetch books. Please try again.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="librarian-container">
      <div className="left-side-container">
        <Avatar className="user-avatar" size={80} icon={<UserOutlined />} />
        <p>Teacher Name</p>
        <p className="p">User Type</p>
        <div className="categories-buttons">
          <button onClick={() => setActiveTab("manageBook")}>
            Manage Book
          </button>
          <button onClick={() => setActiveTab("manageStudent")}>
            Manage Student
          </button>
          <button onClick={() => setActiveTab("reserveBook")}>
            Reserve Book
          </button>
        </div>
      </div>
      <div className="table-container">
        {activeTab === "manageBook" && (
          <ManageBook dataSource={books} columns={columns} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
