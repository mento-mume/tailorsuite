import { useEffect, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Customers from "./pages/Customer";
import Expenses from "./pages/Expenses";
import Staff from "./pages/Staff";
import { db } from "./lib/firebase";
import Login from "./pages/Login";
import AcceptInvite from "./pages/AcceptInvite";
import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { type Order } from "./data/orderTypes";
import { useFirestoreCollection } from "./hooks/useFirestoreCollection";
import { type Customer } from "./data/customerTypes";
import { type Expense } from "./data/expensesTypes";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import { type Payment } from "./data/paymentTypes";
import type { Role, UserProfile } from "./data/roleTypes.ts";

interface AuthenticatedLayoutProps {
  profile: UserProfile | null;
  onUpdateProfile: (
    updates: Partial<Pick<UserProfile, "username" | "phone">>,
  ) => Promise<void>;
}

function AuthenticatedLayout({
  profile,
  onUpdateProfile,
}: AuthenticatedLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  function handleToggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setIsSidebarCollapsed((prev) => !prev);
    } else {
      setIsMobileNavOpen((prev) => !prev);
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
          onUpdateProfile={onUpdateProfile}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  const { user, profile, isLoading } = useAuth();
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

  async function addPayment(
    newPayment: Omit<Payment, "id" | "recordedBy" | "recordedByName">,
  ) {
    await addDoc(collection(db, "payments"), {
      ...newPayment,
      recordedBy: user!.uid,
      recordedByName: profile?.email ?? "Unknown",
    });
  }
  //to be done later
  // async function deletePayment(paymentId: string) {
  //   await deleteDoc(doc(db, "payments", paymentId));
  // }

  async function updateOwnProfile(
    updates: Partial<Pick<UserProfile, "username" | "phone">>,
  ) {
    if (!user) return;
    await updateDoc(doc(db, "Users", user.uid), updates);
  }

  async function createInvite(email: string, role: Role) {
    if (!user) throw new Error("Not authenticated");
    const token = crypto.randomUUID();
    const now = Date.now();
    await setDoc(doc(db, "invites", token), {
      email,
      role,
      status: "pending",
      invitedBy: user.uid,
      invitedByEmail: profile?.email ?? "",
      createdAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
    });
    return token;
  }

  async function revokeInvite(inviteId: string) {
    await updateDoc(doc(db, "invites", inviteId), { status: "revoked" });
  }

  async function updateStaffRole(uid: string, role: Role) {
    await updateDoc(doc(db, "Users", uid), { role });
  }

  async function updateStaffStatus(uid: string, status: UserProfile["status"]) {
    await updateDoc(doc(db, "Users", uid), { status });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/accept-invite/:token" element={<AcceptInvite />} />
      <Route
        element={
          <AuthenticatedLayout
            profile={profile}
            onUpdateProfile={updateOwnProfile}
          />
        }
      >
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
                payments={payments}
                isLoading={
                  customersLoading || ordersLoading || paymentsLoading
                }
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
                expenses={expenses}
                isLoading={ordersLoading || paymentsLoading || expensesLoading}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff
                currentUid={user?.uid ?? ""}
                onInvite={createInvite}
                onRevokeInvite={revokeInvite}
                onUpdateStaffRole={updateStaffRole}
                onUpdateStaffStatus={updateStaffStatus}
              />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
