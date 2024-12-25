'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import useApi from '../hooks/useApi';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const searchParams = useSearchParams();
  const userID = searchParams.get('id');
  const router = useRouter();
  const limit = 16;
  const { callApi, LoadingComponent, ErrorComponent } = useApi();

  useEffect(() => {
    if (userID) {
      fetchData();
    } else {
      router.push('/');
    }
  }, [userID, currentPage]);

  const fetchData = async () => {
    await Promise.all([
      fetchUserData(),
      fetchUserVideos()
    ]);
  };

  const fetchUserData = async () => {
    const result = await callApi(async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/users/user/${userID}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      return response.json();
    });
    if (result) setUser(result.user);
  };

  const fetchUserVideos = async () => {
    const start = currentPage * limit;
    const result = await callApi(async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/videos/user/${userID}?start=${start}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    });
    if (result) {
      setVideos(result.videos);
      setTotalVideos(result.total);
    }
  };

  const handleDeleteVideo = async (filename) => {
    await callApi(async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/videos/delete/${filename}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete video');
    });
    fetchUserVideos();
  };

  const handleDeleteAllVideos = async () => {
    await callApi(async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/videos/delete-all`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete all videos');
    });
    fetchUserVideos();
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * limit < totalVideos) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage="profile" />

      <main className="max-w-6xl mx-auto mt-6 p-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.username}</h2>
          <p className="mb-2">Email: {user?.email}</p>
          <p>Account created on: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Videos</h1>
            <button
              onClick={handleDeleteAllVideos}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete All Videos
            </button>
          </div>

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
                <div key={video.id} className="bg-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow">
                  <img
                    src={thumbnailUrl}
                    alt={`Thumbnail for ${video.title}`}
                    className="mb-4 w-full h-auto object-cover rounded"
                  />
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <Link
                    href={`/video/${video.filename}`}
                    className="text-blue-500 hover:underline block mb-2"
                  >
                    Watch Video
                  </Link>
                  <button
                    onClick={() => handleDeleteVideo(video.filename)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
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

