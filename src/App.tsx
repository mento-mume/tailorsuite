import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Customers from "./pages/Customer";
import Expenses from "./pages/Expenses";
import { db } from "./lib/firebase";
import Login from "./pages/Login";
import { collection, addDoc } from "firebase/firestore";
import { type Order } from "./data/orderTypes";
import { useFirestoreCollection } from "./hooks/useFirestoreCollection";
import { type Customer } from "./data/customerTypes";
import { type Expense } from "./data/expensesTypes";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
function App() {
  const { user, profile, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: orders, isLoading: ordersLoading } =
    useFirestoreCollection<Order>("orders");
  const { data: customers, isLoading: customersLoading } =
    useFirestoreCollection<Customer>("customers");
  const { data: expenses, isLoading: expensesLoading } =
    useFirestoreCollection<Expense>("expenses");

  async function addOrder(
    newOrder: Omit<Order, "id" | "createdBy" | "createdByName" | "createdAt">,
  ) {
    await addDoc(collection(db, "orders"), {
      ...newOrder,
      createdBy: user!.uid,
      createdByName: profile?.email ?? "Unknown",
      createdAt: Date.now(),
    });
  }

  async function addCustomer(
    newCustomer: Omit<
      Customer,
      "id" | "createdBy" | "createdByName" | "createdAt"
    >,
  ) {
    await addDoc(collection(db, "customers"), {
      ...newCustomer,
      createdBy: user!.uid,
      createdByName: profile?.email ?? "Unknown",
      createdAt: Date.now(),
    });
  }

  async function addExpense(
    newExpense: Omit<
      Expense,
      "id" | "createdBy" | "createdByName" | "createdAt"
    >,
  ) {
    await addDoc(collection(db, "expenses"), {
      ...newExpense,
      createdBy: user!.uid,
      createdByName: profile?.email ?? "Unknown",
      createdAt: Date.now(),
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <TopNav
          userName="Amaka Okoro"
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard orders={orders} isLoading={ordersLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders
                    orders={orders}
                    isLoading={ordersLoading}
                    onAddOrder={addOrder}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers
                    customers={customers}
                    isLoading={customersLoading}
                    onAddCustomer={addCustomer}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Expenses
                    expenses={expenses}
                    isLoading={expensesLoading}
                    onAddExpense={addExpense}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports orders={orders} isLoading={ordersLoading} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
