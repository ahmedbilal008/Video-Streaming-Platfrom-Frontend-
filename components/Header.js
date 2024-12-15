// /components/Header.js
import Link from 'next/link';

const Header = () => (
  <header className="bg-blue-600 p-4 shadow-md">
    <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
      <h1 className="text-2xl font-bold">VideoApp</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/auth/login">Login</Link></li>
          <li><Link href="/auth/register">Register</Link></li>
          <li><Link href="/videos">Videos</Link></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
