import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { QRCodeSVG } from 'qrcode.react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GEOAPIFY_API_KEY = '6b330008a9f3461789406fe858f61f95'; // Use your real key

const AdminPage = () => {
  const user = useSelector((state) => state.user);
  const [numberOfQRCodes, setNumberOfQRCodes] = useState(1);
  const [generatedQRCodes, setGeneratedQRCodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [allQRCodes, setAllQRCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add a ref for the map container
  const mapRef = React.useRef(null);
  const leafletMapRef = React.useRef(null);

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/auth/users`;
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        if (response.ok) setUsers(data.users);
      } catch (err) {}
    };
    // Fetch all QR codes
    const fetchAllQRCodes = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/qr/all`;
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        if (response.ok) setAllQRCodes(data.qrCodes);
      } catch (err) {}
    };
    fetchUsers();
    fetchAllQRCodes();
  }, []);

  const generateRandomNumber = () => {
    // Generate a 16-digit random number
    const min = 1000000000000000; // 16 digits starting with 1
    const max = 9999999999999999; // 16 digits
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleGenerateQRCodes = async () => {
    if (numberOfQRCodes < 1) {
      toast.error('Please enter a valid number of QR codes.');
      return;
    }
    setLoading(true);
    const newQRCodes = [];
    for (let i = 0; i < numberOfQRCodes; i++) {
      const randomNumber = generateRandomNumber();
      newQRCodes.push({
        value: randomNumber.toString(),
        timestamp: new Date().toISOString(),
      });
    }
    // Save to backend
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/qr/save`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ qrCodes: newQRCodes })
      });
      if (response.ok) {
        setGeneratedQRCodes(newQRCodes);
        // Refresh all QR codes
        const allRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/qr/all`, { credentials: 'include' });
        const allData = await allRes.json();
        if (allRes.ok) setAllQRCodes(allData.qrCodes);
        toast.success(`${numberOfQRCodes} QR code(s) generated successfully! Download and share them.`);
      } else {
        toast.error('Failed to generate QR codes');
      }
    } catch (err) {
      toast.error('Failed to generate QR codes');
    }
    setLoading(false);
  };

  // Download QR code as image
  const downloadQRCode = (qrValue, index) => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector(`#qr-${index}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      
      const link = document.createElement('a');
      link.download = `qr-code-${qrValue}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // Download all QR codes as ZIP
  const downloadAllQRCodes = () => {
    generatedQRCodes.forEach((qr, index) => {
      setTimeout(() => downloadQRCode(qr.value, index), index * 100);
    });
    toast.success('Downloading all QR codes...');
  };

  // Delete a QR code by ID
  const handleDeleteQRCode = async (qrId) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/qr/${qrId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        // Refresh all QR codes
        const allRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/qr/all`, { credentials: 'include' });
        const allData = await allRes.json();
        if (allRes.ok) setAllQRCodes(allData.qrCodes);
        toast.success('QR code deleted successfully!');
      } else {
        toast.error('Failed to delete QR code');
      }
    } catch (err) {
      toast.error('Failed to delete QR code');
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-[#fcfbf8]">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-[#1c180d] mb-6">Admin Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-[#1c180d] mb-4">Welcome, {user.user.name}!</h2>
            <p className="text-gray-600 mb-6">Generate QR codes, download them, and share via WhatsApp/email. Users will scan them to claim.</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Generate QR Codes</h3>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numberOfQRCodes}
                  onChange={(e) => setNumberOfQRCodes(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="border rounded-md px-4 py-2 w-32"
                  disabled={loading}
                />
                <button
                  onClick={handleGenerateQRCodes}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate QR Codes'}
                </button>
              </div>
            </div>

            {/* Generated QR Codes for Download */}
            {generatedQRCodes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Generated QR Codes (Download & Share)</h3>
                  <button
                    onClick={downloadAllQRCodes}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Download All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generatedQRCodes.map((qr, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <QRCodeSVG id={`qr-${index}`} value={qr.value} size={128} />
                      <p className="text-sm text-gray-600 mt-2 text-center break-all">{qr.value}</p>
                      <button 
                        onClick={() => downloadQRCode(qr.value, index)}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs w-full"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">All QR Codes & Assignments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allQRCodes.map((qr) => (
                  <div key={qr._id} className="bg-white p-4 rounded-lg border">
                    <QRCodeSVG value={qr.value} size={128} />
                    <p className="text-sm text-gray-600 mt-2 text-center break-all">{qr.value}</p>
                    <div className="mt-2">
                      <p className={`text-xs font-medium ${qr.isClaimed ? 'text-green-600' : 'text-yellow-600'}`}>
                        Status: {qr.isClaimed ? 'Claimed' : 'Unclaimed'}
                      </p>
                      {qr.isClaimed && (
                        <>
                          <p className="text-xs text-gray-500 mt-1">
                            Assigned to: {qr.user?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Purpose: {qr.purpose}
                          </p>
                        </>
                      )}
                    </div>
                    <button onClick={() => handleDeleteQRCode(qr._id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs w-full">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 