import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const QRScannerPage = () => {
  const [scannedValue, setScannedValue] = useState('');
  const [qrDetails, setQrDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!scannedValue.trim()) {
      toast.error('Please enter a QR code value');
      return;
    }

    setLoading(true);
    setError('');
    setQrDetails(null);

    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/qr/details/${scannedValue}`;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      
      if (response.ok) {
        setQrDetails(data.qrCode);
        if (data.qrCode.isClaimed) {
          toast.success(`QR Code claimed by ${data.qrCode.user?.name || 'Unknown'}`);
        } else {
          toast.info('QR Code is available for claiming');
        }
      } else {
        setError(data.message || 'QR code not found');
        toast.error(data.message || 'QR code not found');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setError('Failed to scan QR code');
      toast.error('Failed to scan QR code');
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-[#fcfbf8] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1c180d] mb-6">QR Code Scanner</h1>
          
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#1c180d] mb-4">Scan QR Code</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter QR Code Value:
              </label>
              <input
                type="text"
                value={scannedValue}
                onChange={(e) => setScannedValue(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the QR code value to scan..."
              />
            </div>
            <button
              onClick={handleScan}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Scan QR Code'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {qrDetails && (
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1c180d] mb-4">QR Code Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">QR Code Value:</span>
                  <p className="text-gray-900 break-all">{qrDetails.value}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <p className={`font-medium ${qrDetails.isClaimed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {qrDetails.isClaimed ? 'Claimed' : 'Unclaimed'}
                  </p>
                </div>
                {qrDetails.isClaimed && (
                  <>
                    <div>
                      <span className="font-medium text-gray-700">Claimed by:</span>
                      <p className="text-gray-900">{qrDetails.user?.name || 'Unknown'} ({qrDetails.user?.email || ''})</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <span className="font-bold text-green-800 text-lg">Purpose:</span>
                      <p className="text-green-900 text-lg mt-1">{qrDetails.purpose}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Claimed on:</span>
                      <p className="text-gray-900">{new Date(qrDetails.timestamp).toLocaleString()}</p>
                    </div>
                  </>
                )}
                {!qrDetails.isClaimed && (
                  <div>
                    <span className="font-medium text-gray-700">Generated on:</span>
                    <p className="text-gray-900">{new Date(qrDetails.timestamp).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage; 