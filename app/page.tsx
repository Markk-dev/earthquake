import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Import a CSS module that applies a left-to-right fade overlay on the background image
import styles from './page.module.css';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center h-screen px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 animate-fade-in-up">
          <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 hover:scale-105 transition-transform duration-300">
            Philcast
          </h1>
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mb-8">
            Your trusted source for real-time disaster monitoring and alerts in the Philippines.
          </p>
        </div>
      </div>

      {/* Background Image */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-full animate-fade-in">
        <div className="relative h-full w-full">
          <Image
            src="/bg.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-8 right-8 z-20 animate-bounce">
        <Card className="bg-white/10 backdrop-blur-lg border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Live Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm">Monitoring Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}