import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { ProposalView } from './components/ProposalView';
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
  Edit2,
  FileText
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
  handleFirestoreError,
  OperationType 
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
import RakibVideo from './components/RakibVideo';

// --- Sub-Components ---

const BentoCard = ({ title, children, className, extra, accent }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "dashboard-card p-1.5 xs:p-2 sm:p-3 flex flex-col group relative overflow-hidden transition-all duration-300", 
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
      <div className="flex items-center gap-2">
        {accent && (
          <div className={cn(
            "w-2 h-2 rounded-full animate-ping",
            accent === 'blue' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : 
            accent === 'emerald' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
            accent === 'amber' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
            accent === 'rose' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" :
            accent === 'violet' ? "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" :
            accent === 'cyan' ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" :
            accent === 'indigo' ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""
          )} />
        )}
        <span className="font-black text-xs uppercase tracking-[0.2em]">{title}</span>
      </div>
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
      "dashboard-card p-3 xs:p-4 flex flex-col group cursor-default transition-all duration-300 relative overflow-hidden",
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
    <div className="stat-val group-hover:translate-x-1 transition-transform font-mono tracking-tighter text-3xl xs:text-4xl sm:text-5xl mt-1 leading-none relative z-20">{value}</div>
    <div className="stat-label mt-2 opacity-60 group-hover:opacity-100 transition-opacity font-bold font-mono text-[14px] border-t border-bento-border/20 pt-1 uppercase relative z-20">
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
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 transition-all duration-300 group cursor-default shadow-sm mb-1 gap-2">
    <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-lg font-black shadow-lg border-2 border-white/20 bg-bento-bg group-hover:scale-110 transition-transform duration-500 ring-2 ring-indigo-500/20">
            {student.photo ? (
              <img src={student.photo} alt={student.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className={cn(
                "w-full h-full flex items-center justify-center",
                index === 0 ? "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 font-black" : 
                index === 1 ? "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 font-black" :
                index === 2 ? "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950 font-black" : "bg-indigo-500/20 text-indigo-500"
              )}>
                {student.avatar}
              </div>
            )}
          </div>
          {index < 3 && (
            <div className="absolute -top-1.5 -right-1.5 z-10 p-1 bg-white rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <Trophy size={14} className={cn(
                "drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]",
                index === 0 ? "text-amber-500" : index === 1 ? "text-slate-400" : "text-orange-500"
              )} />
            </div>
          )}
       </div>
       <div className="leading-tight">
          <div className="text-[14px] font-black text-bento-text uppercase tracking-tight group-hover:text-indigo-500 transition-colors">{student.name}</div>
          <div className="text-[10px] font-mono font-black text-indigo-500/60 uppercase tracking-widest">{student.batch || student.id}</div>
       </div>
    </div>
    <div className="text-right">
       <div className="text-[18px] font-black font-mono text-indigo-600 dark:text-indigo-400 flex items-baseline gap-1">
         {typeof student.score === 'number' ? student.score.toFixed(2) : student.cgpa}
         <span className="text-[9px] font-bold text-bento-muted/40 uppercase">GPA</span>
       </div>
       <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${((typeof student.score === 'number' ? student.score : student.cgpa) / 4) * 100}%` }}
           className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
         />
       </div>
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

const VerticalMarquee = ({ children, speed = 40, className, accentColor = "rose" }: { children: React.ReactNode, speed?: number, className?: string, accentColor?: string }) => {
  return (
    <div className={cn("relative overflow-hidden group rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-[2px]", className)}>
      {/* Mesh Decor - Very Subtle */}
      <div className={cn("absolute -top-20 -right-20 w-64 h-64 blur-[100px] rounded-full opacity-10 animate-pulse pointer-events-none", 
        accentColor === "rose" ? "bg-rose-500" : accentColor === "emerald" ? "bg-emerald-500" : accentColor === "blue" ? "bg-blue-500" : "bg-indigo-500")} />
      <div className={cn("absolute -bottom-20 -left-20 w-64 h-64 blur-[100px] rounded-full opacity-5 pointer-events-none", 
        accentColor === "rose" ? "bg-orange-500" : accentColor === "emerald" ? "bg-teal-500" : accentColor === "blue" ? "bg-cyan-500" : "bg-indigo-500")} />

      <motion.div
        animate={{
          y: [0, -1000],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ animationPlayState: 'paused' }}
        className="space-y-3 p-3 relative z-10"
      >
        {children}
        {children}
      </motion.div>
      
      {/* Glossy Overlay - Minimal Fades */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-bento-card to-transparent z-10 pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-bento-card to-transparent z-10 pointer-events-none opacity-40" />
    </div>
  );
};

const AlumniPlacements = () => (
  <VerticalMarquee speed={40} className="h-[350px] lg:h-[400px]" accentColor="emerald">
    {DASHBOARD_DATA.placements.map((p, i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group cursor-default shadow-sm gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-500 ring-1 ring-emerald-500/30">
            <GraduationCap size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-black text-bento-text uppercase tracking-tight group-hover:text-emerald-500 transition-colors truncate">{p.name}</div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400/80 truncate">{p.position}</div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[13px] font-black text-emerald-500 flex items-center gap-1 justify-end truncate">
            <MapPin size={12} /> {p.company}
          </div>
          <div className="text-[10px] font-mono font-black text-bento-muted/60 uppercase tracking-widest">{p.year} Batch</div>
        </div>
      </div>
    ))}
  </VerticalMarquee>
);

const JobSeekersList = () => (
  <VerticalMarquee speed={45} className="h-[350px] lg:h-[400px]" accentColor="blue">
    {DASHBOARD_DATA.jobSeekers.map((s, i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 hover:border-blue-500/50 transition-all duration-300 group cursor-default shadow-sm gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-500 ring-1 ring-blue-500/30">
            <Cpu size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-black text-bento-text uppercase tracking-tight group-hover:text-blue-500 transition-colors truncate">{s.name}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {s.skills.split(', ').map((skill, si) => (
                <span key={si} className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-extrabold uppercase ring-1 ring-blue-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <button className="flex items-center gap-1 text-[10px] font-black text-white hover:text-white transition-colors uppercase tracking-widest bg-blue-600 px-3 py-1.5 rounded-lg shadow-lg">
            <Github size={12} /> Profile
          </button>
        </div>
      </div>
    ))}
  </VerticalMarquee>
);

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = React.useState('');
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  
  // Real-time Clock Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setLastUpdated(formatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);
  const [user, setUser] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DASHBOARD_DATA.stats);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'notices' | 'leaderboard' | 'placements' | 'innovation' | 'stats' | 'news'>('stats');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  // CMS State
  const [newNotice, setNewNotice] = useState({ text: '', type: 'info' });
  const [newItem, setNewItem] = useState<any>({ type: 'news', text: '', title: '', team: '', status: 'In Progress', name: '', position: '', company: '', year: '', score: 0, category: '', value: 0, color: '#6366f1' });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Automatically enter admin mode if user is authorized
      if (u && u.email === 'rakib.47g@gmail.com') {
        // Option to auto-enable, but keeping it manual for better UX
      }
    });
    
    // Real-time Listeners
    const unsubNotices = onSnapshot(query(collection(db, 'notices'), orderBy('createdAt', 'desc')), (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(data.length > 0 ? data : DASHBOARD_DATA.notices);
    });

    const unsubNews = onSnapshot(query(collection(db, 'news')), (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(data.length > 0 ? data : DASHBOARD_DATA.notices.map(n => ({ text: n.text })));
    });

    const unsubLeaderboard = onSnapshot(query(collection(db, 'leaderboard'), orderBy('score', 'desc')), (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setLeaderboard(data.length > 0 ? data : DASHBOARD_DATA.leaderboard);
    });

    const unsubProjects = onSnapshot(collection(db, 'innovation'), (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setProjects(data.length > 0 ? data.map(d => d.title) : DASHBOARD_DATA.projects);
    });

    const unsubPlacements = onSnapshot(collection(db, 'placements'), (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPlacements(data.length > 0 ? data : DASHBOARD_DATA.placements);
    });

    const unsubDistribution = onSnapshot(collection(db, 'distribution'), (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setDistribution(data.length > 0 ? data : DASHBOARD_DATA.studentDistribution);
    });

    const unsubStats = onSnapshot(doc(db, 'settings', 'stats'), (s) => {
      if (s.exists()) setStats(s.data());
    });

    // Check Backend Status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'online') setBackendStatus('online');
        else setBackendStatus('offline');
      })
      .catch(() => setBackendStatus('offline'));

    return () => {
      unsubAuth(); unsubNotices(); unsubNews(); unsubLeaderboard(); 
      unsubProjects(); unsubPlacements(); unsubDistribution(); unsubStats();
    };
  }, []);


  const login = async () => {
    try {
      setNotification({ message: 'Initializing Google Login...', type: 'success' });
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in user:", result.user.email);
      setNotification({ message: `Welcome ${result.user.displayName}!`, type: 'success' });
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      let errorMsg = "Login failed: ";
      
      if (err.code === "auth/popup-blocked") {
        errorMsg += "Popups blocked. Keep the window open and allow popups.";
      } else if (err.code === "auth/unauthorized-domain") {
        errorMsg += `Domain not authorized. Please add "${window.location.hostname}" to Firebase Console Settings.`;
      } else if (err.code === "auth/popup-closed-by-user") {
        errorMsg += "Login window closed before completion.";
      } else {
        errorMsg += (err.code ? `[${err.code}] ` : "") + (err.message || "Unknown error");
      }
      
      setNotification({ message: errorMsg, type: 'error' });
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
      });
      setNewNotice({ text: '', type: 'info' });
      setNotification({ message: 'Notice posted successfully!', type: 'success' });
    } catch (err: any) {
      try {
        handleFirestoreError(err, OperationType.CREATE, 'notices');
      } catch (e: any) {
        setNotification({ message: 'Error: Admin access required.', type: 'error' });
      }
    }
  };

  const genericAdd = async (coll: string, data: any) => {
    try {
      await addDoc(collection(db, coll), {
        ...data,
        createdAt: serverTimestamp()
      });
      setNotification({ message: 'Added successfully!', type: 'success' });
    } catch (err: any) {
      setNotification({ message: 'Permission Denied', type: 'error' });
    }
  };

  const genericDelete = async (coll: string, id: string) => {
    try {
      await deleteDoc(doc(db, coll, id));
      setNotification({ message: 'Removed successfully!', type: 'success' });
    } catch (err: any) {
      setNotification({ message: 'Permission Denied', type: 'error' });
    }
  };

  const removeNotice = (id: string) => genericDelete('notices', id);

  const updateStats = async (key: string, value: any) => {
    try {
      await setDoc(doc(db, 'settings', 'stats'), {
        ...stats,
        [key]: value
      }, { merge: true });
    } catch (err: any) {
      setNotification({ message: 'Error: Admin access required.', type: 'error' });
    }
  };


  const AdminPanel = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full bg-bento-card border-2 border-amber-500/20 rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-[800px] shadow-2xl relative"
    >
      {/* Admin Sidebar */}
      <div className="w-full md:w-64 bg-black/10 border-r border-bento-border p-6 flex flex-col gap-2">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white">
            <Settings size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-bento-text">Admin Hub</div>
            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Management</div>
          </div>
        </div>

        {[
          { id: 'stats', label: 'System Stats', icon: BarChart3 },
          { id: 'notices', label: 'Notice Board', icon: Bell },
          { id: 'news', label: 'Breaking News', icon: AlertTriangle },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'placements', label: 'Placements', icon: GraduationCap },
          { id: 'innovation', label: 'Innovations', icon: Cpu },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
              activeAdminTab === tab.id 
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 translate-x-2" 
                : "text-bento-muted hover:bg-white/5 hover:text-bento-text"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-bento-border">
          <button 
            onClick={() => setIsAdminMode(false)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-500 rounded-xl text-[11px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all shadow-md"
          >
            <LogOut size={16} />
            Exit Admin
          </button>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white/[0.01]">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-bento-text uppercase tracking-tighter">
              {activeAdminTab === 'stats' && "System Analytics"}
              {activeAdminTab === 'notices' && "Departmental Announcements"}
              {activeAdminTab === 'news' && "Global News Ticker"}
              {activeAdminTab === 'leaderboard' && "Student Excellence"}
              {activeAdminTab === 'placements' && "Career Success"}
              {activeAdminTab === 'innovation' && "Innovation Tracking"}
            </h2>
            <p className="text-sm font-bold text-bento-muted uppercase tracking-[0.2em] mt-1">Management Interface v2.0</p>
          </div>
          <div className="px-5 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Connection
          </div>
        </header>

        <div className="max-w-4xl">
          {/* STATS MANAGEMENT */}
          {activeAdminTab === 'stats' && (
            <div className="space-y-6">
              <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-600/20 flex items-center justify-between group">
                <div className="pr-4">
                  <h3 className="text-lg font-black text-blue-600 uppercase tracking-tight">Developer Handover Portal</h3>
                  <p className="text-xs text-bento-muted font-bold mt-1">Ready for Django + React migration guide.</p>
                </div>
                <button 
                  onClick={() => window.open('/handover', '_blank')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <FileText size={15} />
                  Open Docs to Print PDF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="dashboard-card p-6 border border-amber-500/20 bg-amber-500/[0.02]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
                    <Users size={16} /> Enrolment Metrics
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'totalStudents', label: 'Total Enrolled', icon: Users },
                      { key: 'activeStudents', label: 'Active Status', icon: UserCheck },
                      { key: 'alumni', label: 'Registered Alumni', icon: GraduationCap },
                    ].map(s => (
                      <div key={s.key} className="space-y-2">
                        <label className="text-[10px] font-black text-bento-muted uppercase tracking-widest flex items-center gap-2">
                          <s.icon size={12} /> {s.label}
                        </label>
                        <input 
                          type="number"
                          value={stats[s.key]}
                          onChange={(e) => updateStats(s.key, parseInt(e.target.value))}
                          className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 font-mono text-xl focus:border-amber-500 outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="dashboard-card p-6 border border-rose-500/20 bg-rose-500/[0.02]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2">
                    <TrendingUp size={16} /> Performance Targets
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-bento-muted uppercase tracking-widest">Placement Rate (%)</label>
                      <input 
                        type="number"
                        value={stats.placementRate}
                        onChange={(e) => updateStats('placementRate', parseInt(e.target.value))}
                        className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 font-mono text-xl focus:border-rose-500 outline-none transition-colors text-rose-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-bento-muted uppercase tracking-widest">GPA Average (0-4.0)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={stats.performanceIndex}
                        onChange={(e) => updateStats('performanceIndex', parseFloat(e.target.value))}
                        className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 font-mono text-xl focus:border-rose-500 outline-none transition-colors text-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* NOTICES MANAGEMENT */}
          {activeAdminTab === 'notices' && (
            <div className="space-y-8">
              <div className="dashboard-card p-8 bg-blue-500/[0.03] border border-blue-500/20 ring-1 ring-blue-500/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6 underline underline-offset-8">Broadcast New Alert</h3>
                <div className="space-y-4">
                  <textarea 
                    value={newNotice.text}
                    onChange={(e) => setNewNotice({...newNotice, text: e.target.value})}
                    placeholder="Enter urgent announcement or departmental update..."
                    className="w-full h-32 bg-black/20 border border-bento-border rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-blue-500/20"
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select 
                      value={newNotice.type}
                      onChange={(e) => setNewNotice({...newNotice, type: e.target.value})}
                      className="flex-1 bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500"
                    >
                      <option value="info">General Info (Blue)</option>
                      <option value="warning">Urgent Warning (Red)</option>
                    </select>
                    <button 
                      onClick={addNotice}
                      className="flex-1 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Publish to Stream
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-bento-muted uppercase tracking-[0.3em] mb-4">Active Notices ({notices.length})</h3>
                {notices.map((n) => (
                  <div key={n.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-bento-border group hover:border-blue-500/50 transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                          n.type === 'warning' ? "bg-rose-500/20 text-rose-500" : "bg-blue-500/20 text-blue-500"
                        )}>{n.type}</span>
                        <span className="text-[10px] font-mono font-bold text-bento-muted">{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : 'Just Now'}</span>
                      </div>
                      <div className="text-sm font-black text-bento-text opacity-80">{n.text}</div>
                    </div>
                    <button 
                      onClick={() => removeNotice(n.id)}
                      className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEWS TICKER MANAGEMENT */}
          {activeAdminTab === 'news' && (
            <div className="space-y-8">
              <div className="dashboard-card p-6 bg-rose-500/[0.03] border border-rose-500/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2">
                  <AlertTriangle size={16} /> Ticker Update
                </h3>
                <div className="flex gap-4">
                  <input 
                    placeholder="Enter breaking news text..."
                    value={newItem.text}
                    onChange={(e) => setNewItem({...newItem, text: e.target.value})}
                    className="flex-1 bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none"
                  />
                  <button 
                    onClick={() => genericAdd('news', { text: newItem.text })}
                    className="bg-rose-600 px-6 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest"
                  >
                    Post Ticker
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                {news.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-bento-border hover:border-rose-500/50 transition-all">
                    <span className="font-black text-rose-500 text-xs italic tracking-tight">{item.text}</span>
                    <button 
                      onClick={() => genericDelete('news', item.id)}
                      className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEADERBOARD MANAGEMENT */}
          {activeAdminTab === 'leaderboard' && (
            <div className="space-y-8">
               <div className="dashboard-card p-6 bg-indigo-500/[0.03] border border-indigo-500/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-6">Add Star Student</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    placeholder="Full Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm"
                  />
                  <input 
                    placeholder="Student ID / Batch"
                    value={newItem.batch}
                    onChange={(e) => setNewItem({...newItem, batch: e.target.value})}
                    className="bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm"
                  />
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="GPA Score (e.g. 3.85)"
                    value={newItem.score}
                    onChange={(e) => setNewItem({...newItem, score: parseFloat(e.target.value)})}
                    className="bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm"
                  />
                  <button 
                    onClick={() => genericAdd('leaderboard', { name: newItem.name, batch: newItem.batch, score: newItem.score, avatar: '👤' })}
                    className="bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    Publish to Leaderboard
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {leaderboard.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-bento-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white">
                        {s.avatar || '🎓'}
                      </div>
                      <div>
                        <div className="text-[12px] font-black text-bento-text uppercase">{s.name}</div>
                        <div className="text-[10px] font-bold text-bento-muted">{s.batch}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-indigo-500 font-mono font-black text-lg">{s.score}</div>
                        <div className="text-[8px] font-black opacity-40 uppercase">GPA Rank</div>
                      </div>
                      <button 
                        onClick={() => genericDelete('leaderboard', s.id)}
                        className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLACEMENT MANAGEMENT */}
          {activeAdminTab === 'placements' && (
            <div className="space-y-8">
              <div className="dashboard-card p-6 border border-emerald-500/20 bg-emerald-500/[0.03]">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">Record Success Story</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Student Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="col-span-2 bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm" />
                  <input placeholder="Company Name" value={newItem.company} onChange={(e) => setNewItem({...newItem, company: e.target.value})} className="bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm" />
                  <input placeholder="Position" value={newItem.position} onChange={(e) => setNewItem({...newItem, position: e.target.value})} className="bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm" />
                  <input placeholder="Batch / Year" value={newItem.year} onChange={(e) => setNewItem({...newItem, year: e.target.value})} className="bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm" />
                  <button 
                    onClick={() => genericAdd('placements', { name: newItem.name, company: newItem.company, position: newItem.position, year: newItem.year })}
                    className="bg-emerald-600 text-white font-black text-[10px] tracking-widest rounded-xl"
                  >
                    Add Record
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                {placements.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-bento-border flex items-center justify-between bg-white/[0.02]">
                    <div>
                      <div className="text-sm font-black text-emerald-500 mb-1">{p.name || p.student}</div>
                      <div className="text-[10px] font-bold text-bento-muted uppercase tracking-widest">{p.position} @ {p.company}</div>
                    </div>
                    <button onClick={() => genericDelete('placements', p.id)} className="text-rose-500 p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INNOVATION MANAGEMENT */}
          {activeAdminTab === 'innovation' && (
            <div className="space-y-8">
              <div className="dashboard-card p-6 border border-cyan-500/20 bg-cyan-500/[0.03]">
                <h3 className="text-xs font-black uppercase tracking-widest text-cyan-500 mb-6">New Prototype Project</h3>
                <div className="flex gap-4">
                  <input 
                    placeholder="Project Title (e.g. Smart Irrigation System)"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    className="flex-1 bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none"
                  />
                  <button 
                    onClick={() => genericAdd('innovation', { title: newItem.title })}
                    className="bg-cyan-600 px-8 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-600/20"
                  >
                    Register Project
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((title: string, i: number) => (
                  <div key={i} className="p-5 rounded-2xl border border-bento-border bg-white/[0.03] hover:border-cyan-500/50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                        <Cpu size={20} />
                      </div>
                      <span className="font-black text-sm uppercase tracking-tight text-bento-text opacity-90">{title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={cn(
      "min-h-screen bg-bento-bg flex flex-col font-sans overflow-hidden transition-colors duration-500",
      isDarkMode && "dark"
    )}>
      {/* Proposal View Overlay */}
      <AnimatePresence>
        {showProposal && (
          <ProposalView onClose={() => setShowProposal(false)} />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="h-auto md:h-[75px] bg-bento-card/80 backdrop-blur-xl border-b border-bento-border flex-shrink-0 z-50 sticky top-0">
        {/* Breaking News Ticker */}
        <div className="bg-rose-600 text-white py-1.5 px-4 overflow-hidden relative">
          <div className="flex items-center gap-4 animate-[marquee_30s_linear_infinite] whitespace-nowrap font-black text-[10px] uppercase tracking-widest">
            {news.map((item, i) => (
              <span key={i || (item as any).id} className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-amber-300" />
                {item.text}
                <span className="mx-4 opacity-50">||</span>
              </span>
            ))}
          </div>
        </div>

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
        <div className="w-full px-2 sm:px-4 lg:px-8 h-full grid grid-cols-1 md:grid-cols-3 items-center relative gap-2 sm:gap-4 py-2 md:py-0">
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
               <h1 className="text-[11px] sm:text-[14px] lg:text-[16px] xl:text-[20px] font-black text-bento-primary uppercase tracking-normal leading-none hover:tracking-wider transition-all duration-700 cursor-default flex items-center gap-2">
                 <span className="opacity-70 font-medium hidden xs:inline">C.P.I</span>
                 <span className="text-bento-text/20 hidden xs:inline">|</span>
                 <span>DASHBOARD</span>
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
                      "flex items-center gap-3 px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                      isAdminMode 
                        ? "bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105" 
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                    )}
                  >
                    {isAdminMode ? <Settings size={15} className="animate-spin" /> : <LogIn size={15} />}
                    <div className="flex flex-col items-start leading-[0.9]">
                      <span className="text-[8px] opacity-70">{isAdminMode ? "System" : "Admin"}</span>
                      <span className="text-[11px]">{isAdminMode ? "Exit Hub" : "Portal"}</span>
                    </div>
                  </button>
                  
                  <div className="h-6 w-[1px] bg-bento-border mx-1" />

                  <div className="flex items-center gap-3 pr-2">
                    <div className="hidden lg:flex flex-col items-end leading-tight">
                      <span className="text-[11px] font-black text-bento-text">{user.displayName}</span>
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest opacity-80">
                        {user.email === 'rakib.47g@gmail.com' ? "ROOT ADMIN" : "STAFF USER"}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/20">
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <button 
                      onClick={logout}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-500 text-white hover:bg-rose-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all active:scale-90 flex items-center justify-center group"
                      title="Logout"
                    >
                      <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="flex items-center gap-4 px-6 sm:px-10 py-3 sm:py-4 rounded-[2.5rem] bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
                  <div className="bg-white/10 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                    <LogIn size={20} />
                  </div>
                  <div className="flex flex-col items-start text-left leading-[0.9]">
                    <span className="text-[10px] sm:text-[12px] opacity-80 font-bold uppercase">Admin</span>
                    <span className="text-[16px] sm:text-[18px] tracking-tight uppercase">Portal</span>
                  </div>
                </button>
              )}
              
              <div className="flex items-center gap-2 bg-bento-bg/50 border border-bento-border p-0.5 sm:p-1 rounded-xl sm:rounded-2xl">
                <button 
                  onClick={toggleTheme}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-bento-text hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-90 flex items-center justify-center shadow-sm group"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
                >
                  {isDarkMode 
                    ? <Sun size={16} className="sm:hidden group-hover:rotate-90 transition-transform duration-500 text-amber-400" /> 
                    : <Moon size={16} className="sm:hidden group-hover:-rotate-12 transition-transform duration-500 text-blue-500" />
                  }
                  {isDarkMode 
                    ? <Sun size={20} className="hidden sm:block group-hover:rotate-90 transition-transform duration-500 text-amber-400" /> 
                    : <Moon size={20} className="hidden sm:block group-hover:-rotate-12 transition-transform duration-500 text-blue-500" />
                  }
                </button>
                <div className="hidden sm:flex flex-col justify-center px-3 border-l border-bento-border">
                  <span className="text-[10px] font-black text-bento-muted uppercase tracking-widest leading-none mb-1">Time and Date</span>
                  <span className="text-[12px] font-bold text-bento-primary font-mono leading-none md:min-w-[180px] xl:min-w-[250px]">{lastUpdated}</span>
                </div>
              </div>
           </div>
        </div>
      </header>

      {/* Main Container - Optimized for all screens including large monitors */}
      <main className="flex-grow w-full max-w-[2400px] mx-auto px-1 sm:px-4 lg:px-6 py-4 flex flex-col xl:grid xl:grid-cols-[1fr_380px] 2xl:grid-cols-[1fr_450px] gap-4 xl:gap-6 overflow-x-hidden overflow-y-auto custom-scrollbar min-h-0">
        
        {isAdminMode ? (
          <AdminPanel />
        ) : (
          <>
            {/* Left Column: Grid Content */}
            <div className="h-auto xl:h-full xl:overflow-y-auto xl:pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-min gap-4 xl:gap-6 pb-4">
                
                {/* Stats Row */}
                <StatCard label="Total Students" value={stats.totalStudents} subtext="Enrolled" variant="blue" />
                <StatCard label="Active Status" value={stats.activeStudents} subtext="In Campus" variant="emerald" />
                <StatCard label="Alumni" value={stats.alumni} subtext="Registered" variant="amber" />
                <StatCard label="Placements" value={stats.placementRate + "%"} subtext="Job Success" variant="rose" />

                {/* Main Graphs */}
                <BentoCard title="STUDENT DISTRIBUTION" extra="Year View" className="sm:col-span-2" accent="violet">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto sm:h-[180px]">
                    <div className="relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {distribution.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color || DASHBOARD_DATA.studentDistribution[index % 4].color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col justify-center space-y-2">
                      {distribution.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-[16px] font-black uppercase tracking-tighter">
                          <div className="flex items-center gap-2 text-violet-500">
                            <div className="w-4 h-4 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]" style={{ backgroundColor: item.color || DASHBOARD_DATA.studentDistribution[i % 4].color }} />
                            <span className="text-bento-text opacity-80">{item.category || item.name}</span>
                          </div>
                          <span className="font-mono text-[18px]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </BentoCard>

              <BentoCard title="PERFORMANCE INDEX" className="sm:col-span-2" accent="blue">
                 <div className="flex items-baseline gap-2 mb-2 group">
                    <div className="stat-val text-4xl tracking-tighter font-mono group-hover:scale-105 transition-transform duration-300">{stats.performanceIndex || 3.85}</div>
                    <div className="text-green-500 text-[10px] font-bold font-mono tracking-widest">+2.4%</div>
                 </div>

                 <div className="h-[140px] w-full min-h-[140px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                          tick={{ fontSize: 13, fill: '#64748b', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} 
                        />
                        <YAxis 
                          domain={[3.0, 4.0]} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 13, fill: '#64748b', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--bento-card)', 
                            borderColor: 'var(--bento-border)',
                            borderRadius: '8px',
                            fontSize: '13px',
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
                   {projects.map((p, i) => (
                     <div key={i} className="flex items-center gap-2 p-2 bg-bento-bg rounded-lg border border-bento-border italic text-[10px] font-bold text-bento-text hover:bg-cyan-500/5 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                       <Cpu size={12} className="text-cyan-500 group-hover:rotate-45 transition-transform" /> 
                       <span className="font-mono tracking-tighter uppercase">{p}</span>
                     </div>
                   ))}
                 </div>
              </BentoCard>

              <BentoCard title="Student Leaderboard" className="2xl:col-span-1" accent="indigo">
                 <div className="mt-2">
                    <VerticalMarquee speed={60} className="h-[350px] lg:h-[400px]" accentColor="indigo">
                       {leaderboard.map((student, i) => (
                          <div key={i} className="mb-2">
                            <LeaderboardRow student={student} index={i} />
                          </div>
                       ))}
                    </VerticalMarquee>
                 </div>
              </BentoCard>

              <BentoCard title="ALUMNI PLACEMENTS" extra="Success Stories" className="2xl:col-span-1" accent="emerald">
                 <div className="mt-2">
                    <VerticalMarquee speed={40} className="h-[350px] lg:h-[400px]" accentColor="emerald">
                      {placements.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group cursor-default shadow-sm gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-500 ring-1 ring-emerald-500/30">
                              <GraduationCap size={20} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[14px] font-black text-bento-text uppercase tracking-tight group-hover:text-emerald-500 transition-colors truncate">{p.name}</div>
                              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400/80 truncate">{p.position}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[13px] font-black text-emerald-500 flex items-center gap-1 justify-end truncate">
                              <MapPin size={12} /> {p.company}
                            </div>
                            <div className="text-[10px] font-mono font-black text-bento-muted/60 uppercase tracking-widest">{p.year} Batch</div>
                          </div>
                        </div>
                      ))}
                    </VerticalMarquee>
                 </div>
              </BentoCard>


              <BentoCard title="TALENT SHAPING" extra="Skill Showcase" className="2xl:col-span-1" accent="blue">
                 <div className="mt-2">
                    <JobSeekersList />
                 </div>
              </BentoCard>

              {/* Large Bottom Video Feed */}
              <BentoCard 
                title="CAMPUS MULTIMEDIA FEED" 
                extra="LIVE MP4" 
                className="sm:col-span-2 lg:col-span-3 2xl:col-span-4" 
                accent="rose"
              >
                <div className="mt-1">
                  <RakibVideo />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-bento-muted uppercase tracking-[0.2em] px-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-rose-500"/> Rakib.esb</span>
                    <span className="opacity-40">|</span>
                    <span>Source: internal_stream.mp4</span>
                  </div>
                  <span className="text-rose-500/80">Broadcasting Now</span>
                </div>
              </BentoCard>
              </div>
            </div>

            {/* Sidebar - Animated Notice Board */}
            <aside className="w-full xl:h-full flex flex-col gap-4 overflow-hidden">
              {/* Latest Notice Highlight */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 text-white shadow-[0_20px_50px_rgba(225,29,72,0.3)] relative overflow-hidden border border-white/30 group"
              >
                {/* Mesh Gradient Decorations */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-[80px] rounded-full animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/20 blur-[80px] rounded-full" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span className="text-[14px] font-black uppercase tracking-[0.4em] drop-shadow-sm">Breaking News</span>
                  </div>
                  <div className="text-xl font-black leading-tight drop-shadow-lg group-hover:scale-[1.01] transition-transform duration-500">
                    {notices[0]?.text || "No recent updates available for the moment."}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                    <span className="text-[12px] font-bold opacity-90 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={12} />
                      {notices[0]?.createdAt?.toDate ? notices[0].createdAt.toDate().toLocaleDateString() : 'Just Now'}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full text-[10px] font-black uppercase ring-1 ring-white/40 backdrop-blur-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_bg-emerald-400]" />
                      Status: Active
                    </div>
                  </div>
                </div>
              </motion.div>

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
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn(
                          "text-[14px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg transition-all group-hover/item:bg-white/10",
                          n.type === 'warning' ? "bg-rose-500/20 text-rose-500" : "bg-blue-500/20 text-blue-500"
                        )}>
                          {n.type}
                        </div>
                        <div className="text-[14px] text-bento-muted font-black font-mono group-hover/item:text-bento-primary transition-colors flex items-center gap-1.5">
                          <Calendar size={12} />
                          {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'JUST NOW'}
                        </div>
                      </div>
                      <div className={cn(
                        "text-base sm:text-lg font-black leading-tight transition-colors pr-6 break-words",
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
                
                 {/* Interactive Footer */}
                <div className="mt-2 pt-2 border-t border-bento-border">
                  <button className="w-full text-[10px] font-black text-bento-muted flex items-center justify-center gap-2 py-1 hover:text-bento-primary transition-colors">
                     PAUSE ON HOVER TO READ <TrendingUp size={10} />
                  </button>
                </div>
              </BentoCard>

              <BentoCard title="Quick Contact" className="h-[220px] flex-shrink-0" accent="blue">
                 <div className="flex items-center justify-between">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 group/person">
                         <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-lg shadow-inner group-hover/person:bg-blue-500 group-hover/person:text-white transition-all">HOD</div>
                         <div className="leading-none">
                           <b className="text-sm block text-bento-text group-hover:text-blue-500 transition-colors uppercase tracking-widest font-black">{DASHBOARD_DATA.faculty.head}</b>
                           <span className="text-[14px] text-bento-muted font-bold block mt-1">{DASHBOARD_DATA.faculty.mobile}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 group/person">
                         <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-lg shadow-inner group-hover/person:bg-emerald-500 group-hover/person:text-white transition-all">CI</div>
                         <div className="leading-none">
                           <b className="text-sm block text-bento-text group-hover:text-emerald-500 transition-colors uppercase tracking-widest font-black">Mehadi Hassan</b>
                           <span className="text-[14px] text-bento-muted font-bold block mt-1 uppercase">Chief Instructor</span>
                         </div>
                      </div>
                      <div className="text-[11px] text-bento-muted font-mono mt-2 opacity-60">
                        {DASHBOARD_DATA.faculty.email}
                      </div>
                   </div>
                   
                   <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm border border-bento-border/50 group hover:scale-105 transition-transform duration-300">
                     <QRCodeSVG 
                        value={`MATMSG:TO:${DASHBOARD_DATA.faculty.email};SUB:Query;BODY:Contacting from Dashboard;;TEL:${DASHBOARD_DATA.faculty.mobile};;`}
                        size={90}
                        level="H"
                        includeMargin={false}
                     />
                     <div className="text-[8px] font-black text-center mt-1 text-slate-400 uppercase tracking-tighter">Scan to Contact</div>
                   </div>
                 </div>
              </BentoCard>
            </aside>
          </>
        )}
      </main>

      {/* Footer Section */}
      <footer className="h-auto py-3 md:h-[40px] bg-bento-card border-t border-bento-border flex-shrink-0 flex flex-col md:flex-row items-center justify-between px-2 sm:px-6 text-[9px] sm:text-[10px] lg:text-[11px] text-bento-muted font-bold tracking-widest uppercase gap-2">
        <div className="text-center md:text-left">© {new Date().getFullYear()} CHATTOGRAM POLYTECHNIC INSTITUTE | ALL RIGHTS RESERVED | DEPARTMENT OF CST</div>
        <div className="flex items-center gap-4 sm:gap-6 text-bento-primary">
          <button 
            onClick={() => setShowProposal(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full hover:bg-blue-500/20 transition-all font-black"
          >
            <FileText size={12} />
            Executive Proposal
          </button>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Support</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">V 2.0.4</span>
          
          <div className="flex items-center gap-2 pl-4 border-l border-bento-border">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              backendStatus === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
              backendStatus === 'checking' ? "bg-amber-500" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            )} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              backendStatus === 'online' ? "text-emerald-500" : 
              backendStatus === 'checking' ? "text-amber-500" : "text-rose-500"
            )}>
              Server {backendStatus}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
