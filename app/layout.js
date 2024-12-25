import { Inter } from 'next/font/google'
import './globals.css'
import ErrorAlert from './components/ErrorAlert'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Video Streaming App',
  description: 'A microservices-based short video streaming application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-100">
          {children}
        </div>
        <div id="error-container"></div>
      </body>
    </html>
  )
}

