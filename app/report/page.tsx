import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Report } from '../../types';
import { addReport, getReports, deleteReport } from '../../lib/db';
import { fileToBase64 } from '../../lib/utils';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';
import useModal from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const ReportPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Omit<Report, 'id' | 'photos'>>({
      month: months[new Date().getMonth()],
      year: new Date().getFullYear(),
      activityName: '',
      attendees: 0,
      involvedKader: 0,
      notes: ''
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const { isOpen: isDeleteModalOpen, data: deleteReportId, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal<string>();

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();
        setReports(data.sort((a,b) => b.year - a.year || months.indexOf(b.month) - months.indexOf(a.month)));
      } catch (error) {
        console.error('Failed to load reports:', error);
        alert('Error: Could not load saved reports. Please try refreshing the page.');
      }
    };
    loadReports();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!currentReport.activityName) {
      alert("Activity name is required.");
      return;
    }
    try {
      const photoData = await Promise.all(photos.map(p => fileToBase64(p)));
      const id = `${currentReport.year}-${months.indexOf(currentReport.month)+1}`;
      
      const newReport: Report = {
          id,
          ...currentReport,
          photos: photoData
      };
      
      await addReport(newReport);
      alert('Report saved!');
      setReports(prev => [newReport, ...prev].sort((a,b) => b.year - a.year || months.indexOf(b.month) - months.indexOf(a.month)));
    } catch (error) {
      console.error('Failed to save report:', error);
      alert('Error: Could not save the report. This might be due to a photo processing error or a database issue.');
    }
  };

  const handleDeleteConfirm = async () => {
    if(deleteReportId) {
      try {
        await deleteReport(deleteReportId);
        setReports(reports.filter(r => r.id !== deleteReportId));
      } catch (error) {
        console.error('Failed to delete report:', error);
        alert('Error: Could not delete the report. Please try again.');
      } finally {
        closeDeleteModal();
      }
    }
  }

  return (
    <div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Confirm Report Deletion"
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this report? This cannot be undone.</p>
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Auto Report Builder</h1>
         <Link to="/report/tahun">
            <Button>Generate Yearly Report</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Input Laporan Bulanan</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <select className="w-full p-2 border rounded" value={currentReport.month} onChange={e => setCurrentReport({...currentReport, month: e.target.value})}>{months.map(m=><option key={m}>{m}</option>)}</select>
              <input type="number" className="w-full p-2 border rounded" value={currentReport.year} onChange={e => setCurrentReport({...currentReport, year: +e.target.value})}/>
              <input type="text" placeholder="Nama Kegiatan" className="w-full p-2 border rounded" onChange={e => setCurrentReport({...currentReport, activityName: e.target.value})}/>
              <input type="number" placeholder="Jumlah Jamaah" className="w-full p-2 border rounded" onChange={e => setCurrentReport({...currentReport, attendees: +e.target.value})}/>
              <input type="number" placeholder="Kader Terlibat" className="w-full p-2 border rounded" onChange={e => setCurrentReport({...currentReport, involvedKader: +e.target.value})}/>
              <textarea placeholder="Catatan Ketua" className="w-full p-2 border rounded" onChange={e => setCurrentReport({...currentReport, notes: e.target.value})}></textarea>
              <div>
                  <label>Foto Dokumentasi (max 3)</label>
                  <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="w-full p-2 border rounded" />
              </div>
              <Button onClick={handleSubmit} className="w-full">Save Report</Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader><CardTitle>Saved Reports</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                    {reports.map(report => (
                        <li key={report.id} className="p-3 bg-gray-50 flex justify-between items-center rounded">
                            <div>
                                <p className="font-semibold">{report.activityName}</p>
                                <p className="text-sm text-gray-500">{report.month} {report.year}</p>
                            </div>
                            <div className="space-x-2">
                                <Button variant="ghost" size="sm" className="text-red-500" title="Delete Report" onClick={() => openDeleteModal(report.id)}><Trash2 size={16}/></Button>
                            </div>
                        </li>
                    ))}
                    {reports.length === 0 && <p>No reports saved yet.</p>}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
