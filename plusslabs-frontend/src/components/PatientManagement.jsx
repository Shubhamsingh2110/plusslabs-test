import React, { useState, useEffect } from 'react';

const PatientManagement = () => {
  // Updated formData to match patient model
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    dob: "",
    gender: "",
    bloodType: "",
    weight: "",
    medicalHistory: "" // as comma-separated string; will split to array on submit
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all'); // example filter

  // Fetch patients from backend
  useEffect(() => {
    fetch('http://localhost:3000/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error(err));
  }, []);

  const refreshPatients = () => {
    fetch('http://localhost:3000/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Build payload matching patient model.
    // Convert medicalHistory string into an array
    const historyArray = formData.medicalHistory.split(',').map(item => item.trim()).filter(Boolean);

    const payload = formData.id 
      ? { ...formData, medicalHistory: historyArray, weight: Number(formData.weight) }
      : { 
          // Generator for dummy userId; in production, use authenticated user id
          userId: "64edfe875fd536e0f8a0b2a3",
          dob: formData.dob,
          gender: formData.gender,
          bloodType: formData.bloodType,
          weight: Number(formData.weight),
          medicalHistory: historyArray,
          pastTests: [] // leave empty on creation
        };

    try {
      if(formData.id) {
        await fetch(`http://localhost:3000/api/patients/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('http://localhost:3000/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      refreshPatients();
      setFormData({ id: null, dob: "", gender: "", bloodType: "", weight:"", medicalHistory: "" });
    } catch (error) {
      console.error("Error submitting patient:", error);
    }
  };

  const handleEdit = (patient) => {
    // When editing, join array fields for medicalHistory into comma-separated string
    setFormData({
      id: patient._id || patient.id,
      dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : "",
      gender: patient.gender,
      bloodType: patient.bloodType,
      weight: patient.weight,
      medicalHistory: patient.medicalHistory ? patient.medicalHistory.join(', ') : ""
    });
  };

  // Filtering logic example (filter by gender)
  const displayedPatients = patients.filter(p => {
    const matchesGender = filterGender === 'all' ? true : p.gender === filterGender;
    return matchesGender;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Patient Management</h2>
      
      {/* Patient Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
        <label>
          Date of Birth:
          <input
            type="date"
            value={formData.dob || ""}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="block w-full border rounded px-3 py-2"
          />
        </label>
        <label>
          Gender:
          <select
            value={formData.gender || ""}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="block w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Blood Type (e.g., O+)"
          value={formData.bloodType || ""}
          onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
          className="block w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Weight in kg"
          value={formData.weight || ""}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          className="block w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Medical History (comma separated)"
          value={formData.medicalHistory || ""}
          onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
          className="block w-full border rounded px-3 py-2"
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {formData.id ? 'Edit Patient' : 'Add Patient'}
        </button>
      </form>

      {/* Filter by Gender */}
      <div className="flex gap-4 mb-4">
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Patient List */}
      <div>
        {displayedPatients.length ? (
          displayedPatients.map(patient => (
            <div key={patient._id || patient.id} className="border p-4 rounded mb-2">
              <p><strong>DOB:</strong> {new Date(patient.dob).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Blood Type:</strong> {patient.bloodType}</p>
              <p><strong>Weight:</strong> {patient.weight} kg</p>
              <p><strong>Medical History:</strong> {patient.medicalHistory && patient.medicalHistory.join(', ')}</p>
              <button onClick={() => handleEdit(patient)} className="mt-2 text-blue-500 underline">Edit</button>
            </div>
          ))
        ) : (
          <p>No patients found.</p>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;
