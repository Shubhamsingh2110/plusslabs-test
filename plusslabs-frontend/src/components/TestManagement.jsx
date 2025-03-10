import React, { useState, useEffect } from 'react';

const TestManagement = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/tests')
      .then(res => res.json())
      .then(data => setTests(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Test Management</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Test Name</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Discount</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Gold Price</th>
          </tr>
        </thead>
        <tbody>
          {tests.length ? tests.map(test => (
            <tr key={test._id || test.id} className="text-center">
              <td className="px-4 py-2 border">{test.name}</td>
              <td className="px-4 py-2 border">{test.description}</td>
              <td className="px-4 py-2 border">{test.price}</td>
              <td className="px-4 py-2 border">{test.discount}</td>
              <td className="px-4 py-2 border">{test.category}</td>
              <td className="px-4 py-2 border">{test.goldPrice}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 border">No tests available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TestManagement;
