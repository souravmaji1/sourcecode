'use client'
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Mail, Plus, Trash, Upload } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  'https://tbnfcmekmqbhxfvrzmbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibmZjbWVrbXFiaHhmdnJ6bWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg1MjkyNSwiZXhwIjoyMDM2NDI4OTI1fQ.QPyLbV_M2ZGvw_bpbpPZui4HBtODsDHhFR92p4Yos1I'
);

export default function FavoritesPage() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadSheetOpen, setIsLeadSheetOpen] = useState(false);
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [isEmailSheetOpen, setIsEmailSheetOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sequences, setSequences] = useState([]);
  const [currentSequence, setCurrentSequence] = useState({ name: '', steps: [] });
  const [sequenceStep, setSequenceStep] = useState({ days: 1, subject: '', body: '' });
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchSequences();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(data);
    }
    setIsLoading(false);
  };

  const fetchSequences = async () => {
    const { data, error } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching sequences:', error);
    } else {
      setSequences(data);
    }
  };

  const removeFavorite = async (favoriteId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    if (error) {
      console.error('Error removing favorite:', error);
    } else {
      fetchFavorites();
    }
  };

  const openLeadDetails = (lead) => {
    setSelectedLead(lead);
    setIsLeadSheetOpen(true);
  };

  const downloadCSV = (lead) => {
    // Implementation of CSV download
    console.log('Downloading CSV for', lead);
  };

  const toggleFavoriteSelection = (favoriteId) => {
    setSelectedFavorites(prev => 
      prev.includes(favoriteId)
        ? prev.filter(id => id !== favoriteId)
        : [...prev, favoriteId]
    );
  };

  const toggleAllFavorites = () => {
    if (selectedFavorites.length === favorites.length) {
      setSelectedFavorites([]);
    } else {
      setSelectedFavorites(favorites.map(fav => fav.id));
    }
  };

  const openEmailSheet = () => {
    setIsEmailSheetOpen(true);
  };

  const sendEmail = async () => {
    const selectedLeads = favorites.filter(fav => selectedFavorites.includes(fav.id));
    
    for (const lead of selectedLeads) {
      try {
        const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: lead.lead_email,
            subject: emailSubject,
            body: emailBody,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send email');
        }

        const result = await response.json();
        console.log('Email sent:', result);
      } catch (error) {
        console.error('Error sending email:', error);
        toast({
          title: "Error",
          description: `Failed to send email to ${lead.lead_email}`,
          variant: "destructive",
        });
        return; // Stop sending emails if there's an error
      }
    }

    toast({
      title: "Emails Sent",
      description: `Emails sent to ${selectedLeads.length} recipient(s).`,
    });
    setIsEmailSheetOpen(false);
  };

  const addSequenceStep = () => {
    setCurrentSequence(prev => ({
      ...prev,
      steps: [...prev.steps, sequenceStep]
    }));
    setSequenceStep({ days: 1, subject: '', body: '' });
  };

  const removeSequenceStep = (index) => {
    setCurrentSequence(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const saveSequence = async () => {
    const { data, error } = await supabase
      .from('email_sequences')
      .insert({ ...currentSequence, user_id: user.id });

    if (error) {
      console.error('Error saving sequence:', error);
      toast({
        title: "Error",
        description: "Failed to save the sequence. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Email sequence saved successfully.",
      });
      fetchSequences();
      setCurrentSequence({ name: '', steps: [] });
    }
  };

  const applySequence = (sequenceId) => {
    // Implementation of applying a sequence to selected favorites
    console.log('Applying sequence', sequenceId, 'to', selectedFavorites);
    toast({
      title: "Sequence Applied",
      description: `Email sequence applied to ${selectedFavorites.length} recipient(s).`,
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImportData(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    const rows = importData.split('\n').map(row => row.split(','));
    const headers = rows[0].map(header => header.trim().toLowerCase());
    const requiredHeaders = ['name', 'email', 'type'];
    
    if (!requiredHeaders.every(header => headers.includes(header))) {
      toast({
        title: "Error",
        description: "CSV file must include 'name', 'email', and 'type' columns.",
        variant: "destructive",
      });
      setIsImporting(false);
      return;
    }

    const leads = rows.slice(1).map(row => {
      const lead = {};
      headers.forEach((header, index) => {
        lead[header] = row[index] ? row[index].trim() : '';
      });
      return lead;
    });

    let importedCount = 0;
    let errorCount = 0;

    for (const lead of leads) {
      if (!lead.name || !lead.email) {
        errorCount++;
        continue;
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          lead_name: lead.name,
          lead_email: lead.email,
          lead_type: lead.type || 'Custom',
        });

      if (error) {
        console.error('Error importing lead:', error);
        errorCount++;
      } else {
        importedCount++;
      }
    }

    toast({
      title: "Import Complete",
      description: `Imported ${importedCount} leads successfully.`,
    });
    setIsImporting(false);
    setIsImportDialogOpen(false);
    setImportData('');
    fetchFavorites();
  };

  const renderLeadDetails = () => {
    if (!selectedLead) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>{selectedLead.lead_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email:</strong> {selectedLead.lead_email}</p>
          <p><strong>Type:</strong> {selectedLead.lead_type}</p>
          {/* Add more details as needed */}
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div 
      className="flex h-full flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center justify-between space-y-2">
        <Heading
          title="Your Favorite Leads"
          description="View and manage your favorite leads"
        />
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Import Leads
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Leads</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current.click()}>
                  Select CSV File
                </Button>
                <Textarea
                  placeholder="Or paste your CSV data here (format: name,email,type)"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={10}
                />
                <Button onClick={handleImport} disabled={isImporting}>
                  {isImporting ? 'Importing...' : 'Import'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={openEmailSheet} disabled={selectedFavorites.length === 0}>
            <Mail className="mr-2 h-4 w-4" />
            Email Options
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="py-4 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectedFavorites.length === favorites.length}
                      onCheckedChange={toggleAllFavorites}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {favorites.map((favorite) => (
                  <TableRow key={favorite.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFavorites.includes(favorite.id)}
                        onCheckedChange={() => toggleFavoriteSelection(favorite.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{favorite.lead_name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {favorite.lead_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{favorite.lead_email}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openLeadDetails(favorite)}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFavorite(favorite.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <Sheet open={isLeadSheetOpen} onOpenChange={setIsLeadSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Complete Details</SheetTitle>
            <Button
              onClick={() => selectedLead && downloadCSV(selectedLead)}
              variant="outline"
              className="mt-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </SheetHeader>

          {renderLeadDetails()}
        </SheetContent>
      </Sheet>

      <Sheet open={isEmailSheetOpen} onOpenChange={setIsEmailSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Email Options</SheetTitle>
          </SheetHeader>
          <Tabs defaultValue="single" className="mt-4">
            <TabsList>
              <TabsTrigger value="single">Single Email</TabsTrigger>
              <TabsTrigger value="sequence">Email Sequence</TabsTrigger>
            </TabsList>
            <TabsContent value="single">
              <div className="space-y-4">
                <Input
                  placeholder="Email Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
                <Textarea
                  placeholder="Email Body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={6}
                />
                <Button onClick={sendEmail}>Send Email</Button>
              </div>
            </TabsContent>
            <TabsContent value="sequence">
              <div className="space-y-4">
                <Input
                  placeholder="Sequence Name"
                  value={currentSequence.name}
                  onChange={(e) => setCurrentSequence(prev => ({ ...prev, name: e.target.value }))}
                />
                {currentSequence.steps.map((step, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Day {step.days}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeSequenceStep(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <p><strong>Subject:</strong> {step.subject}</p>
                    <p><strong>Body:</strong> {step.body.substring(0, 50)}...</p>
                  </Card>
                ))}
                <Card className="p-4">
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Days after previous email"
                      value={sequenceStep.days}
                      onChange={(e) => setSequenceStep(prev => ({ ...prev, days: parseInt(e.target.value) }))}
                    />
                    <Input
                      placeholder="Email Subject"
                      value={sequenceStep.subject}
                      onChange={(e) => setSequenceStep(prev => ({ ...prev, subject: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Email Body"
                      value={sequenceStep.body}
                      onChange={(e) => setSequenceStep(prev => ({ ...prev, body: e.target.value }))}
                      rows={4}
                    />
                    <Button onClick={addSequenceStep}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Step
                    </Button>
                  </div>
                </Card>
                <Button onClick={saveSequence}>Save Sequence</Button>
              </div>
            </TabsContent>
          </Tabs>
          <SheetFooter className="mt-4">
            <Select onValueChange={(value) => applySequence(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Apply existing sequence" />
              </SelectTrigger>
              <SelectContent>
                {sequences.map((seq) => (
                  <SelectItem key={seq.id} value={seq.id}>{seq.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}