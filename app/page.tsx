'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LandingNav } from '@/components/landing-nav';

// Define motion components with proper types
const MotionH1 = motion.h1;
const MotionDiv = motion.div;
const MotionSpan = motion.span;

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <LandingNav />
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <MotionH1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-red-600">
                    TOYOTA
                  </div>
                  <div className="text-2xl font-bold text-black-600">
                    Your intelligent guide to everything Toyota. Get personalized recommendations, maintenance tips, and expert assistance for your Toyota vehicle.
                  </div>
                </MotionH1>
                
              </div>
              <MotionDiv 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button 
                    onClick={() => router.push('/chat')} 
                    className="relative overflow-hidden group bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-6 text-lg font-medium rounded-lg"
                  >
                    <MotionSpan 
                      className="absolute inset-0 bg-white/10 group-hover:bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                    <span className="relative z-10">Start Chat</span>
                  </Button>
                </MotionDiv>
                
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17, delay: 0.05 }}
                >
                  <Button 
                    onClick={() => router.push('/cars')} 
                    className="relative overflow-hidden group bg-red-600 hover:bg-red-700 text-white px-6 py-6 text-lg font-medium rounded-lg"
                  >
                    <MotionSpan 
                      className="absolute inset-0 bg-white/10 group-hover:bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                    <span className="relative z-10">Explore Vehicles</span>
                  </Button>
                </MotionDiv>

                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17, delay: 0.1 }}
                >
                  <Button 
                    onClick={() => router.push('/aisurvey')} 
                    className="relative overflow-hidden group bg-gray-800 hover:bg-gray-900 text-white px-6 py-6 text-lg font-medium rounded-lg"
                  >
                    <MotionSpan 
                      className="absolute inset-0 bg-white/10 group-hover:bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                    <span className="relative z-10">Get Recommendations</span>
                  </Button>
                </MotionDiv>
              </MotionDiv>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-600">Smart Vehicle Recommendations</h2>
                <p className="text-muted-foreground">
                  Get personalized Toyota vehicle recommendations based on your lifestyle and preferences.
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-600">Maintenance & Support</h2>
                <p className="text-muted-foreground">
                  24/7 access to maintenance schedules, service tips, and expert Toyota support.
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-600">Genuine Parts & Accessories</h2>
                <p className="text-muted-foreground">
                  Discover and shop for genuine Toyota parts and accessories with expert guidance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Toyota Motor Corporation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
