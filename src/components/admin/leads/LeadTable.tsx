import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, UserPlus, ArrowUpDown, Filter, X } from 'lucide-react';
import { Lead } from '@/types/lead';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type LeadTableProps = {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

type SortField = 'name' | 'email' | 'status' | 'source' | 'created_at';
type SortDirection = 'asc' | 'desc';

const LeadTable: React.FC<LeadTableProps> = ({ leads: initialLeads, loading, onEdit, onDelete }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => leads.some(lead => lead.id === id)));
  }, [leads]);

  useEffect(() => {
    let filteredLeads = [...initialLeads];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredLeads = filteredLeads.filter(
        lead => 
          lead.name.toLowerCase().includes(query) || 
          lead.email.toLowerCase().includes(query) ||
          (lead.phone && lead.phone.toLowerCase().includes(query))
      );
    }
    
    if (statusFilter !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.status === statusFilter);
    }
    
    filteredLeads.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'status':
          comparison = String(a.status || '').localeCompare(String(b.status || ''));
          break;
        case 'source':
          comparison = String(a.source || '').localeCompare(String(b.source || ''));
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setLeads(filteredLeads);
  }, [initialLeads, searchQuery, sortField, sortDirection, statusFilter]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortField('created_at');
    setSortDirection('desc');
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-purple-500';
      case 'converted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isAllSelected = leads.length > 0 && selectedIds.length === leads.length;
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(leads.map(lead => lead.id));
  };
  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]);
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      alert('Bulk delete for leads (implement logic):\n' + selectedIds.join(', '));
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading leads...</div>;
  }
  
  if (leads.length === 0 && !searchQuery && statusFilter === 'all') {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center border rounded-md">
        <UserPlus className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No leads yet</h3>
        <p className="text-gray-500 max-w-sm mb-4">
          Add your first lead by clicking the "Add Lead" button.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-end mb-2">
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" /> 
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className={sortField === 'name' ? 'bg-accent' : ''}
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortField === 'email' ? 'bg-accent' : ''}
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortField === 'status' ? 'bg-accent' : ''}
                onClick={() => handleSort('status')}
              >
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortField === 'source' ? 'bg-accent' : ''}
                onClick={() => handleSort('source')}
              >
                Source {sortField === 'source' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortField === 'created_at' ? 'bg-accent' : ''}
                onClick={() => handleSort('created_at')}
              >
                Created Date {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" /> Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-4 bg-muted/40 rounded-md border">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <p className="text-sm font-medium mb-1">Filter by Status</p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="self-end mb-0.5"
            >
              <X className="h-4 w-4 mr-1" /> Clear All
            </Button>
          </div>
        </div>
      )}
      
      {leads.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No leads match your search criteria.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all leads"
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleSort('email')}
                >
                  Email {sortField === 'email' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleSort('source')}
                >
                  Source {sortField === 'source' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleSort('created_at')}
                >
                  Created {sortField === 'created_at' && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  )}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(lead.id)}
                      onCheckedChange={() => toggleSelectOne(lead.id)}
                      aria-label={`Select ${lead.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(lead.status)} text-white`}>
                      {lead.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.source || '-'}</TableCell>
                  <TableCell>
                    {format(new Date(lead.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(lead)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit lead</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(lead)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete lead</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground pt-2">
        Showing {leads.length} of {initialLeads.length} leads
      </div>
    </div>
  );
};

export default LeadTable;
