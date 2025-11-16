
import React, { useState, useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { RenjaPlan, RenjaItem } from '../../types';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';

const programTemplates = {
  administrasi: "Tertib Administrasi (Surat, Keuangan)",
  kaderisasi: "Pendidikan Kader (LKD, Pelatihan)",
  dakwah: "Kegiatan Dakwah (Majelis Taklim, Pengajian)",
  sosial: "Bakti Sosial (Santunan, Kerja Bakti)",
  digitalisasi: "Digitalisasi Ranting (Website, Medsos)",
};

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const RenjaPage: React.FC = () => {
  const [plans, setPlans] = useLocalStorage<RenjaPlan[]>('renja_plans', []);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<RenjaPlan | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (selectedPrograms.length === 0) {
      alert("Please select at least one program.");
      return;
    }

    const plan: RenjaItem[] = [];
    months.forEach((month, index) => {
      // Simple logic: distribute programs across the year
      const programKey = selectedPrograms[index % selectedPrograms.length];
      plan.push({
        month,
        program: programTemplates[programKey as keyof typeof programTemplates],
        indicator: `Pelaksanaan ${programTemplates[programKey as keyof typeof programTemplates]}`,
      });
    });

    const newPlan = { id: `renja-${Date.now()}`, year: new Date().getFullYear(), plan };
    setGeneratedPlan(newPlan);
  };
  
  const handleSavePlan = () => {
      if(generatedPlan){
          setPlans([...plans, generatedPlan]);
          setGeneratedPlan(null);
          setSelectedPrograms([]);
          alert("Plan saved successfully!");
      }
  }

  const exportPdf = (plan: RenjaPlan) => {
    const doc = new jsPDF();
    doc.text(`Rencana Kerja Tahunan ${plan.year}`, 14, 16);
    (doc as any).autoTable({
        head: [['Bulan', 'Program', 'Indikator Capaian']],
        body: plan.plan.map(item => [item.month, item.program, item.indicator]),
        startY: 20,
    });
    doc.save(`renja_${plan.year}.pdf`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Renja Builder (Work Plan)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader><CardTitle>1. Select Programs</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(programTemplates).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-nuGreen focus:ring-nuGreen border-gray-300 rounded"
                    checked={selectedPrograms.includes(key)}
                    onChange={() => {
                      setSelectedPrograms(prev =>
                        prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
                      );
                    }}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} className="w-full">Generate Plan</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {generatedPlan ? (
            <Card ref={planRef}>
              <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>2. Generated Plan for {generatedPlan.year}</CardTitle>
                    <Button variant="secondary" onClick={() => exportPdf(generatedPlan)}><Download className="mr-2 h-4 w-4"/>PDF</Button>
                  </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50"><tr><th>Month</th><th>Program</th><th>Indicator</th></tr></thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generatedPlan.plan.map(item => (
                          <tr key={item.month}>
                            <td className="px-4 py-2">{item.month}</td>
                            <td className="px-4 py-2">{item.program}</td>
                            <td className="px-4 py-2">{item.indicator}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </CardContent>
              <CardFooter>
                  <Button onClick={handleSavePlan} className="w-full">Save This Plan</Button>
              </CardFooter>
            </Card>
          ) : (
             <div className="p-8 text-center border-2 border-dashed rounded-lg h-full flex flex-col justify-center">
                <p>Generated plan will appear here.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Saved Plans</h2>
        <div className="space-y-4">
            {plans.map(plan => (
                <Card key={plan.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Plan for {plan.year}</CardTitle>
                            <Button variant="secondary" onClick={() => exportPdf(plan)}><Download className="mr-2 h-4 w-4"/>Export PDF</Button>
                        </div>
                    </CardHeader>
                </Card>
            ))}
             {plans.length === 0 && <p>No saved plans yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default RenjaPage;
