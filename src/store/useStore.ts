import { create } from 'zustand';
import { Project, Task, User, Comment, Attachment } from '../types';
import { addDays, subDays } from 'date-fns';

// Sample users
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
];

// Sample projects with tasks
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved user experience',
    color: '#FF6B6B',
    members: users,
    tasks: [
      {
        id: '101',
        title: 'Design Homepage',
        description: 'Create a modern and engaging homepage design with clear call-to-actions',
        status: 'completed',
        priority: 'high',
        creator: users[0],
        assignee: users[1],
        projectId: '1',
        dueDate: addDays(new Date(), 5),
        attachments: [
          {
            id: 'a1',
            name: 'homepage-mockup.fig',
            url: '#',
            type: 'figma',
            createdAt: subDays(new Date(), 2),
          },
        ],
        comments: [
          {
            id: 'c1',
            content: 'Design looks great! Ready for development.',
            createdAt: subDays(new Date(), 1),
            user: users[2],
          },
        ],
        subtasks: [],
        createdAt: subDays(new Date(), 5),
        updatedAt: subDays(new Date(), 1),
      },
      {
        id: '102',
        title: 'Implement Responsive Layout',
        description: 'Ensure website works perfectly on all device sizes',
        status: 'in-progress',
        priority: 'medium',
        creator: users[0],
        assignee: users[2],
        projectId: '1',
        dueDate: addDays(new Date(), 7),
        attachments: [],
        comments: [],
        subtasks: [
          {
            id: '102-1',
            title: 'Mobile Navigation',
            description: 'Implement hamburger menu for mobile devices',
            status: 'completed',
            priority: 'medium',
            creator: users[0],
            projectId: '1',
            parentId: '102',
            attachments: [],
            comments: [],
            subtasks: [],
            createdAt: subDays(new Date(), 3),
            updatedAt: subDays(new Date(), 3),
          },
        ],
        createdAt: subDays(new Date(), 4),
        updatedAt: subDays(new Date(), 2),
      },
    ],
    createdAt: subDays(new Date(), 10),
    updatedAt: subDays(new Date(), 1),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Build a cross-platform mobile app for our service using React Native',
    color: '#4ECDC4',
    members: [users[0], users[1]],
    tasks: [
      {
        id: '201',
        title: 'User Authentication',
        description: 'Implement secure login and registration system',
        status: 'todo',
        priority: 'high',
        creator: users[1],
        assignee: users[0],
        projectId: '2',
        dueDate: addDays(new Date(), 3),
        attachments: [],
        comments: [],
        subtasks: [],
        createdAt: subDays(new Date(), 2),
        updatedAt: subDays(new Date(), 2),
      },
      {
        id: '202',
        title: 'Push Notifications',
        description: 'Set up push notifications for important updates',
        status: 'todo',
        priority: 'medium',
        creator: users[1],
        projectId: '2',
        dueDate: addDays(new Date(), 10),
        attachments: [],
        comments: [],
        subtasks: [],
        createdAt: subDays(new Date(), 1),
        updatedAt: subDays(new Date(), 1),
      },
    ],
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 1),
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for product launch',
    color: '#95A5A6',
    members: [users[1], users[2]],
    tasks: [
      {
        id: '301',
        title: 'Social Media Strategy',
        description: 'Develop comprehensive social media strategy for launch',
        status: 'completed',
        priority: 'high',
        creator: users[1],
        assignee: users[2],
        projectId: '3',
        dueDate: addDays(new Date(), 1),
        attachments: [
          {
            id: 'a2',
            name: 'social-media-plan.pdf',
            url: '#',
            type: 'pdf',
            createdAt: subDays(new Date(), 1),
          },
        ],
        comments: [
          {
            id: 'c2',
            content: 'Strategy approved by marketing team',
            createdAt: new Date(),
            user: users[1],
          },
        ],
        subtasks: [],
        createdAt: subDays(new Date(), 3),
        updatedAt: new Date(),
      },
    ],
    createdAt: subDays(new Date(), 7),
    updatedAt: new Date(),
  },
];

interface Store {
  projects: Project[];
  currentProject: Project | null;
  currentUser: User | null;
  
  // Project actions
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setCurrentProject: (project: Project) => void;
  
  // Task actions
  addTask: (projectId: string, task: Task) => void;
  updateTask: (projectId: string, task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  
  // Subtask actions
  addSubtask: (projectId: string, parentTaskId: string, subtask: Task) => void;
  
  // Comment actions
  addComment: (projectId: string, taskId: string, comment: Comment) => void;
  
  // Attachment actions
  addAttachment: (projectId: string, taskId: string, attachment: Attachment) => void;
}

export const useStore = create<Store>((set) => ({
  projects: sampleProjects,
  currentProject: null,
  currentUser: users[0],

  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),

  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    })),

  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    })),

  setCurrentProject: (project) =>
    set(() => ({ currentProject: project })),

  addTask: (projectId, task) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: [...p.tasks, task] }
          : p
      ),
    })),

  updateTask: (projectId, task) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) => (t.id === task.id ? task : t)),
            }
          : p
      ),
    })),

  deleteTask: (projectId, taskId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.filter((t) => t.id !== taskId),
            }
          : p
      ),
    })),

  addSubtask: (projectId, parentTaskId, subtask) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === parentTaskId
                  ? { ...t, subtasks: [...t.subtasks, subtask] }
                  : t
              ),
            }
          : p
      ),
    })),

  addComment: (projectId, taskId, comment) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, comments: [...t.comments, comment] }
                  : t
              ),
            }
          : p
      ),
    })),

  addAttachment: (projectId, taskId, attachment) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, attachments: [...t.attachments, attachment] }
                  : t
              ),
            }
          : p
      ),
    })),
}));