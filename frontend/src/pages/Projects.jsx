import { useEffect, useState } from 'react';
import { get, post, del } from '../utils/api';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProjects = () => get('/api/projects').then(setProjects).catch(console.error);

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post('/api/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await del(`/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Projects</h1>
        {user.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="create-form" onSubmit={handleCreate}>
          <input placeholder="Project Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} required />
          <textarea placeholder="Description (optional)" value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      )}

      <div className="cards-grid">
        {projects.length === 0 ? (
          <p className="empty">No projects yet. {user.role === 'admin' ? 'Create one!' : 'Ask your admin.'}</p>
        ) : projects.map(project => (
          <div className="project-card" key={project._id}>
            <div className="card-header">
              <h3>{project.name}</h3>
              <span className={`status-dot ${project.status}`}>{project.status}</span>
            </div>
            <p className="card-desc">{project.description || 'No description'}</p>
            <div className="card-footer">
              <span>👤 {project.owner?.name}</span>
              <span>👥 {project.members?.length || 0} members</span>
              {user.role === 'admin' && (
                <button className="btn-danger-sm" onClick={() => handleDelete(project._id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
