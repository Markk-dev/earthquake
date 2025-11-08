"use client";
import { useEffect, useState, useRef } from 'react';

interface WindyMapProps {
  className?: string;
}

export function WindyMap({ className }: WindyMapProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const loadWindyScript = () => {
      // Check if script already exists
      let script = document.getElementById('windy-script') as HTMLScriptElement;
      
      if (!script) {
        // Create and load script
        script = document.createElement('script');
        script.id = 'windy-script';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.type = 'text/javascript';
        script.src = 'https://windy.app/widget3/windy_map_async.js';
        
        script.onload = () => {
          // Windy widget auto-initializes when it finds elements with data-windywidget
          // Force a small delay to ensure DOM is ready
          setTimeout(() => {
            if (containerRef.current) {
              // Trigger re-scan if Windy has a refresh method
              if ((window as any).windy && (window as any).windy.refresh) {
                (window as any).windy.refresh();
              }
            }
          }, 200);
        };
        
        script.onerror = () => {
          console.error('Failed to load Windy script');
        };
        
        document.body.appendChild(script);
      } else {
        // Script already loaded, trigger re-initialization
        setTimeout(() => {
          if (containerRef.current) {
            // Windy should auto-detect the element, but we can force refresh
            if ((window as any).windy && (window as any).windy.refresh) {
              (window as any).windy.refresh();
            }
          }
        }, 100);
      }
    };
    
    loadWindyScript();
    
    return () => {
      // Don't remove script on unmount to allow reuse
      // The script can stay loaded for better performance
    };
  }, []);

  if (!mounted) {
    return (
      <div className={className} style={{ width: '100%', height: '600px' }}>
        <div className="flex items-center justify-center h-full bg-muted rounded-md">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return(
    <div className={className} ref={containerRef}>
        <div
            id="windy"
            style={{width: '100%', height: '600px'}}
            data-windywidget="map"
            data-spotid="339553"
            data-appid="ea4746c6ad80abefcfd69bf5b01f729d"
            data-spots="true">
        </div>
    </div>
 );
}