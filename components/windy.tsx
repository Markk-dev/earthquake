"use client";
import Script from 'next/script'
import { useEffect } from 'react'

export function WindyMap(className?: string) {
  useEffect(() => {
    // Suppress console errors from Windy widget about missing map layers
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Filter out OpenMapTiles building layer errors from Windy widget
      if (args[0]?.includes?.('building') && args[0]?.includes?.('openmaptiles')) {
        // Suppress this specific error - it's a warning from Windy's internal map style
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return(
    <div className={className}>
        <div
            id="windy"
            style={{width: '100%', height: '600px'}}
            data-windywidget="map"
            data-spotid="339553"
            data-appid="ea4746c6ad80abefcfd69bf5b01f729d"
            data-spots="true">
        </div>
        <Script 
          async={true} 
          data-cfasync="false" 
          type="text/javascript" 
          src="https://windy.app/widget3/windy_map_async.js"
          onError={(e) => {
            console.error('Windy widget script failed to load:', e);
          }}
        />
    </div>
 );
}