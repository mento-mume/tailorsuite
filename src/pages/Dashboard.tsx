import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { type Order } from "../data/orderTypes";
import { useNavigate, Link } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  Wallet,
  AlertCircle,
  Plus,
} from "lucide-react";

interface DashboardProps {
  orders: Order[];
  isLoading: boolean;
}
export default function Dashboard({ orders, isLoading }: DashboardProps) {
  const navigate = useNavigate();
  const todaysOrders = orders.slice(0, 4);

  const upcomingDeliveries = orders
    .filter(
      (order) => order.status !== "Delivered" && order.status !== "Cancelled",
    )
    .slice(0, 3);

  const outstandingPayments = orders.filter(
    (order) => !order.isPaid && order.amount > 0,
  );

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled",
  ).length;
  const readyCount = orders.filter((o) => o.status === "Ready").length;
  const totalOwed = outstandingPayments.reduce(
    (sum, order) => sum + order.amount,
    0,
  );
  const recentActivity = [...orders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  const now = new Date();

  const overdueCount = orders.filter((order) => {
    if (order.status === "Delivered" || order.status === "Cancelled")
      return false;
    const due = new Date(order.dueDate);
    return !isNaN(due.getTime()) && due < now;
  }).length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Here's what's happening in your shop today.
          </p>
        </div>
        <Button
          icon={<Plus size={18} />}
          onClick={() => navigate("/orders?new=true")}
        >
          New Order
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-text-secondary">
          Loading dashboard…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Active Orders
                </p>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <ClipboardList size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{activeOrdersCount}</p>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Ready for Pickup
                </p>
                <div className="w-9 h-9 rounded-lg bg-green-50 text-success flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{readyCount}</p>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Outstanding Payments
                </p>
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-warning flex items-center justify-center shrink-0">
                  <Wallet size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">
                ₦{totalOwed.toLocaleString()}
              </p>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary font-medium">
                  Overdue Orders
                </p>
                <div className="w-9 h-9 rounded-lg bg-red-50 text-danger flex items-center justify-center shrink-0">
                  <AlertCircle size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{overdueCount}</p>
            </Card>
          </div>

          <div className="grid grid-cols-[1.6fr_1fr] gap-6 mb-6">
            <Card title="Today's Orders">
              <Link
                to="/orders"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>

              <Table<Order>
                data={todaysOrders}
                keyExtractor={(order) => order.id}
                columns={[
                  { header: "Order", render: (order) => order.id },
                  { header: "Customer", render: (order) => order.customer },
                  { header: "Item", render: (order) => order.item },
                  {
                    header: "Status",
                    render: (order) => <Badge status={order.status} />,
                  },
                ]}
              />
            </Card>

            <Card title="Recent Activity">
              {recentActivity.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start gap-3 py-2.5 border-b border-[#E5E7EB] last:border-b-0"
                >
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-primary" />
                  <div>
                    <p className="text-sm">
                      {order.createdByName} created order for {order.customer}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="grid grid-cols-[1.6fr_1fr] gap-6">
            <Card title="Upcoming Deliveries">
              {upcomingDeliveries.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2.5 border-b border-[#E5E7EB] last:border-b-0"
                >
                  <p className="text-sm">
                    {order.customer} — {order.item}
                  </p>
                  <p className="text-xs text-text-secondary">{order.dueDate}</p>
                </div>
              ))}
            </Card>

            <Card title="Outstanding Payments">
              {outstandingPayments.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2.5 border-b border-[#E5E7EB] last:border-b-0"
                >
                  <p className="text-sm">{order.customer}</p>
                  <p className="text-xs font-semibold text-danger">
                    ₦{order.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
