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
