import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProjectList } from './components/ProjectList';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { Squares2X2Icon, ViewColumnsIcon } from '@heroicons/react/24/outline';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <div className="bg-gray-50 w-64 p-4 border-r border-gray-200 h-screen">
          <div className="mb-8">
            <nav className="space-y-2">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Squares2X2Icon className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ViewColumnsIcon className="h-5 w-5 mr-3" />
                Projects
              </Link>
            </nav>
          </div>
          <ProjectList />
        </div>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<TaskList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;