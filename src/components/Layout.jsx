import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import Header from './Header';
import Sidebar from './Sidebar';
import UpsellModal from './UpsellModal';
import UpgradePricingModal from './UpgradePricingModal';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { animationSeed } = usePlan();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen text-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${location.pathname}-${animationSeed}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <UpsellModal />
      <UpgradePricingModal />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            fontWeight: 600,
            color: '#0f172a',
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#ecfdf5',
            },
          },
        }}
      />
    </div>
  );
}

export default Layout;
