import { useEffect, useState } from "react";
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
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import { type Payment } from "./data/paymentTypes";
import type { UserProfile } from "./data/roleTypes.ts";
function App() {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
  async function updateExpense(
    expenseId: string,
    updates: Partial<
      Omit<Expense, "id" | "createdBy" | "createdByName" | "createdAt">
    >,
  ) {
    await updateDoc(doc(db, "expenses", expenseId), updates);
  }

  async function deleteExpense(expenseId: string) {
    await deleteDoc(doc(db, "expenses", expenseId));
  }

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

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

  async function updateOwnProfile(
    updates: Partial<Pick<UserProfile, "username" | "phone">>,
  ) {
    if (!user) return;
    await updateDoc(doc(db, "Users", user.uid), updates);
  }
  function handleToggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setIsSidebarCollapsed((prev) => !prev);
    } else {
      setIsMobileNavOpen((prev) => !prev);
    }
  }

  return (
    <div className="flex min-h-screen">
      {isMobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileNavOpen}
        onNavigate={() => setIsMobileNavOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          profile={profile}
          onUpdateProfile={updateOwnProfile}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard
                    orders={orders}
                    payments={payments}
                    isLoading={ordersLoading || paymentsLoading}
                  />
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
                    onUpdateExpense={updateExpense}
                    onDeleteExpense={deleteExpense}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports
                    orders={orders}
                    payments={payments}
                    isLoading={ordersLoading || paymentsLoading}
                  />
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
