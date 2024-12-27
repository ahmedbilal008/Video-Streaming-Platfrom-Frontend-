'use client';

import { useState } from 'react';

export default function VideoUpload({ onUploadSuccess, storageUsage, bandwidthUsage }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setUploadStatus('Please provide a title and select a video file.');
      return;
    }

    // Check storage limit
    if (storageUsage && storageUsage.usagePercentage >= 100) {
      setUploadStatus('Storage limit reached. Please delete some videos before uploading.');
      return;
    }

    // Check bandwidth limit
    if (bandwidthUsage && bandwidthUsage.totalUsageMb >= bandwidthUsage.dailyLimitMb) {
      setUploadStatus('Daily bandwidth limit reached. Please try again tomorrow.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    // Prepare form data
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/videos/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        //credentials: 'include', // Include cookies for token validation
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        setUploadStatus('Video uploaded successfully!');
        onUploadSuccess(); // Call this to refresh the dashboard
        setFile(null); // Reset the file input
        setTitle(''); // Reset the title input
      } else {
        const errorData = await response.json();
        setUploadStatus('Failed to upload video: ' + (errorData.message || 'Unknown error'));
        
        if (errorData.message.includes('Exceeding total storage limit')) {
          setUploadStatus('Exceeding storage limit. Please delete some videos or upload a smaller file.');
        } else if (errorData.message.includes('Exceeding daily bandwidth limit')) {
          setUploadStatus('Exceeding daily bandwidth limit. Please try again tomorrow or upload a smaller file.');
        }
      }
    } catch (error) {
      setUploadStatus('Error uploading video: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const isUploadDisabled = !file || !title.trim() || isUploading || 
    (storageUsage && storageUsage.usagePercentage >= 100) || 
    (bandwidthUsage && bandwidthUsage.totalUsageMb >= bandwidthUsage.dailyLimitMb);

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Video Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter video title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-700">
          Select Video File
        </label>
        <input
          type="file"
          id="video"
          onChange={handleFileChange}
          accept="video/*"
          className="mt-1 block w-full px-3 py-2"
          key={file ? file.name : 'file-input'} // This key change will force re-render and clear the input
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isUploadDisabled}
      >
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>
      {uploadStatus && (
        <p className={`mt-2 text-sm ${
          uploadStatus.includes('successfully') 
            ? 'text-green-600' 
            : uploadStatus.includes('Uploading') 
              ? 'text-blue-600' 
              : 'text-red-600'
        }`}>
          {uploadStatus}
        </p>
      )}
      {storageUsage && storageUsage.usagePercentage >= 80 && (
        <p className="mt-2 text-sm text-yellow-600">
          Warning: Storage is {storageUsage.usagePercentage >= 98 ? 'critically' : 'highly'} utilized!
        </p>
      )}
      {bandwidthUsage && bandwidthUsage.totalUsageMb >= 0.8 * bandwidthUsage.dailyLimitMb && (
        <p className="mt-2 text-sm text-yellow-600">
          Warning: Daily bandwidth usage is {bandwidthUsage.totalUsageMb >= bandwidthUsage.dailyLimitMb ? 'fully' : 'highly'} utilized!
        </p>
      )}
    </form>
  );
}

