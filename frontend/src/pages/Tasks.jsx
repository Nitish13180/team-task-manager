import { useEffect, useState } from 'react';
import { get, post, put, del } from '../utils/api';
import './Projects.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', project: '', priority: 'medium', dueDate: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = () => {
    get('/api/tasks').then(setTasks).catch(console.error);
    get('/api/projects').then(setProjects).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await post('/api/tasks', form);
      setForm({ title: '', description: '', project: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await put(`/api/tasks/${id}`, { status });
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await del(`/api/tasks/${id}`);
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const filtered = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);
  const isOverdue = (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Tasks</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <form className="create-form" onSubmit={handleCreate}>
          <input placeholder="Task Title" value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea placeholder="Description" value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} />
          <select value={form.project} onChange={e => setForm({...form, project: e.target.value})} required>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input type="date" value={form.dueDate}
            onChange={e => setForm({...form, dueDate: e.target.value})} />
          <button type="submit" className="btn-primary">Create Task</button>
        </form>
      )}

      <div className="filter-bar">
        {['all', 'todo', 'in-progress', 'done'].map(s => (
          <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}>
            {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {filtered.length === 0 ? (
          <p className="empty">No tasks found.</p>
        ) : filtered.map(task => (
          <div className={`task-card ${isOverdue(task) ? 'overdue' : ''}`} key={task._id}>
            <div className="card-header">
              <h3>{task.title}</h3>
              <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
            </div>
            <p className="card-desc">{task.description || 'No description'}</p>
            <p className="task-meta">📁 {task.project?.name} · 👤 {task.assignedTo?.name || 'Unassigned'}</p>
            {task.dueDate && (
              <p className={`due-date ${isOverdue(task) ? 'overdue-text' : ''}`}>
                📅 {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue(task) && ' ⚠️ Overdue'}
              </p>
            )}
            <div className="card-actions">
              <select value={task.status} onChange={e => handleStatusChange(task._id, e.target.value)}
                className={`status-select ${task.status}`}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {user.role === 'admin' && (
                <button className="btn-danger-sm" onClick={() => handleDelete(task._id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
