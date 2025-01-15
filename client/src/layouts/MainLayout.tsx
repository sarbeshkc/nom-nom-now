import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/Footer';
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}