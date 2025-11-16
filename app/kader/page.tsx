import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getKader, deleteKader } from '../../lib/db';
import { Kader } from '../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Edit, Trash2, Download, Search } from 'lucide-react';
import { exportToCsv } from '../../lib/utils';
import useModal from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const KaderPage: React.FC = () => {
  const [kaderList, setKaderList] = useState<Kader[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ position: '', interests: '', expertise: '' });
  const { isOpen: isDeleteModalOpen, data: deleteKaderId, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal<string>();

  useEffect(() => {
    const loadKader = async () => {
      try {
        const data = await getKader();
        setKaderList(data);
      } catch (error) {
        console.error('Failed to load kader list:', error);
        alert('Error: Could not load member data from the database. Please try refreshing the page.');
      }
    };
    loadKader();
  }, []);

  const handleDeleteConfirm = async () => {
    if (deleteKaderId) {
      try {
        await deleteKader(deleteKaderId);
        setKaderList(kaderList.filter(k => k.id !== deleteKaderId));
      } catch (error) {
        console.error('Failed to delete kader:', error);
        alert('Error: Could not delete the member. Please try again.');
      } finally {
        closeDeleteModal();
      }
    }
  };
  
  const handleExport = () => {
      exportToCsv(filteredKader, 'kader_data');
  }

  const filteredKader = kaderList.filter(k =>
    (k.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.position ? k.position.toLowerCase().includes(filters.position.toLowerCase()) : true) &&
    (filters.interests ? k.interests.toLowerCase().includes(filters.interests.toLowerCase()) : true) &&
    (filters.expertise ? k.expertise.toLowerCase().includes(filters.expertise.toLowerCase()) : true)
  );

  return (
    <div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Confirm Member Deletion"
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this member's data? This action is permanent.</p>
      </Modal>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Kader Map</h1>
        <div className="flex gap-2">
            <Button onClick={handleExport} variant="secondary"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
            <Link to="/kader/add">
                <Button><Plus className="mr-2 h-4 w-4" /> Add Kader</Button>
            </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Name..."
                className="pl-10"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Input type="text" placeholder="Filter by Position..." onChange={e => setFilters({...filters, position: e.target.value})} />
            <Input type="text" placeholder="Filter by Interests..." onChange={e => setFilters({...filters, interests: e.target.value})} />
            <Input type="text" placeholder="Filter by Expertise..." onChange={e => setFilters({...filters, expertise: e.target.value})} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium">Expertise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium">Interests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium">Phone</th>
                  <th className="px-6 py-3 text-right text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKader.map(kader => (
                  <tr key={kader.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{kader.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{kader.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{kader.expertise}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{kader.interests}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{kader.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <Link to={`/kader/edit/${kader.id}`} title="Edit Kader" className="text-nuGreen hover:text-nuGreen-dark inline-flex items-center"><Edit size={16}/></Link>
                      <button onClick={() => openDeleteModal(kader.id)} title="Delete Kader" className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaderPage;