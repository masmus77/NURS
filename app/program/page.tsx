import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ProgramItem, ProgramStatus } from '../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Edit, Trash2, Download, X, ChevronDown } from 'lucide-react';
import { exportToCsv } from '../../lib/utils';
import useModal from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import StatusIndicator from '../../components/ui/StatusIndicator';
import { cn } from '../../lib/utils';


const initialPrograms: ProgramItem[] = [
    { id: 'prog-1', title: 'Rapat Anggota Tahunan', category: 'Administrasi', status: ProgramStatus.Completed, description: 'Rapat tahunan untuk membahas laporan pertanggungjawaban pengurus dan merencanakan program kerja tahun berikutnya.', pic: 'Ketua', deadline: '2024-03-31' },
    { id: 'prog-2', title: 'Latihan Kader Dasar', category: 'Kaderisasi', status: ProgramStatus.InProgress, description: 'Pelatihan dasar bagi anggota baru untuk memahami nilai-nilai, ideologi, dan struktur organisasi NU.', pic: 'Sekretaris', deadline: '2024-06-30' },
    { id: 'prog-3', title: 'Website Ranting', category: 'Digitalisasi', status: ProgramStatus.NotStarted, description: 'Pembuatan website resmi untuk ranting sebagai pusat informasi dan media dakwah digital.', pic: 'Bendahara', deadline: '2024-09-30' }
];

const ProgramListPage: React.FC = () => {
  const [programs, setPrograms] = useLocalStorage<ProgramItem[]>('programs', initialPrograms);
  const [newProgram, setNewProgram] = useState<Omit<ProgramItem, 'id'>>({ title: '', category: 'Administrasi', status: ProgramStatus.NotStarted, description: '', pic: '', deadline: ''});
  const [isAdding, setIsAdding] = useState(false);
  const { isOpen: isDeleteModalOpen, data: deleteProgramId, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal<string>();
  const [statusFilter, setStatusFilter] = useState<ProgramStatus | 'All'>('All');
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<{ status: ProgramStatus | '', deadline: string }>({ status: '', deadline: '' });
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState('');

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

  const filteredPrograms = programs.filter(p =>
    statusFilter === 'All' || p.status === statusFilter
  );

  const handleExportCsv = () => {
    exportToCsv(filteredPrograms, `program_data_${statusFilter.replace(' ', '_').toLowerCase()}`);
  };

  const handleSelectProgram = (programId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedPrograms);
    if (isSelected) {
        newSelected.add(programId);
    } else {
        newSelected.delete(programId);
    }
    setSelectedPrograms(newSelected);
  };
  
  const handleBulkUpdate = () => {
    const { status, deadline } = bulkAction;
    if (!status && !deadline) {
      alert("Please choose a status or set a deadline to apply.");
      return;
    }

    setPrograms(prevPrograms => prevPrograms.map(p => {
      if (selectedPrograms.has(p.id)) {
        const updatedProgram = { ...p };
        if (status) updatedProgram.status = status;
        if (deadline) updatedProgram.deadline = deadline;
        return updatedProgram;
      }
      return p;
    }));
    
    setFeedbackMessage(`${selectedPrograms.size} program(s) updated successfully.`);
    setTimeout(() => setFeedbackMessage(''), 3000); // Clear message after 3 seconds

    setSelectedPrograms(new Set());
    setBulkAction({ status: '', deadline: '' });
  };
  
  const handleToggleExpand = (programId: string) => {
    setExpandedPrograms(prev => {
        const newSet = new Set(prev);
        if (newSet.has(programId)) {
            newSet.delete(programId);
        } else {
            newSet.add(programId);
        }
        return newSet;
    });
  };

  const categories: ProgramItem['category'][] = ['Administrasi', 'Kaderisasi', 'Digitalisasi', 'Sosial'];
  const filterStatuses: (ProgramStatus | 'All')[] = ['All', ProgramStatus.NotStarted, ProgramStatus.InProgress, ProgramStatus.Completed];

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
                disabled={filteredPrograms.length === 0}
                title={filteredPrograms.length === 0 ? 'No data to export' : 'Export filtered data to CSV'}
            >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
            <Button onClick={() => setIsAdding(!isAdding)}>
                <Plus className="mr-2 h-4 w-4" /> {isAdding ? 'Cancel' : 'Add Program'}
            </Button>
        </div>
      </div>
      
      {feedbackMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="status">
            <p>{feedbackMessage}</p>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-2 py-3">
            <span className="font-medium mr-2 text-sm text-gray-700">Filter by status:</span>
            {filterStatuses.map(status => (
                <Button
                    key={status}
                    variant={statusFilter === status ? 'primary' : 'ghost'}
                    onClick={() => setStatusFilter(status)}
                    className="px-3 py-1 text-sm"
                >
                    {status}
                </Button>
            ))}
        </CardContent>
      </Card>

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
      
      {selectedPrograms.size > 0 && (
          <Card className="mb-6 bg-nuGreen-light/10 border border-nuGreen-light">
               <CardHeader className="p-3 bg-nuGreen-light/20">
                <CardTitle className="text-sm md:text-base text-nuGreen-dark">Bulk Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="font-semibold text-nuGreen-dark flex-shrink-0">{selectedPrograms.size} program(s) selected.</p>
                  <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end flex-grow">
                      <Select
                          value={bulkAction.status}
                          onChange={e => setBulkAction({ ...bulkAction, status: e.target.value as ProgramStatus })}
                          className="text-sm"
                          aria-label="Change status for selected programs"
                      >
                          <option value="">Change Status...</option>
                          {Object.values(ProgramStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                      <Input
                          type="date"
                          value={bulkAction.deadline}
                          onChange={e => setBulkAction({ ...bulkAction, deadline: e.target.value })}
                          className="text-sm"
                          aria-label="Change deadline for selected programs"
                      />
                      <Button onClick={handleBulkUpdate} size="sm">Update Selected</Button>
                      <Button variant="secondary" size="sm" onClick={() => setSelectedPrograms(new Set())}>
                          Cancel
                      </Button>
                  </div>
              </CardContent>
          </Card>
      )}

      <div className="space-y-6">
        {categories.map(category => {
          const programsInCategory = filteredPrograms.filter(p => p.category === category);
          if (programsInCategory.length === 0) {
            return null;
          }

          const programsInCategoryIds = programsInCategory.map(p => p.id);
          const allInCategorySelected = programsInCategory.length > 0 && programsInCategoryIds.every(id => selectedPrograms.has(id));

          const handleSelectAllInCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
              const newSelected = new Set(selectedPrograms);
              if (e.target.checked) {
                  programsInCategoryIds.forEach(id => newSelected.add(id));
              } else {
                  programsInCategoryIds.forEach(id => newSelected.delete(id));
              }
              setSelectedPrograms(newSelected);
          };

          return (
            <Card key={category}>
                <CardHeader>
                    <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div role="list" className="min-w-full">
                        {/* Desktop Header */}
                        <div role="rowheader" className="hidden md:flex items-center bg-gray-50 border-b">
                            <div className="px-6 py-3 w-12 flex-shrink-0">
                                <input 
                                    type="checkbox" 
                                    checked={allInCategorySelected} 
                                    onChange={handleSelectAllInCategory} 
                                    className="h-4 w-4 text-nuGreen focus:ring-nuGreen border-gray-300 rounded" 
                                    title={`Select all in ${category}`}
                                />
                            </div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">Program</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48 flex-shrink-0">Status</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56 flex-shrink-0">Progress</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 flex-shrink-0">PIC</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 flex-shrink-0">Deadline</div>
                            <div className="px-6 py-3 w-24 flex-shrink-0 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
                        </div>

                        {/* Program List */}
                        <div role="rowgroup">
                            {programsInCategory.map((program) => (
                                <div role="listitem" key={program.id} className="border-b border-gray-200 last:border-b-0">
                                    <div className={cn(selectedPrograms.has(program.id) ? 'bg-nuGreen-light/10' : 'bg-white')}>
                                        {/* Desktop View */}
                                        <div className="hidden md:flex items-center">
                                            <div className="px-6 py-4 w-12 flex-shrink-0">
                                                <input type="checkbox" checked={selectedPrograms.has(program.id)} onChange={e => handleSelectProgram(program.id, e.target.checked)} className="h-4 w-4 text-nuGreen focus:ring-nuGreen border-gray-300 rounded"/>
                                            </div>
                                            <button 
                                                onClick={() => handleToggleExpand(program.id)}
                                                className="px-6 py-4 flex-1 text-sm font-medium text-gray-900 flex items-center gap-2 text-left hover:text-nuGreen transition-colors w-full"
                                                aria-expanded={expandedPrograms.has(program.id)}
                                                aria-controls={`details-${program.id}`}
                                            >
                                                <span>{program.title}</span>
                                                <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', expandedPrograms.has(program.id) && 'rotate-180')} />
                                            </button>
                                            <div className="px-6 py-4 w-48 flex-shrink-0"><StatusIndicator status={program.status} /></div>
                                            <div className="px-6 py-4 w-56 flex-shrink-0"><ProgressBar status={program.status} /></div>
                                            <div className="px-6 py-4 w-32 flex-shrink-0 text-sm text-gray-500">{program.pic}</div>
                                            <div className="px-6 py-4 w-32 flex-shrink-0 text-sm text-gray-500">{program.deadline}</div>
                                            <div className="px-6 py-4 w-24 flex-shrink-0 text-right space-x-2">
                                                <Link to={`/program/${program.id}`} title="Edit Program" className="text-nuGreen hover:text-nuGreen-dark inline-flex items-center"><Edit size={16}/></Link>
                                                <button onClick={() => openDeleteModal(program.id)} title="Delete Program" className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                                            </div>
                                        </div>

                                        {/* Mobile View */}
                                        <div className="md:hidden p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                    <input type="checkbox" checked={selectedPrograms.has(program.id)} onChange={e => handleSelectProgram(program.id, e.target.checked)} className="h-4 w-4 text-nuGreen focus:ring-nuGreen border-gray-300 rounded mt-1"/>
                                                     <button 
                                                        onClick={() => handleToggleExpand(program.id)}
                                                        className="font-semibold text-gray-900 text-left flex items-center gap-2 hover:text-nuGreen transition-colors"
                                                        aria-expanded={expandedPrograms.has(program.id)}
                                                        aria-controls={`details-${program.id}`}
                                                     >
                                                        <span>{program.title}</span>
                                                        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0', expandedPrograms.has(program.id) && 'rotate-180')} />
                                                    </button>
                                                </div>
                                                <div className="space-x-2 flex-shrink-0">
                                                    <Link to={`/program/${program.id}`} title="Edit Program" className="text-nuGreen hover:text-nuGreen-dark inline-flex items-center"><Edit size={16}/></Link>
                                                    <button onClick={() => openDeleteModal(program.id)} title="Delete Program" className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                                                </div>
                                            </div>
                                            <div className="mt-4 space-y-3 pl-7">
                                                <div>
                                                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Status</div>
                                                    <StatusIndicator status={program.status} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Progress</div>
                                                    <ProgressBar status={program.status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <div>
                                                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">PIC</div>
                                                        <div className="text-sm text-gray-800">{program.pic}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">Deadline</div>
                                                        <div className="text-sm text-gray-800">{program.deadline}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {expandedPrograms.has(program.id) && (
                                        <div 
                                            id={`details-${program.id}`}
                                            className={cn(
                                                'text-sm text-gray-700 transition-all', 
                                                selectedPrograms.has(program.id) ? 'bg-nuGreen-light/20' : 'bg-gray-50'
                                            )}
                                        >
                                           <div className="p-4 pl-7 md:py-4 md:px-6 md:pl-[4.5rem]">
                                                <p className="whitespace-pre-wrap"><strong className="font-semibold text-gray-800">Description:</strong> {program.description || 'No description provided.'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
          );
        })}
         {filteredPrograms.length === 0 && !isAdding && (
            <Card>
                <CardContent>
                    <p className="text-center text-gray-500 py-8">
                        No programs match the status "{statusFilter}".
                    </p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
};

export default ProgramListPage;