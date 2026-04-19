import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  GraduationCap, 
  Calendar, 
  Bell, 
  Trophy, 
  Cpu, 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Sun,
  Moon,
  Plus,
  Trash2,
  Save,
  LogIn,
  LogOut,
  Settings,
  X,
  Edit2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Legend,
  ComposedChart,
  Scatter,
  Line
} from 'recharts';
import { DASHBOARD_DATA } from './constants';
import { cn } from './lib/utils';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError 
} from './lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  updateDoc,
  setDoc
} from 'firebase/firestore';
import RegionalMap from './components/RegionalMap';

// --- Sub-Components ---

const BentoCard = ({ title, children, className, extra, accent }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "dashboard-card p-3 flex flex-col group relative overflow-hidden transition-all duration-300", 
      accent === 'blue' && "bg-blue-500/[0.03] dark:bg-blue-500/[0.05] border-blue-500/20",
      accent === 'emerald' && "bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] border-emerald-500/20",
      accent === 'amber' && "bg-amber-500/[0.03] dark:bg-amber-500/[0.05] border-amber-500/20",
      accent === 'rose' && "bg-rose-500/[0.03] dark:bg-rose-500/[0.05] border-rose-500/20",
      accent === 'violet' && "bg-violet-500/[0.03] dark:bg-violet-500/[0.05] border-violet-500/20",
      accent === 'cyan' && "bg-cyan-500/[0.03] dark:bg-cyan-500/[0.05] border-cyan-500/20",
      accent === 'indigo' && "bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] border-indigo-500/20",
      className
    )}
  >
    {/* Subtle Glow Background */}
    {accent && (
      <div className={cn(
        "absolute -top-12 -right-12 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full",
        accent === 'blue' && "bg-blue-500",
        accent === 'emerald' && "bg-emerald-500",
        accent === 'amber' && "bg-amber-500",
        accent === 'rose' && "bg-rose-500",
        accent === 'violet' && "bg-violet-500",
        accent === 'cyan' && "bg-cyan-500",
        accent === 'indigo' && "bg-indigo-500",
      )} />
    )}
    <div className="card-title flex-shrink-0 flex items-center justify-between relative z-20">
      <span>{title}</span>
      {extra && <span className={cn(
        "text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm",
        accent === 'blue' ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" : 
        accent === 'emerald' ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
        accent === 'amber' ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
        accent === 'rose' ? "bg-rose-500/20 text-rose-600 dark:text-rose-400" :
        accent === 'violet' ? "bg-violet-500/20 text-violet-600 dark:text-violet-400" :
        accent === 'cyan' ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" :
        accent === 'indigo' ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" :
        "bg-bento-primary/10 text-bento-primary"
      )}>{extra}</span>}
    </div>
    <div className="flex-grow min-h-0 z-10 relative">
      {children}
    </div>
  </motion.div>
);

const StatCard = ({ label, value, subtext, delay = 0, variant = 'blue' }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={cn(
      "dashboard-card p-4 flex flex-col group cursor-default transition-all duration-300 relative overflow-hidden",
      variant === 'blue' && "bg-blue-500/[0.04] border-blue-500/20 hover:border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.05)]",
      variant === 'emerald' && "bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
      variant === 'amber' && "bg-amber-500/[0.04] border-amber-500/20 hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
      variant === 'rose' && "bg-rose-500/[0.04] border-rose-500/20 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
    )}
  >
    <div className={cn(
      "card-title transition-colors uppercase tracking-widest relative z-20",
      variant === 'blue' && "text-blue-600 dark:text-blue-400",
      variant === 'emerald' && "text-emerald-600 dark:text-emerald-400",
      variant === 'amber' && "text-amber-600 dark:text-amber-400",
      variant === 'rose' && "text-rose-600 dark:text-rose-400"
    )}>
      {label}
    </div>
    <div className="stat-val group-hover:translate-x-1 transition-transform font-mono tracking-tighter text-3xl mt-1 leading-none relative z-20">{value}</div>
    <div className="stat-label mt-2 opacity-60 group-hover:opacity-100 transition-opacity font-bold font-mono text-[10px] border-t border-bento-border/20 pt-1 uppercase relative z-20">
      {subtext}
    </div>
    
    {/* Dynamic Background Corner Accent */}
    <div className={cn(
      "absolute -bottom-4 -right-4 w-12 h-12 rotate-45 opacity-10 blur-sm group-hover:scale-150 transition-transform duration-700",
      variant === 'blue' && "bg-blue-500",
      variant === 'emerald' && "bg-emerald-500",
      variant === 'amber' && "bg-amber-500",
      variant === 'rose' && "bg-rose-500"
    )} />
  </motion.div>
);

const LeaderboardRow = ({ student, index }: any) => (
  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-bento-primary/5 transition-all group cursor-pointer border border-transparent hover:border-bento-border">
    <div className="flex items-center gap-3">
       <div className="relative">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm",
            index === 0 ? "bg-yellow-400 text-yellow-900" : 
            index === 1 ? "bg-slate-300 text-slate-700" :
            index === 2 ? "bg-orange-300 text-orange-900" : "bg-bento-bg text-bento-muted border border-bento-border"
          )}>
            {student.avatar}
          </div>
          {index < 3 && (
            <div className="absolute -top-1 -right-1">
              <Trophy size={10} className={cn(
                index === 0 ? "text-yellow-500" : index === 1 ? "text-slate-400" : "text-orange-500"
              )} />
            </div>
          )}
       </div>
       <div className="leading-tight">
          <div className="text-[12px] font-bold text-bento-text group-hover:text-bento-primary transition-colors">{student.name}</div>
          <div className="text-[9px] font-mono text-bento-muted uppercase tracking-tighter">{student.id}</div>
       </div>
    </div>
    <div className="text-right">
       <div className="text-[12px] font-black font-mono text-bento-primary">{student.score.toFixed(2)}</div>
       <div className="text-[8px] font-bold text-bento-muted uppercase">GPA</div>
    </div>
  </div>
);

const Candlestick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isUp = close >= open;
  const color = isUp ? '#10b981' : '#ef4444';
  
  // The y and height passed to shape are based on the [open, close] range.
  // We need to calculate the wicks relative to this box.
  const volume = Math.abs(open - close);
  const unit = volume === 0 ? 0 : height / volume;
  const highY = y - (high - Math.max(open, close)) * unit;
  const lowY = y + height + (Math.min(open, close) - low) * unit;

  return (
    <g className="cursor-crosshair group/candle">
      {/* Vertical line (wick) */}
      <line
        x1={x + width / 2}
        y1={highY}
        x2={x + width / 2}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
        className="group-hover/candle:stroke-bento-primary transition-colors"
      />
      {/* Candle body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity={0.8}
        rx={1}
        className="group-hover/candle:fill-opacity-100 transition-all"
      />
    </g>
  );
};

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = React.useState('Oct 24, 2023 • 10:45 AM');
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [user, setUser] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DASHBOARD_DATA.stats);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  
  // Notice Form State
  const [newNotice, setNewNotice] = useState({ text: '', type: 'info' });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    
    // Real-time Notices
    const qNotices = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubNotices = onSnapshot(qNotices, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(data.length > 0 ? data : DASHBOARD_DATA.notices);
    }, (err) => handleFirestoreError(err, 'list', 'notices'));

    // Real-time Leaderboard
    const qLeaderboard = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
    const unsubLeaderboard = onSnapshot(qLeaderboard, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data() }));
      setLeaderboard(data.length > 0 ? data : DASHBOARD_DATA.leaderboard);
    }, (err) => handleFirestoreError(err, 'list', 'leaderboard'));

    // Real-time Stats
    const unsubStats = onSnapshot(doc(db, 'settings', 'stats'), (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.data());
      }
    });

    return () => {
      unsubAuth();
      unsubNotices();
      unsubLeaderboard();
      unsubStats();
    };
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setNotification({ message: 'Login successful!', type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Login failed. Please try again.', type: 'error' });
    }
  };

  const logout = () => {
    signOut(auth);
    setIsAdminMode(false);
    setNotification({ message: 'Logged out.', type: 'success' });
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // CRUD Functions
  const addNotice = async () => {
    if (!newNotice.text || !user) return;
    try {
      await addDoc(collection(db, 'notices'), {
        ...newNotice,
        createdAt: serverTimestamp(),
        authorId: user.uid
      });
      setNewNotice({ text: '', type: 'info' });
      setNotification({ message: 'Notice posted successfully!', type: 'success' });
    } catch (err: any) {
      try {
        handleFirestoreError(err, 'create', 'notices');
      } catch (e: any) {
        const info = JSON.parse(e.message);
        const msg = !info.authInfo.emailVerified 
          ? 'Error: Your email must be verified to post notices.' 
          : 'Permission denied: Admin access required.';
        setNotification({ message: msg, type: 'error' });
      }
    }
  };

  const removeNotice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
      setNotification({ message: 'Notice removed.', type: 'success' });
    } catch (err: any) {
      try {
        handleFirestoreError(err, 'delete', 'notices');
      } catch (e: any) {
        setNotification({ message: 'Error: Permission denied.', type: 'error' });
      }
    }
  };

  const updateStats = async (key: string, value: number) => {
    try {
      await setDoc(doc(db, 'settings', 'stats'), {
        ...stats,
        [key]: value
      }, { merge: true });
      // We don't notify for every single input change to avoid noise, 
      // but maybe on blur or just let it be silent success
    } catch (err: any) {
      try {
        handleFirestoreError(err, 'write', 'settings/stats');
      } catch (e: any) {
        setNotification({ message: 'Error: Email verification or Admin access required.', type: 'error' });
      }
    }
  };

  return (
    <div className={cn(
      "h-screen bg-bento-bg flex flex-col font-sans overflow-hidden transition-colors duration-500",
      isDarkMode && "dark"
    )}>
      {/* Header Section */}
      <header className="h-[75px] bg-bento-card/80 backdrop-blur-xl border-b border-bento-border flex-shrink-0 z-50 sticky top-0">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-bento-primary to-transparent opacity-50" />
        
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] font-black text-[12px] uppercase tracking-widest flex items-center gap-3",
                notification.type === 'error' ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
              )}
            >
              {notification.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              {notification.message}
              <button onClick={() => setNotification(null)} className="ml-2 hover:scale-110 transition-transform"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="max-w-[1920px] mx-auto px-8 h-full grid grid-cols-1 md:grid-cols-3 items-center relative gap-4">
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none" />
          {/* Left Part - Status Indicators */}
          <div className="hidden md:flex items-center gap-4">
             <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 cursor-help hover:text-green-500 transition-colors">
                  <div className="w-1 h-1 rounded-full bg-green-500" /> 
                  <span className="uppercase tracking-widest">DB: ONLINE</span>
                </span>
                <span className="flex items-center gap-1.5 cursor-help hover:text-blue-500 transition-colors">
                  <div className="w-1 h-1 rounded-full bg-blue-500" /> 
                  <span className="uppercase tracking-widest">SYS: V.2.0.4</span>
                </span>
             </div>
          </div>

          {/* Center Part - Title */}
          <div className="flex flex-col items-center justify-center text-center py-2 md:py-0 relative">
             <div className="flex items-center gap-3 mb-1">
               <div className="h-[1px] w-6 bg-bento-primary/30 hidden lg:block" />
               <h1 className="text-[14px] lg:text-[16px] xl:text-[20px] font-black text-bento-primary uppercase tracking-normal leading-none hover:tracking-wider transition-all duration-700 cursor-default flex items-center gap-2">
                 <span className="opacity-70 font-medium">Chattogram Polytechnic</span>
                 <span className="text-bento-text/20">|</span>
                 <span>CPI DASHBOARD</span>
               </h1>
               <div className="h-[1px] w-6 bg-bento-primary/30 hidden lg:block" />
             </div>
             <p className="text-[8px] lg:text-[10px] text-bento-muted font-black uppercase tracking-[0.4em] hover:tracking-[0.6em] transition-all duration-1000 cursor-default opacity-60">
               Engineering & Technology Portal
             </p>
          </div>

           {/* Right Part - Controls & Time */}
           <div className="flex items-center justify-end gap-3 lg:gap-4">
              {user ? (
                <div className="flex items-center gap-2 bg-bento-bg/50 border border-bento-border p-1 rounded-2xl">
                  <button 
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                      isAdminMode 
                        ? "bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105" 
                        : "text-bento-muted hover:text-amber-500 hover:bg-amber-500/5"
                    )}
                  >
                    <Settings size={15} className={cn("transition-transform duration-700", isAdminMode && "animate-spin")} />
                    <span className="hidden sm:inline">{isAdminMode ? "Exit Admin" : "Manage CMS"}</span>
                  </button>
                  
                  <div className="h-6 w-[1px] bg-bento-border mx-1" />

                  <div className="flex items-center gap-3 pr-2">
                    <div className="hidden lg:flex flex-col items-end leading-tight">
                      <span className="text-[11px] font-black text-bento-text">{user.displayName}</span>
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest opacity-80">System Admin</span>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-10 h-10 rounded-xl bg-rose-500 text-white hover:bg-rose-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all active:scale-90 flex items-center justify-center group"
                      title="Logout"
                    >
                      <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-bento-primary text-white font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 group"
                >
                  <LogIn size={15} className="group-hover:translate-x-1 transition-transform" />
                  Admin Portal
                </button>
              )}
              
              <div className="flex items-center gap-2 bg-bento-bg/50 border border-bento-border p-1 rounded-2xl">
                <button 
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-xl text-bento-text hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-90 flex items-center justify-center shadow-sm group"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
                >
                  {isDarkMode 
                    ? <Sun size={20} className="group-hover:rotate-90 transition-transform duration-500 text-amber-400" /> 
                    : <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500 text-blue-500" />
                  }
                </button>
                <div className="hidden xl:flex flex-col justify-center px-3 border-l border-bento-border">
                  <span className="text-[8px] font-black text-bento-muted uppercase tracking-widest leading-none mb-1">Last Update</span>
                  <span className="text-[10px] font-bold text-bento-primary font-mono leading-none">{lastUpdated}</span>
                </div>
              </div>
           </div>
        </div>
      </header>

      {/* Main Container - Fit to Screen */}
      <main className="flex-grow max-w-[1900px] mx-auto w-full px-3 lg:px-4 py-3 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3 overflow-hidden">
        
        {/* Left Column: Grid Content - Scrollable if needed, but ideally fits */}
        <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 auto-rows-min gap-3">
            
            {/* Stats Row */}
            <StatCard label="Total Students" value={stats.totalStudents} subtext="+12 / Sem" variant="blue" />
            <StatCard label="Active Status" value={stats.activeStudents} subtext="95% Active" variant="emerald" />
            <StatCard label="Alumni" value={stats.alumni} subtext="Verified" variant="amber" />
            <StatCard label="Placements" value={stats.placementRate + "%"} subtext="Target: 90%" variant="rose" />

            {/* Main Graphs */}
            <BentoCard title="STUDENT DISTRIBUTION" extra="Year View" className="md:col-span-2" accent="violet">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[180px]">
                <div className="relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DASHBOARD_DATA.studentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {DASHBOARD_DATA.studentDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  {DASHBOARD_DATA.studentDistribution.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
                      <div className="flex items-center gap-2 text-violet-500">
                        <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]" style={{ backgroundColor: item.color }} />
                        <span className="text-bento-text opacity-80">{item.name}</span>
                      </div>
                      <span className="font-mono text-[12px]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>

          <BentoCard title="PERFORMANCE INDEX" className="md:col-span-2" accent="blue">
             <div className="flex items-baseline gap-2 mb-2 group">
                <div className="stat-val text-4xl tracking-tighter font-mono group-hover:scale-105 transition-transform duration-300">3.85</div>
                <div className="text-green-500 text-[10px] font-bold font-mono tracking-widest">+2.4%</div>
             </div>
             <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={DASHBOARD_DATA.performance}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSpline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      domain={[3.0, 4.0]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bento-card)', 
                        borderColor: 'var(--bento-border)',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontFamily: 'JetBrains Mono',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                      }}
                      itemStyle={{ color: 'var(--bento-primary)', fontWeight: 'black' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#2563eb" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorSpline)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </BentoCard>

          {/* Lower Grid Row */}
          <BentoCard title="INNOVATION HUB" className="2xl:col-span-1" accent="cyan">
             <div className="space-y-3">
               {DASHBOARD_DATA.projects.slice(0, 3).map((p, i) => (
                 <div key={i} className="flex items-center gap-2 p-2 bg-bento-bg rounded-lg border border-bento-border italic text-[10px] font-bold text-bento-text hover:bg-cyan-500/5 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                   <Cpu size={12} className="text-cyan-500 group-hover:rotate-45 transition-transform" /> 
                   <span className="font-mono tracking-tighter uppercase">{p}</span>
                 </div>
               ))}
             </div>
          </BentoCard>

          <BentoCard title="Student Leaderboard" className="2xl:col-span-1" accent="indigo">
             <div className="space-y-1">
                {(leaderboard.length > 0 ? leaderboard : DASHBOARD_DATA.leaderboard).map((student, i) => (
                  <LeaderboardRow key={i} student={student} index={i} />
                ))}
             </div>
          </BentoCard>

          <BentoCard title="PROFICIENCY INDEX" className="2xl:col-span-1" accent="blue">
            <div className="h-[280px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={DASHBOARD_DATA.skillsRadar}>
                  <PolarGrid stroke="#e2e8f0" strokeWidth={1} opacity={0.2} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'Inter', fontWeight: '500' }} />
                  <Radar 
                    dataKey="A" 
                    stroke="#2563eb" 
                    strokeWidth={1.5} 
                    fill="#2563eb" 
                    fillOpacity={0.25} 
                    animationDuration={2000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>

          <BentoCard title="REGIONAL CONTEXT" className="2xl:col-span-1 p-2" accent="emerald">
             <div className="h-[280px] w-full">
                <RegionalMap />
             </div>
          </BentoCard>
          </div>
        </div>

        {/* Sidebar - Animated Notice Board */}
        <aside className="h-full flex flex-col gap-4 overflow-hidden">
          <BentoCard 
            title={
              <div className="flex items-center justify-between w-full h-[30px]">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[ping_2s_infinite]" />
                   <span className="text-[13px] uppercase tracking-wider font-black text-bento-text group-hover:text-red-500 transition-colors duration-500">Live Notice Board</span>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                   <span className="text-[9px] font-black text-red-500 tracking-widest uppercase">LIVE FEED</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </div>
              </div>
            }
            className="flex-1 flex flex-col overflow-hidden border-t-2 border-red-500/50 group hover:border-red-500 transition-colors duration-500 shadow-xl"
          >
            <div className="flex-1 overflow-hidden relative py-3 px-1">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent z-20" />
              
              <motion.div 
                animate={{ 
                  y: [0, -1200] 
                }}
                transition={{ 
                  duration: 45, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                whileHover={{ animationPlayState: 'paused' }}
                className="space-y-5"
              >
              {/* Notice Data Feed */}
              {notices.map((n, i) => (
                <div key={i} className={cn(
                  "p-4 border rounded-2xl bg-bento-bg/40 backdrop-blur-sm shadow-md transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer group/item relative overflow-hidden",
                  n.type === 'warning' ? "border-rose-500/30 hover:border-rose-500" : "border-blue-500/30 hover:border-blue-500"
                )}>
                  {/* Item Shine Effect */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 group-hover/item:bg-white/20 transition-colors" />
                  
                  {isAdminMode && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeNotice(n.id); }}
                      className="absolute top-3 right-3 p-1.5 bg-rose-500 text-white rounded-xl opacity-0 group-hover/item:opacity-100 transition-all hover:bg-rose-600 shadow-lg z-30"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg transition-all group-hover/item:bg-white/10",
                      n.type === 'warning' ? "bg-rose-500/20 text-rose-500" : "bg-blue-500/20 text-blue-500"
                    )}>
                      {n.type}
                    </div>
                    <div className="text-[10px] text-bento-muted font-black font-mono group-hover/item:text-bento-primary transition-colors flex items-center gap-1.5">
                      <Calendar size={10} />
                      {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'JUST NOW'}
                    </div>
                  </div>
                  <div className={cn(
                    "text-[14px] font-black leading-tight transition-colors pr-6",
                    n.type === 'warning' ? "text-rose-900 dark:text-rose-100 group-hover/item:text-rose-600" : "text-bento-text group-hover/item:text-blue-500"
                  )}>{n.text}</div>
                  
                  {/* Decorative corner accent */}
                  <div className={cn(
                    "absolute bottom-0 right-0 w-8 h-8 opacity-10",
                    n.type === 'warning' ? "bg-rose-500" : "bg-blue-500",
                    "rounded-tl-full"
                  )} />
                </div>
              ))}
              {/* Duplicate notices for infinite scroll feel if list is short */}
              {notices.length < 10 && notices.map((n, i) => (
                <div key={`d-${i}`} className={cn(
                  "p-4 border rounded-2xl bg-bento-bg/40 backdrop-blur-sm shadow-md transition-all opacity-50 blur-[0.5px]",
                  n.type === 'warning' ? "border-rose-500/30" : "border-blue-500/30"
                )}>
                   <div className="flex items-center justify-between mb-3 opacity-50">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-500">
                      PAST FEED
                    </div>
                  </div>
                  <div className="text-[14px] font-black leading-tight text-slate-300 line-clamp-1">{n.text}</div>
                </div>
              ))}
              </motion.div>
              
              {/* Premium Top & Bottom Fade Masks - Enhanced */}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bento-card via-bento-card/90 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bento-card via-bento-card/90 to-transparent pointer-events-none z-10" />
            </div>
            
            {/* Admin Notice Input */}
            {isAdminMode && (
              <div className="mt-4 p-4 border border-bento-border rounded-2xl bg-white/5 space-y-3 z-30 relative">
                 <div className="flex items-center gap-2">
                   <Plus size={14} className="text-bento-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-bento-text">Post New Notice</span>
                 </div>
                 <textarea 
                   value={newNotice.text}
                   onChange={(e) => setNewNotice({...newNotice, text: e.target.value})}
                   placeholder="Type departmental announcement..."
                   className="w-full h-20 bg-bento-bg border border-bento-border rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                 />
                 <div className="flex gap-2">
                   <select 
                     value={newNotice.type}
                     onChange={(e) => setNewNotice({...newNotice, type: e.target.value})}
                     className="flex-1 bg-bento-bg border border-bento-border rounded-lg px-2 py-1.5 text-[10px] font-bold outline-none"
                   >
                     <option value="info">INFO (BLUE)</option>
                     <option value="warning">WARNING (RED)</option>
                   </select>
                   <button 
                     onClick={addNotice}
                     className="bg-bento-primary text-white font-black text-[10px] px-4 py-1.5 rounded-lg hover:bg-blue-600 active:scale-95 transition-all"
                   >
                     SEND FEED
                   </button>
                 </div>
              </div>
            )}
            
             {/* Admin Stats Management */}
             {isAdminMode && (
               <div className="mt-4 p-4 border border-bento-border rounded-2xl bg-white/5 space-y-4 z-30 relative">
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-bento-text">Update System Stats</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-bento-muted uppercase">Students</label>
                      <input 
                        type="number" 
                        value={stats.totalStudents} 
                        onChange={(e) => updateStats('totalStudents', parseInt(e.target.value))}
                        className="w-full bg-bento-bg border border-bento-border rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-bento-muted uppercase">Alumni</label>
                      <input 
                        type="number" 
                        value={stats.alumni} 
                        onChange={(e) => updateStats('alumni', parseInt(e.target.value))}
                        className="w-full bg-bento-bg border border-bento-border rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[8px] font-bold text-bento-muted uppercase">Placement Rate (%)</label>
                      <input 
                        type="number" 
                        value={stats.placementRate} 
                        onChange={(e) => updateStats('placementRate', parseInt(e.target.value))}
                        className="w-full bg-bento-bg border border-bento-border rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
               </div>
             )}
             
             {/* Interactive Footer */}
            <div className="mt-2 pt-2 border-t border-bento-border">
              <button className="w-full text-[10px] font-black text-bento-muted flex items-center justify-center gap-2 py-1 hover:text-bento-primary transition-colors">
                 PAUSE ON HOVER TO READ <TrendingUp size={10} />
              </button>
            </div>
          </BentoCard>

          <BentoCard title="Quick Contact" className="h-[160px] flex-shrink-0" accent="blue">
             <div className="space-y-3">
                <div className="flex items-center gap-3 group/person">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs shadow-inner group-hover/person:bg-blue-500 group-hover/person:text-white transition-all">HOD</div>
                   <div className="leading-none">
                     <b className="text-xs block text-bento-text group-hover:text-blue-500 transition-colors">Head of Dept.</b>
                     <span className="text-[10px] text-bento-muted font-mono">+880 1817-548148</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 group/person">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs shadow-inner group-hover/person:bg-emerald-500 group-hover/person:text-white transition-all">CI</div>
                   <div className="leading-none">
                     <b className="text-xs block text-bento-text group-hover:text-emerald-500 transition-colors">Mehadi Hassan</b>
                     <span className="text-[10px] text-bento-muted uppercase">Chief Instructor</span>
                   </div>
                </div>
             </div>
          </BentoCard>
        </aside>
      </main>

      {/* Footer Section */}
      <footer className="h-[40px] bg-bento-card border-t border-bento-border flex-shrink-0 flex items-center justify-between px-6 text-[10px] lg:text-[11px] text-bento-muted font-bold tracking-widest uppercase">
        <div>© {new Date().getFullYear()} CHATTOGRAM POLYTECHNIC INSTITUTE | ALL RIGHTS RESERVED | DEPARTMENT OF CST</div>
        <div className="flex gap-6 text-bento-primary">
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Support</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">V 2.0.4</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
