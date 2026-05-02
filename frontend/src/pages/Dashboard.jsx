import { useEffect, useState } from 'react';
import { get } from '../utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    get('/api/tasks/stats/dashboard').then(setStats).catch(console.error);
    get('/api/tasks').then(data => setTasks(data.slice(0, 5))).catch(console.error);
  }, []);

  const isOverdue = (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Here's what's happening with your projects today.</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card todo">
            <div className="stat-number">{stats.todo}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-card progress">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card done">
            <div className="stat-number">{stats.done}</div>
            <div className="stat-label">Done</div>
          </div>
          <div className="stat-card overdue">
            <div className="stat-number">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      )}

      <div className="recent-tasks">
        <h2>Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p className="empty">No tasks yet. Create your first project!</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className={isOverdue(task) ? 'overdue-row' : ''}>
                  <td>{task.title}</td>
                  <td>{task.project?.name || '-'}</td>
                  <td><span className={`status-badge ${task.status}`}>{task.status}</span></td>
                  <td><span className={`priority-badge ${task.priority}`}>{task.priority}</span></td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
