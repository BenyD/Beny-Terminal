'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingScreen } from './loading-screen';
import { Container } from './container';
import { Navbar } from './navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isTerminalPage = pathname === '/terminal';

  useEffect(() => {
    // Check if this is the first visit in the current session
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      // If already visited in this session, don't show loading screen
      setIsLoading(false);
    } else {
      // First visit, show loading screen and set session storage
      setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasVisited', 'true');
      }, 7000); // Extended to match the new animations timeline
    }
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Container>
        <div className="flex h-full flex-col">
          <div
            className={`min-h-0 flex-1 overflow-y-auto ${isTerminalPage ? '' : 'pb-4'} transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          >
            {children}
          </div>
          <div
            className={`navbar-container flex-shrink-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          >
            <Navbar />
          </div>
        </div>
      </Container>
    </>
  );
}
