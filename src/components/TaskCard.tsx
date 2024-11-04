import React from 'react';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
  };

  return (
    <div
      onClick={() => onClick(task)}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[task.status]
            }`}
          >
            {task.status}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          {task.dueDate && (
            <span>{format(task.dueDate, 'MMM d')}</span>
          )}
          {task.attachments.length > 0 && (
            <span>📎 {task.attachments.length}</span>
          )}
          {task.comments.length > 0 && (
            <span>💬 {task.comments.length}</span>
          )}
        </div>
      </div>
      
      {task.subtasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Subtasks: {task.subtasks.filter(st => st.status === 'completed').length}/{task.subtasks.length}
          </div>
        </div>
      )}
    </div>
  );
};