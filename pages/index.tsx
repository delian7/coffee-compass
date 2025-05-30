import { useState, useEffect } from 'react';
import { MapProvider } from '@/hooks/use-user-location';
import { VenueProvider } from '@/hooks/use-venues';
import MapView from '@/components/map/MapView';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { VenueDetails } from '@/components/venues/VenueDetails';

export default function Index() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <MapProvider>
      <VenueProvider>
        <div className="h-screen flex flex-col md:flex-row relative font-opensans bg-coffee-light text-coffee-dark overflow-hidden">
          <Header onMenuClick={toggleBottomSheet} />
          <main className="flex-grow relative h-[calc(100vh-64px)] md:h-screen w-full z-0" style={{ minHeight: '400px' }}>
            <MapView />
          </main>
          <Sidebar />
          <BottomSheet isOpen={isBottomSheetOpen} onToggle={toggleBottomSheet} />
          <VenueDetails />
        </div>
      </VenueProvider>
    </MapProvider>
  );
}