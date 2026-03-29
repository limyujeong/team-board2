import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { Task, Priority } from '../types';

interface CardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const priorityLabels: Record<Priority, string> = {
  low: '낮음',
  medium: '중간',
  high: '높음',
};

export const Card: React.FC<CardProps> = ({ task, onClick, onDragStart }) => {
  return (
    <motion.div
      layoutId={task.id}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileDrag={{ rotate: 3, scale: 1.02, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="group relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab active:cursor-grabbing hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-opacity">
          <MoreHorizontal size={14} />
        </button>
      </div>
      
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center gap-3 mt-auto">
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
            <Calendar size={12} />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
