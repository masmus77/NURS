
import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { toPng } from 'html-to-image';
import { ArrowLeft, Download } from 'lucide-react';

const templateDetails = {
  'hari-besar': { name: 'Ucapan Hari Besar', fields: ['Title', 'Date'] },
  'laporan-kegiatan': { name: 'Laporan Kegiatan', fields: ['Activity Name', 'Date', 'Location', 'Attendees'] },
  'ajakan-rutinan': { name: 'Ajakan Rutinan', fields: ['Activity Name', 'Time', 'Location'] },
  'quotes-kiai': { name: 'Quotes Kiai', fields: ['Quote', 'Source'] },
};

const ContentTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const template = templateDetails[id as keyof typeof templateDetails];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (previewRef.current) {
      toPng(previewRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `poster-${id}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => console.error(err));
    }
  };

  if (!template) return <div>Template not found</div>;

  return (
    <div>
      <Link to="/content" className="inline-flex items-center text-nuGreen hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Templates
      </Link>
      <h1 className="text-3xl font-bold mb-6">Editor: {template.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader><CardTitle>Input Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {template.fields.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium">{field}</label>
                  <Input
                    type="text"
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                </div>
              ))}
              <Button onClick={handleExport}><Download className="mr-2 h-4 w-4"/>Export as PNG</Button>
            </CardContent>
          </Card>
        </div>

        <div>
            <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
            <div ref={previewRef} className="w-full aspect-square bg-nuGreen-dark text-white p-8 flex flex-col justify-between" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/arabesque.png')`}}>
                <div>
                    <h2 className="text-4xl font-bold text-nuGold">{formData['Title'] || formData['Activity Name'] || 'Judul Acara'}</h2>
                    <p className="text-lg">{formData['Date'] || formData['Time'] || 'Tanggal & Waktu'}</p>
                    <p className="text-lg">{formData['Location'] || ''}</p>
                </div>
                
                {id === 'quotes-kiai' && (
                    <blockquote className="text-center my-auto">
                        <p className="text-2xl italic">"{formData['Quote'] || 'Isi kutipan di sini...'}"</p>
                        <footer className="mt-4 text-lg text-nuGold">- {formData['Source'] || 'Sumber'}</footer>
                    </blockquote>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-nuGold">
                    <span className="text-lg font-semibold">NU Ranting System</span>
                    <img className="h-16 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Logo_of_Nahdlatul_Ulama.svg/1200px-Logo_of_Nahdlatul_Ulama.svg.png" alt="NU Logo" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTemplatePage;
