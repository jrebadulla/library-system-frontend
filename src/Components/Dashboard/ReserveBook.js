import React, { useEffect, useState } from "react";
import { Tabs, Table, Tag } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Connection/firebaseConfig";
import "./ReserveBook.css";

const ReserveBook = () => {
  const [bookRequests, setBookRequests] = useState([]);

  useEffect(() => {
    const fetchBookRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "book-request"));
        const requests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookRequests(requests);
      } catch (error) {
        console.error("Error fetching book requests: ", error);
      }
    };

    fetchBookRequests();
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let backgroundColor = "";
        let color = "black";
        switch (status) {
          case "pending":
            backgroundColor = "#FFAF00";
            break;
          case "approved":
            backgroundColor = "#87d068";
            break;
          case "declined":
            backgroundColor = "#ff4d4f";
            break;
          default:
            backgroundColor = "#2db7f5";
        }
        return (
          <Tag className="custom-tag" style={{ backgroundColor, color }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Requested At",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (requestedAt) => {
        return new Date(requestedAt.seconds * 1000).toLocaleDateString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <button className="approve-button">Approve</button>
          <button className="decline-button">Decline</button>
        </span>
      ),
    },
  ];

  const tabItems = [
    {
      label: "Book Request",
      key: "1",
      children: (
        <div>
          <Table dataSource={bookRequests} columns={columns} rowKey="id" />
        </div>
      ),
    },
    {
      label: "Book Returned",
      key: "2",
      children: (
        <div>
          <Table />
        </div>
      ),
    },
  ];

  return (
    <div className="reservebook-container">
      <h1>Book Requests & Returns</h1>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ReserveBook;
