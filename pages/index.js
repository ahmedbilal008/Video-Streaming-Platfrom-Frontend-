// /pages/index.js
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => (
  <div>
    <Header />
    <main className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">Welcome to VideoApp</h1>
      <p className="text-lg">Stream and share your favorite videos.</p>
    </main>
    <Footer />
  </div>
);

export default Home;
