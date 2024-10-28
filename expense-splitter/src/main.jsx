import { createRoot } from "react-dom/client";
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
import Error from "./components/layout/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home />, errorElement: <Error /> },
      { path: "*", element: <NotFound /> },
      { path: "signin", element: <Login />, errorElement: <Error /> },
      { path: "groups", element: <Group />, errorElement: <Error /> },
      { path: "groups/add", element: <CreateGroup />, errorElement: <Error /> },
      {
        path: "groups/:groupId",
        element: <GroupDetail />,
        errorElement: <Error />,
      },
      {
        path: "groups/edit/:groupId",
        element: <EditGroup />,
        errorElement: <Error />,
      },
      { path: "friends", element: <Friend />, errorElement: <Error /> },
      { path: "friends/add", element: <FriendForm />, errorElement: <Error /> },
      {
        path: "friends/edit/:friendId",
        element: <FriendForm />,
        errorElement: <Error />,
      },
      { path: "expenses", element: <Expense />, errorElement: <Error /> },
      {
        path: "expenses/add",
        element: <CreateExpense />,
        errorElement: <Error />,
      },
      {
        path: "expenses/:expenseId",
        element: <ExpenseDetail />,
        errorElement: <Error />,
      },
      {
        path: "expenses/edit/:groupId",
        element: <EditExpense />,
        errorElement: <Error />,
      },
      { path: "receipts", element: <ReceiptUpload />, errorElement: <Error /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <DataProvider>
    <RouterProvider router={router} />
  </DataProvider>,
);
