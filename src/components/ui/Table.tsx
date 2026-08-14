interface Column<T> {
    header: string
    render: (row: T) => React.ReactNode
  }
  interface TableProps<T> {
    columns: Column<T>[]
    data: T[]
    keyExtractor: (row: T) => string
  }
  export default function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className="text-left text-sm font-semibold text-text-secondary px-4 py-3 border-b border-[#E5E7EB]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-gray-100">
              {columns.map((column) => (
                <td
                  key={column.header}
                  className="text-sm px-4 h-14 border-b border-[#E5E7EB] last:border-b-0"
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }