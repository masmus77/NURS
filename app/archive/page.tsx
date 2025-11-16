import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFiles, deleteFile } from '../../lib/db';
import { ArchiveFile } from '../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Search, FileText, Trash2, Download } from 'lucide-react';
import { downloadFile } from '../../lib/utils';
import useModal from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';

const ArchivePage: React.FC = () => {
  const [files, setFiles] = useState<ArchiveFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const { isOpen: isDeleteModalOpen, data: deleteFileId, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal<string>();

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const storedFiles = await getFiles();
        setFiles(storedFiles.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error('Failed to load archive files:', error);
        alert('Error: Could not load documents from the database. Please try refreshing the page.');
      }
    };
    loadFiles();
  }, []);

  const handleDeleteConfirm = async () => {
    if (deleteFileId) {
      try {
        await deleteFile(deleteFileId);
        setFiles(files.filter(f => f.id !== deleteFileId));
      } catch (error) {
        console.error('Failed to delete file:', error);
        alert('Error: Could not delete the file. Please try again.');
      } finally {
        closeDeleteModal();
      }
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || file.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const categories: ArchiveFile['category'][] = ['Administrasi', 'Surat', 'Kegiatan', 'Keuangan'];

  return (
    <div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Confirm File Deletion"
        confirmText="Delete"
      >
        <p>Are you sure you want to permanently delete this file? This action cannot be undone.</p>
      </Modal>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Digital Archive</h1>
        <Link to="/archive/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="p-2 border rounded-md"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFiles.length > 0 ? (
            <ul className="space-y-3">
              {filteredFiles.map(file => (
                <li key={file.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-nuGreen mr-3" />
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.category} - {(file.size / 1024).toFixed(2)} KB - {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" title="Download File" onClick={() => downloadFile(file.data, file.name)}>
                        <Download size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" title="Delete File" onClick={() => openDeleteModal(file.id)} className="text-red-500">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p>No documents found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivePage;
