/// <reference types="vite/client" />
import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  InfoWindow,
  ControlPosition,
  MapControl
} from '@vis.gl/react-google-maps';
import { MapPin, AlertCircle, Crosshair, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Chattogram Polytechnic Institute Coordinates
const CPI_POSITION = { lat: 22.3607, lng: 91.8021 };

const MAP_ID = 'bento-dashboard-map'; // You can create a Map ID in Google Cloud Console for advanced styling

const RegionalMap = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // If API Key is missing, show a beautiful fallback UI
  if (!apiKey) {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 animate-pulse">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-2">Google Maps API Key Required</h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed mb-6">
          To display the interactive Google Map, please provide your API key in the <span className="font-bold text-slate-700 dark:text-white">Settings</span> menu using the variable:
          <code className="block mt-2 p-2 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">VITE_GOOGLE_MAPS_API_KEY</code>
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => window.open('https://developers.google.com/maps/documentation/javascript/get-api-key', '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-bento-primary text-white text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-blue-600 transition-all"
          >
            Get API Key <ExternalLink size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-bento-border shadow-2xl group bg-white dark:bg-slate-900">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={CPI_POSITION}
          defaultZoom={15}
          mapId={MAP_ID}
          disableDefaultUI={true}
          className="w-full h-full grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
        >
          <AdvancedMarker
            position={CPI_POSITION}
            onClick={() => setInfoWindowShown(true)}
          >
            <div className="relative flex items-center justify-center">
               <div className="w-10 h-10 rounded-full bg-blue-500/20 animate-ping absolute" />
               <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
                 <MapPin size={16} fill="white" />
               </div>
            </div>
          </AdvancedMarker>

          <AnimatePresence>
            {infoWindowShown && (
              <InfoWindow
                position={CPI_POSITION}
                onCloseClick={() => setInfoWindowShown(false)}
              >
                <div className="p-1 max-w-[200px]">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase mb-1">Chattogram Polytechnic</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Engineering Hub & Institutional Authority Zone.</p>
                </div>
              </InfoWindow>
            )}
          </AnimatePresence>

          {/* Custom Overlay UI */}
          <MapControl position={ControlPosition.TOP_RIGHT}>
             <div className="m-4 flex flex-col gap-2">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-bento-border p-3 rounded-xl shadow-lg flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <MapPin size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none mb-1">Google Engine</span>
                    <span className="text-[9px] font-bold text-slate-500 font-mono leading-none">Live Data Enabled</span>
                  </div>
                </motion.div>
             </div>
          </MapControl>

        </Map>
      </APIProvider>

      {/* Static HUD Decoration */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Network Lock</span>
          </div>
          <span className="text-[7px] font-mono text-slate-400">SAT_LINK_CPI_01</span>
        </div>
      </div>

      {/* Technical Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none z-20" />
    </div>
  );
};

export default RegionalMap;
