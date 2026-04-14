import React from 'react';

const StatCard = ({ title, amount, type }) => {
  const getGradient = () => {
    switch (type) {
      case 'income':
        return 'from-green-400 to-green-600';
      case 'expense':
        return 'from-red-400 to-red-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getGradient()} rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-2">{amount}</p>
        </div>
        <div className="text-4xl opacity-50">
          {type === 'income' && '💰'}
          {type === 'expense' && '💸'}
          {type === 'balance' && '⚖️'}
        </div>
      </div>
    </div>
  );
};

export default StatCard;