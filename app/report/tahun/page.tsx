import React, { useState, useEffect, useRef } from 'react';
import { getReportsByYear } from '../../../lib/db';
import { Report } from '../../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';

const YearlyReportPage: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [reports, setReports] = useState<Report[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const handleGenerate = async () => {
    try {
      const data = await getReportsByYear(year);
      if (data.length === 0) {
          alert(`No reports found for the year ${year}.`);
      }
      setReports(data);
    } catch (error) {
      console.error(`Failed to generate report for year ${year}:`, error);
      alert(`Error: Could not retrieve reports for ${year}. Please try again.`);
    }
  };
  
  const exportToPdf = () => {
      const doc = new jsPDF();
      doc.text(`Laporan Tahunan Ranting NU - Tahun ${year}`, 14, 16);
      
      let finalY = 20;

      reports.forEach((report, index) => {
          if (finalY > 250) { // check for page break
              doc.addPage();
              finalY = 20;
          }
          doc.setFontSize(12).text(`${index+1}. ${report.activityName} (${report.month} ${report.year})`, 14, finalY += 10);
          doc.setFontSize(10).text(`- Jamaah Hadir: ${report.attendees}`, 16, finalY += 6);
          doc.setFontSize(10).text(`- Kader Terlibat: ${report.involvedKader}`, 16, finalY += 6);
          doc.setFontSize(10).text(`- Catatan: ${report.notes}`, 16, finalY += 6);
          finalY += 5; // spacing
      });

      doc.save(`laporan_tahunan_${year}.pdf`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yearly Report Generator</h1>
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-grow">
            <label>Select Year:</label>
            <input 
              type="number" 
              value={year} 
              onChange={e => setYear(parseInt(e.target.value))}
              className="p-2 border rounded-md ml-2"
            />
          </div>
          <Button onClick={handleGenerate}>Generate Report</Button>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Report for {year}</h2>
                <Button onClick={exportToPdf}><Download className="mr-2 h-4 w-4"/>Export PDF</Button>
              </div>
              <div ref={reportRef} className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <h3 className="font-bold text-lg">{report.activityName} - {report.month}</h3>
                    <p>Jamaah: {report.attendees}, Kader: {report.involvedKader}</p>
                    <p className="mt-2 text-gray-600">Catatan: {report.notes}</p>
                    <div className="flex gap-2 mt-2">
                        {report.photos.map((photo, i) => (
                            <img key={i} src={photo} alt={`doc-${i}`} className="h-24 w-24 object-cover rounded"/>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center py-8">Select a year and click 'Generate Report' to see the yearly summary.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyReportPage;