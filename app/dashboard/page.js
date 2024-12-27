'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import VideoUpload from '../components/VideoUpload'
import Navbar from '../components/Navbar';
import useApi from '../hooks/useApi';

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [videos, setVideos] = useState([])
  const [storageUsage, setStorageUsage] = useState(null)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [bandwidthUsage, setBandwidthUsage] = useState(null)
  const router = useRouter()
  const limit = 16;
  const { callApi, LoadingComponent, ErrorComponent } = useApi();

  useEffect(() => {
    //const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))
    const token = sessionStorage.getItem('authToken');
    if (token) {
      fetchUserDataFromToken(token)
      fetchData()
    } else {
      router.push('/')
    }
  }, [currentPage])

  const fetchUserDataFromToken = (token) => {
    try {
      if (!token) throw new Error('Token not found');
  
      // Decode JWT payload (base64-decode)
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedToken.exp && decodedToken.exp < now) {
        router.push('/');
      }
      setUser({ id: decodedToken.id, username: decodedToken.email });
    } catch (error) {
      router.push('/'); // Redirect if invalid token
    }
  };

  const fetchData = async () => {
    await Promise.all([
      fetchVideos(),
      fetchStorageUsage(),
      fetchBandwidthUsage()
    ]);
  };

  const fetchVideos = async () => {
    const start = currentPage * limit;
    const result = await callApi(async () => {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/videos/stream?start=${start}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        //credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    });
    if (result) {
      setVideos(result.videos);
      setTotalVideos(result.total);
    }
  };

  const fetchStorageUsage = async () => {
    const result = await callApi(async () => {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_SERVICE_URL}/api/storage/usage`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        //credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch storage usage');
      return response.json();
    });
    if (result) setStorageUsage(result);
  };

  const fetchBandwidthUsage = async () => {
    const result = await callApi(async () => {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_USAGE_SERVICE_URL}/api/usage/daily-usage`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        //credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch bandwidth usage');
      return response.json();
    });
    if (result) setBandwidthUsage(result);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * limit < totalVideos) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const getStorageColor = (percentage) => {
    if (percentage >= 95) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getBandwidthColor = (used, total) => {
    const percentage = (used / total) * 100;
    if (percentage >= 95) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage="dashboard" />

      <main className="max-w-6xl mx-auto mt-6 p-6">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Storage Usage</h2>
            {storageUsage ? (
              <div>
                <div className="flex justify-between mb-1">
                  <span>{storageUsage.usagePercentage}% used</span>
                  <span>{storageUsage.totalSizeMb.toFixed(2)} MB / {storageUsage.maxStorageMb} MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getStorageColor(storageUsage.usagePercentage)}`}
                    style={{width: `${Math.min(storageUsage.usagePercentage, 100)}%`}}
                  ></div>
                </div>
                {storageUsage.usagePercentage >= 80 && (
                  <p className="mt-2 text-yellow-600">Warning: Storage is {storageUsage.usagePercentage >= 95 ? 'critically' : 'highly'} utilized!</p>
                )}
              </div>
            ) : (
              <p>Loading storage usage...</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Daily Bandwidth Usage</h2>
            {bandwidthUsage ? (
              <div>
                <div className="flex justify-between mb-1">
                  <span>{((bandwidthUsage.totalUsageMb / bandwidthUsage.dailyLimitMb) * 100).toFixed(2)}% used</span>
                  <span>{bandwidthUsage.totalUsageMb.toFixed(2)} MB / {bandwidthUsage.dailyLimitMb} MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getBandwidthColor(bandwidthUsage.totalUsageMb, bandwidthUsage.dailyLimitMb)}`}
                    style={{width: `${Math.min((bandwidthUsage.totalUsageMb / bandwidthUsage.dailyLimitMb) * 100, 100)}%`}}
                  ></div>
                </div>
                {bandwidthUsage.totalUsageMb >= bandwidthUsage.dailyLimitMb && (
                  <p className="mt-2 text-red-600">Daily bandwidth limit reached. Uploads restricted.</p>
                )}
              </div>
            ) : (
              <p>Loading bandwidth usage...</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Upload a New Video</h2>
          <VideoUpload 
            onUploadSuccess={() => {
              fetchVideos();
              fetchStorageUsage();
              fetchBandwidthUsage();
            }} 
            storageUsage={storageUsage} 
            bandwidthUsage={bandwidthUsage}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">Your Videos</h1>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous Page
            </button>
            <span>Page {currentPage + 1}</span>
            <button
              onClick={handleNextPage}
              disabled={(currentPage + 1) * limit >= totalVideos}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next Page
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => {
              const thumbnailUrl = video.filepath.replace('.mp4', '.jpg');
              return (
                <Link href={`/video/${video.filename}`} className="block" key={video.id}>
                  <div className="bg-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <img
                      src={thumbnailUrl}
                      alt={`Thumbnail for ${video.title}`}
                      className="mb-4 w-full h-auto object-cover rounded"
                    />
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>

          {videos.length === 0 && <p>No videos available.</p>}
        </div>
      </main>
      {LoadingComponent}
      {ErrorComponent}
    </div>
  );
}

