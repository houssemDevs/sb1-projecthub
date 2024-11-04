import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task, Comment } from '../types';
import { useStore } from '../store/useStore';
import { XMarkIcon, PaperClipIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  const { currentProject, addComment, addSubtask } = useStore();
  const [newComment, setNewComment] = useState('');
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [newSubtask, setNewSubtask] = useState({ title: '', description: '' });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !newComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      content: newComment,
      createdAt: new Date(),
      user: { id: '1', name: 'Current User', email: 'user@example.com' },
    };

    addComment(currentProject.id, task.id, comment);
    setNewComment('');
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !newSubtask.title.trim()) return;

    const subtask: Task = {
      id: crypto.randomUUID(),
      title: newSubtask.title,
      description: newSubtask.description,
      status: 'todo',
      priority: 'medium',
      creator: { id: '1', name: 'Current User', email: 'user@example.com' },
      projectId: currentProject.id,
      parentId: task.id,
      attachments: [],
      comments: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addSubtask(currentProject.id, task.id, subtask);
    setNewSubtask({ title: '', description: '' });
    setShowSubtaskForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75">
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Task Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{task.description}</p>
              </div>

              <div className="flex space-x-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className="mt-1 text-sm text-gray-900 capitalize">
                    {task.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <span className="mt-1 text-sm text-gray-900 capitalize">
                    {task.priority}
                  </span>
                </div>
                {task.dueDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                    <span className="mt-1 text-sm text-gray-900">
                      {format(task.dueDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Subtasks</h3>
                  <button
                    onClick={() => setShowSubtaskForm(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add Subtask
                  </button>
                </div>
                {showSubtaskForm && (
                  <form onSubmit={handleAddSubtask} className="mb-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Subtask title"
                      value={newSubtask.title}
                      onChange={(e) =>
                        setNewSubtask({ ...newSubtask, title: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newSubtask.description}
                      onChange={(e) =>
                        setNewSubtask({ ...newSubtask, description: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowSubtaskForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                )}
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.status === 'completed'}
                        className="rounded text-blue-600 focus:ring-blue-500"
                        readOnly
                      />
                      <span>{subtask.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Attachments
                </h3>
                <div className="space-y-2">
                  {task.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <PaperClipIcon className="h-4 w-4 text-gray-400" />
                      <a
                        href={attachment.url}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Comments
                </h3>
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {comment.user.name}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                          {comment.content}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {format(comment.createdAt, 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Comment Form */}
                <form onSubmit={handleAddComment} className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};