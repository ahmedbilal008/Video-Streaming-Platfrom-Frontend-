'use client';

import { useState, useRef } from 'react';

export default function VideoUpload({ onUploadSuccess, storageUsage, bandwidthUsage }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      setTitle(droppedFile.name.split('.').slice(0, -1).join('.'));
    } else {
      setUploadStatus('Please drop a valid video file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setUploadStatus('Please provide a title and select a video file.');
      return;
    }

    const maxFileSizeMb = 50; // Maximum file size in MB
    const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxFileSizeBytes) {
      setUploadStatus(`Please choose a file smaller than ${maxFileSizeMb} MB.`);
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
      });

      if (response.ok) {
        const data = await response.json();
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
        } else if (errorData.message.includes('Already uploading')) {
          setUploadStatus('You are already uploading a video. Please wait for a moment before trying again.');
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
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${isDragging ? 'border-blue-500 bg-blue-50' : ''
          }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="video"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload a file</span>
              <input
                id="video"
                name="video"
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">Video up to 50MB</p>
        </div>
      </div>
      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Selected file: {file.name}
        </p>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isUploadDisabled}
      >
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>
      {uploadStatus && (
        <p className={`mt-2 text-sm ${uploadStatus.includes('successfully')
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

