
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Archive, Users, Calendar, BarChart2, Image, FileText } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Program Tracker', href: '/program', icon: CheckSquare },
  { name: 'Digital Archive', href: '/archive', icon: Archive },
  { name: 'Kader Map', href: '/kader', icon: Users },
  { name: 'Renja Builder', href: '/renja', icon: Calendar },
  { name: 'Impact Dashboard', href: '/impact', icon: BarChart2 },
  { name: 'Content Generator', href: '/content', icon: Image },
  { name: 'Auto Report Builder', href: '/report', icon: FileText },
];

const Sidebar: React.FC = () => {
  const navLinkClasses = 'group flex items-center px-3 py-2 text-sm font-medium rounded-md';
  const activeClass = 'bg-nuGreen-light text-white';
  const inactiveClass = 'text-green-100 hover:bg-nuGreen-light hover:bg-opacity-75';

  return (
    <div className="flex flex-col flex-grow bg-nuGreen-dark pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <img className="h-10 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Logo_of_Nahdlatul_Ulama.svg/1200px-Logo_of_Nahdlatul_Ulama.svg.png" alt="NU Logo" />
        <span className="ml-3 text-white text-lg font-bold">NU Ranting System</span>
      </div>
      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
            >
              <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
