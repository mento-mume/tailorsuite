export interface Customer {
    id: string
    name: string
    phone: string
    ordersCount: number
    amountOwed: number
  }
  
  export const mockCustomers: Customer[] = [
    { id: 'c1', name: 'Chidi Nwosu', phone: '0802 345 6789', ordersCount: 7, amountOwed: 35000 },
    { id: 'c2', name: 'Funke Alade', phone: '0813 222 9090', ordersCount: 12, amountOwed: 0 },
    { id: 'c3', name: 'Emeka Obi', phone: '0705 888 4433', ordersCount: 3, amountOwed: 60000 },
    { id: 'c4', name: 'Bisi Adeyemi', phone: '0906 112 3344', ordersCount: 5, amountOwed: 150000 },
    { id: 'c5', name: 'Grace Effiong', phone: '0803 111 2222', ordersCount: 1, amountOwed: 180000 },
    { id: 'c6', name: 'Ngozi Umeh', phone: '0701 777 6655', ordersCount: 9, amountOwed: 0 },
  ]