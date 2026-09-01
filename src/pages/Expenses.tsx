import { useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { type Expense, type ExpenseCategory, } from '../data/expensesTypes'
import { Shirt, Users, Zap, Wrench } from 'lucide-react'



const categoryStyles: Record<ExpenseCategory, { bg: string; text: string; icon: ReactNode }> = {
  Materials: { bg: 'bg-blue-50', text: 'text-primary', icon: <Shirt size={18} /> },
  Labor: { bg: 'bg-amber-50', text: 'text-warning', icon: <Users size={18} /> },
  Utilities: { bg: 'bg-green-50', text: 'text-success', icon: <Zap size={18} /> },
  Equipment: { bg: 'bg-violet-50', text: 'text-violet-600', icon: <Wrench size={18} /> },
}

interface ExpensesProps {
    expenses: Expense[]
    onAddExpense: (expense: Omit<Expense, 'id'>) => void
  }
  
  export default function Expenses({ expenses, onAddExpense }: ExpensesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newExpense, setNewExpense] = useState({
      name: '',
      category: 'Materials' as ExpenseCategory,
      date: '',
      amount: '',
    })
  
    function updateField(field: keyof typeof newExpense, value: string) {
      setNewExpense((prev) => ({ ...prev, [field]: value }))
    }
  
    function closeModal() {
      setIsModalOpen(false)
      setNewExpense({ name: '', category: 'Materials', date: '', amount: '' })
    }
  
    async function handleCreateExpense() {
      const expense: Omit<Expense, 'id'> = {
        name: newExpense.name,
        category: newExpense.category,
        date: newExpense.date,
        amount: Number(newExpense.amount) || 0,
      }
  
      await onAddExpense(expense)
      closeModal()
    }
  
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold">Expenses</h1>
            <p className="text-sm text-text-secondary mt-0.5">Fabric, labor, and running costs.</p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Add Expense
          </Button>
        </div>
  
        <Card title="This month">
          {expenses.map((expense) => {
            const style = categoryStyles[expense.category]
            return (
              <div key={expense.id} className="flex items-center gap-4 py-4 border-b border-[#E5E7EB] last:border-b-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                  {style.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{expense.name}</p>
                  <p className="text-xs text-text-secondary">{expense.category} · {expense.date}</p>
                </div>
                <p className="text-sm font-bold ml-auto">₦{expense.amount.toLocaleString()}</p>
              </div>
            )
          })}
        </Card>
  
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Expense">
          <div className="flex flex-col gap-4">
            <Input
              label="Description"
              placeholder="e.g. Ankara fabric — 40 yards"
              value={newExpense.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
  
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm bg-white focus:outline-none focus:border-primary"
              >
                {(['Materials', 'Labor', 'Utilities', 'Equipment'] as ExpenseCategory[]).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
  
            <Input
              label="Date"
              type="date"
              value={newExpense.date}
              onChange={(e) => updateField('date', e.target.value)}
            />
  
            <Input
              label="Amount (₦)"
              type="number"
              placeholder="0"
              value={newExpense.amount}
              onChange={(e) => updateField('amount', e.target.value)}
            />
  
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleCreateExpense}>Add Expense</Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }