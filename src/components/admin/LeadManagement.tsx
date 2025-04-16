
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, UserPlus, Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setLeads(data as Lead[] || []);
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
    (lead.phone && lead.phone.includes(searchTerm))
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Prevent non-admin users from accessing this page
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Access Denied: Admin rights required</p>
      </div>
    );
  }

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
                            {lead.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-gray-500" />
                                <span className="text-sm">{lead.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{lead.source || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(lead.status)} text-white capitalize`}
                          >
                            {lead.status || 'new'}
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
