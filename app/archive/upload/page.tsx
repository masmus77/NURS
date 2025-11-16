
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addFile } from '../../../lib/db';
import { ArchiveFile } from '../../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { fileToBase64 } from '../../../lib/utils';

const ArchiveUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<ArchiveFile['category']>('Administrasi');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    setIsUploading(true);
    try {
      const base64Data = await fileToBase64(file);
      const newFile: ArchiveFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        category,
        data: base64Data,
        createdAt: Date.now(),
      };
      await addFile(newFile);
      alert('File uploaded successfully!');
      navigate('/archive');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const categories: ArchiveFile['category'][] = ['Administrasi', 'Surat', 'Kegiatan', 'Keuangan'];

  return (
    <div>
      <Link to="/archive" className="inline-flex items-center text-nuGreen hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Archive
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Select value={category} onChange={(e) => setCategory(e.target.value as any)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-nuGreen hover:text-nuGreen-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-nuGreen">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG, DOCX up to 10MB</p>
                </div>
              </div>
              {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
            </div>

            <div>
              <Button type="submit" disabled={isUploading || !file}>
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchiveUploadPage;
