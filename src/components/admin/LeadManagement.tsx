
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, UserPlus, Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  created_at: string;
};

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // This is a mock implementation for demonstration
      // In a real app, you would fetch from a leads table in Supabase
      const mockLeads = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 123-456-7890',
          status: 'new',
          source: 'Website',
          created_at: '2025-04-10T10:30:00Z',
        },
        {
          id: '2',
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          phone: '+1 234-567-8901',
          status: 'contacted',
          source: 'Referral',
          created_at: '2025-04-08T14:15:00Z',
        },
        {
          id: '3',
          name: 'Robert Lee',
          email: 'robert.lee@example.com',
          phone: '+1 345-678-9012',
          status: 'qualified',
          source: 'Social Media',
          created_at: '2025-04-05T09:45:00Z',
        },
        {
          id: '4',
          name: 'Emily Chen',
          email: 'emily.chen@example.com',
          phone: '+1 456-789-0123',
          status: 'converted',
          source: 'Email Campaign',
          created_at: '2025-04-01T16:20:00Z',
        },
        {
          id: '5',
          name: 'Michael Williams',
          email: 'michael.williams@example.com',
          phone: '+1 567-890-1234',
          status: 'lost',
          source: 'Event',
          created_at: '2025-03-28T11:10:00Z',
        }
      ] as Lead[];
      
      setLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load leads. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500 hover:bg-blue-600';
      case 'contacted': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'qualified': return 'bg-purple-500 hover:bg-purple-600';
      case 'converted': return 'bg-green-500 hover:bg-green-600';
      case 'lost': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search leads..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="flex items-center gap-2 bg-music-500 hover:bg-music-600">
            <UserPlus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Leads</CardTitle>
          <CardDescription>Manage your prospective students and contacts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500">Loading leads...</p>
            </div>
          ) : (
            filteredLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-sm">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-sm">{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(lead.status)} text-white capitalize`}
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(lead.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">No leads found</p>
                <Button className="bg-music-500 hover:bg-music-600">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add your first lead
                </Button>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadManagement;
