'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '../components/Navbar';
import Link from 'next/link'
import useApi from '../hooks/useApi';

export default function Logs() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>}>
      <LogsContent />
    </Suspense>
  );
}

function LogsContent() {
    const [logs, setLogs] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)
    const searchParams = useSearchParams();
    const userID = searchParams.get('id');
    const router = useRouter()
    const { callApi, LoadingComponent, ErrorComponent } = useApi();

    useEffect(() => {
        if (userID) {
            checkAdminStatus(userID)
            fetchLogs(userID)
        } else {
            router.push('/');
        }
    }, [currentPage])

    const checkAdminStatus = async (userID) => {
        const result = await callApi(async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/users/user/${userID}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch user data');
            return response.json();
        });
        if (result && result.user.role === 'admin') {
            setIsAdmin(true);
        }
    }

    const fetchLogs = async (userId) => {
        const start = currentPage * 100;
        const endpoint = isAdmin
            ? `${process.env.NEXT_PUBLIC_LOGGING_SERVICE_URL}/api/logs/all?start=${start}`
            : `${process.env.NEXT_PUBLIC_LOGGING_SERVICE_URL}/api/logs/user/${userID}?start=${start}`;
        
        const result = await callApi(async () => {
            const response = await fetch(endpoint, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch logs');
            return response.json();
        });
        if (result) setLogs(result.logs);
    }

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1)
    }

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(0, prev - 1))
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="logs"/>

            <main className="max-w-6xl mx-auto mt-6 p-6">
                <h1 className="text-3xl font-bold mb-6">System Logs</h1>
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
                        disabled={logs.length < 100}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next Page
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left">User ID</th>
                                <th className="px-4 py-3 text-left">Action Type</th>
                                <th className="px-4 py-3 text-left">Service Name</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left">Date and Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-4 py-3">{log.user_id}</td>
                                    <td className="px-4 py-3">{log.action_type}</td>
                                    <td className="px-4 py-3">{log.service_name}</td>
                                    <td className="px-4 py-3">{log.description}</td>
                                    <td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
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
                        disabled={logs.length < 100}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next Page
                    </button>
                </div>
            </main>
            {LoadingComponent}
            {ErrorComponent}
        </div>
    )
}

