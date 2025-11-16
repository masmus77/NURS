import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getKaderById, updateKader } from '../../../../lib/db';
import { Kader } from '../../../../types';
import Card, { CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';

const KaderEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [kader, setKader] = useState<Kader | null>(null);

  useEffect(() => {
    const fetchKader = async () => {
      if (id) {
        try {
          const data = await getKaderById(id);
          if (data) {
            setKader(data);
          } else {
            alert('Member not found. Redirecting to member list.');
            navigate('/kader');
          }
        } catch (error) {
          console.error(`Failed to fetch kader with id ${id}:`, error);
          alert('Error: Could not load member data. Please try again.');
        }
      }
    };
    fetchKader();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (kader) {
      setKader({ ...kader, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kader) {
      try {
        await updateKader(kader);
        alert('Kader updated successfully!');
        navigate('/kader');
      } catch (error) {
        console.error('Failed to update kader:', error);
        alert('Error: Could not update member data. Please try again.');
      }
    }
  };

  if (!kader) return <div>Loading...</div>;

  return (
    <div>
       <Link to="/kader" className="inline-flex items-center text-nuGreen hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Kader List
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit Kader: {kader.name}</CardTitle>
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
                    <label className="block text-sm font-medium">Expertise</label>
                    <Input type="text" name="expertise" value={kader.expertise} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Interests</label>
                    <Input type="text" name="interests" value={kader.interests} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium">WhatsApp Number</label>
                    <Input type="tel" name="phone" value={kader.phone} onChange={handleChange} />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Availability</label>
                    <Input type="text" name="availability" value={kader.availability} onChange={handleChange} />
                </div>
            </div>
            <div className="pt-4">
              <Button type="submit">Update Kader</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaderEditPage;