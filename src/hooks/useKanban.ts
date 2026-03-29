import { useState, useEffect } from 'react';
import { KanbanData, Task, Column, Priority } from '../types';

const STORAGE_KEY = 'kanban-data-v1';

const initialData: KanbanData = {
  tasks: {
    'task-1': { id: 'task-1', title: '프로젝트 기획안 작성', description: '팀 미팅을 위한 기획안 초안을 작성합니다.', priority: 'high', dueDate: '2024-04-01', createdAt: Date.now() },
    'task-2': { id: 'task-2', title: '디자인 시스템 구축', description: 'Figma를 사용하여 기본 컴포넌트를 설계합니다.', priority: 'medium', dueDate: '2024-04-05', createdAt: Date.now() },
    'task-3': { id: 'task-3', title: 'API 문서화', description: 'Swagger를 사용하여 백엔드 API를 문서화합니다.', priority: 'low', createdAt: Date.now() },
  },
  columns: {
    'col-1': { id: 'col-1', title: '할 일', taskIds: ['task-1', 'task-3'] },
    'col-2': { id: 'col-2', title: '진행 중', taskIds: ['task-2'] },
    'col-3': { id: 'col-3', title: '완료', taskIds: [] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
};

export const useKanban = () => {
  const [data, setData] = useState<KanbanData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTask = (columnId: string, title: string) => {
    const newTaskId = `task-${Math.random().toString(36).substr(2, 9)}`;
    const newTask: Task = {
      id: newTaskId,
      title,
      description: '',
      priority: 'medium',
      createdAt: Date.now(),
    };

    setData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [newTaskId]: newTask },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          taskIds: [newTaskId, ...prev.columns[columnId].taskIds],
        },
      },
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { ...prev.tasks[taskId], ...updates },
      },
    }));
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setData(prev => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...prev.columns[columnId],
            taskIds: prev.columns[columnId].taskIds.filter(id => id !== taskId),
          },
        },
      };
    });
  };

  const moveTask = (taskId: string, sourceColId: string, destColId: string, index: number) => {
    setData(prev => {
      const sourceTaskIds = [...prev.columns[sourceColId].taskIds];
      sourceTaskIds.splice(sourceTaskIds.indexOf(taskId), 1);

      const destTaskIds = sourceColId === destColId ? sourceTaskIds : [...prev.columns[destColId].taskIds];
      destTaskIds.splice(index, 0, taskId);

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [sourceColId]: { ...prev.columns[sourceColId], taskIds: sourceTaskIds },
          [destColId]: { ...prev.columns[destColId], taskIds: destTaskIds },
        },
      };
    });
  };

  const addColumn = (title: string) => {
    const newColId = `col-${Math.random().toString(36).substr(2, 9)}`;
    setData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newColId]: { id: newColId, title, taskIds: [] },
      },
      columnOrder: [...prev.columnOrder, newColId],
    }));
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    setData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], title },
      },
    }));
  };

  const deleteColumn = (columnId: string) => {
    setData(prev => {
      const newColumns = { ...prev.columns };
      const taskIdsToRemove = newColumns[columnId].taskIds;
      delete newColumns[columnId];

      const newTasks = { ...prev.tasks };
      taskIdsToRemove.forEach(id => delete newTasks[id]);

      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns,
        columnOrder: prev.columnOrder.filter(id => id !== columnId),
      };
    });
  };

  return {
    data,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumnTitle,
    deleteColumn,
  };
};
