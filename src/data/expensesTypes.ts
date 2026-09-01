export type ExpenseCategory = 'Materials' | 'Labor' | 'Utilities' | 'Equipment'

export interface Expense {
  id: string
  name: string
  category: ExpenseCategory
  date: string
  amount: number
}

