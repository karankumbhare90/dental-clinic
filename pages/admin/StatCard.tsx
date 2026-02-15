import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface StatCardProps {
    title: string
    value: string
    change: string
    isUp: boolean
    icon: React.ElementType
    color: string
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    isUp,
    icon: Icon,
    color,
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start z-10">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                        {value}
                    </h3>
                </div>
                <div className={`p-2 rounded-lg text-white ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {/* KEEPING YOUR COMMENTED TREND CODE EXACTLY AS IS */}
            {/* 
      <div className="flex items-center gap-1 mt-4 z-10">
        {isUp ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-xs font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
        <span className="text-xs text-slate-400 ml-1">vs last period</span>
      </div>
      */}

            <div
                className={`absolute -right-6 -bottom-6 w-24 h-24 opacity-5 rounded-full group-hover:scale-110 transition-transform duration-500 ${color}`}
            />
        </div>
    )
}

export default StatCard
