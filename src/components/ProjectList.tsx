import React from 'react';
import { useStore } from '../store/useStore';

export const ProjectList: React.FC = () => {
  const { projects, currentProject, setCurrentProject } = useStore();

  return (
    <div className="bg-gray-50 w-64 p-4 border-r border-gray-200 h-screen">
      <h2 className="text-lg font-semibold mb-4">Projects</h2>
      <div className="space-y-2">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setCurrentProject(project)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              currentProject?.id === project.id
                ? 'bg-blue-100 text-blue-800'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span>{project.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};