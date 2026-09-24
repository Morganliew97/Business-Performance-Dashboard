// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { getNotifications } from '../utils/notifications';

export default function Header({ title, subtitle, onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const getUserData = () => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { name: 'Morgan Liew', title: 'Financial Planning & Analysis' };
      }
    }
    return { name: 'Morgan Liew', title: 'Financial Planning & Analysis' };
  };

  const user = getUserData();
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Notifications are derived from the same mock data that powers the
  // dashboard (invoices, expenses, revenue). Each carries a `route`
  // so clicking it navigates to the right page.
  const notifications = getNotifications();

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clicking a notification navigates to its route and closes the dropdown.
  const handleNotificationClick = (notification) => {
    setShowNotifications(false);
    if (notification.route) {
      navigate(notification.route);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-ink-200 bg-surface/95 px-5 py-3.5 backdrop-blur">
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-md border border-ink-200 p-1.5 text-ink-500 hover:bg-ink-100 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-semibold text-ink-900">{title}</h1>
          {subtitle && <p className="truncate text-[12.5px] text-ink-500">{subtitle}</p>}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="hidden items-center gap-2 rounded-md border border-ink-200 bg-canvas px-3 py-1.5 text-ink-400 md:flex">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search records, invoices…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 bg-transparent text-[12.5px] text-ink-700 outline-none placeholder:text-ink-400"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="Notifications"
            className="relative rounded-md border border-ink-200 p-2 text-ink-500 hover:bg-ink-100"
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-negative" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-ink-200 bg-white shadow-lg">
              <div className="border-b border-ink-100 px-4 py-2.5">
                <p className="text-sm font-semibold text-ink-800">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="w-full cursor-pointer border-b border-ink-50 px-4 py-3 text-left hover:bg-ink-50"
                  >
                    <div className="flex items-start gap-2">
                      {/* Colored dot reflects the notification tone */}
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          n.tone === 'negative'
                            ? 'bg-negative'
                            : n.tone === 'warning'
                            ? 'bg-warning'
                            : 'bg-positive'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-ink-800">{n.text}</p>
                        {n.detail && (
                          <p className="mt-0.5 truncate text-[11.5px] text-ink-500">{n.detail}</p>
                        )}
                        <p className="mt-0.5 text-[11px] text-ink-400">{n.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/');
                  }}
                  className="text-[12.5px] font-medium text-accent-600 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="hidden items-center gap-2 rounded-md border border-ink-200 py-1 pl-1 pr-3 hover:bg-ink-50 sm:flex"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-[11px] font-semibold text-accent-600">
              {initials}
            </div>
            <span className="text-[12.5px] font-medium text-ink-700">{user.name}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-ink-200 bg-white shadow-lg">
              <div className="border-b border-ink-100 px-4 py-3">
                <p className="text-sm font-semibold text-ink-800">{user.name}</p>
                <p className="text-[11.5px] text-ink-500">{user.title}</p>
              </div>
              <div className="py-1">
                <button className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-ink-700 hover:bg-ink-50">
                  <User size={15} />
                  Profile
                </button>
                <button className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-ink-700 hover:bg-ink-50">
                  <Settings size={15} />
                  Settings
                </button>
                <button className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-negative hover:bg-ink-50">
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}