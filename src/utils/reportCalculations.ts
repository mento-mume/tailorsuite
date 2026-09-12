import type { Payment } from "../data/paymentTypes";
import type { Expense } from "../data/expensesTypes";

export type ReportPeriod = "month" | "quarter" | "6months" | "year";

export interface PeriodTotals {
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ReportBucket extends PeriodTotals {
  label: string;
}

interface Range {
  start: number;
  end: number;
}

export function getPeriodRange(period: ReportPeriod): Range {
  const now = new Date();
  let start: Date;

  switch (period) {
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter":
      start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    case "6months":
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return { start: start.getTime(), end: now.getTime() };
}

function getMonthBuckets(startYear: number, startMonth: number, count: number): Range[] {
  const buckets: Range[] = [];
  for (let i = 0; i < count; i++) {
    const monthStart = new Date(startYear, startMonth + i, 1);
    const monthEnd = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    buckets.push({ start: monthStart.getTime(), end: monthEnd.getTime() });
  }
  return buckets;
}

function getBucketRanges(period: ReportPeriod): { label: string; range: Range }[] {
  const now = new Date();

  if (period === "month") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const buckets: { label: string; range: Range }[] = [];
    for (let day = 1; day <= daysInMonth; day += 7) {
      const endDay = Math.min(day + 6, daysInMonth);
      const start = new Date(now.getFullYear(), now.getMonth(), day).getTime();
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        endDay,
        23,
        59,
        59,
        999,
      ).getTime();
      buckets.push({ label: `Week ${buckets.length + 1}`, range: { start, end } });
    }
    return buckets;
  }

  const monthCount = period === "quarter" ? 3 : period === "6months" ? 6 : 12;
  let startYear = now.getFullYear();
  let startMonth: number;

  if (period === "quarter") {
    startMonth = Math.floor(now.getMonth() / 3) * 3;
  } else if (period === "6months") {
    const anchor = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    startYear = anchor.getFullYear();
    startMonth = anchor.getMonth();
  } else {
    startMonth = 0;
  }

  return getMonthBuckets(startYear, startMonth, monthCount).map((range) => ({
    label: new Date(range.start).toLocaleDateString("en-US", { month: "short" }),
    range,
  }));
}

function sumInRange(range: Range, timestamps: { at: number; amount: number }[]): number {
  return timestamps
    .filter((t) => t.at >= range.start && t.at <= range.end)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getPeriodTotals(
  period: ReportPeriod,
  payments: Payment[],
  expenses: Expense[],
): PeriodTotals {
  const range = getPeriodRange(period);
  const revenue = sumInRange(
    range,
    payments.map((p) => ({ at: p.paidAt, amount: p.amount })),
  );
  const expenseTotal = sumInRange(
    range,
    expenses.map((e) => ({ at: new Date(e.date).getTime(), amount: e.amount })),
  );

  return { revenue, expenses: expenseTotal, profit: revenue - expenseTotal };
}

export function getBucketedTotals(
  period: ReportPeriod,
  payments: Payment[],
  expenses: Expense[],
): ReportBucket[] {
  const paymentPoints = payments.map((p) => ({ at: p.paidAt, amount: p.amount }));
  const expensePoints = expenses.map((e) => ({
    at: new Date(e.date).getTime(),
    amount: e.amount,
  }));

  return getBucketRanges(period).map(({ label, range }) => {
    const revenue = sumInRange(range, paymentPoints);
    const expenseTotal = sumInRange(range, expensePoints);
    return { label, revenue, expenses: expenseTotal, profit: revenue - expenseTotal };
  });
}
