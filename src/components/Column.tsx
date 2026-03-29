import React, { useState } from 'react';
import { Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Column as ColumnType, Task } from '../types';
import { Card } from './Card';
import { AnimatePresence, motion } from 'motion/react';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (title: string) => void;
  onTaskClick: (task: Task) => void;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onTaskClick,
  onUpdateTitle,
  onDelete,
  onDragStart,
  onDrop,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleTitleSubmit = () => {
    if (title.trim()) {
      onUpdateTitle(title);
      setIsEditing(false);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle);
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div
      className="flex flex-col w-80 shrink-0 h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-4 px-2 group">
        {isEditing ? (
          <input
            autoFocus
            className="bg-white dark:bg-slate-800 border border-blue-500 rounded px-2 py-1 text-sm font-bold w-full focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
          />
        ) : (
          <div className="flex items-center gap-2 overflow-hidden">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
              {column.title}
            </h2>
            <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md">
              {tasks.length}
            </span>
          </div>
        )}

        <div className="relative flex items-center gap-1">
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-8 z-20 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden"
                >
                  <button
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Edit2 size={12} /> 이름 수정
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={12} /> 삭제
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[100px] pb-4">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onDragStart={(e) => onDragStart(e, task.id)}
            />
          ))}
        </AnimatePresence>

        {isAdding ? (
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-blue-500 shadow-sm">
            <textarea
              autoFocus
              placeholder="할 일을 입력하세요..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none resize-none mb-2"
              rows={2}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTask();
                }
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700"
              >
                취소
              </button>
              <button
                onClick={handleAddTask}
                className="px-3 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                추가
              </button>
            </div>
          </div>
        ) : (
          tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500">
              <p className="text-[10px] font-bold uppercase tracking-widest">비어 있음</p>
              <p className="text-[10px] mt-1">카드를 드래그하거나 추가하세요</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
