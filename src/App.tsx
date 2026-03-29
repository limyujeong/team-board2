/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Layout, Search, Bell, User } from 'lucide-react';
import { useKanban } from './hooks/useKanban';
import { Column } from './components/Column';
import { TaskModal } from './components/TaskModal';
import { ThemeToggle } from './components/ThemeToggle';
import { Task } from './types';

export default function App() {
  const {
    data,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumnTitle,
    deleteColumn,
  } = useKanban();

  const [selectedTask, setSelectedTask] = useState<{ task: Task; columnId: string } | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [sourceColId, setSourceColId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string, colId: string) => {
    setDraggedTaskId(taskId);
    setSourceColId(colId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColId', colId);
  };

  const handleDrop = (e: React.DragEvent, destColId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sColId = e.dataTransfer.getData('sourceColId');

    if (taskId && sColId) {
      moveTask(taskId, sColId, destColId, 0); // Always drop at top for simplicity in this demo
    }
    setDraggedTaskId(null);
    setSourceColId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <span className="font-bold text-slate-800 dark:text-slate-100 hidden sm:inline-block">KanbanPro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-700">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="작업 검색..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 w-48"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <Bell size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <User size={18} />
          </div>
        </div>
      </nav>

      <div className="p-6 md:p-8">
        <header className="max-w-[1600px] mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Layout size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">워크스페이스 / 프로젝트</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">팀 업무 보드</h1>
          </div>

          <button
            onClick={() => {
              const title = prompt('새 컬럼 이름을 입력하세요:');
              if (title) addColumn(title);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} /> 컬럼 추가
          </button>
        </header>

        <main className="max-w-[1600px] mx-auto overflow-x-auto pb-8">
          <div className="flex gap-6 items-start min-h-[calc(100vh-250px)]">
            {data.columnOrder.map((colId) => {
              const column = data.columns[colId];
              const tasks = column.taskIds.map((id) => data.tasks[id]);

              return (
                <Column
                  key={colId}
                  column={column}
                  tasks={tasks}
                  onAddTask={(title) => addTask(colId, title)}
                  onTaskClick={(task) => setSelectedTask({ task, columnId: colId })}
                  onUpdateTitle={(title) => updateColumnTitle(colId, title)}
                  onDelete={() => {
                    if (confirm('컬럼과 포함된 모든 작업이 삭제됩니다. 계속하시겠습니까?')) {
                      deleteColumn(colId);
                    }
                  }}
                  onDragStart={(e, taskId) => handleDragStart(e, taskId, colId)}
                  onDrop={(e) => handleDrop(e, colId)}
                />
              );
            })}

            {/* Empty State for New Column */}
            <button
              onClick={() => {
                const title = prompt('새 컬럼 이름을 입력하세요:');
                if (title) addColumn(title);
              }}
              className="w-80 shrink-0 h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">새 컬럼 추가</span>
            </button>
          </div>
        </main>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask.task}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updates) => updateTask(selectedTask.task.id, updates)}
          onDelete={() => {
            deleteTask(selectedTask.task.id, selectedTask.columnId);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
