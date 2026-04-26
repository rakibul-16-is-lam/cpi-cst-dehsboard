import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface RakibVideoProps {
  src?: string;
  className?: string;
}

const RakibVideo: React.FC<RakibVideoProps> = ({ 
  src: defaultSrc = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  className 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState(defaultSrc);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setVideoSrc(defaultSrc);
  }, [defaultSrc]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(current);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);
      // Revoke the old object URL if it exists to avoid memory leaks
      if (videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(videoSrc);
      }
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative group overflow-hidden rounded-2xl bg-black aspect-[21/9] shadow-2xl", className)}>
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        loop
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="video/*"
      />
      
      {/* Custom Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-3">
        
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-bento-primary"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-bento-primary transition-colors">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-bento-primary transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button 
              onClick={() => {
                if(videoRef.current) videoRef.current.currentTime = 0;
              }} 
              className="text-white hover:text-bento-primary transition-colors"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={triggerUpload}
              className="text-white hover:text-rose-500 transition-colors flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-black uppercase ring-1 ring-white/20"
            >
              <Upload size={16} /> Update Feed
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-black">PLAYBACK ENGINE</span>
            <button className="text-white hover:text-bento-primary transition-colors p-1">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Center Play Button (Visible when paused) */}
      {!isPlaying && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
            <Play size={32} fill="currentColor" className="ml-1" />
          </div>
        </motion.div>
      )}

      {/* Metadata Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full group/badge cursor-pointer" onClick={triggerUpload}>
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[9px] font-black text-white uppercase tracking-widest group-hover/badge:text-rose-400 transition-colors">Multimedia Feed</span>
      </div>
    </div>
  );
};

export default RakibVideo;
