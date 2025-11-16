import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ProgramItem, ProgramStatus } from '../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { exportToCsv } from '../../lib/utils';
import useModal from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';

const initialPrograms: ProgramItem[] = [
    { id: 'prog-1', title: 'Rapat Anggota Tahunan', category: 'Administrasi', status: ProgramStatus.Completed, description: '...', pic: 'Ketua', deadline: '2024-03-31' },
    { id: 'prog-2', title: 'Latihan Kader Dasar', category: 'Kaderisasi', status: ProgramStatus.InProgress, description: '...', pic: 'Sekretaris', deadline: '2024-06-30' },
    { id: 'prog-3', title: 'Website Ranting', category: 'Digitalisasi', status: ProgramStatus.NotStarted, description: '...', pic: 'Bendahara', deadline: '2024-09-30' }
];

const ProgramStatusBadge = ({ status }: { status: ProgramStatus }) => {
  const colorMap = {
    [ProgramStatus.NotStarted]: 'bg-red-100 text-red-800',
    [ProgramStatus.InProgress]: 'bg-yellow-100 text-yellow-800',
    [ProgramStatus.Completed]: 'bg-green-100 text-green-800',
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorMap[status]}`}>{status}</span>;
};

const ProgramListPage: React.FC = () => {
  const [programs, setPrograms] = useLocalStorage<ProgramItem[]>('programs', initialPrograms);
  const [newProgram, setNewProgram] = useState<Omit<ProgramItem, 'id'>>({ title: '', category: 'Administrasi', status: ProgramStatus.NotStarted, description: '', pic: '', deadline: ''});
  const [isAdding, setIsAdding] = useState(false);
  const { isOpen: isDeleteModalOpen, data: deleteProgramId, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal<string>();

  const handleDeleteConfirm = () => {
    if (deleteProgramId) {
      setPrograms(programs.filter(p => p.id !== deleteProgramId));
      closeDeleteModal();
    }
  };
  
  const handleAddProgram = () => {
    if (!newProgram.title) {
        alert("Title is required");
        return;
    }
    const programToAdd: ProgramItem = { ...newProgram, id: `prog-${Date.now()}` };
    setPrograms([...programs, programToAdd]);
    setNewProgram({ title: '', category: 'Administrasi', status: ProgramStatus.NotStarted, description: '', pic: '', deadline: ''});
    setIsAdding(false);
  }

  const handleExportCsv = () => {
    exportToCsv(programs, 'program_data');
  };

  const categories: ProgramItem['category'][] = ['Administrasi', 'Kaderisasi', 'Digitalisasi', 'Sosial'];

  return (
    <div>
       <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this program? This action cannot be undone.</p>
      </Modal>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Program Tracker</h1>
        <div className="flex items-center gap-2">
            <Button 
                onClick={handleExportCsv} 
                variant="secondary" 
                disabled={programs.length === 0}
                title={programs.length === 0 ? 'No data to export' : 'Export data to CSV'}
            >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
            <Button onClick={() => setIsAdding(!isAdding)}>
                <Plus className="mr-2 h-4 w-4" /> {isAdding ? 'Cancel' : 'Add Program'}
            </Button>
        </div>
      </div>

      {isAdding && (
         <Card className="mb-6">
            <CardHeader>
                <CardTitle>Add New Program</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Title" value={newProgram.title} onChange={e => setNewProgram({...newProgram, title: e.target.value})} className="p-2 border rounded" />
                <select value={newProgram.category} onChange={e => setNewProgram({...newProgram, category: e.target.value as any})} className="p-2 border rounded">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Person in Charge" value={newProgram.pic} onChange={e => setNewProgram({...newProgram, pic: e.target.value})} className="p-2 border rounded" />
                <input type="date" value={newProgram.deadline} onChange={e => setNewProgram({...newProgram, deadline: e.target.value})} className="p-2 border rounded" />
                 <select value={newProgram.status} onChange={e => setNewProgram({...newProgram, status: e.target.value as ProgramStatus})} className="p-2 border rounded">
                    {Object.values(ProgramStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </CardContent>
             <CardContent>
                <textarea placeholder="Description" value={newProgram.description} onChange={e => setNewProgram({...newProgram, description: e.target.value})} className="w-full p-2 border rounded" />
                <Button onClick={handleAddProgram} className="mt-4">Save Program</Button>
            </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {categories.map(category => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {programs.filter(p => p.category === category).map((program) => (
                      <tr key={program.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{program.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><ProgramStatusBadge status={program.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.pic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.deadline}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                           <Link to={`/program/${program.id}`} title="Edit Program" className="text-nuGreen hover:text-nuGreen-dark inline-flex items-center"><Edit size={16}/></Link>
                           <button onClick={() => openDeleteModal(program.id)} title="Delete Program" className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramListPage;
