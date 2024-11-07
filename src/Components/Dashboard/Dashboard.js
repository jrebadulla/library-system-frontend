import React, { useState } from "react";
import "./Dashboard.css";
import { Avatar } from "antd";
import ManageBook from "./ManageBook";
import {
  BarChartOutlined,
  BookOutlined,
  ClockCircleFilled,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import TeacherDashboard from "../TeacherDashboard/TeacherDashboard";
import ReserveBook from "./ReserveBook";
import Analytics from "./Analytics";
import ManageUser from "../ManageUser/ManageUser";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("manageBook");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fullName = localStorage.getItem("full_name");
  const userType = localStorage.getItem("user_type");
  const profilePicture = localStorage.getItem("profile_picture");
  const navigate = useNavigate();
  const borderColor = userType === "College Staff" ? "#1E90FF" : "#32CD32";

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

  const handleMenuClick = (e) => {
    if (e.key === "3") {
      localStorage.clear();
      navigate("/login");
    }
  };

  const items = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Account",
    },
    {
      key: "3",
      label: "Sign Out",
    },
  ];

  return (
    <div className="librarian-container">
      <div className="left-side-container">
        <div className="avatar-container">
          <Avatar
            className="user-avatar"
            size={80}
            src={profilePicture}
            style={{ borderColor: borderColor }}
          />
          <Dropdown
            className="dropdown-avatar"
            menu={{
              items,
              onClick: handleMenuClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <DownOutlined className="downline" />
            </a>
          </Dropdown>
        </div>
        <p>{fullName}</p>
        <p className="p">{userType}</p>

        <div className="categories-buttons">
          {userType === "Librarian" && (
            <>
           
                <button
                  className="icons-btn"
                  onClick={() => setActiveTab("manageBook")}
                >
                  <BookOutlined className="icons-btn" /> Manage Book
                </button>
                <button
                  className="icons-btn"
                  onClick={() => setActiveTab("manageUser")}
                >
                  <UserOutlined className="icons-btn" /> Manage Users
                </button>
                <button
                  className="icons-btn"
                  onClick={() => setActiveTab("viewReserveBook")}
                >
                  <ClockCircleFilled className="icons-btn" /> Book Transactions
                </button>
                <button
                  className="icons-btn"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChartOutlined className="icons-btn" /> Catalog Analytics
                </button>
     
            </>
          )}

          {userType === "College Staff" && (
            <>
              <button onClick={() => setActiveTab("viewAssignedBooks")}>
                Books <BookOutlined className="icons-btn" />
              </button>
              <button onClick={() => setActiveTab("viewStudentsProgress")}>
                Reserve Book
                <ClockCircleFilled className="icons-btn" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="table-container">
        {activeTab === "manageBook" && userType === "Librarian" && (
          <ManageBook dataSource={books} columns={columns} loading={loading} />
        )}
        {activeTab === "viewAssignedBooks" && userType === "College Staff" && (
          <TeacherDashboard />
        )}
        {activeTab === "viewReserveBook" && userType === "Librarian" && (
          <ReserveBook />
        )}
        {activeTab === "analytics" && userType === "Librarian" && <Analytics />}
        {activeTab === "manageUser" && userType === "Librarian" && (
          <ManageUser />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
