import { useEffect, useState } from 'react';
import { get, post, put, del } from '../utils/api';
import './Projects.css';
 
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [managingProject, setManagingProject] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
 
  const fetchProjects = () => get('/api/projects').then(setProjects).catch(console.error);
  const fetchUsers = () => get('/api/users').then(setUsers).catch(console.error);
 
  useEffect(() => {
    fetchProjects();
    if (user.role === 'admin') fetchUsers();
  }, []);
 
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
 
  const handleAddMember = async (projectId, userId, currentMembers) => {
    const memberIds = currentMembers.map(m => m._id || m);
    if (memberIds.includes(userId)) {
      alert('User already a member!');
      return;
    }
    try {
      await put(`/api/projects/${projectId}`, { members: [...memberIds, userId] });
      fetchProjects();
      setManagingProject(null);
    } catch (err) {
      alert(err.message);
    }
  };
 
  const handleRemoveMember = async (projectId, userId, currentMembers) => {
    const memberIds = currentMembers.map(m => m._id || m).filter(id => id !== userId);
    try {
      await put(`/api/projects/${projectId}`, { members: memberIds });
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
            
            {/* Members Section */}
            <div className="members-section">
              <p className="members-title">👥 Members ({project.members?.length || 0})</p>
              <div className="members-list">
                {project.members?.map(member => (
                  <div key={member._id} className="member-tag">
                    {member.name}
                    {user.role === 'admin' && (
                      <button className="remove-member" onClick={() => handleRemoveMember(project._id, member._id, project.members)}>×</button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Add Member Dropdown (Admin only) */}
              {user.role === 'admin' && (
                <div className="add-member-section">
                  {managingProject === project._id ? (
                    <div className="member-select-box">
                      <select onChange={e => e.target.value && handleAddMember(project._id, e.target.value, project.members)} defaultValue="">
                        <option value="">+ Select member to add</option>
                        {users.filter(u => u.role === 'member' && !project.members?.find(m => m._id === u._id)).map(u => (
                          <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                      <button className="btn-cancel-sm" onClick={() => setManagingProject(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button className="btn-add-member" onClick={() => setManagingProject(project._id)}>+ Add Member</button>
                  )}
                </div>
              )}
            </div>
 
            <div className="card-footer">
              <span>👤 {project.owner?.name}</span>
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