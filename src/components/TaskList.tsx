import React, { useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { TaskDetail } from './TaskDetail';
import { useStore } from '../store/useStore';
import { Modal } from './Modal';
import { TaskForm } from './TaskForm';
import { PlusIcon } from '@heroicons/react/24/outline';

export const TaskList: React.FC = () => {
  const { currentProject } = useStore();
  const [filter, setFilter] = useState<Task['status']>('todo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!currentProject) {
    return (
      <div className="p-8 text-center text-gray-500">
        Select a project to view tasks
      </div>
    );
  }

  const filteredTasks = currentProject.tasks.filter(
    (task) => task.status === filter && !task.parentId
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{currentProject.name}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {(['todo', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === status
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={(task) => setSelectedTask(task)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};