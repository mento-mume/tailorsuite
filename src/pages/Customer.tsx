import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { type Order } from "../data/orderTypes";
import { type Customer } from "../data/customerTypes";

const avatarColors = [
  "bg-primary",
  "bg-secondary",
  "bg-violet-600",
  "bg-orange-500",
  "bg-success",
  "bg-emerald-500",
];

interface CustomersProps {
  customers: Customer[];
  orders: Order[];
  isLoading: boolean;
  onAddCustomer: (
    customer: Omit<
      Customer,
      "id" | "createdBy" | "createdByName" | "createdAt"
    >,
  ) => Promise<void>;
  onUpdateCustomer: (
    customerId: string,
    updates: Partial<Omit<Customer, "id">>,
  ) => Promise<void>;
  onDeleteCustomer: (customerId: string) => Promise<void>;
}

export default function Customers({
  customers,
  orders,
  isLoading,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}: CustomersProps) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null,
  );
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null,
  );

  const [submitError, setSubmitError] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

  function getAvatarColor(index: number) {
    return avatarColors[index % avatarColors.length];
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  function updateField(field: keyof typeof newCustomer, value: string) {
    setNewCustomer((prev) => ({ ...prev, [field]: value }));
  }

  function openViewModal(customer: Customer) {
    setViewingCustomer(customer);
  }

  function openEditModal(customer: Customer) {
    setNewCustomer({ name: customer.name, phone: customer.phone });
    setEditingCustomerId(customer.id);
    setIsFormModalOpen(true);
  }

  function openDeleteConfirm(customer: Customer) {
    setDeletingCustomer(customer);
  }

  function closeFormModal() {
    setIsFormModalOpen(false);
    setEditingCustomerId(null);
    setSubmitError("");
    setNewCustomer({ name: "", phone: "" });
  }

  async function handleSubmitCustomer() {
    setSubmitError("");

    try {
      if (editingCustomerId) {
        await onUpdateCustomer(editingCustomerId, {
          name: newCustomer.name,
          phone: newCustomer.phone,
        });
      } else {
        await onAddCustomer({
          name: newCustomer.name,
          phone: newCustomer.phone,
        });
      }
      closeFormModal();
    } catch {
      setSubmitError(
        "Could not save customer. Check your connection and try again.",
      );
    }
  }

  async function confirmDelete() {
    if (!deletingCustomer) return;
    try {
      await onDeleteCustomer(deletingCustomer.id);
      setDeletingCustomer(null);
    } catch {
      setSubmitError(
        "Could not delete customer. Check your connection and try again.",
      );
      setDeletingCustomer(null);
    }
  }

  // Helper function to get customer order stats
  function getCustomerStats(customerId: string) {
    const customerOrders = orders.filter(
      (order) => order.customerId === customerId,
    );
    const ordersCount = customerOrders.length;
    const amountOwed = customerOrders
      .filter((o) => !o.isPaid)
      .reduce((sum, o) => sum + o.amount, 0);
    return { ordersCount, amountOwed };
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Customers</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Everyone who's ever placed an order.
          </p>
        </div>
        <Button
          icon={<Plus size={18} />}
          onClick={() => setIsFormModalOpen(true)}
        >
          New Customer
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-text-secondary">
          Loading customers…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => {
            const { ordersCount, amountOwed } = getCustomerStats(customer.id);

            return (
              <Card key={customer.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full text-white flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(index)}`}
                    >
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{customer.name}</p>
                      <p className="text-xs text-text-secondary">
                        {customer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openViewModal(customer)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => openEditModal(customer)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(customer)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-danger hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                  <div>
                    <p className="text-base font-bold">{ordersCount}</p>
                    <p className="text-xs text-text-secondary">Orders</p>
                  </div>
                  <div>
                    <p
                      className={`text-base font-bold ${amountOwed > 0 ? "text-danger" : "text-text-primary"}`}
                    >
                      ₦{amountOwed.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-secondary">Balance</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingCustomerId ? "Edit Customer" : "New Customer"}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="e.g. Grace Effiong"
            value={newCustomer.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <Input
            label="Phone number"
            placeholder="e.g. 0803 111 2222"
            value={newCustomer.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          {submitError && <p className="text-xs text-danger">{submitError}</p>}
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={closeFormModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCustomer}>
              {editingCustomerId ? "Save Changes" : "Create Customer"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        title="Delete Customer"
      >
        {deletingCustomer && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">
              Delete{" "}
              <span className="font-semibold text-text-primary">
                {deletingCustomer.name}
              </span>
              ? This can't be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeletingCustomer(null)}
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

      {/* View Customer Modal */}
      <Modal
        isOpen={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        title="Customer Details"
      >
        {viewingCustomer && (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs text-text-secondary">Name</span>
              <p className="text-sm font-medium">{viewingCustomer.name}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary">Phone</span>
              <p className="text-sm font-medium">{viewingCustomer.phone}</p>
            </div>
            {(() => {
              const { ordersCount, amountOwed } = getCustomerStats(
                viewingCustomer.id,
              );
              return (
                <>
                  <div>
                    <span className="text-xs text-text-secondary">Orders</span>
                    <p className="text-sm font-medium">{ordersCount}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary">
                      Balance owed
                    </span>
                    <p className="text-sm font-medium">
                      ₦{amountOwed.toLocaleString()}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
}
