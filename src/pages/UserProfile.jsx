// src/pages/UserProfile.jsx
import { useState } from 'react';
import { Edit2, Save, X, Mail, Building2, ShieldCheck } from 'lucide-react';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Jordan Morgan',
    email: 'jordan.morgan@meridian-analytics.com',
    title: 'Director of Financial Planning & Analysis',
    department: 'Finance',
    accessLevel: 'Administrator'
  });
  const [originalData, setOriginalData] = useState({ ...formData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = () => {
    alert(`✅ Profile Updated!\n\n` +
          `Name: ${formData.name}\n` +
          `Title: ${formData.title}\n` +
          `Email: ${formData.email}\n` +
          `Department: ${formData.department}\n` +
          `Access Level: ${formData.accessLevel}`);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="rounded-card border border-ink-200 bg-surface p-4 shadow-card">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[13.5px] font-semibold text-ink-900">Profile</h3>
            <p className="text-[12px] text-ink-500">
              {isEditing ? '✏️ Editing mode - make your changes' : 'View your account details'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors text-[12px] font-medium"
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-100 text-ink-700 rounded-md hover:bg-ink-200 transition-colors text-[12px] font-medium"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-[12px] font-medium"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-[20px] font-semibold text-accent-600">
            {formData.name.charAt(0)}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-[15px] font-semibold text-ink-900 bg-transparent border-b border-accent-500 focus:outline-none w-full"
              />
            ) : (
              <p className="text-[15px] font-semibold text-ink-900">{formData.name}</p>
            )}
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="text-[12.5px] text-ink-500 bg-transparent border-b border-accent-500 focus:outline-none w-full"
              />
            ) : (
              <p className="text-[12.5px] text-ink-500">{formData.title}</p>
            )}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-3.5 border-t border-ink-100 pt-5 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <Mail size={16} className="mt-0.5 text-ink-400" />
            <div className="flex-1">
              <dt className="text-[11.5px] text-ink-500">Email</dt>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-[13px] text-ink-900 bg-transparent border-b border-accent-500 focus:outline-none w-full"
                />
              ) : (
                <dd className="text-[13px] text-ink-900">{formData.email}</dd>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 size={16} className="mt-0.5 text-ink-400" />
            <div className="flex-1">
              <dt className="text-[11.5px] text-ink-500">Department</dt>
              {isEditing ? (
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="text-[13px] text-ink-900 bg-transparent border-b border-accent-500 focus:outline-none w-full"
                >
                  <option value="Finance">Finance</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">Human Resources</option>
                </select>
              ) : (
                <dd className="text-[13px] text-ink-900">{formData.department}</dd>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck size={16} className="mt-0.5 text-ink-400" />
            <div className="flex-1">
              <dt className="text-[11.5px] text-ink-500">Access level</dt>
              {isEditing ? (
                <select
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={handleChange}
                  className="text-[13px] text-ink-900 bg-transparent border-b border-accent-500 focus:outline-none w-full"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                  <option value="Viewer">Viewer</option>
                </select>
              ) : (
                <dd className="text-[13px] text-ink-900">{formData.accessLevel}</dd>
              )}
            </div>
          </div>
        </dl>

        {/* Status Indicator */}
        <div className={`mt-4 p-2 rounded-md text-[11px] ${
          isEditing 
            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {isEditing 
            ? '✏️ Editing mode enabled - fields are editable' 
            : '🔒 View mode - click "Edit Profile" to make changes'}
        </div>
      </div>
    </div>
  );
}