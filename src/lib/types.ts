type ServerError = {
  field: string;
  message: string;
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
  subtitle?: string;
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

type Tx = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amountCents: number;
  currency: string;
  category: string;
  description?: string;
  occurredAt: string;
};

type Filters = {
  type?: string;
  category?: string;
  start?: string;
  end?: string;
};
