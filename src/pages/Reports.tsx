import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { type Order } from "../data/orderTypes";
import { Wallet, ShoppingBag, TrendingUp, TrendingDown, CheckCircle2, Receipt } from "lucide-react";
import { type Payment } from "../data/paymentTypes";
import { type Expense } from "../data/expensesTypes";
import { isOrderPaid } from "../utils/paymentCalculation";
import {
  getBucketedTotals,
  getPeriodTotals,
  type ReportPeriod,
} from "../utils/reportCalculations";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = {
  revenue: "#2563EB",
  expenses: "#eb6834",
  profit: "#111827",
};

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  month: "This month",
  quarter: "This quarter",
  "6months": "Last 6 months",
  year: "This year",
};

function formatCurrency(value: number) {
  return `₦${Math.round(value).toLocaleString()}`;
}

interface ReportsProps {
  orders: Order[];
  payments: Payment[];
  expenses: Expense[];
  isLoading: boolean;
}

export default function Reports({
  orders,
  payments,
  expenses,
  isLoading,
}: ReportsProps) {
  const [period, setPeriod] = useState<ReportPeriod>("6months");

  const totals = useMemo(
    () => getPeriodTotals(period, payments, expenses),
    [period, payments, expenses],
  );
  const buckets = useMemo(
    () => getBucketedTotals(period, payments, expenses),
    [period, payments, expenses],
  );

  const paidOrders = orders.filter((order) => isOrderPaid(order, payments));
  const totalOrdersCount = orders.length;
  const averageOrderValue =
    totalOrdersCount > 0 ? totals.revenue / totalOrdersCount : 0;
  const isProfitable = totals.profit >= 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Reports</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Revenue, expenses, and profit trends over time.
          </p>
        </div>
        <select
          className="h-11 w-full sm:w-auto rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm bg-white focus:outline-none focus:border-primary"
          value={period}
          onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
        >
          {(Object.keys(PERIOD_LABELS) as ReportPeriod[]).map((key) => (
            <option key={key} value={key}>
              {PERIOD_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className="py-12 text-center text-sm text-text-secondary">
          Loading reports…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Revenue
                </p>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <Wallet size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(totals.revenue)}
              </p>
            </Card>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Expenses
                </p>
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#eb6834] flex items-center justify-center shrink-0">
                  <Receipt size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(totals.expenses)}
              </p>
            </Card>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Profit
                </p>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isProfitable
                      ? "bg-green-50 text-success"
                      : "bg-red-50 text-danger"
                  }`}
                >
                  {isProfitable ? (
                    <TrendingUp size={18} />
                  ) : (
                    <TrendingDown size={18} />
                  )}
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  isProfitable ? "text-success" : "text-danger"
                }`}
              >
                {formatCurrency(totals.profit)}
              </p>
            </Card>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6">
            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Orders Completed
                </p>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <ShoppingBag size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{totalOrdersCount}</p>
            </Card>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Average Order Value
                </p>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <TrendingUp size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(averageOrderValue)}
              </p>
            </Card>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Paid Orders
                </p>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{paidOrders.length}</p>
            </Card>
          </div>
          <Card title="Revenue vs Expenses">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={buckets} barGap={2} barCategoryGap="24%">
                  <CartesianGrid
                    vertical={false}
                    stroke="#E5E7EB"
                    strokeDasharray="0"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    axisLine={{ stroke: "#C3C2B7" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[(min: number) => Math.min(0, min), "auto"]}
                    tickFormatter={(value: number) => {
                      const sign = value < 0 ? "-" : "";
                      const abs = Math.abs(value);
                      return `${sign}${abs >= 1000 ? `${Math.round(abs / 1000)}k` : abs}`;
                    }}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(Number(Array.isArray(value) ? value[0] : value))
                    }
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E5E7EB",
                      fontSize: 13,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 13, color: "#6B7280" }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill={CHART_COLORS.revenue}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill={CHART_COLORS.expenses}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke={CHART_COLORS.profit}
                    strokeWidth={2}
                    dot={{ r: 4, fill: CHART_COLORS.profit, stroke: "#fff", strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
