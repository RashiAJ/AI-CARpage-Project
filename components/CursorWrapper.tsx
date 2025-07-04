'use client';

import dynamic from 'next/dynamic';

// Dynamically import the CarCursor with no SSR
const CarCursor = dynamic(() => import('@/components/CarCursor'), {
  ssr: false,
  loading: () => null,
});

// This component will only render on the client side
export default function CursorWrapper() {
  // Only render in browser environment
  if (typeof window === 'undefined') return null;
  
  return <CarCursor />;
}
