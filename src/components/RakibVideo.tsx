import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Upload, 
  Image, 
  Video, 
  Info 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface RakibVideoProps {
  src?: string;
  className?: string;
}

const RakibVideo: React.FC<RakibVideoProps> = ({ 
  src: defaultSrc = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  className 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [videoSrc, setVideoSrc] = useState(defaultSrc);
  const [imageSrc, setImageSrc] = useState<string>("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Custom Controls Visibility Toggle for Image Mode
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Check if the current user is Root Admin
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setIsAdmin(u?.email === 'rakib.47g@gmail.com');
    });

    // Subscribing to database broadcast config
    const unsubBroadcast = onSnapshot(doc(db, 'settings', 'broadcast'), (s) => {
      if (s.exists()) {
        const data = s.data();
        if (data.mediaType) setMediaType(data.mediaType as any);
        if (data.videoSrc) setVideoSrc(data.videoSrc);
        if (data.imageSrc) setImageSrc(data.imageSrc);
      }
    });

    return () => {
      unsubAuth();
      unsubBroadcast();
    };
  }, []);

  const syncBroadcast = async (updatedType: 'video' | 'image', updatedVideo: string, updatedImage: string) => {
    if (auth.currentUser?.email !== 'rakib.47g@gmail.com') return;
    try {
      await setDoc(doc(db, 'settings', 'broadcast'), {
        mediaType: updatedType,
        videoSrc: updatedVideo,
        imageSrc: updatedImage
      });
    } catch (err) {
      console.error("Failed to sync broadcast:", err);
    }
  };

  const handleMediaTypeChange = (type: 'video' | 'image') => {
    setMediaType(type);
    if (auth.currentUser?.email === 'rakib.47g@gmail.com') {
      syncBroadcast(type, videoSrc, imageSrc);
    }
  };

  useEffect(() => {
    if (mediaType === 'image') {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [mediaType]);

  const togglePlay = () => {
    if (mediaType !== 'video') return;
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);
      if (videoSrc.startsWith('blob:') && videoSrc !== defaultSrc) {
        URL.revokeObjectURL(videoSrc);
      }
      if (auth.currentUser?.email === 'rakib.47g@gmail.com') {
        syncBroadcast(mediaType, url, imageSrc);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setShowControls(false);
      if (auth.currentUser?.email === 'rakib.47g@gmail.com') {
        syncBroadcast(mediaType, videoSrc, url);
      }
    }
  };

  const triggerUpload = () => {
    if (mediaType === 'video') {
      videoInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current && mediaType === 'video') {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className={cn("relative group overflow-hidden rounded-2xl bg-black h-full w-full shadow-2xl border border-white/5 flex flex-col", className)}>
      
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoChange}
        className="hidden"
        accept="video/*"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      {/* Main Media Container */}
      <div className="relative flex-grow w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {mediaType === 'video' ? (
            <motion.video
              key="video_player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={videoRef}
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              loop
            />
          ) : (
            <motion.div
              key="image_player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950 p-2"
            >
              <motion.img
                src={imageSrc}
                alt="CST Department Highlights"
                className="max-w-full max-h-full object-contain brightness-95"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Center Play Indicator overlay for video ONLY */}
        {mediaType === 'video' && !isPlaying && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <Play size={28} fill="currentColor" className="ml-1" />
            </div>
          </motion.div>
        )}

        {/* Video mode absolute top header overlay */}
        {mediaType === 'video' && (
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
            {/* Left Badge: Dynamic Meta Identifier */}
            <div 
              id="video-feed-badge"
              onClick={triggerUpload}
              className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 bg-black/85 border border-white/10 rounded-full group/badge cursor-pointer shadow-lg hover:bg-black/95 hover:border-white/20 active:scale-95 transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-white/95 uppercase tracking-[0.2em] group-hover/badge:text-rose-400 transition-colors">
                VIDEO FEED
              </span>
            </div>

            {/* Right Segments: Choice Selector Toggle */}
            <div className="pointer-events-auto flex items-center bg-black/85 border border-white/15 rounded-full p-0.5 shadow-xl">
              <button
                onClick={() => handleMediaTypeChange('video')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)] font-extrabold"
              >
                <Video size={11} className="animate-pulse" />
                VIDEO
              </button>
              <button
                onClick={() => handleMediaTypeChange('image')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 text-white/60 hover:text-white hover:bg-white/5"
              >
                <Image size={11} />
                IMAGE
              </button>
            </div>
          </div>
        )}

        {/* Video Mode controls overlay - Confined to bottom, no top blur or full-screen blockage */}
        {mediaType === 'video' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-5 pt-12 gap-3.5 flex flex-col z-20">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer accent-rose-500 appearance-none transition-all outline-none"
            />

            <div className="flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/20">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="text-white hover:text-rose-400 active:scale-95 transition-all p-1.5 hover:bg-white/5 rounded-lg">
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-rose-400 active:scale-95 transition-all p-1.5 hover:bg-white/5 rounded-lg">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button 
                  onClick={() => { if(videoRef.current) videoRef.current.currentTime = 0; }} 
                  className="text-white hover:text-rose-400 active:scale-95 transition-all p-1.5 hover:bg-white/5 rounded-lg"
                  title="Restart Track"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={triggerUpload}
                  className="text-white hover:text-white bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:bg-rose-600 transition-all active:scale-95 duration-250 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider"
                >
                  <Upload size={13} /> Update Video
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-black hidden sm:inline-block">
                  AV STREAMING CORE
                </span>
                <button onClick={handleFullScreen} className="text-white hover:text-rose-400 active:scale-95 transition-all p-1.5 hover:bg-white/5 rounded-lg" title="Full Screen">
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Small floating setup button for Image mode when controls are hidden */}
        {mediaType === 'image' && !showControls && (
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowControls(true)}
            className="absolute bottom-4 right-4 z-30 bg-black/85 hover:bg-black text-white/95 border border-white/20 hover:border-teal-500/50 px-4 py-2.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.5)] active:scale-95 transition-all duration-300 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider cursor-pointer font-display"
            title="Show Controls and Settings"
          >
            <Upload size={13} className="text-teal-400" />
            Enable Selector / Upload Image
          </motion.button>
        )}
      </div>

      {/* Image Mode Dedicated Bottom Controls (No elements layout above the image) */}
      {mediaType === 'image' && showControls && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/95 dark:bg-slate-950/95 border-t border-white/10 p-4 flex flex-col gap-3 shrink-0"
        >
          {/* Header-like actions row now beautifully shifted below the image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
            
            {/* Left Badge: Dynamic Meta Identifier */}
            <div 
              id="image-feed-badge"
              onClick={triggerUpload}
              className="flex items-center gap-2.5 px-3.5 py-1.5 bg-black/60 border border-white/10 rounded-full group/badge cursor-pointer shadow-lg hover:border-white/20 active:scale-95 transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-black text-white/95 uppercase tracking-[0.2em] group-hover/badge:text-teal-400 transition-colors">
                CAMPUS ALBUM
              </span>
            </div>

            {/* Right Segments: Choice Selector Toggle */}
            <div className="flex items-center bg-black/60 border border-white/15 rounded-full p-0.5 shadow-xl">
              <button
                onClick={() => handleMediaTypeChange('video')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Video size={11} />
                VIDEO
              </button>
              <button
                onClick={() => handleMediaTypeChange('image')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 bg-teal-500 text-white shadow-[0_0_12px_rgba(20,184,166,0.4)] font-extrabold"
              >
                <Image size={11} />
                IMAGE
              </button>
            </div>
          </div>

          {/* Controls button row bottom */}
          <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl gap-4">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={triggerUpload}
                className="text-white hover:text-white bg-teal-500 hover:bg-teal-600 shadow-[0_0_12px_rgba(20,184,166,0.3)] transition-all active:scale-95 duration-200 flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                <Upload size={14} /> Upload New Image
              </button>
              <button 
                onClick={() => setShowControls(false)}
                className="text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all active:scale-95 duration-200 flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                Hide Buttons
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/5 rounded-lg text-white/60 font-mono text-[9px] uppercase tracking-widest leading-none">
              <Info size={11} className="text-teal-400" /> STAGE CLEANVIEW ACTIVE
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default RakibVideo;
