import React, { useEffect, useState } from 'react';

const SuperAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const [usersRes, adminsRes] = await Promise.all([
          fetch(`${baseUrl}/auth/users`, { credentials: 'include' }),
          fetch(`${baseUrl}/auth/admins`, { credentials: 'include' })
        ]);
        const usersData = await usersRes.json();
        const adminsData = await adminsRes.json();
        setUsers(usersData.users || []);
        setAdmins(adminsData.admins || []);
      } catch (err) {
        setUsers([]);
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-[#1c180d] mb-6">Super Admin Dashboard</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Admins</h2>
            <ul className="mb-6">
              {admins.map(admin => (
                <li key={admin._id} className="border-b py-2">{admin.name} ({admin.email})</li>
              ))}
            </ul>
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <ul>
              {users.map(user => (
                <li key={user._id} className="border-b py-2">{user.name} ({user.email})</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPage; 