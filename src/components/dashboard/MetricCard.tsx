export const MetricCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  valueColor = "text-slate-900",
  subtitle,
}: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center mr-4`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              {title}
            </p>
            <p className={`text-2xl font-semibold mt-1 ${valueColor}`}>
              {value}
              {subtitle && (
                <span className="text-sm ml-1 text-orange-500">{subtitle}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
