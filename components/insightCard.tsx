import React from "react";

interface InsightCardProps {
  title: string;
  category: string;
  date: string;
  amount: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  category,
  date,
  amount,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full">
            {category}
          </span>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-gray-800">{amount}</p>
      </div>
    </div>
  );
};

export default InsightCard;
