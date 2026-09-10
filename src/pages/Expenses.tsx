import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { type Expense, type ExpenseCategory } from "../data/expensesTypes";
import { Shirt, Users, Zap, Wrench } from "lucide-react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const categoryStyles: Record<
  ExpenseCategory,
  { bg: string; text: string; icon: ReactNode }
> = {
  Materials: {
    bg: "bg-blue-50",
    text: "text-primary",
    icon: <Shirt size={18} />,
  },
  Labor: { bg: "bg-amber-50", text: "text-warning", icon: <Users size={18} /> },
  Utilities: {
    bg: "bg-green-50",
    text: "text-success",
    icon: <Zap size={18} />,
  },
  Equipment: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    icon: <Wrench size={18} />,
  },
};

interface ExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
  onAddExpense: (
    expense: Omit<Expense, "id" | "createdBy" | "createdByName" | "createdAt">,
  ) => Promise<void>;
  onUpdateExpense: (
    expenseId: string,
    updates: Partial<
      Omit<Expense, "id" | "createdBy" | "createdByName" | "createdAt">
    >,
  ) => Promise<void>;
  onDeleteExpense: (expenseId: string) => Promise<void>;
}

export default function Expenses({
  expenses,
  isLoading,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
}: ExpensesProps) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "Materials" as ExpenseCategory,
    date: "",
    amount: "",
  });

  function updateField(field: keyof typeof newExpense, value: string) {
    setNewExpense((prev) => ({ ...prev, [field]: value }));
  }

  function openViewModal(expense: Expense) {
    setViewingExpense(expense);
  }

  function openEditModal(expense: Expense) {
    setNewExpense({
      name: expense.name,
      category: expense.category,
      date: expense.date,
      amount: expense.amount.toString(),
    });
    setEditingExpenseId(expense.id);
    setIsFormModalOpen(true);
  }

  function openDeleteConfirm(expense: Expense) {
    setDeletingExpense(expense);
  }

  function closeFormModal() {
    setIsFormModalOpen(false);
    setEditingExpenseId(null);
    setSubmitError("");
    setNewExpense({ name: "", category: "Materials", date: "", amount: "" });
  }

  async function handleSubmitExpense() {
    setSubmitError("");

    try {
      if (editingExpenseId) {
        await onUpdateExpense(editingExpenseId, {
          name: newExpense.name,
          category: newExpense.category,
          date: newExpense.date,
          amount: Number(newExpense.amount) || 0,
        });
      } else {
        await onAddExpense({
          name: newExpense.name,
          category: newExpense.category,
          date: newExpense.date,
          amount: Number(newExpense.amount) || 0,
        });
      }
      closeFormModal();
    } catch {
      setSubmitError(
        "Could not save expense. Check your connection and try again.",
      );
    }
  }

  async function confirmDelete() {
    if (!deletingExpense) return;
    try {
      await onDeleteExpense(deletingExpense.id);
      setDeletingExpense(null);
    } catch {
      setSubmitError(
        "Could not delete expense. Check your connection and try again.",
      );
      setDeletingExpense(null);
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Expenses</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Fabric, labor, and running costs.
          </p>
        </div>
        <Button
          icon={<Plus size={18} />}
          onClick={() => setIsFormModalOpen(true)}
        >
          Add Expense
        </Button>
      </div>
      {isLoading ? (
        <div className="py-12 text-center text-sm text-text-secondary">
          Loading expenses…
        </div>
      ) : (
        <Card title="This month">
          {expenses.map((expense) => {
            const style = categoryStyles[expense.category];
            return (
              <div
                key={expense.id}
                className="flex items-center gap-4 py-4 border-b border-[#E5E7EB] last:border-b-0"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}
                >
                  {style.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{expense.name}</p>
                  <p className="text-xs text-text-secondary">
                    {expense.category} · {expense.date}
                  </p>
                </div>
                <p className="text-sm font-bold ml-auto">
                  ₦{expense.amount.toLocaleString()}
                </p>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openViewModal(expense)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => openEditModal(expense)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(expense)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-danger hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingExpenseId ? "Edit Expense" : "Add Expense"}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Description"
            placeholder="e.g. Ankara fabric — 40 yards"
            value={newExpense.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">
              Category
            </label>
            <select
              value={newExpense.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm bg-white focus:outline-none focus:border-primary"
            >
              {(
                [
                  "Materials",
                  "Labor",
                  "Utilities",
                  "Equipment",
                ] as ExpenseCategory[]
              ).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Date"
            type="date"
            value={newExpense.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
          <Input
            label="Amount (₦)"
            type="number"
            placeholder="0"
            value={newExpense.amount}
            onChange={(e) => updateField("amount", e.target.value)}
          />
          {submitError && <p className="text-xs text-danger">{submitError}</p>}
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={closeFormModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmitExpense}>
              {editingExpenseId ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        title="Delete Expense"
      >
        {deletingExpense && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">
              Delete{" "}
              <span className="font-semibold text-text-primary">
                {deletingExpense.name}
              </span>
              ? This can't be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeletingExpense(null)}
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
        isOpen={!!viewingExpense}
        onClose={() => setViewingExpense(null)}
        title="Expense Details"
      >
        {viewingExpense && (
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs text-text-secondary">Description</span>
              <p className="text-sm font-medium">{viewingExpense.name}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary">Category</span>
              <p className="text-sm font-medium">{viewingExpense.category}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary">Date</span>
              <p className="text-sm font-medium">{viewingExpense.date}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary">Amount</span>
              <p className="text-sm font-medium">
                ₦{viewingExpense.amount.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
