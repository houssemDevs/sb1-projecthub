import React from 'react';
import { useStore } from '../store/useStore';
import { Project, Task } from '../types';
import { format } from 'date-fns';
import { ChartBarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const { projects, setCurrentProject } = useStore();

  const getProjectProgress = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getTasksByStatus = (project: Project) => {
    return project.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<Task['status'], number>);
  };

  const getUpcomingTasks = (project: Project) => {
    const today = new Date();
    return project.tasks.filter(task => 
      task.dueDate && 
      task.status !== 'completed' && 
      task.dueDate > today
    ).length;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const progress = getProjectProgress(project);
          const tasksByStatus = getTasksByStatus(project);
          const upcomingTasks = getUpcomingTasks(project);

          return (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCurrentProject(project)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(project.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <ChartBarIcon className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                    <div className="text-sm font-medium text-gray-900">
                      {tasksByStatus['todo'] || 0}
                    </div>
                    <div className="text-xs text-gray-500">To Do</div>
                  </div>
                  <div className="text-center">
                    <ClockIcon className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                    <div className="text-sm font-medium text-gray-900">
                      {tasksByStatus['in-progress'] || 0}
                    </div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div className="text-center">
                    <UserGroupIcon className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                    <div className="text-sm font-medium text-gray-900">
                      {project.members.length}
                    </div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>

                {upcomingTasks > 0 && (
                  <div className="text-sm text-gray-600">
                    {upcomingTasks} upcoming {upcomingTasks === 1 ? 'task' : 'tasks'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};