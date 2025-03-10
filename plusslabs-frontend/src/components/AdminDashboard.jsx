import React, { useState } from 'react';
import PatientManagement from './PatientManagement';
import TestManagement from './TestManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button className={`px-4 py-2 rounded ${activeTab === 'patients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('patients')}>
          Patients
        </button>
        <button className={`px-4 py-2 rounded ${activeTab === 'tests' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('tests')}>
          Tests
        </button>
      </div>
      {activeTab === 'patients' ? <PatientManagement /> : <TestManagement />}
    </div>
  );
};

export default AdminDashboard;
