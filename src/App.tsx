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
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { type Order } from "./data/orderTypes";
import { useFirestoreCollection } from "./hooks/useFirestoreCollection";
import { type Customer } from "./data/customerTypes";
import { type Expense } from "./data/expensesTypes";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import { type Payment } from "./data/paymentTypes";

function App() {
  const { user, profile, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: orders, isLoading: ordersLoading } =
    useFirestoreCollection<Order>("orders");
  const { data: customers, isLoading: customersLoading } =
    useFirestoreCollection<Customer>("customers");
  const { data: expenses, isLoading: expensesLoading } =
    useFirestoreCollection<Expense>("expenses");
  const { data: payments, isLoading: paymentsLoading } =
    useFirestoreCollection<Payment>("payments");

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
  async function updateOrder(
    orderId: string,
    updates: Partial<
      Omit<Order, "id" | "createdBy" | "createdByName" | "createdAt">
    >,
  ) {
    await updateDoc(doc(db, "orders", orderId), updates);
  }

  async function deleteOrder(orderId: string) {
    await deleteDoc(doc(db, "orders", orderId));
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
  async function updateCustomer(
    customerId: string,
    updates: Partial<Omit<Customer, "id">>,
  ) {
    await updateDoc(doc(db, "customers", customerId), updates);
  }

  async function deleteCustomer(customerId: string) {
    await deleteDoc(doc(db, "customers", customerId));
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
  async function addPayment(
    newPayment: Omit<Payment, "id" | "recordedBy" | "recordedByName">,
  ) {
    await addDoc(collection(db, "payments"), {
      ...newPayment,
      recordedBy: user!.uid,
      recordedByName: profile?.email ?? "Unknown",
    });
  }

  async function deletePayment(paymentId: string) {
    await deleteDoc(doc(db, "payments", paymentId));
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
                    customers={customers}
                    payments={payments}
                    isLoading={
                      ordersLoading || customersLoading || paymentsLoading
                    }
                    onAddOrder={addOrder}
                    onUpdateOrder={updateOrder}
                    onDeleteOrder={deleteOrder}
                    onAddPayment={addPayment}
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
                    orders={orders}
                    isLoading={customersLoading || ordersLoading}
                    onAddCustomer={addCustomer}
                    onUpdateCustomer={updateCustomer}
                    onDeleteCustomer={deleteCustomer}
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
