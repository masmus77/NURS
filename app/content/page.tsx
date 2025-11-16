
import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardContent, CardTitle, CardHeader } from '../../components/ui/Card';
import { Calendar, FileText, MessageCircle, Mic } from 'lucide-react';

const templates = [
  { id: 'hari-besar', name: 'Ucapan Hari Besar', icon: Calendar, description: 'Poster untuk hari besar Islam/nasional.' },
  { id: 'laporan-kegiatan', name: 'Laporan Kegiatan', icon: FileText, description: 'Ringkasan visual kegiatan yang telah dilaksanakan.' },
  { id: 'ajakan-rutinan', name: 'Ajakan Rutinan', icon: MessageCircle, description: 'Pengingat untuk kegiatan rutin seperti Yasinan.' },
  { id: 'quotes-kiai', name: 'Quotes Kiai', icon: Mic, description: 'Kutipan inspiratif dari para ulama NU.' },
];

const ContentPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Generator</h1>
      <p className="mb-6 text-gray-600">Pilih template untuk membuat konten media sosial dengan cepat.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <Link to={`/content/template/${template.id}`} key={template.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="p-3 bg-nuGreen-light rounded-lg text-white">
                  <template.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <p className="text-gray-500">{template.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContentPage;
