import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity._id} className="px-4 py-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className={`inline-block h-8 w-8 rounded-full text-center pt-1 ${
                    activity.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {activity.type === 'income' ? '💰' : '💸'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.description || activity.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} • {activity.category}
                  </p>
                </div>
                <div className={`text-sm font-semibold ${
                  activity.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {activity.type === 'income' ? '+' : '-'}${activity.amount.toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentActivity;