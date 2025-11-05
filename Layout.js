import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  GraduationCap, 
  Trophy, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  Home,
  BookOpen,
  Target,
  Users,
  Puzzle,
  WifiOff,
  Award,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { getUnresolvedDoubtsCount } from "@/components/lib/offline";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("StudentDashboard"),
    icon: Home,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Game Boards",
    url: createPageUrl("GameBoards"),
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Mini Games",
    url: createPageUrl("MiniGames"),
    icon: Puzzle,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    title: "Doubt Section",
    url: createPageUrl("DoubtSection"),
    icon: HelpCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    badge: true
  },
  {
    title: "Achievements",
    url: createPageUrl("Achievements"),
    icon: Trophy,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    title: "Certificates",
    url: createPageUrl("Certificates"),
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    title: "Teacher Portal",
    url: createPageUrl("TeacherDashboard"),
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Offline Mode",
    url: createPageUrl("OfflineLobby"),
    icon: WifiOff,
    color: "text-gray-600",
    bgColor: "bg-gray-100"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [doubtCount, setDoubtCount] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const calculatedIsOffline = searchParams.get('mode') === 'offline' || currentPageName === 'OfflineLobby';
    setIsOffline(calculatedIsOffline);

    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.log("User not authenticated");
      }
    };

    const unresolvedCount = getUnresolvedDoubtsCount();
    setDoubtCount(unresolvedCount);

    if (!calculatedIsOffline) {
        loadUser();
    }
  }, [location.search, currentPageName]);

  const isActivePage = (targetUrl) => {
    if (targetUrl.includes('?')) {
      return location.pathname + location.search === targetUrl;
    }
    return location.pathname === targetUrl;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SALT
              </span>
            </div>
          </div>
          {currentUser && !isOffline && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Level 5
            </Badge>
          )}
          {isOffline && (
            <Badge variant="outline" className="text-gray-600 bg-gray-100">
                <WifiOff className="w-3 h-3 mr-1"/> Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <MobileSidebar 
              navigationItems={navigationItems}
              isActivePage={isActivePage}
              onClose={() => setSidebarOpen(false)}
              currentUser={currentUser}
              isOffline={isOffline}
              doubtCount={doubtCount}
            />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 min-h-screen bg-white/70 backdrop-blur-sm border-r border-gray-200">
          <DesktopSidebar 
            navigationItems={navigationItems}
            isActivePage={isActivePage}
            currentUser={currentUser}
            isOffline={isOffline}
            doubtCount={doubtCount}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

function DesktopSidebar({ navigationItems, isActivePage, currentUser, isOffline, doubtCount }) {
  const navItems = isOffline 
    ? navigationItems.filter(item => 
        item.url.includes('OfflineLobby') || 
        item.url.includes('MiniGames') ||
        item.url.includes('DoubtSection')
      ) 
    : navigationItems;

  return (
    <div className="p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            SALT
          </h1>
          <p className="text-xs text-gray-500">STEM Learning Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {navItems.map((item) => {
          let url = item.url;
          if (isOffline && item.url === createPageUrl('MiniGames')) {
              url = createPageUrl('MiniGames?mode=offline');
          }
          if (isOffline && item.url === createPageUrl('DoubtSection')) {
              url = createPageUrl('DoubtSection?mode=offline');
          }
          
          return (
            <Link
              key={item.title}
              to={url}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActivePage(url)
                  ? `${item.bgColor} ${item.color} shadow-sm`
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </div>
              {item.badge && doubtCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {doubtCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      {currentUser && !isOffline && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser.full_name}</p>
              <p className="text-xs text-gray-600">Student</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-100 text-blue-800">Level 5</Badge>
            <span className="text-sm font-medium text-gray-600">2,450 pts</span>
          </div>
        </div>
      )}
      {isOffline && (
        <div className="bg-gray-100 p-4 rounded-xl text-center">
            <WifiOff className="w-8 h-8 mx-auto text-gray-500 mb-2"/>
            <p className="font-medium text-gray-800">Offline Mode</p>
            <p className="text-xs text-gray-600">Progress is saved on this device.</p>
        </div>
      )}
    </div>
  );
}

function MobileSidebar({ navigationItems, isActivePage, onClose, currentUser, isOffline, doubtCount }) {
  const navItems = isOffline 
    ? navigationItems.filter(item => 
        item.url.includes('OfflineLobby') || 
        item.url.includes('MiniGames') ||
        item.url.includes('DoubtSection')
      ) 
    : navigationItems;
    
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            SALT
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          let url = item.url;
          if (isOffline && item.url === createPageUrl('MiniGames')) {
              url = createPageUrl('MiniGames?mode=offline');
          }
          if (isOffline && item.url === createPageUrl('DoubtSection')) {
              url = createPageUrl('DoubtSection?mode=offline');
          }
          
          return (
            <Link
              key={item.title}
              to={url}
              onClick={onClose}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActivePage(url)
                  ? `${item.bgColor} ${item.color} shadow-sm`
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </div>
              {item.badge && doubtCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {doubtCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      {currentUser && !isOffline && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser.full_name}</p>
              <p className="text-xs text-gray-600">Student</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-100 text-blue-800">Level 5</Badge>
            <span className="text-sm font-medium text-gray-600">2,450 pts</span>
          </div>
        </div>
      )}
      {isOffline && (
        <div className="bg-gray-100 p-4 rounded-xl text-center">
            <WifiOff className="w-8 h-8 mx-auto text-gray-500 mb-2"/>
            <p className="font-medium text-gray-800">Offline Mode</p>
            <p className="text-xs text-gray-600">Progress is saved locally.</p>
        </div>
      )}
    </div>
  );
}