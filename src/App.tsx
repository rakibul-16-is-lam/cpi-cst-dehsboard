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
  Clock,
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
  Plus,
  Trash2,
  Save,
  LogIn,
  LogOut,
  Settings,
  X,
  Edit2,
  FileText,
  Video
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
import { TRANSLATIONS } from './translations';
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

const BentoCard = ({ title, children, className, extra, accent, titleClassName }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "dashboard-card p-3 xs:p-4 sm:p-5 flex flex-col group relative overflow-hidden transition-all duration-300", 
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
    {title && (
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
          <span className={cn("font-black text-xs uppercase tracking-[0.2em]", titleClassName)}>{title}</span>
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
    )}
    <div className="flex-grow flex flex-col min-h-0 z-10 relative">
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
      "dashboard-card p-3 xs:p-4 flex flex-col justify-between group cursor-default transition-all duration-300 relative overflow-hidden",
      variant === 'blue' && "bg-blue-500/[0.04] border-blue-500/20 hover:border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.05)]",
      variant === 'emerald' && "bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
      variant === 'amber' && "bg-amber-500/[0.04] border-amber-500/20 hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
      variant === 'rose' && "bg-rose-500/[0.04] border-rose-500/20 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
    )}
  >
    <div className="flex items-start justify-between relative z-20 gap-2">
      <div className={cn(
        "card-title transition-colors uppercase tracking-widest",
        variant === 'blue' && "text-blue-600 dark:text-blue-400",
        variant === 'emerald' && "text-emerald-600 dark:text-emerald-400",
        variant === 'amber' && "text-amber-600 dark:text-amber-400",
        variant === 'rose' && "text-rose-600 dark:text-rose-400"
      )}>
        {label}
      </div>
      <div className={cn(
        "stat-label opacity-60 group-hover:opacity-100 transition-opacity font-bold font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border border-bento-border/20 bg-bento-border/5 leading-none shrink-0",
        variant === 'blue' && "text-blue-500 border-blue-500/10 bg-blue-500/5",
        variant === 'emerald' && "text-emerald-500 border-emerald-500/10 bg-emerald-500/5",
        variant === 'amber' && "text-amber-500 border-amber-500/10 bg-amber-500/5",
        variant === 'rose' && "text-rose-500 border-rose-500/10 bg-rose-500/5"
      )}>
        {subtext}
      </div>
    </div>
    <div className="stat-val group-hover:translate-x-1 transition-transform font-mono tracking-tighter text-3xl xs:text-4xl sm:text-5xl mt-3 leading-none relative z-20">{value}</div>
    
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
  <VerticalMarquee speed={40} className="h-full min-h-[300px]" accentColor="emerald">
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
  <VerticalMarquee speed={45} className="h-[250px]" accentColor="blue">
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
  const [lang, setLang] = useState<'en' | 'bn'>(() => {
    return (localStorage.getItem('cpi_dashboard_lang') as 'en' | 'bn') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'bn' : 'en';
    setLang(nextLang);
    localStorage.setItem('cpi_dashboard_lang', nextLang);
  };

  const t = TRANSLATIONS[lang];

  const toBanglaNumerals = (num: string | number) => {
    if (lang === 'en') return String(num);
    const numMap: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(char => numMap[char] || char).join('');
  };
  
  // Set html element lang attribute for CSS font mapping
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Real-time Clock Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', {
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
  }, [lang]);
  const [user, setUser] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DASHBOARD_DATA.stats);
  const [broadcast, setBroadcast] = useState<any>({ mediaType: 'video', videoSrc: '', imageSrc: '' });
  const [contact, setContact] = useState<any>({
    headName: DASHBOARD_DATA.faculty.head,
    headPhone: DASHBOARD_DATA.faculty.mobile,
    headEmail: DASHBOARD_DATA.faculty.email,
    ciName: 'Mehadi Hassan',
    ciPhone: '01783515865',
    ciEmail: 'cstinstructor@gmail.com'
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [unauthorizedDomainInfo, setUnauthorizedDomainInfo] = useState<{ isOpen: boolean; domain: string } | null>(null);
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'notices' | 'leaderboard' | 'placements' | 'innovation' | 'stats' | 'news' | 'broadcast' | 'contact'>('stats');
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
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
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

    const unsubBroadcast = onSnapshot(doc(db, 'settings', 'broadcast'), (s) => {
      if (s.exists()) setBroadcast(s.data());
    });

    const unsubContact = onSnapshot(doc(db, 'settings', 'contact'), (s) => {
      if (s.exists()) setContact(s.data());
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
      unsubBroadcast(); unsubContact();
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
        setUnauthorizedDomainInfo({ isOpen: true, domain: window.location.hostname });
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(id);
    setTimeout(() => setCopiedState(null), 2000);
  };

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
          { id: 'broadcast', label: 'Live Broadcast', icon: Video },
          { id: 'contact', label: 'Quick Contacts', icon: Phone },
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
              {activeAdminTab === 'broadcast' && "Live Video & Image Broadcast"}
              {activeAdminTab === 'contact' && "Quick Contacts Directory"}
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

          {/* BROADCAST MANAGEMENT */}
          {activeAdminTab === 'broadcast' && (
            <div className="space-y-8 animate-fade-in-slow">
              <div className="dashboard-card p-6 border border-rose-500/20 bg-rose-500/[0.03]">
                <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2">
                  <Video size={16} /> Broadcast Control Center
                </h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-bento-muted uppercase tracking-widest">Active Media Type</label>
                      <select
                        value={broadcast.mediaType || 'video'}
                        onChange={async (e) => {
                          const val = e.target.value;
                          try {
                            await setDoc(doc(db, 'settings', 'broadcast'), {
                              ...broadcast,
                              mediaType: val
                            }, { merge: true });
                            setNotification({ message: 'Media type changed globally!', type: 'success' });
                          } catch (err) {
                            setNotification({ message: 'Failed to update media type', type: 'error' });
                          }
                        }}
                        className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 font-semibold text-sm text-bento-text focus:border-rose-500 outline-none transition-colors cursor-pointer"
                      >
                        <option value="video">Streaming Video</option>
                        <option value="image">Campus Album Image</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-bento-muted uppercase tracking-widest">Current Status</label>
                      <div className="px-4 py-3 bg-black/45 border border-bento-border rounded-xl flex items-center gap-3">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        <span className="text-xs uppercase tracking-wider font-extrabold text-rose-500 font-mono">Live Broadcast Node Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-bento-muted uppercase tracking-widest">Broadcast Video URL (Direct MP4 or Stream link)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter video URL..."
                        value={broadcast.videoSrc || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBroadcast({ ...broadcast, videoSrc: val });
                        }}
                        className="flex-grow bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm text-bento-text focus:border-rose-500 outline-none transition-all font-mono"
                      />
                      <button
                        onClick={async () => {
                          try {
                            await setDoc(doc(db, 'settings', 'broadcast'), {
                              ...broadcast
                            }, { merge: true });
                            setNotification({ message: 'Video URL broadcasted globally!', type: 'success' });
                          } catch (err) {
                            setNotification({ message: 'Failed to broadcast video', type: 'error' });
                          }
                        }}
                        className="bg-rose-600 hover:bg-rose-700 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-colors"
                      >
                        Publish URL
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-bento-muted uppercase tracking-widest">Broadcast Highlight Image URL (Unsplash or web address)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter image URL..."
                        value={broadcast.imageSrc || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBroadcast({ ...broadcast, imageSrc: val });
                        }}
                        className="flex-grow bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm text-bento-text focus:border-rose-500 outline-none transition-all font-mono"
                      />
                      <button
                        onClick={async () => {
                          try {
                            await setDoc(doc(db, 'settings', 'broadcast'), {
                              ...broadcast
                            }, { merge: true });
                            setNotification({ message: 'Image broadcasted globally!', type: 'success' });
                          } catch (err) {
                            setNotification({ message: 'Failed to broadcast image', type: 'error' });
                          }
                        }}
                        className="bg-rose-600 hover:bg-rose-700 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-colors"
                      >
                        Publish URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACTS MANAGEMENT */}
          {activeAdminTab === 'contact' && (
            <div className="space-y-8 animate-fade-in-slow">
              <div className="dashboard-card p-6 border border-blue-500/20 bg-blue-500/[0.03]">
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
                  <Phone size={16} /> Faculty Quick Contacts Directory
                </h3>
                <div className="space-y-6">
                  {/* Head of Department details */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-500 border-b border-bento-border pb-1">1. Head of Department (HOD)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-bento-muted">Full Name</label>
                        <input
                          type="text"
                          value={contact.headName || ''}
                          onChange={(e) => setContact({ ...contact, headName: e.target.value })}
                          className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm text-bento-text focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-bento-muted">Mobile Number</label>
                        <input
                          type="text"
                          value={contact.headPhone || ''}
                          onChange={(e) => setContact({ ...contact, headPhone: e.target.value })}
                          className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm text-bento-text focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-bento-muted">Office Email</label>
                        <input
                          type="text"
                          value={contact.headEmail || ''}
                          onChange={(e) => setContact({ ...contact, headEmail: e.target.value })}
                          className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm text-bento-text focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chief Instructor details */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 border-b border-bento-border pb-1">2. Chief Instructor (CI)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-bento-muted">Full Name</label>
                        <input
                          type="text"
                          value={contact.ciName || ''}
                          onChange={(e) => setContact({ ...contact, ciName: e.target.value })}
                          className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors text-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-bento-muted">Mobile Number</label>
                        <input
                          type="text"
                          value={contact.ciPhone || ''}
                          onChange={(e) => setContact({ ...contact, ciPhone: e.target.value })}
                          className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors text-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-bento-muted">Office Email</label>
                        <input
                          type="text"
                          value={contact.ciEmail || ''}
                          onChange={(e) => setContact({ ...contact, ciEmail: e.target.value })}
                          className="w-full bg-black/20 border border-bento-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        await setDoc(doc(db, 'settings', 'contact'), contact);
                        setNotification({ message: 'Quick Contacts updated successfully!', type: 'success' });
                      } catch (err) {
                        setNotification({ message: 'Error: Admin access required.', type: 'error' });
                      }
                    }}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    Save Contacts Directory to Database
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const getYearColor = (name: string) => {
    const norm = (name || '').toLowerCase();
    if (norm.includes('1st') || norm.includes('mobile')) return '#41cbd9'; // Cyan/Turquoise
    if (norm.includes('2nd') || norm.includes('onsite')) return '#3d5e82'; // Slate/Steel Blue
    if (norm.includes('3rd') || norm.includes('impl')) return '#fcbe4a'; // Yellow/Gold
    if (norm.includes('4th') || norm.includes('tech')) return '#ff7360'; // Coral/Salmon
    if (norm.includes('others') || norm.includes('other')) return '#8fd175'; // Light Green
    return '#a855f7';
  };

  const displayDistribution = React.useMemo(() => {
    const hasNewCategories = distribution && distribution.some((item: any) => {
      const name = (item.category || item.name || '').toLowerCase();
      return name.includes('mobile') || name.includes('onsite') || name.includes('impl') || name.includes('tech');
    });

    if (hasNewCategories) {
      return distribution;
    }
    return DASHBOARD_DATA.studentDistribution;
  }, [distribution]);

  return (
    <div className={cn(
      "h-screen max-h-screen bg-bento-bg flex flex-col font-sans overflow-hidden transition-colors duration-500"
    )}>
      {/* Proposal View Overlay */}
      <AnimatePresence>
        {showProposal && (
          <ProposalView onClose={() => setShowProposal(false)} />
        )}
      </AnimatePresence>

      {/* Unauthorized Domain Guide Modal */}
      <AnimatePresence>
        {unauthorizedDomainInfo?.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto font-sans"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bento-card border border-bento-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-left"
            >
              {/* Close Button */}
              <button 
                onClick={() => setUnauthorizedDomainInfo(null)}
                className="absolute top-4 right-4 text-bento-muted hover:text-bento-text bg-bento-bg/50 p-2 rounded-full border border-bento-border/50 hover:scale-105 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 text-amber-500 border-b border-bento-border pb-4">
                <AlertTriangle size={24} className="shrink-0 animate-pulse text-amber-500" />
                <div>
                  <h3 className="font-display font-black text-xs uppercase tracking-widest text-amber-500">Firebase Setup Required</h3>
                  <p className="text-[10px] text-bento-muted font-bold tracking-tight mt-0.5">AUTH_UNAUTHORIZED_DOMAIN</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-semibold leading-relaxed text-bento-muted">
                <p>
                  To secure user logins with Google, Firebase requires authorizing your app's host domains in your Firebase Project configuration.
                </p>

                <div className="bg-black/20 rounded-2xl p-4 border border-bento-border/50 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-bento-text block">Simple Steps to Fix:</span>
                  <ol className="list-decimal list-inside space-y-2 text-[11px] text-bento-muted font-bold">
                    <li>
                      Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-0.5 font-extrabold">Firebase Console <ExternalLink size={10} /></a>.
                    </li>
                    <li>Select your project, then navigate to <strong>Authentication</strong> &gt; <strong>Settings</strong> &gt; <strong>Authorized domains</strong>.</li>
                    <li>Click <strong>Add domain</strong> and authorize both URLs shown below:</li>
                  </ol>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-bento-muted">Development Domain</span>
                      {copiedState === 'dev' ? (
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Copied!</span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-black/40 border border-bento-border/40 p-2.5 rounded-xl font-mono text-[11px] text-bento-text select-all">
                      <span>{unauthorizedDomainInfo.domain}</span>
                      <button 
                        onClick={() => handleCopy(unauthorizedDomainInfo.domain, 'dev')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-bento-muted">Shared/Preview Domain</span>
                      {copiedState === 'pre' ? (
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Copied!</span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-black/40 border border-bento-border/40 p-2.5 rounded-xl font-mono text-[11px] text-bento-text select-all">
                      <span>{unauthorizedDomainInfo.domain.replace('-dev-', '-pre-')}</span>
                      <button 
                        onClick={() => handleCopy(unauthorizedDomainInfo.domain.replace('-dev-', '-pre-'), 'pre')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-bento-border/50">
                <button 
                  onClick={() => setUnauthorizedDomainInfo(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  Got it, Done!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="h-auto lg:h-[96px] bg-bento-card/80 backdrop-blur-xl border-b border-bento-border flex-shrink-0 z-50 sticky top-0 flex items-center py-3 lg:py-0">
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
        <div className="w-full max-w-[2800px] mx-auto px-4 sm:px-6 lg:px-10 h-full grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] 2xl:grid-cols-[1fr_520px] gap-4 md:gap-6 items-center relative py-1 overflow-hidden">
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none" />
          
          {/* Left Part - Logo & Title */}
          <div className="flex flex-col justify-center items-center text-center min-w-0 z-10 w-full">
            <h1 className="font-display font-black text-[15px] sm:text-[18px] md:text-[22px] lg:text-[24px] xl:text-[28px] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 dark:from-sky-400 dark:via-blue-350 dark:to-indigo-200 uppercase tracking-wider leading-none hover:scale-[1.01] transition-all duration-500 cursor-default select-none animate-[pulse_6s_infinite]" style={{ wordSpacing: "0.2em" }}>
              {t.welcomeTitle}
            </h1>
            
            <p className="font-sans text-[8px] sm:text-[9px] xl:text-[11px] text-bento-muted font-extrabold uppercase tracking-[0.25em] opacity-85 mt-2 select-none leading-none">
              {t.cstDept}
            </p>
          </div>

          {/* Right Part - Controls & Time */}
          <div className="flex items-center justify-center md:justify-end gap-3 w-full z-10">
             {/* Beautiful Language Switcher */}
             <button
               onClick={toggleLanguage}
               className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-indigo-500/20 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
               title="Change Language / ভাষা পরিবর্তন করুন"
             >
               <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-[10px] font-black">
                 {lang.toUpperCase()}
               </span>
               <span className="text-[11px] font-black tracking-widest uppercase text-slate-850 dark:text-slate-100 hidden xs:inline">
                 {lang === 'en' ? 'বাংলা' : 'English'}
               </span>
             </button>

             {user ? (
               <div className="flex items-center gap-2 bg-bento-bg/50 border border-bento-border p-1 rounded-2xl">
                 <div className="flex items-center gap-3 pr-2 pl-2">
                   {user.email === 'rakib.47g@gmail.com' && (
                     <button
                       onClick={() => setIsAdminMode(!isAdminMode)}
                       className={cn(
                         "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-300",
                         isAdminMode 
                           ? "bg-slate-900 border border-indigo-500/35 text-indigo-400 font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                           : "bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                       )}
                     >
                       <Settings size={13} className={cn(isAdminMode && "animate-spin")} />
                       {isAdminMode ? "Dashboard" : "Admin Panel"}
                     </button>
                   )}
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
                 className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] cursor-pointer"
               >
                 <LogIn size={14} />
                 <span className="text-[11px] font-black tracking-wider uppercase">
                   Login
                 </span>
               </button>
             )}
              
             <div className="flex items-center gap-3 bg-bento-bg/50 border border-bento-border p-2 sm:p-2.5 rounded-xl sm:rounded-2xl md:px-5">
               <div className="hidden xs:flex w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 animate-[pulse_3s_infinite] flex-shrink-0">
                 <Clock size={18} className="sm:size-5" />
               </div>
               <div className="hidden sm:flex flex-col justify-center">
                 <span className="text-[11px] sm:text-[12px] font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none mb-1">{t.timeAndDate}</span>
                 <span className="text-[15px] sm:text-[16px] md:text-[17px] font-bold text-blue-600 dark:text-blue-400 font-mono leading-none md:min-w-[270px] xl:min-w-[325px] tracking-wide">{lastUpdated}</span>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Container - Optimized for all screens including large monitors */}
      <main className="flex-grow w-full max-w-[2800px] mx-auto px-4 sm:px-6 lg:px-10 py-4 grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] 2xl:grid-cols-[1fr_520px] gap-4 md:gap-6 overflow-x-hidden overflow-y-auto md:overflow-hidden custom-scrollbar min-h-0">
        
        {isAdminMode ? (
          <AdminPanel />
        ) : (
          <>
            {/* Left Column: Grid Content */}
            <div className="flex flex-col w-full min-h-0 h-auto md:h-full md:overflow-y-auto md:pr-3 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-min gap-4 lg:gap-6 pb-0 mb-0 shrink-0">
                {/* Stats Row */}
                <StatCard label={t.totalStudents} value={toBanglaNumerals(stats.totalStudents)} subtext={t.enrolled} variant="blue" />
                <StatCard label={t.activeStatus} value={toBanglaNumerals(stats.activeStudents)} subtext={t.inCampus} variant="emerald" />
                <StatCard label={t.alumni} value={toBanglaNumerals(stats.alumni)} subtext={t.registered} variant="amber" />
                <StatCard label={t.placements} value={toBanglaNumerals(stats.placementRate || 0) + "%"} subtext={t.jobSuccess} variant="rose" />
              </div>

              {/* Premium Expanded Full-Screen Video Feed */}
              <div className="flex-grow mt-4 lg:mt-6 min-h-[500px] md:min-h-0 relative w-full rounded-3xl bg-slate-100/50 dark:bg-slate-900/40 p-4 border border-bento-border shadow-2xl flex flex-col">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </div>
                    <div>
                      <span className="text-[13px] font-extrabold text-bento-text tracking-wider uppercase font-display block">
                        {t.successfulAlbum}
                      </span>
                      <span className="text-[9px] text-bento-muted font-bold block uppercase tracking-widest font-mono">
                        {t.albumSub}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 shadow-sm animate-pulse">
                     <span className="text-[8px] font-black text-rose-500 tracking-widest uppercase font-mono">{t.liveBroadcast}</span>
                  </div>
                </div>
                
                <div className="flex-grow min-h-[420px] md:min-h-0 relative w-full h-[500px] md:h-full rounded-2xl overflow-hidden bg-black shadow-inner border border-bento-border/50">
                  <RakibVideo className="absolute inset-0 w-full h-full" />
                </div>
              </div>
            </div>

            {/* Sidebar - Animated Notice Board */}
            <aside className="w-full md:h-full flex flex-col gap-4 overflow-y-auto md:overflow-hidden md:pr-1 custom-scrollbar">
              {/* Latest Notice Highlight */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 text-white shadow-[0_20px_40px_rgba(225,29,72,0.3)] relative overflow-hidden border border-white/25 group flex-shrink-0"
              >
                {/* Shining sweep effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2.5s_infinite] pointer-events-none" />
                
                {/* Mesh Gradient Decorations */}
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/20 blur-[80px] rounded-full animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-400/20 blur-[80px] rounded-full" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute inset-0" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white relative" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] drop-shadow-sm font-display text-white/90">{t.breakingNews}</span>
                    </div>
                    <div className="bg-white/15 p-1.5 rounded-lg backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform duration-300">
                      <Bell size={13} className="text-white animate-pulse" />
                    </div>
                  </div>
                  <div className="text-[17px] font-black leading-snug drop-shadow-md group-hover:text-amber-100 transition-colors duration-300 font-display">
                    {notices[0]?.text || t.noUpdates}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                    <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Calendar size={11} className="text-amber-300" />
                      {notices[0]?.createdAt?.toDate ? notices[0].createdAt.toDate().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US') : t.justNow}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/30 rounded-full text-[9px] font-black uppercase tracking-wider ring-1 ring-white/30 backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      {t.active}
                    </div>
                  </div>
                </div>
              </motion.div>

              <BentoCard 
                title={
                  <div className="flex items-center justify-between w-full h-[32px]">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                       <span className="text-[13px] uppercase tracking-wider font-extrabold text-bento-text font-display group-hover:text-red-500 transition-colors duration-500">{t.liveNoticeBoard}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
                       <span className="text-[9px] font-black text-red-500 tracking-widest uppercase font-mono">{t.liveFeed}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>
                  </div>
                }
                className="flex-1 flex flex-col overflow-hidden border-t-4 border-red-500/80 group hover:border-red-500 transition-all duration-500 shadow-2xl rounded-2xl"
              >
                <div className="flex-1 overflow-hidden relative py-3 px-1">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent z-20" />
                  
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
                    className="space-y-4"
                  >
                  {/* Notice Data Feed */}
                  {notices.map((n, i) => {
                    const isWarning = n.type === 'warning';
                    return (
                      <div key={i} className={cn(
                        "p-4 border rounded-2xl bg-gradient-to-br transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer group/item relative overflow-hidden",
                        isWarning 
                          ? "from-rose-500/5 to-amber-500/0 border-rose-500/20 hover:border-rose-500 hover:shadow-rose-500/5 hover:from-rose-500/10" 
                          : "from-blue-500/5 to-indigo-500/0 border-blue-500/20 hover:border-blue-500 hover:shadow-blue-500/5 hover:from-blue-500/10"
                      )}>
                        {/* Left neon border lines */}
                        <div className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                          isWarning ? "bg-rose-500" : "bg-blue-500"
                        )} />

                        {/* Top micro light reflection */}
                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/10 group-hover/item:bg-white/20 transition-colors" />
                        
                        <div className="flex items-center justify-between mb-2.5">
                          <div className={cn(
                            "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1",
                            isWarning ? "bg-rose-500/20 text-rose-500" : "bg-blue-500/20 text-blue-500"
                          )}>
                            {isWarning ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                            {n.type}
                          </div>
                          <div className="text-[11px] text-bento-muted font-bold font-mono group-hover/item:text-bento-primary transition-colors flex items-center gap-1.5">
                            <Clock size={11} className="opacity-70" />
                            {n.createdAt?.toDate ? toBanglaNumerals(n.createdAt.toDate().toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })) : t.justNow.toUpperCase()}
                          </div>
                        </div>
                        <div className={cn(
                          "text-[14px] sm:text-base font-extrabold leading-snug transition-colors pr-4 break-words",
                          isWarning ? "text-rose-950 dark:text-rose-100 group-hover/item:text-rose-600" : "text-bento-text group-hover/item:text-blue-500"
                        )}>{n.text}</div>
                        
                        {/* Decorative corner accent */}
                        <div className={cn(
                          "absolute bottom-0 right-0 w-6 h-6 opacity-5 group-hover/item:opacity-10 transition-opacity",
                          isWarning ? "bg-rose-500" : "bg-blue-500",
                          "rounded-tl-full"
                        )} />
                      </div>
                    );
                  })}

                  {/* Duplicate notices for infinite scroll feel if list is short */}
                  {notices.length < 10 && notices.map((n, i) => {
                    const isWarning = n.type === 'warning';
                    return (
                      <div key={`d-${i}`} className={cn(
                        "p-4 border rounded-2xl bg-bento-bg/30 backdrop-blur-xs transition-all opacity-45 blur-[0.2px]",
                        isWarning ? "border-rose-500/15" : "border-blue-500/15"
                      )}>
                         <div className="flex items-center justify-between mb-2 opacity-50">
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-500">
                             {t.pastFeed}
                          </div>
                        </div>
                        <div className="text-[13px] font-bold leading-tight text-slate-400 line-clamp-1">{n.text}</div>
                      </div>
                    );
                  })}
                  </motion.div>
                  
                  {/* Premium Top & Bottom Fade Masks - Enhanced */}
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bento-card via-bento-card/95 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bento-card via-bento-card/95 to-transparent pointer-events-none z-10" />
                </div>
                
                 {/* Interactive Footer */}
                <div className="mt-1 pt-2 border-t border-bento-border/50">
                  <button className="w-full text-[9px] font-black text-bento-muted flex items-center justify-center gap-1.5 py-1 hover:text-bento-primary transition-colors tracking-widest font-mono">
                     {t.hoverToPause} <TrendingUp size={10} />
                  </button>
                </div>
              </BentoCard>

              <BentoCard title={t.quickContact} titleClassName="inline-block px-[3px] mb-[3px]" className="h-[185px] flex-shrink-0 rounded-2xl shadow-xl" accent="blue">
                 <div className="flex items-center justify-between h-full py-1">
                    <div className="space-y-3.5 flex-grow pr-2">
                       {/* HOD Contact Row */}
                       <div className="flex items-center gap-3.5 group/person cursor-pointer">
                          <div className="relative shrink-0">
                             <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 font-extrabold text-xs shadow-md group-hover/person:from-blue-500 group-hover/person:to-indigo-600 group-hover/person:text-white group-hover/person:border-blue-500 group-hover/person:shadow-[0_4px_12px_rgba(59,130,246,0.3)] transition-all duration-300">
                                {lang === 'bn' ? "প্রধান" : "HOD"}
                             </div>
                             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                             </div>
                          </div>
                          <div className="leading-tight">
                            <b className="text-[13px] block text-bento-text group-hover/person:text-blue-500 transition-colors uppercase tracking-wider font-extrabold leading-none">{contact.headName}</b>
                            <span className="text-[11px] text-bento-muted font-bold block mt-1 hover:text-blue-500 transition-all flex items-center gap-1">
                              <Phone size={10} className="text-blue-500/70 shrink-0 group-hover/person:animate-bounce" /> {toBanglaNumerals(contact.headPhone)}
                            </span>
                          </div>
                       </div>

                       {/* CI Contact Row */}
                       <div className="flex items-center gap-3.5 group/person cursor-pointer">
                          <div className="relative shrink-0">
                             <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 font-extrabold text-xs shadow-md group-hover/person:from-emerald-500 group-hover/person:to-teal-600 group-hover/person:text-white group-hover/person:border-emerald-500 group-hover/person:shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-all duration-300">
                                {lang === 'bn' ? "সিআই" : "CI"}
                             </div>
                             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                             </div>
                          </div>
                          <div className="leading-tight">
                            <b className="text-[13px] block text-bento-text group-hover/person:text-emerald-500 transition-colors uppercase tracking-wider font-extrabold leading-none">{contact.ciName}</b>
                            <span className="text-[11px] text-bento-muted font-bold block mt-1 flex items-center gap-1 uppercase tracking-tight">
                              <span className="relative flex h-1.5 w-1.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                              {t.chiefInstructor}
                            </span>
                          </div>
                       </div>

                       {/* HOD/CI Mail Indicator */}
                       <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider hover:text-blue-500 transition-colors flex items-center gap-1.5 pt-1.5 cursor-pointer border-t border-bento-border/40">
                         <Mail size={11} className="text-slate-400/80 shrink-0" />
                         {contact.headEmail}
                       </div>
                    </div>
                    
                    {/* Exquisite QR Code Frame */}
                    <div className="relative shrink-0 flex flex-col items-center p-2 bg-white/90 dark:bg-slate-900/80 rounded-2xl shadow-lg border border-bento-border hover:border-blue-500/40 hover:shadow-[0_12px_28px_rgba(59,130,246,0.15)] group hover:scale-[1.05] transition-all duration-300 backdrop-blur-md select-none group/qr">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-350 blur-xs" />
                      <div className="relative bg-white p-1 rounded-xl">
                        <QRCodeSVG 
                           value={`MATMSG:TO:${contact.headEmail};SUB:Query;BODY:Contacting from Dashboard;;TEL:${contact.headPhone};;`}
                           size={70}
                           level="H"
                           includeMargin={false}
                        />
                      </div>
                      <div className="text-[8px] font-black text-center mt-1.5 text-slate-500 tracking-[0.25em] group-hover:text-blue-500 transition-colors uppercase font-mono">
                        {t.scanCode}
                      </div>
                    </div>
                 </div>
              </BentoCard>
            </aside>
          </>
        )}
      </main>

      {/* Footer Section */}
      <footer className="h-auto py-3 md:h-[40px] bg-bento-card border-t border-bento-border flex-shrink-0 flex flex-col md:flex-row items-center justify-between px-2 sm:px-6 text-[9px] sm:text-[10px] lg:text-[11px] text-bento-muted font-bold tracking-widest uppercase gap-2">
        <div className="text-center md:text-left">© {toBanglaNumerals(new Date().getFullYear())} {t.rightsReserved}</div>
        <div className="flex items-center gap-4 sm:gap-6 text-bento-primary">
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">{t.support}</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">V {toBanglaNumerals("2.0.4")}</span>
          
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
              {t.server} {lang === 'bn' ? (backendStatus === 'online' ? 'অনলাইন' : backendStatus === 'checking' ? 'যাচাই করা হচ্ছে' : 'অফলাইন') : backendStatus}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
