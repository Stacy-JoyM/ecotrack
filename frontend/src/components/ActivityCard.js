import React from "react";
import { ChevronRight } from "lucide-react";


// Activity Card Component
const ActivityCard = ({ icon: Icon, title, time, carbon, bgColor }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="text-gray-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{carbon}</p>
          <p className="text-sm text-gray-500">kg CO</p>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );
};
export default ActivityCard; 