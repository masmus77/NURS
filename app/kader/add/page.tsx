import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addKader } from '../../../lib/db';
import { Kader } from '../../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';

const KaderAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [kader, setKader] = useState<Omit<Kader, 'id'>>({
    name: '', position: '', expertise: '', interests: '', phone: '', availability: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKader({ ...kader, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kader.name) {
      alert('Name is required.');
      return;
    }
    try {
      const newKader: Kader = { id: `kader-${Date.now()}`, ...kader };
      await addKader(newKader);
      alert('Kader added successfully!');
      navigate('/kader');
    } catch (error) {
      console.error('Failed to add kader:', error);
      alert('Error: Could not save new member data. Please try again.');
    }
  };

  return (
    <div>
      <Link to="/kader" className="inline-flex items-center text-nuGreen hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Kader List
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Add New Kader</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <Input type="text" name="name" value={kader.name} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Position</label>
                    <Input type="text" name="position" value={kader.position} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Expertise (e.g., IT, Fundraising)</label>
                    <Input type="text" name="expertise" value={kader.expertise} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Interests (e.g., Dakwah, Social)</label>
                    <Input type="text" name="interests" value={kader.interests} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium">WhatsApp Number</label>
                    <Input type="tel" name="phone" value={kader.phone} onChange={handleChange} />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Availability (e.g., Weekends)</label>
                    <Input type="text" name="availability" value={kader.availability} onChange={handleChange} />
                </div>
            </div>
            <div className="pt-4">
              <Button type="submit">Save Kader</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaderAddPage;