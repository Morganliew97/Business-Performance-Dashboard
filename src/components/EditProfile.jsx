import { useState } from 'react';

export default function EditProfile() {
  const [name, setName] = useState('Jordan Morgan');

  return (
    <div className="min-h-screen bg-navy-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-navy-900 rounded-xl border border-white/10 p-6">
          <h1 className="text-2xl font-bold text-white mb-4">TEST - Edit Profile</h1>
          
          {/* Simple input field */}
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-navy-800 text-white border border-accent-500 text-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
          
          <p className="text-white mt-4">Name: {name}</p>
          
          <button
            onClick={() => alert(`Name: ${name}`)}
            className="mt-4 px-4 py-2 bg-accent-500 text-white rounded-lg"
          >
            Test Save
          </button>
        </div>
      </div>
    </div>
  );
}