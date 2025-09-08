export const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};
