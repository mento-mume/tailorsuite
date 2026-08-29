export type ExpenseCategory = 'Materials' | 'Labor' | 'Utilities' | 'Equipment'

export interface Expense {
  id: string
  name: string
  category: ExpenseCategory
  date: string
  amount: number
}

export const mockExpenses: Expense[] = [
  { id: 'e1', name: 'Ankara fabric — 40 yards', category: 'Materials', date: 'Aug 4', amount: 120000 },
  { id: 'e2', name: 'Tailor apprentice wages', category: 'Labor', date: 'Aug 1', amount: 85000 },
  { id: 'e3', name: 'Generator fuel', category: 'Utilities', date: 'Jul 30', amount: 15000 },
  { id: 'e4', name: 'Sewing machine servicing', category: 'Equipment', date: 'Jul 27', amount: 22000 },
]
