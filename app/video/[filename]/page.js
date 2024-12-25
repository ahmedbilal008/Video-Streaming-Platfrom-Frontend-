'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VideoPlayer from '../../components/VideoPlayer'

export default function VideoPage() {
  const { filename } = useParams()
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/videos/stream/${filename}`, {
          method: 'GET',
          credentials: 'include',
        })
        console.log(response);
        if (response.ok) {
          const data = await response.json(); 
          setVideoUrl(data.url)
        } else {
          console.error('Failed to fetch video URL')
        }
      } catch (error) {
        console.error('Error fetching video URL:', error)
      }
    }

    fetchVideoUrl()
  }, [filename])

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center justify-center">
      <div className="container mx-auto p-6 bg-slate-50 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Video Player
        </h1>
        {videoUrl ? (
          <VideoPlayer src={videoUrl} />
        ) : (
          <p className="text-center text-gray-600">Loading video...</p>
        )}
      </div>
    </div>
  )
}

