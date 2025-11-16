
import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ImpactData } from '../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const ImpactPage: React.FC = () => {
  const [impactData, setImpactData] = useLocalStorage<ImpactData[]>('impact_data', []);
  const [currentInput, setCurrentInput] = useState<Omit<ImpactData, 'id'>>({
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    activities: 0,
    attendees: 0,
    activeKader: 0,
    socialFund: 0,
    programProgress: 0
  });

  const handleAddData = () => {
    const id = `${currentInput.year}-${months.indexOf(currentInput.month) + 1}`;
    const existingIndex = impactData.findIndex(d => d.id === id);
    if (existingIndex > -1) {
      const updatedData = [...impactData];
      updatedData[existingIndex] = { id, ...currentInput };
      setImpactData(updatedData);
    } else {
      setImpactData([...impactData, { id, ...currentInput }]);
    }
    alert('Data saved!');
  };

  const chartData = impactData.sort((a,b) => a.year - b.year || months.indexOf(a.month) - months.indexOf(b.month));
  const summary = impactData.reduce((acc, curr) => ({
      totalActivities: acc.totalActivities + curr.activities,
      totalAttendees: acc.totalAttendees + curr.attendees,
      totalSocialFund: acc.totalSocialFund + curr.socialFund,
  }), { totalActivities: 0, totalAttendees: 0, totalSocialFund: 0 });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Impact Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card><CardContent><h4 className="text-sm font-medium">Total Kegiatan</h4><p className="text-2xl font-bold">{summary.totalActivities}</p></CardContent></Card>
        <Card><CardContent><h4 className="text-sm font-medium">Total Jamaah Hadir</h4><p className="text-2xl font-bold">{summary.totalAttendees}</p></CardContent></Card>
        <Card><CardContent><h4 className="text-sm font-medium">Total Dana Sosial</h4><p className="text-2xl font-bold">Rp {summary.totalSocialFund.toLocaleString('id-ID')}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader><CardTitle>Monthly Progress</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="activities" fill="#006f42" name="Jumlah Kegiatan" />
                            <Bar dataKey="attendees" fill="#f4a261" name="Jamaah Hadir" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader><CardTitle>Input Data Bulanan</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <select className="p-2 border rounded-md w-1/2" value={currentInput.month} onChange={e => setCurrentInput({...currentInput, month: e.target.value})}>
                            {months.map(m => <option key={m}>{m}</option>)}
                        </select>
                         <input type="number" className="p-2 border rounded-md w-1/2" value={currentInput.year} onChange={e => setCurrentInput({...currentInput, year: parseInt(e.target.value)})} />
                    </div>
                    <div><label>Jumlah Kegiatan</label><Input type="number" value={currentInput.activities} onChange={e => setCurrentInput({...currentInput, activities: +e.target.value})} /></div>
                    <div><label>Jamaah Hadir</label><Input type="number" value={currentInput.attendees} onChange={e => setCurrentInput({...currentInput, attendees: +e.target.value})} /></div>
                    <div><label>Kader Aktif</label><Input type="number" value={currentInput.activeKader} onChange={e => setCurrentInput({...currentInput, activeKader: +e.target.value})} /></div>
                    <div><label>Dana Sosial (Rp)</label><Input type="number" value={currentInput.socialFund} onChange={e => setCurrentInput({...currentInput, socialFund: +e.target.value})} /></div>
                    <div><label>Progres Program Inti (%)</label><Input type="number" max="100" value={currentInput.programProgress} onChange={e => setCurrentInput({...currentInput, programProgress: +e.target.value})} /></div>
                    <Button onClick={handleAddData} className="w-full">Save Data</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;
