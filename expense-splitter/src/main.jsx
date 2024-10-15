import { createRoot } from "react-dom/client";
// import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DataProvider } from "./components/context/SiteContext";
import "./index.css";
import Layout from "./components/layout/Layout";
import Home from "./components/Home";
import NotFound from "./components/layout/NotFound";
import Login from "./components/Login";
import Group from "./components/group/Group";
import GroupDetail from "./components/group/GroupDetail";
import Friend from "./components/friend/Friend";
import Expense from "./components/expense/Expense";
import ExpenseDetail from "./components/expense/ExpenseDetail";
import ReceiptUpload from "./components/upload/ReceiptUpload";
import FriendForm from "./components/friend/FriendForm";
import CreateGroup from "./components/group/CreateGroup";
import CreateExpense from "./components/expense/CreateExpense";
import EditExpense from "./components/expense/EditExpense";
import EditGroup from "./components/group/EditGroup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },
      { path: "home", element: <Home /> },
      { path: "*", element: <NotFound /> },
      { path: "groups", element: <Group /> },
      { path: "groups/add", element: <CreateGroup /> },
      { path: "groups/:groupId", element: <GroupDetail /> },
      { path: "groups/edit/:groupId", element: <EditGroup /> },
      { path: "friends", element: <Friend /> },
      { path: "friends/add", element: <FriendForm /> },
      { path: "expenses", element: <Expense /> },
      { path: "expenses/add", element: <CreateExpense /> },
      { path: "expenses/:expenseId", element: <ExpenseDetail /> },
      { path: "expenses/edit/:groupId", element: <EditExpense /> },
      { path: "receipts", element: <ReceiptUpload /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <DataProvider>
    <RouterProvider router={router} />
  </DataProvider>,
);

// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// createRoot(document.getElementById('root')).render(<App />)
