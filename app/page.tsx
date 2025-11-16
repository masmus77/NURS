
import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardContent, CardTitle, CardHeader } from '../components/ui/Card';
import { Home, CheckSquare, Archive, Users, Calendar, BarChart2, Image, FileText } from 'lucide-react';

const modules = [
  { name: 'Program Tracker', href: '/program', icon: CheckSquare, description: 'Monitor progress of all programs.' },
  { name: 'Digital Archive', href: '/archive', icon: Archive, description: 'Store and manage important documents.' },
  { name: 'Kader Map', href: '/kader', icon: Users, description: 'Manage member data and skills.' },
  { name: 'Renja Builder', href: '/renja', icon: Calendar, description: 'Create yearly work plans easily.' },
  { name: 'Impact Dashboard', href: '/impact', icon: BarChart2, description: 'Visualize organizational impact.' },
  { name: 'Content Generator', href: '/content', icon: Image, description: 'Create social media content from templates.' },
  { name: 'Auto Report Builder', href: '/report', icon: FileText, description: 'Generate monthly and annual reports.' },
];

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Logo_of_Nahdlatul_Ulama.svg" alt="NU Logo" className="h-12 w-12" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Utama</h1>
          <p className="mt-1 text-gray-600">Selamat datang di Sistem Manajemen Ranting NU. Pilih modul untuk memulai.</p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link to={module.href} key={module.name} className="block hover:scale-105 transform transition-transform duration-200">
            <Card className="h-full hover:shadow-xl transition-shadow duration-200">
              <CardContent className="flex flex-col items-center text-center">
                <div className="p-4 bg-nuGreen-light rounded-full text-white">
                  <module.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-nuGreen-dark">{module.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{module.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;