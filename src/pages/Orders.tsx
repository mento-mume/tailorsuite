import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { type Order, type OrderStatusFilter } from "../data/orderTypes";
import { Plus, Search, Pencil, Trash2, Eye, Banknote } from "lucide-react";
import Modal from "../components/ui/Modal";
import { type OrderStatus } from "../components/ui/Badge";
import { useSearchParams } from "react-router-dom";
import { type Customer } from "../data/customerTypes";
import { type Payment } from "../data/paymentTypes";
import { getOrderBalance } from "../utils/paymentCalculation";

const statusOptions: OrderStatusFilter[] = [
  "All",
  "Received",
  "Measuring",
  "Cutting",
  "Sewing",
  "Ironing",
  "Ready",
  "Delivered",
  "Cancelled",
];
interface OrdersProps {
  orders: Order[];
  customers: Customer[];
  payments: Payment[];
  isLoading: boolean;
  onAddOrder: (
    order: Omit<Order, "id" | "createdBy" | "createdByName" | "createdAt">,
  ) => Promise<void>;
  onUpdateOrder: (
    orderId: string,
    updates: Partial<
      Omit<Order, "id" | "createdBy" | "createdByName" | "createdAt">
    >,
  ) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onAddPayment: (
    payment: Omit<Payment, "id" | "recordedBy" | "recordedByName">,
  ) => Promise<void>;
}
export default function Orders({
  orders,
  customers,
  payments,
  isLoading,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
  onAddPayment,
}: OrdersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("All");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingPaymentFor, setRecordingPaymentFor] = useState<Order | null>(
    null,
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [newOrder, setNewOrder] = useState({
    customerId: "",
    item: "",
    status: "Received" as OrderStatus,
    dueDate: "",
    amount: "",
  });
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsFormModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function updateField(field: keyof typeof newOrder, value: string) {
    setNewOrder((prev) => ({ ...prev, [field]: value }));
  }
  function openViewModal(order: Order) {
    setViewingOrder(order);
  }

  function openEditModal(order: Order) {
    setNewOrder({
      customerId: order.customerId,
      item: order.item,
      status: order.status,
      dueDate: order.dueDate,
      amount: order.amount.toString(),
    });
    setEditingOrderId(order.id);
    setIsFormModalOpen(true);
  }

  function openDeleteConfirm(order: Order) {
    setDeletingOrder(order);
  }

  function closeFormModal() {
    setIsFormModalOpen(false);
    setEditingOrderId(null);
    setSubmitError("");
    setIsSubmitting(false);
    setNewOrder({
      customerId: "",
      item: "",
      status: "Received",
      dueDate: "",
      amount: "",
    });
  }

  async function handleSubmitOrder() {
    if (isSubmitting) return;
    setSubmitError("");

    const selectedCustomer = customers.find(
      (c) => c.id === newOrder.customerId,
    );
    if (!selectedCustomer) {
      setSubmitError("Please select a customer.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingOrderId) {
        await onUpdateOrder(editingOrderId, {
          customerId: newOrder.customerId,
          customer: selectedCustomer.name,
          item: newOrder.item,
          status: newOrder.status,
          dueDate: newOrder.dueDate,
          amount: Number(newOrder.amount) || 0,
        });
      } else {
        await onAddOrder({
          customerId: newOrder.customerId,
          customer: selectedCustomer.name,
          item: newOrder.item,
          status: newOrder.status,
          dueDate: newOrder.dueDate,
          amount: Number(newOrder.amount) || 0,
        });
      }
      closeFormModal();
    } catch {
      setIsSubmitting(false);
      setSubmitError(
        "Could not save order. Check your connection and try again.",
      );
    }
  }

  async function confirmDelete() {
    if (!deletingOrder) return;
    try {
      await onDeleteOrder(deletingOrder.id);
      setDeletingOrder(null);
    } catch {
      setSubmitError(
        "Could not delete order. Check your connection and try again.",
      );
      setDeletingOrder(null);
    }
  }
  async function handleRecordPayment() {
    if (!recordingPaymentFor) return;
    const amount = Number(paymentAmount) || 0;
    if (amount <= 0) {
      setSubmitError("Enter a valid payment amount.");
      return;
    }

    try {
      await onAddPayment({
        orderId: recordingPaymentFor.id,
        customerId: recordingPaymentFor.customerId,
        amount,
        paidAt: Date.now(),
      });
      setRecordingPaymentFor(null);
      setPaymentAmount("");
    } catch {
      setSubmitError("Could not record payment. Try again.");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Orders</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track every order from received to delivered.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto shrink-0"
          icon={<Plus size={18} />}
          onClick={() => setIsFormModalOpen(true)}
        >
          New Order
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="max-w-[280px] w-full">
            <Input
              icon={<Search size={18} />}
              placeholder="Search order or customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as OrderStatusFilter)
            }
            className="h-11 rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All statuses" : status}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            Loading orders…
          </div>
        ) : (
          <>
            {/* Mobile / tablet: card list */}
            <div className="flex flex-col gap-3 md:hidden">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{order.customer}</p>
                      <p className="text-xs text-text-secondary">{order.id}</p>
                    </div>
                    <Badge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <span className="text-xs text-text-secondary block">
                        Item
                      </span>
                      {order.item}
                    </div>
                    <div>
                      <span className="text-xs text-text-secondary block">
                        Due date
                      </span>
                      {order.dueDate}
                    </div>
                    <div>
                      <span className="text-xs text-text-secondary block">
                        Amount
                      </span>
                      ₦{order.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-1 border-t border-[#F3F4F6]">
                    <button
                      onClick={() => openViewModal(order)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEditModal(order)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setRecordingPaymentFor(order)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-success hover:bg-green-50"
                    >
                      <Banknote size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(order)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-danger hover:bg-red-50 ml-auto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="py-12 text-center text-sm text-text-secondary">
                  No orders found.
                </div>
              )}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block">
              <Table<Order>
                data={filteredOrders}
                keyExtractor={(order) => order.id}
                columns={[
                  { header: "Order", render: (order) => order.id },
                  { header: "Customer", render: (order) => order.customer },
                  { header: "Item", render: (order) => order.item },
                  {
                    header: "Status",
                    render: (order) => <Badge status={order.status} />,
                  },
                  { header: "Due date", render: (order) => order.dueDate },
                  {
                    header: "Amount",
                    render: (order) => `₦${order.amount.toLocaleString()}`,
                  },
                  {
                    header: "",
                    render: (order) => (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openViewModal(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setRecordingPaymentFor(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-success hover:bg-green-50"
                        >
                          <Banknote size={16} />
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingOrderId ? "Edit Order" : "New Order"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">
              Customer
            </label>
            <select
              value={newOrder.customerId}
              onChange={(e) => updateField("customerId", e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
            >
              <option value="">Select a customer…</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Item"
            placeholder="e.g. Agbada set"
            value={newOrder.item}
            onChange={(e) => updateField("item", e.target.value)}
          />

          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">
              Status
            </label>
            <select
              value={newOrder.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
            >
              {statusOptions
                .filter((s) => s !== "All")
                .map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </select>
          </div>

          <Input
            label="Due date"
            type="date"
            value={newOrder.dueDate}
            onChange={(e) => updateField("dueDate", e.target.value)}
          />
          <Input
            label="Amount (₦)"
            type="number"
            placeholder="0"
            value={newOrder.amount}
            onChange={(e) => updateField("amount", e.target.value)}
          />

          {submitError && <p className="text-xs text-danger">{submitError}</p>}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={closeFormModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmitOrder} isLoading={isSubmitting}>
              {editingOrderId ? "Save Changes" : "Create Order"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        title="Delete Order"
      >
        {deletingOrder && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">
              Delete the order for{" "}
              <span className="font-semibold text-text-primary">
                {deletingOrder.customer}
              </span>
              ? This can't be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeletingOrder(null)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title="Order Details"
      >
        {viewingOrder &&
          (() => {
            const orderPayments = payments.filter(
              (p) => p.orderId === viewingOrder.id,
            );
            const balance = getOrderBalance(viewingOrder, payments);

            return (
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-xs text-text-secondary">Customer</span>
                  <p className="text-sm font-medium">{viewingOrder.customer}</p>
                </div>
                <div>
                  <span className="text-xs text-text-secondary">Item</span>
                  <p className="text-sm font-medium">{viewingOrder.item}</p>
                </div>
                <div>
                  <span className="text-xs text-text-secondary">Status</span>
                  <div className="mt-1">
                    <Badge status={viewingOrder.status} />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-text-secondary">Due date</span>
                  <p className="text-sm font-medium">{viewingOrder.dueDate}</p>
                </div>
                <div>
                  <span className="text-xs text-text-secondary">Amount</span>
                  <p className="text-sm font-medium">
                    ₦{viewingOrder.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-text-secondary">Balance</span>
                  <p
                    className={`text-sm font-medium ${balance > 0 ? "text-danger" : "text-success"}`}
                  >
                    ₦{balance.toLocaleString()}
                  </p>
                </div>

                {orderPayments.length > 0 && (
                  <div>
                    <span className="text-xs text-text-secondary">
                      Payment history
                    </span>
                    {orderPayments.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between text-sm py-1"
                      >
                        <span>{new Date(p.paidAt).toLocaleDateString()}</span>
                        <span>₦{p.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
      </Modal>

      <Modal
        isOpen={!!recordingPaymentFor}
        onClose={() => setRecordingPaymentFor(null)}
        title="Record Payment"
      >
        {recordingPaymentFor &&
          (() => {
            const balance = getOrderBalance(recordingPaymentFor, payments);
            return (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-text-secondary">
                  Balance remaining:{" "}
                  <span className="font-semibold text-text-primary">
                    ₦{balance.toLocaleString()}
                  </span>
                </p>
                <Input
                  label="Amount received (₦)"
                  type="number"
                  placeholder="0"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                {submitError && (
                  <p className="text-xs text-danger">{submitError}</p>
                )}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setRecordingPaymentFor(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleRecordPayment}>Record Payment</Button>
                </div>
              </div>
            );
          })()}
      </Modal>
    </div>
  );
}
