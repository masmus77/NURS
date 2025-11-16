
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { ProgramItem, ProgramStatus } from '../../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download } from 'lucide-react';

const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [programs, setPrograms] = useLocalStorage<ProgramItem[]>('programs', []);
  const [program, setProgram] = useState<ProgramItem | null>(null);

  useEffect(() => {
    // This effect finds the program by ID or navigates back if not found.
    // It waits until the programs array is populated to avoid premature navigation.
    if (programs.length > 0 && id) {
      const foundProgram = programs.find(p => p.id === id);
      if (foundProgram) {
        setProgram(foundProgram);
      } else {
        // If the program is not found, alert the user and redirect.
        alert('Program not found. Redirecting to the program list.');
        navigate('/program');
      }
    }
  }, [id, programs, navigate]);

  const handleUpdate = () => {
    if (program) {
      setPrograms(programs.map(p => (p.id === id ? program : p)));
      alert('Program updated successfully!');
      navigate('/program');
    }
  };
  
  const exportToPdf = () => {
      const input = document.getElementById('pdf-export');
      if (input) {
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps= pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`program-${program?.title}.pdf`);
          });
      }
  };

  if (!program) {
    return <div>Loading program details or redirecting...</div>;
  }

  return (
    <div>
      <Link to="/program" className="inline-flex items-center text-nuGreen hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Program List
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Program Detail</h1>
        <Button onClick={exportToPdf} variant="secondary">
          <Download className="mr-2 h-4 w-4" /> Export to PDF
        </Button>
      </div>

      <Card id="pdf-export">
        <CardHeader>
          <CardTitle>Program: {program.title}</CardTitle>
        </CardHeader>
        
        {/* Prominent Display Section */}
        <CardContent className="border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                 <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Penanggung Jawab (PIC)</h4>
                    <p className="mt-1 text-xl font-semibold text-gray-900">{program.pic}</p>
                </div>
                 <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Deskripsi</h4>
                    <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">{program.description || 'No description provided.'}</p>
                </div>
            </div>
        </CardContent>

        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 pt-2">Edit Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <Input
              type="text"
              value={program.title}
              onChange={(e) => setProgram({ ...program, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <Select
              value={program.category}
              onChange={(e) => setProgram({ ...program, category: e.target.value as any })}
            >
              <option>Administrasi</option>
              <option>Kaderisasi</option>
              <option>Digitalisasi</option>
              <option>Sosial</option>
            </Select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Select
              value={program.status}
              onChange={(e) => setProgram({ ...program, status: e.target.value as ProgramStatus })}
            >
              {Object.values(ProgramStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Person in Charge</label>
            <Input
              type="text"
              value={program.pic}
              onChange={(e) => setProgram({ ...program, pic: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <Input
              type="date"
              value={program.deadline}
              onChange={(e) => setProgram({ ...program, deadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-nuGreen focus:border-nuGreen sm:text-sm"
              value={program.description}
              onChange={(e) => setProgram({ ...program, description: e.target.value })}
            />
          </div>
          <div className="pt-4">
            <Button onClick={handleUpdate}>Update Program</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramDetailPage;
