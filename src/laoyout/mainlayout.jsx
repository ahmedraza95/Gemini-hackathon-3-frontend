import { Outlet } from 'react-router-dom';
import Header from '../pages/header';
import Footer from '../pages/footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50">
      <Header />
      <main className="relative">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-100/30 to-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;