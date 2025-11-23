import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Target, Calendar, Edit2, Check, X, BarChart3, 
  Download, Upload, ChevronDown, ChevronUp, AlertTriangle, 
  Info, ExternalLink, BookOpen, Gamepad2, MessageCircle, HelpCircle 
} from 'lucide-react';

// [INSTRUCTION]: Uncomment this line for your GitHub/Vercel build
// import './styles/quests.css';

// ==========================================
// CONFIGURATION & DATA
// ==========================================

// [INSTRUCTION]: Uncomment import.meta.env for production. Using fallback for preview.
const GOOGLE_DOC_URL = 
  // (import.meta.env?.VITE_GOOGLE_DOC_URL as string) || 
  "https://docs.google.com/document/d/1JyKI70T_1VAmJyUE28iiBS0fAVo-OY-PwHOSyPdxQDk/edit?tab=t.0#heading=h.61x1vaa6502e";

const TOWERS_DATA = [
  { name: 'Prison Tower', points: 15, color: 'bg-pink-300' },
  { name: 'Atlantis Tower', points: 15, color: 'bg-cyan-400' },
  { name: 'Mezuvian Tower', points: 15, color: 'bg-red-400' },
  { name: 'Oasis Tower', points: 15, color: 'bg-orange-300' },
  { name: 'Aether Tower', points: 15, color: 'bg-purple-400' },
  { name: 'Arcane Tower', points: 15, color: 'bg-pink-500' },
  { name: 'Celestial Tower', points: 15, color: 'bg-yellow-400' }
];

const WORLDS_DATA = [
  { 
    num: 1, color: 'bg-slate-600',
    bosses: ['Big Tree Guardian', 'Crab Prince', 'Dire Boarwolf'],
    dungeons: [
      { name: '1-1 Crabby Crusade', normal: 1, challenge: 2 },
      { name: '1-2 Scarecrow Defense', normal: 1, challenge: 2 },
      { name: '1-3 Dire Problem', normal: 1, challenge: 2 },
      { name: '1-4 Kingslayer', normal: 1, challenge: 2 },
      { name: '1-5 Gravetower Dungeon', normal: 1, challenge: 2 }
    ]
  },
  { 
    num: 2, color: 'bg-green-600',
    bosses: ['Big Poison Flower', 'Dark Goblin Knight', 'Red Goblins'],
    dungeons: [
      { name: '2-1 Temple of Ruin', normal: 1, challenge: 2 },
      { name: '2-2 Mama Trauma', normal: 1, challenge: 2 },
      { name: '2-3 Volcano\'s Shadow', normal: 2, challenge: 3 },
      { name: '2-4 Volcano Dungeon', normal: 2, challenge: 3 }
    ]
  },
  { 
    num: 3, color: 'bg-blue-600',
    bosses: ['Icy Blob', 'Castle Commander', 'Dragon Protector'],
    dungeons: [
      { name: '3-1 Mountain Pass', normal: 2, challenge: 3 },
      { name: '3-2 Winter Cavern', normal: 2, challenge: 3 },
      { name: '3-3 Winter Dungeon', normal: 2, challenge: 3 }
    ]
  },
  { 
    num: 4, color: 'bg-orange-600',
    bosses: ['Elder Golem', 'Buff Twins (Cac & Tus)', 'Fire Scorpion'],
    dungeons: [
      { name: '4-1 Scrap Canyon', normal: 3, challenge: 4 },
      { name: '4-2 Deserted Burrowmine', normal: 3, challenge: 4 },
      { name: '4-3 Pyramid Dungeon', normal: 3, challenge: 4 }
    ]
  },
  { 
    num: 5, color: 'bg-pink-600',
    bosses: ['Great Blossom Tree', 'Blue Goblin Gatekeeper', 'Hand of Ignis'],
    dungeons: [
      { name: '5-1 Konoh Heartlands', normal: 3, challenge: 4 },
      { name: '5-2 Konoh Inferno', normal: 4, challenge: 5 }
    ]
  },
  { 
    num: 6, color: 'bg-teal-600',
    bosses: ['Whirlpool Scorpion', 'Lava Shark'],
    dungeons: [
      { name: '6-1 Rough Waters', normal: 4, challenge: 5 },
      { name: '6-2 Treasure Hunt', normal: 4, challenge: 5 }
    ]
  },
  { 
    num: 7, color: 'bg-red-600',
    bosses: ['Son of Ignis', 'Hades', 'Minotaur'],
    dungeons: [
      { name: '7-1 The Underworld', normal: 5, challenge: 6 },
      { name: '7-2 The Labyrinth', normal: 5, challenge: 6 }
    ]
  },
  { 
    num: 8, color: 'bg-yellow-700',
    bosses: ['Gargantigator', 'Ancient Emerald Guardian', 'Toa: Tree of the Ruins', 'Ruinous, Poison Dragon'],
    dungeons: [
      { name: '8-1 Rescue in the Ruins', normal: 5, challenge: 6 },
      { name: '8-2 Ruin Rush', normal: 6, challenge: 7 }
    ]
  },
  { 
    num: 9, color: 'bg-purple-700',
    bosses: ['Aether Lord', 'Giant Minotaur', 'Redwood Mammoose'],
    dungeons: [
      { name: '9-1 Treetop Trouble', normal: 6, challenge: 7 },
      { name: '9-2 Aether Fortress', normal: 6, challenge: 7 }
    ]
  },
  { 
    num: 10, color: 'bg-fuchsia-800',
    bosses: ['Crystal Assassin', 'Crystal Alpha', 'Crystal Tyrant'],
    dungeons: [
      { name: '10-1 Crystal Chaos', normal: 7, challenge: 8 },
      { name: '10-2 Astral Academy', normal: 7, challenge: 8 }
    ]
  }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getTodayEST = () => {
  const now = new Date();
  const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  if (estTime.getHours() < 17) {
    estTime.setDate(estTime.getDate() - 1);
  }
  const year = estTime.getFullYear();
  const month = String(estTime.getMonth() + 1).padStart(2, '0');
  const day = String(estTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const calculatePoints = (player) => {
  if (!player) return 0;
  let points = 0;

  WORLDS_DATA.forEach(world => {
    world.dungeons.forEach(dungeon => {
      if (player.dungeons[`${dungeon.name}_normal`]) points += dungeon.normal;
      if (player.dungeons[`${dungeon.name}_challenge`]) points += dungeon.challenge;
    });
  });

  WORLDS_DATA.forEach(world => {
    world.bosses.forEach((boss) => {
      if (player.worldEvents[`world${world.num}_${boss}`]) points += 1;
    });
  });

  TOWERS_DATA.forEach(tower => {
    if (player.towers[tower.name]) points += 15;
  });

  if (player.infiniteTower.floor >= 150) {
    const floorsAbove150 = player.infiniteTower.floor - 150;
    const bossesDefeated = Math.floor(floorsAbove150 / 5);
    points += bossesDefeated * 5;
  }

  if (player.guildQuests.easy) points += 25;
  if (player.guildQuests.medium) points += 50;
  if (player.guildQuests.hard) points += 100;

  return points;
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const CustomModal = ({ isOpen, type, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-yellow-500/30 rounded-xl max-w-md w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="quest-card flex items-center gap-3 mb-4">
            {type === 'confirm' ? (
              <AlertTriangle className="text-white" size={28} />
            ) : (
              <Info className="text-blue-400" size={28} />
            )}
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
          <div className="flex gap-3">
            {type === 'confirm' ? (
              <>
                <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">Confirm</button>
                <button onClick={onCancel} className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">Cancel</button>
              </>
            ) : (
              <button onClick={onCancel} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">Okay</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onEnter, playerName, setPlayerName }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl w-full z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-4 ring-1 ring-yellow-500/30">
            <Trophy className="text-yellow-400" size={48} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 tracking-tight">
            THE HYYERR GUILD
          </h1>
          <p className="text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            Official Point Tracker & Resource Hub
          </p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {getSeasonDates().reverse().map(date => (
                <button
                  key={date}
                  onClick={() => {
                    const today = getTodayEST();
                    
                    // Only force save if currently on today's date
                    if (selectedDate === today && currentPlayer) {
                      forceSaveCurrentState();
                    }
                    
                    // Update view mode and selected date
                    const isViewingPast = date !== today;
                    setIsViewMode(isViewingPast);
                    setSelectedDate(date);
                    setShowCalendar(false);
                    
                    // Load appropriate player data
                    const stored = localStorage.getItem(`hyyerr_player_${date}`);
                    if (stored) {
                      setCurrentPlayer(JSON.parse(stored));
                    } else if (date === today) {
                      // Only create new empty player for today
                      setCurrentPlayer({
                        name: playerName,
                        dungeons: {},
                        worldEvents: {},
                        towers: {},
                        infiniteTower: { floor: 0 },
                        guildQuests: { easy: false, medium: false, hard: false }
                      });
                    } else {
                      // For past dates with no data, show empty state
                      setCurrentPlayer({
                        name: playerName,
                        dungeons: {},
                        worldEvents: {},
                        towers: {},
                        infiniteTower: { floor: 0 },
                        guildQuests: { easy: false, medium: false, hard: false }
                      });
                    }
                  }}
                  className={`p-3 rounded-lg border transition-all relative ${
                    date === selectedDate
                      ? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-500/50'
                      : history[date]
                      ? history[date] >= 300
                        ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-white text-sm font-medium mb-1">{formatDate(date)}</div>
                  <div className={`text-xs font-bold ${
                    history[date]
                      ? history[date] >= 300
                        ? 'text-green-400'
                        : 'text-yellow-400'
                      : 'text-gray-500'
                  }`}>
                    {history[date] ? `${history[date]} pts` : '-'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full border border-purple-500/30 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Performance Analytics</h3>
              <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-500/30">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1">Goal Completion</div>
                <div className="text-4xl font-bold text-green-400">{analytics.goalPercentage}%</div>
                <div className="text-xs text-green-400/60 mt-2">Days with 300+ pts</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-5 border border-orange-500/30">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1">Current Streak</div>
                <div className="text-4xl font-bold text-orange-400">{analytics.currentStreak}</div>
                <div className="text-xs text-orange-400/60 mt-2">Consecutive days</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-5 border border-blue-500/30">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1">Weekly Avg</div>
                <div className="text-4xl font-bold text-blue-400">{analytics.weeklyAvg}</div>
                <div className="text-xs text-blue-400/60 mt-2">Last 7 Days</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-5 border border-yellow-500/30">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1">Total Score</div>
                <div className="text-4xl font-bold text-yellow-400">{totalPoints}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-500/30">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1">Best Day</div>
                <div className="text-4xl font-bold text-purple-400">{analytics.bestDayPoints}</div>
                <div className="text-xs text-purple-400/60 mt-2">{analytics.bestDay ? formatDate(analytics.bestDay) : 'No Data'}</div>
              </div>
              <div className="bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-xl p-5 border border-teal-500/30">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1">Daily Avg</div>
                <div className="text-4xl font-bold text-teal-400">{avgPoints}</div>
                <div className="text-xs text-teal-400/60 mt-2">Lifetime Season Avg</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import/Export Modal */}
      {showImportExport && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-green-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Backup & Restore</h3>
              <button onClick={() => setShowImportExport(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={exportData}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Download size={18} />
                Download Backup File
              </button>

              <div className="relative">
                <label className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer font-semibold">
                  <Upload size={18} />
                  Restore From Backup
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => importData(e)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-xs leading-relaxed">
                  <strong>Tip:</strong> Export regularly to save your data locally. Importing will overwrite your current history with the backup file.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome, Adventurer</h2>
                <p className="text-gray-400 leading-relaxed">
                  Track your daily dungeon runs, boss kills, and tower climbs efficiently. Your progress is saved automatically to this device.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Enter Username to Begin</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onEnter()}
                    placeholder="Roblox Username"
                    className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                  />
                  <button onClick={onEnter} className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95">Enter</button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-black/20 p-3 rounded-lg border border-white/5">
                <HelpCircle size={16} className="text-blue-400" />
                <span>Need help? Contact <span className="text-white font-semibold">HyyerrFocus</span> on Discord.</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-purple-400" />
                Official Resources
              </h3>
              
              <a href="https://discord.gg/RRvcg9hMwK" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 rounded-xl group transition-all">
                <div className="flex items-center gap-3">
                  <MessageCircle className="text-[#5865F2]" size={24} />
                  <div className="text-left">
                    <div className="text-white font-bold group-hover:text-[#5865F2] transition-colors">World Zero Discord</div>
                    <div className="text-[#5865F2]/60 text-xs">Join the community</div>
                  </div>
                </div>
                <ExternalLink size={16} className="text-[#5865F2] opacity-0 group-hover:opacity-100 transition-all" />
              </a>

              <a href="https://www.roblox.com/games/2727067538/World-Zero-Anime-RPG" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl group transition-all">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="text-red-500" size={24} />
                  <div className="text-left">
                    <div className="text-white font-bold group-hover:text-red-500 transition-colors">Play World Zero</div>
                    <div className="text-red-500/60 text-xs">Roblox Game Link</div>
                  </div>
                </div>
                <ExternalLink size={16} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all" />
              </a>

              <a href={GOOGLE_DOC_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl group transition-all">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-blue-500" size={24} />
                  <div className="text-left">
                    <div className="text-white font-bold group-hover:text-blue-500 transition-colors">Document Project Hub</div>
                    <div className="text-blue-500/60 text-xs">Massive Info Database</div>
                  </div>
                </div>
                <ExternalLink size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
              </a>

            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-600 text-sm">
          This is an unofficial tool created for the World Zero community.
        </div>
      </div>
    </div>
  );
};

const HeaderSection = ({ currentPlayer, currentSeason, selectedDate, setView, setShowAnalytics, setShowCalendar, setShowImportExport, myPoints, totalPoints, avgPoints, startEdit, isViewMode, playerName }) => {
  const today = getTodayEST();
  const isViewingPast = selectedDate !== today;
  
  return (
    <div className="bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-red-900/20 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-4 shadow-2xl border border-yellow-500/30">
      {isViewingPast && (
        <div className="mb-4 p-4 bg-blue-500/30 border-2 border-blue-400 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
          <Info className="text-blue-300 shrink-0" size={24} />
          <span className="text-blue-100 text-sm font-semibold">
            📅 Viewing past date in READ-ONLY mode. Use "Manual Override" button below to edit this date's points, or return to today to track new progress.
          </span>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center gap-2 pb-1 leading-relaxed">
            <Trophy className="text-yellow-400 shrink-0" size={32} />
            <span className="break-all">{currentPlayer?.name || playerName}</span>
          </h1>
          <p className="text-yellow-200 text-sm opacity-80 pl-1">
            Season {currentSeason} • {formatDate(selectedDate)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setView('landing')} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all flex items-center gap-2 text-sm border border-white/10">
            Back to Home
          </button>
          <button onClick={() => setShowAnalytics(true)} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg shadow-purple-600/20">
            <BarChart3 size={18} /> Analytics
          </button>
          <button onClick={() => setShowCalendar(true)} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg shadow-blue-600/20">
            <Calendar size={18} /> Calendar
          </button>
          <button onClick={() => setShowImportExport(true)} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg shadow-green-600/20">
            <Download size={18} /> Backup
          </button>
        </div>
      </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white/5 rounded-xl p-4 sm:col-span-2 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <div className="text-gray-300 text-sm mb-1">
            {isViewingPast ? "Points on This Date" : "Today's Points"}
          </div>
          <div className={`text-4xl font-black tracking-tight ${myPoints >= 300 ? 'text-green-400' : 'text-yellow-400'}`}>
            {myPoints}
            <span className="text-xl text-gray-500 font-normal ml-2">/ 300</span>
          </div>
          <div className="mt-3 bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${myPoints >= 300 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min((myPoints / 300) * 100, 100)}%` }}
            />
          </div>
          {isViewingPast && (
            <button onClick={() => startEdit(selectedDate, myPoints)} className="mt-4 w-full px-3 py-2 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/30 text-orange-300 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <Edit2 size={16} /> Manual Override
            </button>
          )}
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20 flex flex-col justify-center">
          <div className="text-gray-400 text-sm mb-1">Total Season Points</div>
          <div className="text-3xl font-bold text-blue-400">{totalPoints}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20 flex flex-col justify-center">
          <div className="text-gray-400 text-sm mb-1">Daily Average</div>
          <div className="text-3xl font-bold text-green-400">{avgPoints}</div>
        </div>
      </div>
    </div>
  );
};

const GuildQuestSection = ({ currentPlayer, updateCompletion }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-4 shadow-xl border border-white/10">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Target className="text-green-400" size={24} />
      Guild Quests (175 pts total)
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <label className="quest-card easy flex items-center gap-3 rounded-xl p-4 cursor-pointer transition-all bg-green-500/10 hover:bg-green-500/20 border border-green-500/40">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={currentPlayer.guildQuests.easy}
            onChange={(e) => updateCompletion("guildQuests", null, { easy: e.target.checked })}
            className="peer w-6 h-6 rounded border-2 border-gray-500 checked:border-transparent checked:bg-blue-500 transition-all appearance-none cursor-pointer"
          />
          <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={14} />
        </div>
        <div>
          <div className="text-white font-semibold">Easy Quest</div>
          <div className="quest-subtext text-green-400 text-sm font-bold">25 points</div>
        </div>
      </label>

      <label className="quest-card medium flex items-center gap-3 rounded-xl p-4 cursor-pointer transition-all bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/40">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={currentPlayer.guildQuests.medium}
            onChange={(e) => updateCompletion("guildQuests", null, { medium: e.target.checked })}
            className="peer w-6 h-6 rounded border-2 border-gray-500 checked:border-transparent checked:bg-blue-500 transition-all appearance-none cursor-pointer"
          />
          <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={14} />
        </div>
        <div>
          <div className="text-white font-semibold">Medium Quest</div>
          <div className="quest-subtext text-yellow-400 text-sm font-bold">50 points</div>
        </div>
      </label>

      <label className="quest-card hard flex items-center gap-3 rounded-xl p-4 cursor-pointer transition-all bg-red-500/10 hover:bg-red-500/20 border border-red-500/40">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={currentPlayer.guildQuests.hard}
            onChange={(e) => updateCompletion("guildQuests", null, { hard: e.target.checked })}
            className="peer w-6 h-6 rounded border-2 border-gray-500 checked:border-transparent checked:bg-blue-500 transition-all appearance-none cursor-pointer"
          />
          <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={14} />
        </div>
        <div>
          <div className="text-white font-semibold">Hard Quest</div>
          <div className="quest-subtext text-red-400 text-sm font-bold">100 points</div>
        </div>
      </label>
    </div>
  </div>
);

const TowerSection = ({ currentPlayer, updateCompletion }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-4 shadow-xl border border-white/10">
    <h2 className="text-xl font-bold text-white mb-4">Towers (15 pts each)</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      {TOWERS_DATA.map(tower => (
        <label key={tower.name} className={`relative group overflow-hidden quest-card flex items-center gap-3 ${tower.color} bg-opacity-10 rounded-xl p-3 cursor-pointer hover:bg-opacity-20 transition-all border border-white/10`}>
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={currentPlayer.towers[tower.name] || false}
              onChange={(e) => updateCompletion('towers', tower.name, e.target.checked)}
              className="peer w-5 h-5 rounded border-2 border-white/30 checked:border-transparent checked:bg-purple-500 transition-all appearance-none cursor-pointer"
            />
            <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={12} />
          </div>
          <div className="z-10">
            <div className="text-white font-medium text-sm">{tower.name}</div>
            <div className="text-gray-400 text-xs">15 points</div>
          </div>
        </label>
      ))}
    </div>

    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
      <div className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
        <Target className="text-purple-400" size={20} />
        Infinite Tower Calculator
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1 w-full">
          <label className="text-purple-200 text-sm mb-2 block">Highest Floor Reached</label>
          <div className="relative">
            <input
              type="number"
              value={currentPlayer.infiniteTower.floor}
              onChange={(e) => updateCompletion('infiniteTower', null, { floor: parseInt(e.target.value) || 0 })}
              placeholder="150"
              className="w-full px-4 py-4 rounded-xl bg-black/40 border border-purple-500/30 text-white text-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/50 text-sm font-mono">FLOOR</div>
          </div>
        </div>
        <div className="bg-black/40 rounded-xl p-4 border border-purple-400/30 min-w-[150px] text-center">
          <div className="text-purple-300 text-xs mb-1 uppercase tracking-wider">Points Earned</div>
          <div className="text-4xl font-black text-purple-400">
            {currentPlayer.infiniteTower.floor >= 150 
              ? Math.floor((currentPlayer.infiniteTower.floor - 150) / 5) * 5
              : 0}
          </div>
          <div className="text-xs text-purple-400/60 mt-1">5 pts per 5 floors (&gt;150)</div>
        </div>
      </div>
    </div>
  </div>
);

const WorldGrid = ({ currentPlayer, updateCompletion, collapsedWorlds, toggleWorld }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {WORLDS_DATA.map(world => (
      <div key={world.num} className={(world.num === 1 ? 'bg-slate-600' : world.num === 2 ? 'bg-green-600' : world.num === 3 ? 'bg-blue-600' : world.num === 4 ? 'bg-orange-600' : world.num === 5 ? 'bg-pink-600' : world.num === 6 ? 'bg-teal-600' : world.num === 7 ? 'bg-red-600' : world.num === 8 ? 'bg-yellow-700' : world.num === 9 ? 'bg-purple-700' : 'bg-fuchsia-800') + ' bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden transition-all hover:border-white/20'}>
        <div 
          onClick={() => toggleWorld(world.num)}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className={(world.num === 1 ? 'bg-slate-600' : world.num === 2 ? 'bg-green-600' : world.num === 3 ? 'bg-blue-600' : world.num === 4 ? 'bg-orange-600' : world.num === 5 ? 'bg-pink-600' : world.num === 6 ? 'bg-teal-600' : world.num === 7 ? 'bg-red-600' : world.num === 8 ? 'bg-yellow-700' : world.num === 9 ? 'bg-purple-700' : 'bg-fuchsia-800') + ' w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg'}>
              {world.num}
            </div>
            <h3 className="text-lg font-bold text-white">World {world.num}</h3>
          </div>
          {collapsedWorlds[world.num] ? <ChevronDown size={20} className="text-white/50" /> : <ChevronUp size={20} className="text-white/50" />}
        </div>

        {!collapsedWorlds[world.num] && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-black/20 rounded-xl p-4 mb-3">
              <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-3">Bosses (1 pt each)</div>
              <div className="flex flex-wrap gap-2">
                {world.bosses.map((boss) => (
                  <label key={boss} className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 border border-white/5 transition-colors">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={currentPlayer.worldEvents[`world${world.num}_${boss}`] || false}
                        onChange={(e) => updateCompletion('worldEvents', `world${world.num}_${boss}`, e.target.checked)}
                        className="peer w-4 h-4 rounded border border-white/30 checked:border-transparent checked:bg-green-500 transition-all appearance-none cursor-pointer"
                      />
                      <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={10} />
                    </div>
                    <span className="text-gray-200 text-sm">{boss}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {world.dungeons.map(dungeon => (
                <div key={dungeon.name} className="bg-black/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-white text-sm font-medium pl-1">{dungeon.name}</div>
                  <div className="flex gap-2">
                    <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${currentPlayer.dungeons[`${dungeon.name}_normal`] ? 'bg-blue-500/20 border-blue-500/50 text-blue-200' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                      <input
                        type="checkbox"
                        checked={currentPlayer.dungeons[`${dungeon.name}_normal`] || false}
                        onChange={(e) => updateCompletion('dungeons', `${dungeon.name}_normal`, e.target.checked)}
                        className="hidden"
                      />
                      Normal ({dungeon.normal}pt)
                    </label>
                    <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${currentPlayer.dungeons[`${dungeon.name}_challenge`] ? 'bg-orange-500/20 border-orange-500/50 text-orange-200' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                      <input
                        type="checkbox"
                        checked={currentPlayer.dungeons[`${dungeon.name}_challenge`] || false}
                        onChange={(e) => updateCompletion('dungeons', `${dungeon.name}_challenge`, e.target.checked)}
                        className="hidden"
                      />
                      Chall. ({dungeon.challenge}pts)
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  // --- State ---
  const [view, setView] = useState('landing');
  const [playerName, setPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [history, setHistory] = useState({});
  const [notes, setNotes] = useState({});
  const [editingDate, setEditingDate] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [currentSeason, setCurrentSeason] = useState(18);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [collapsedWorlds, setCollapsedWorlds] = useState({});
  const [seasonStartDate, setSeasonStartDate] = useState('');
  const [isViewMode, setIsViewMode] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // --- Helper Functions ---
  const showModal = (title, message, type = 'alert', onConfirm = () => {}) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const getSeasonDates = () => {
    const dates = [];
    let startDate;
    if (seasonStartDate) {
      startDate = new Date(seasonStartDate + 'T12:00:00');
    } else {
      if (currentSeason === 18) {
        startDate = new Date('2024-11-14T12:00:00');
      } else {
        const today = new Date(getTodayEST() + 'T12:00:00');
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
      }
    }
    const today = new Date(getTodayEST() + 'T12:00:00');
    if (startDate > today) return [getTodayEST()];

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  // --- Effects ---
  useEffect(() => {
    setSelectedDate(getTodayEST());
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('hyyerr_player_name');
    if (storedName) setPlayerName(storedName);

    const storedSeason = localStorage.getItem('hyyerr_current_season');
    const season = storedSeason ? parseInt(storedSeason) : 18;
    if (storedSeason) setCurrentSeason(season);

    const seasonKey = `season${season}`;
    
    // Load history FIRST before anything else
    const storedHistory = localStorage.getItem(`hyyerr_points_history_${seasonKey}`);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      } catch (e) { 
        console.error('Error loading history:', e); 
        setHistory({});
      }
    }
    
    const storedStartDate = localStorage.getItem(`hyyerr_season_start_${seasonKey}`);
    if (storedStartDate) {
      setSeasonStartDate(storedStartDate);
    } else if (season === 18) {
      const defaultSeason18Start = '2024-11-14';
      setSeasonStartDate(defaultSeason18Start);
      localStorage.setItem(`hyyerr_season_start_season18`, defaultSeason18Start);
    }

    const storedNotes = localStorage.getItem(`hyyerr_notes_${seasonKey}`);
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (e) { console.error(e); }
    }
  }, []);

  // This effect is intentionally minimal - date changes are handled in the calendar button click handler

  useEffect(() => {
    const today = getTodayEST();
    
    // ONLY save if we're viewing TODAY - nothing else matters
    if (selectedDate !== today) {
      return; // Exit immediately if not today
    }
    
    // ONLY save if we have player data
    if (!currentPlayer) {
      return;
    }
    
    // Now we can safely save
    localStorage.setItem(`hyyerr_player_${selectedDate}`, JSON.stringify(currentPlayer));
    const points = calculatePoints(currentPlayer);
    const seasonKey = `season${currentSeason}`;
    
    // CRITICAL: Only update history if there's NO manual override for today
    // Manual overrides should be preserved
    const existingPoints = history[selectedDate];
    const updatedHistory = { ...history, [selectedDate]: points };
    
    if (existingPoints !== points) {
      setHistory(updatedHistory);
      localStorage.setItem(`hyyerr_points_history_${seasonKey}`, JSON.stringify(updatedHistory));
    }

    // Cleanup function to save state before unmount or browser close
    const cleanupSave = () => {
      // Double check we're still on today
      if (getTodayEST() === selectedDate && currentPlayer) {
        forceSaveCurrentState(currentPlayer);
      }
    };

    // Add event listener for browser closure/reload
    window.addEventListener('beforeunload', cleanupSave);

    // Return cleanup function for component unmount
    return () => {
      cleanupSave();
      window.removeEventListener('beforeunload', cleanupSave);
    };
  }, [currentPlayer, selectedDate, currentSeason]);

  // --- Handlers ---
  
  // Force save function to prevent data loss
  const forceSaveCurrentState = (playerToSave = null) => {
    const player = playerToSave || currentPlayer;

    if (player && selectedDate) {
      // 1. Save the player's checked state for the selected day
      localStorage.setItem(`hyyerr_player_${selectedDate}`, JSON.stringify(player));
      
      // 2. Calculate points and update history
      const points = calculatePoints(player);
      const seasonKey = `season${currentSeason}`;
      const updatedHistory = { ...history, [selectedDate]: points };
      
      // Update state only if we are not in cleanup/unmount phase
      if (!playerToSave) {
        setHistory(updatedHistory);
      }
      localStorage.setItem(`hyyerr_points_history_${seasonKey}`, JSON.stringify(updatedHistory));
    }
  };
  
  const initializePlayer = () => {
    if (!playerName.trim()) return;
    const name = playerName.trim();
    localStorage.setItem('hyyerr_player_name', name);
    const today = getTodayEST();
    const stored = localStorage.getItem(`hyyerr_player_${today}`);
    if (stored) {
      try {
        setCurrentPlayer(JSON.parse(stored));
      } catch (e) { console.error(e); }
    } else {
      const newPlayer = {
        name,
        dungeons: {},
        worldEvents: {},
        towers: {},
        infiniteTower: { floor: 0 },
        guildQuests: { easy: false, medium: false, hard: false }
      };
      setCurrentPlayer(newPlayer);
    }
    setView('tracker');
  };

  const updateCompletion = (category, key, value) => {
    const today = getTodayEST();
    
    // Prevent updates if not on today's date
    if (selectedDate !== today) {
      showModal('View Only Mode', 'You are viewing a past date. Return to today to make changes, or use Manual Override to edit this date.', 'alert');
      return;
    }
    
    const updated = { ...currentPlayer };
    if (category === 'guildQuests' || category === 'infiniteTower') {
      updated[category] = { ...updated[category], ...value };
    } else {
      updated[category] = { ...updated[category], [key]: value };
    }
    setCurrentPlayer(updated);
  };

  const startEdit = (date, points) => {
    setEditingDate(date);
    setEditValue(points.toString());
  };

  const saveEdit = () => {
    if (editingDate && editValue !== '') {
      const seasonKey = `season${currentSeason}`;
      const newPoints = parseInt(editValue) || 0;
      const updatedHistory = { ...history, [editingDate]: newPoints };
      
      // Update state immediately
      setHistory(updatedHistory);
      
      // Save to localStorage
      localStorage.setItem(`hyyerr_points_history_${seasonKey}`, JSON.stringify(updatedHistory));
      
      // Clear edit state
      setEditingDate(null);
      setEditValue('');
      
      showModal('Success', 'Points updated successfully!', 'info');
    }
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setEditValue('');
  };

  const handleDeleteEntry = (dateToDelete) => {
    showModal(
      'Delete Entry',
      `Are you sure you want to delete the history for ${formatDate(dateToDelete)}? This cannot be undone.`,
      'confirm',
      () => {
        const seasonKey = `season${currentSeason}`;
        const updatedHistory = { ...history };
        delete updatedHistory[dateToDelete];
        setHistory(updatedHistory);
        localStorage.setItem(`hyyerr_points_history_${seasonKey}`, JSON.stringify(updatedHistory));
        localStorage.removeItem(`hyyerr_player_${dateToDelete}`);
        if (notes[dateToDelete]) {
          const updatedNotes = { ...notes };
          delete updatedNotes[dateToDelete];
          setNotes(updatedNotes);
          localStorage.setItem(`hyyerr_notes_${seasonKey}`, JSON.stringify(updatedNotes));
        }
        showModal('Success', 'Entry deleted successfully.', 'info');
      }
    );
  };

  const exportData = () => {
    try {
      const exportObj = { playerName, currentSeason, seasons: {} };
      for (let s = 1; s <= currentSeason; s++) {
        const seasonKey = `season${s}`;
        const histStr = localStorage.getItem(`hyyerr_points_history_${seasonKey}`);
        const noteStr = localStorage.getItem(`hyyerr_notes_${seasonKey}`);
        const startStr = localStorage.getItem(`hyyerr_season_start_${seasonKey}`);
        if (histStr || noteStr || startStr) {
          exportObj.seasons[s] = {};
          if (histStr) exportObj.seasons[s].history = JSON.parse(histStr);
          if (noteStr) exportObj.seasons[s].notes = JSON.parse(noteStr);
          if (startStr) exportObj.seasons[s].startDate = startStr;
        }
      }
      const jsonString = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `world-zero-backup-${getTodayEST()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showModal('Success', 'Backup exported successfully!', 'info');
    } catch (error) {
      showModal('Error', 'Error exporting: ' + error.message, 'alert');
    }
  };

  const importData = (e) => {
    // Force save current state before importing
    forceSaveCurrentState();
    
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.playerName) {
          setPlayerName(data.playerName);
          localStorage.setItem('hyyerr_player_name', data.playerName);
        }
        if (data.seasons) {
          Object.keys(data.seasons).forEach(seasonNum => {
            const seasonKey = `season${seasonNum}`;
            const seasonData = data.seasons[seasonNum];
            if (seasonData.history) localStorage.setItem(`hyyerr_points_history_${seasonKey}`, JSON.stringify(seasonData.history));
            if (seasonData.notes) localStorage.setItem(`hyyerr_notes_${seasonKey}`, JSON.stringify(seasonData.notes));
            if (seasonData.startDate) localStorage.setItem(`hyyerr_season_start_${seasonKey}`, seasonData.startDate);
          });
        }
        showModal('Success', 'Data imported! Page will reload.', 'info', () => window.location.reload());
      } catch (err) {
        showModal('Error', 'Error importing: ' + err.message, 'alert');
      }
    };
    reader.readAsText(file);
  };

  const toggleWorld = (worldNum) => {
    setCollapsedWorlds(prev => ({ ...prev, [worldNum]: !prev[worldNum] }));
  };

  // --- Analytics & Render Prep ---
  const calculateAnalytics = () => {
    const seasonDates = getSeasonDates();
    const season18Start = new Date('2024-11-14T12:00:00');
    const today = new Date(getTodayEST() + 'T12:00:00');
    const allDates = Object.keys(history)
      .filter(date => {
        const dateObj = new Date(date + 'T12:00:00');
        return seasonDates.includes(date) && dateObj >= season18Start && dateObj <= today;
      }).sort();
    
    const daysWithGoal = allDates.filter(d => history[d] >= 300).length;
    const goalPercentage = allDates.length > 0 ? Math.round((daysWithGoal / allDates.length) * 100) : 0;
    
    let currentStreak = 0;
    let checkDate = new Date(getTodayEST() + 'T12:00:00');
    let loopLimit = 365; 
    while (loopLimit > 0) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (history[dateStr] && history[dateStr] >= 300) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else { break; }
      loopLimit--;
    }
    
    const last7Days = allDates.slice(-7);
    const weeklyTotal = last7Days.reduce((sum, date) => sum + (history[date] || 0), 0);
    const weeklyAvg = last7Days.length > 0 ? Math.round(weeklyTotal / last7Days.length) : 0;
    const bestDay = allDates.reduce((best, date) => (!best || history[date] > history[best]) ? date : best, null);
    
    return {
      goalPercentage, currentStreak, weeklyAvg, bestDay,
      bestDayPoints: bestDay ? history[bestDay] : 0,
      totalDays: allDates.length, daysWithGoal
    };
  };

  const analytics = calculateAnalytics();
  const seasonDates = getSeasonDates();
  const seasonHistoryDates = Object.keys(history).filter(date => {
    const dateObj = new Date(date + 'T12:00:00');
    return seasonDates.includes(date) && dateObj >= new Date('2024-11-14T12:00:00') && dateObj <= new Date(getTodayEST() + 'T12:00:00');
  });
  const totalPoints = seasonHistoryDates.reduce((sum, date) => sum + (history[date] || 0), 0);
  const avgPoints = seasonHistoryDates.length > 0 ? Math.round(totalPoints / seasonHistoryDates.length) : 0;
  
  // CRITICAL FIX: Use stored history points for past dates, calculated points only for today
  const today = getTodayEST();
  const myPoints = useMemo(() => {
    if (selectedDate === today) {
      return currentPlayer ? calculatePoints(currentPlayer) : 0;
    } else {
      // For past dates, ALWAYS use history value (preserves manual overrides)
      return history[selectedDate] || 0;
    }
  }, [selectedDate, currentPlayer, history, today]);

  // --- Main Render ---
  if (view === 'landing' || !currentPlayer) {
    return (
      <>
        <CustomModal {...modalConfig} />
        <LandingPage 
          onEnter={initializePlayer} 
          playerName={playerName} 
          setPlayerName={setPlayerName} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-6 font-sans pb-24">
      <CustomModal {...modalConfig} />
      
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <HeaderSection 
          currentPlayer={currentPlayer}
          currentSeason={currentSeason}
          selectedDate={selectedDate}
          setView={setView}
          setShowAnalytics={setShowAnalytics}
          setShowCalendar={setShowCalendar}
          setShowImportExport={setShowImportExport}
          myPoints={myPoints}
          totalPoints={totalPoints}
          avgPoints={avgPoints}
          startEdit={startEdit}
          isViewMode={isViewMode}
          playerName={playerName}
        />

        <GuildQuestSection 
          currentPlayer={currentPlayer || {
            name: playerName,
            dungeons: {},
            worldEvents: {},
            towers: {},
            infiniteTower: { floor: 0 },
            guildQuests: { easy: false, medium: false, hard: false }
          }} 
          updateCompletion={updateCompletion} 
        />

        <TowerSection 
          currentPlayer={currentPlayer || {
            name: playerName,
            dungeons: {},
            worldEvents: {},
            towers: {},
            infiniteTower: { floor: 0 },
            guildQuests: { easy: false, medium: false, hard: false }
          }} 
          updateCompletion={updateCompletion} 
        />

        <WorldGrid 
          currentPlayer={currentPlayer || {
            name: playerName,
            dungeons: {},
            worldEvents: {},
            towers: {},
            infiniteTower: { floor: 0 },
            guildQuests: { easy: false, medium: false, hard: false }
          }} 
          updateCompletion={updateCompletion} 
          collapsedWorlds={collapsedWorlds} 
          toggleWorld={toggleWorld} 
        />

      </div>

      {/* Modals */}
      
      {/* Edit Modal */}
      {editingDate && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-yellow-500/30 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Manual Override</h3>
            <p className="text-gray-400 text-sm mb-4">Editing points for {formatDate(editingDate)}</p>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
              placeholder="Enter points"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={saveEdit} className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 font-semibold">
                <Check size={18} /> Save
              </button>
              <button onClick={cancelEdit} className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold">
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full border border-blue-500/30 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Season Calendar</h3>
              <button onClick={() => setShowCalendar(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className
