import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface EstateDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Document {
  id: string;
  title: string;
  type: string;
  status: 'Current' | 'Outdated' | 'In Progress';
  location: string;
  lastUpdated: string;
}

interface Trust {
  id: string;
  name: string;
  settlor: string;
  trustees: string[];
  jurisdiction: string;
  startDate?: string;
  beneficiaries: {
    name: string;
    relationship: string;
    allocation: number;
  }[];
  notes?: string;
}

interface Action {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignedTo: string;
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  allocation: number;
  contact: string;
  notes?: string;
}

export const EstateDetailDialog = ({ isOpen, onClose }: EstateDetailDialogProps) => {
  // State for documents
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      title: "Last Will and Testament",
      type: "Legal Document",
      status: "Current",
      location: "Safe Deposit Box at First National Bank",
      lastUpdated: "2023-05-15"
    },
    {
      id: "doc2",
      title: "Power of Attorney",
      type: "Legal Document",
      status: "Outdated",
      location: "Home Office Filing Cabinet",
      lastUpdated: "2021-03-10"
    }
  ]);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: "",
    type: "",
    status: "Current",
    location: "",
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  // State for trusts
  const [trusts, setTrusts] = useState<Trust[]>([
    {
      id: "trust1",
      name: "Family Trust",
      settlor: "John Smith",
      trustees: ["Jane Smith", "Robert Johnson"],
      jurisdiction: "Ontario",
      startDate: "2020-01-15",
      beneficiaries: [
        { name: "Emma Smith", relationship: "Daughter", allocation: 50 },
        { name: "Michael Smith", relationship: "Son", allocation: 50 }
      ],
      notes: "Annual review required by January 31st"
    }
  ]);
  const [showAddTrust, setShowAddTrust] = useState(false);
  const [newTrust, setNewTrust] = useState<Partial<Trust>>({
    name: "",
    settlor: "",
    trustees: [""],
    jurisdiction: "",
    startDate: "",
    beneficiaries: [{ name: "", relationship: "", allocation: 0 }],
    notes: ""
  });

  // State for action items
  const [actions, setActions] = useState<Action[]>([
    {
      id: "action1",
      title: "Update Will",
      description: "Schedule appointment with estate attorney to update will with new property",
      priority: "High",
      dueDate: "2023-12-15",
      assignedTo: "Self"
    }
  ]);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState<Partial<Action>>({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: ""
  });

  // State for beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "ben1",
      name: "Emma Smith",
      relationship: "Daughter",
      allocation: 40,
      contact: "emma@example.com",
      notes: "Executor of the estate"
    },
    {
      id: "ben2",
      name: "Michael Smith",
      relationship: "Son",
      allocation: 40,
      contact: "michael@example.com"
    },
    {
      id: "ben3",
      name: "Children's Hospital Foundation",
      relationship: "Charity",
      allocation: 20,
      contact: "donations@chf.org",
      notes: "Annual donation acknowledgment required"
    }
  ]);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState<Partial<Beneficiary>>({
    name: "",
    relationship: "",
    allocation: 0,
    contact: "",
    notes: ""
  });
  
  // Add delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'document' | 'trust' | 'action' | 'beneficiary';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'document',
    id: '',
    title: ''
  });

  // Add document function
  const handleAddDocument = () => {
    if (newDocument.title && newDocument.type && newDocument.location) {
      const document: Document = {
        id: uuidv4(),
        title: newDocument.title,
        type: newDocument.type,
        status: newDocument.status as 'Current' | 'Outdated' | 'In Progress',
        location: newDocument.location,
        lastUpdated: newDocument.lastUpdated || new Date().toISOString().split('T')[0]
      };
      setDocuments([...documents, document]);
      setNewDocument({
        title: "",
        type: "",
        status: "Current",
        location: "",
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setShowAddDocument(false);
    }
  };

  // Add trust function
  const handleAddTrust = () => {
    if (newTrust.name && newTrust.settlor && newTrust.jurisdiction) {
      const trust: Trust = {
        id: uuidv4(),
        name: newTrust.name,
        settlor: newTrust.settlor,
        trustees: newTrust.trustees || [""],
        jurisdiction: newTrust.jurisdiction,
        startDate: newTrust.startDate,
        beneficiaries: newTrust.beneficiaries || [],
        notes: newTrust.notes
      };
      setTrusts([...trusts, trust]);
      setNewTrust({
        name: "",
        settlor: "",
        trustees: [""],
        jurisdiction: "",
        startDate: "",
        beneficiaries: [{ name: "", relationship: "", allocation: 0 }],
        notes: ""
      });
      setShowAddTrust(false);
    }
  };

  // Add action function
  const handleAddAction = () => {
    if (newAction.title && newAction.description && newAction.dueDate) {
      const action: Action = {
        id: uuidv4(),
        title: newAction.title,
        description: newAction.description,
        priority: newAction.priority as 'High' | 'Medium' | 'Low',
        dueDate: newAction.dueDate,
        assignedTo: newAction.assignedTo || "Self"
      };
      setActions([...actions, action]);
      setNewAction({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        assignedTo: ""
      });
      setShowAddAction(false);
    }
  };

  // Add beneficiary function
  const handleAddBeneficiary = () => {
    if (newBeneficiary.name && newBeneficiary.relationship && newBeneficiary.contact) {
      const beneficiary: Beneficiary = {
        id: uuidv4(),
        name: newBeneficiary.name,
        relationship: newBeneficiary.relationship,
        allocation: newBeneficiary.allocation || 0,
        contact: newBeneficiary.contact,
        notes: newBeneficiary.notes
      };
      setBeneficiaries([...beneficiaries, beneficiary]);
      setNewBeneficiary({
        name: "",
        relationship: "",
        allocation: 0,
        contact: "",
        notes: ""
      });
      setShowAddBeneficiary(false);
    }
  };

  // Delete functions
  const handleDeleteDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setDeleteConfirmation({
        isOpen: true,
        type: 'document',
        id,
        title: document.title
      });
    }
  };

  const handleDeleteTrust = (id: string) => {
    const trust = trusts.find(t => t.id === id);
    if (trust) {
      setDeleteConfirmation({
        isOpen: true,
        type: 'trust',
        id,
        title: trust.name
      });
    }
  };

  const handleDeleteAction = (id: string) => {
    const action = actions.find(a => a.id === id);
    if (action) {
      setDeleteConfirmation({
        isOpen: true,
        type: 'action',
        id,
        title: action.title
      });
    }
  };

  const handleDeleteBeneficiary = (id: string) => {
    const beneficiary = beneficiaries.find(b => b.id === id);
    if (beneficiary) {
      setDeleteConfirmation({
        isOpen: true,
        type: 'beneficiary',
        id,
        title: beneficiary.name
      });
    }
  };

  const confirmDelete = () => {
    const { type, id } = deleteConfirmation;
    
    switch (type) {
      case 'document':
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        break;
      case 'trust':
        setTrusts(prev => prev.filter(trust => trust.id !== id));
        break;
      case 'action':
        setActions(prev => prev.filter(action => action.id !== id));
        break;
      case 'beneficiary':
        setBeneficiaries(prev => prev.filter(beneficiary => beneficiary.id !== id));
        break;
    }
    
    setDeleteConfirmation({
      isOpen: false,
      type: 'document',
      id: '',
      title: ''
    });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      type: 'document',
      id: '',
      title: ''
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Estate Planning Details</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="legacy">Legacy Planning</TabsTrigger>
              <TabsTrigger value="contacts">Key Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estate Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm">Estate Value</h4>
                        <p className="text-2xl font-bold">$2,450,000</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Last Updated</h4>
                        <p>March 15, 2023</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Estate Executor</h4>
                      <p>Emma Smith (Daughter)</p>
                      <p className="text-sm text-muted-foreground">Secondary: Michael Smith (Son)</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Estate Attorney</h4>
                      <p>Sarah Johnson, Johnson & Associates</p>
                      <p className="text-sm text-muted-foreground">Contact: (555) 123-4567</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estate Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {beneficiaries.map((ben) => (
                        <div key={ben.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{ben.name}</p>
                            <p className="text-sm text-muted-foreground">{ben.relationship}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{ben.allocation}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legacy" className="space-y-6">
              {/* Estate Documents */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Estate Documents</CardTitle>
                  <Button onClick={() => setShowAddDocument(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="relative p-4 border rounded-lg bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="pr-8">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{doc.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              doc.status === 'Current' ? 'bg-green-100 text-green-800' :
                              doc.status === 'Outdated' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{doc.type}</p>
                          <p className="text-sm">{doc.location}</p>
                          <p className="text-sm text-muted-foreground">Last updated: {doc.lastUpdated}</p>
                        </div>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No documents added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trusts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Trusts</CardTitle>
                  <Button onClick={() => setShowAddTrust(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trust
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trusts.map((trust) => (
                      <div key={trust.id} className="relative p-4 border rounded-lg bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDeleteTrust(trust.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="pr-8">
                          <h4 className="font-medium mb-2">{trust.name}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Settlor:</span> {trust.settlor}
                            </div>
                            <div>
                              <span className="font-medium">Jurisdiction:</span> {trust.jurisdiction}
                            </div>
                            <div>
                              <span className="font-medium">Trustees:</span> {trust.trustees.join(', ')}
                            </div>
                            {trust.startDate && (
                              <div>
                                <span className="font-medium">Start Date:</span> {trust.startDate}
                              </div>
                            )}
                          </div>
                          {trust.beneficiaries.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Beneficiaries:</span>
                              <div className="mt-1 space-y-1">
                                {trust.beneficiaries.map((ben, index) => (
                                  <div key={index} className="text-sm flex justify-between">
                                    <span>{ben.name} ({ben.relationship})</span>
                                    <span>{ben.allocation}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {trust.notes && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Notes:</span>
                              <p className="text-sm text-muted-foreground">{trust.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {trusts.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No trusts added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Action Items</CardTitle>
                  <Button onClick={() => setShowAddAction(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {actions.map((action) => (
                      <div key={action.id} className="relative p-4 border rounded-lg bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDeleteAction(action.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="pr-8">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{action.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              action.priority === 'High' ? 'bg-red-100 text-red-800' :
                              action.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {action.priority}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span>Due: {action.dueDate}</span>
                            <span>Assigned to: {action.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {actions.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No action items added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Beneficiaries */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Beneficiaries</CardTitle>
                  <Button onClick={() => setShowAddBeneficiary(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Beneficiary
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {beneficiaries.map((beneficiary) => (
                      <div key={beneficiary.id} className="relative p-4 border rounded-lg bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="pr-8">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{beneficiary.name}</h4>
                            <span className="text-sm font-medium">{beneficiary.allocation}%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Relationship:</span> {beneficiary.relationship}
                            </div>
                            <div>
                              <span className="font-medium">Contact:</span> {beneficiary.contact}
                            </div>
                          </div>
                          {beneficiary.notes && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Notes:</span>
                              <p className="text-sm text-muted-foreground">{beneficiary.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {beneficiaries.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No beneficiaries added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Estate Attorney</h4>
                      <p>Sarah Johnson</p>
                      <p className="text-sm">Johnson & Associates</p>
                      <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">sarah@johnsonlaw.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Financial Advisor</h4>
                      <p>Robert Chen</p>
                      <p className="text-sm">Wealth Management Partners</p>
                      <p className="text-sm text-muted-foreground">(555) 987-6543</p>
                      <p className="text-sm text-muted-foreground">rchen@wealthmp.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Accountant</h4>
                      <p>Maria Rodriguez</p>
                      <p className="text-sm">Rodriguez Tax Services</p>
                      <p className="text-sm text-muted-foreground">(555) 456-7890</p>
                      <p className="text-sm text-muted-foreground">maria@rodrigueztax.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Insurance Agent</h4>
                      <p>David Wilson</p>
                      <p className="text-sm">Wilson Insurance Group</p>
                      <p className="text-sm text-muted-foreground">(555) 789-0123</p>
                      <p className="text-sm text-muted-foreground">david@wilsoninsurance.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmation.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Document Dialog */}
      <Dialog open={showAddDocument} onOpenChange={setShowAddDocument}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Estate Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Document Type</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newDocument.type}
                onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={newDocument.status}
                onChange={(e) => setNewDocument({ ...newDocument, status: e.target.value as 'Current' | 'Outdated' | 'In Progress' })}
              >
                <option value="Current">Current</option>
                <option value="Outdated">Outdated</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newDocument.location}
                onChange={(e) => setNewDocument({ ...newDocument, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Updated</label>
              <input
                type="date"
                className="w-full p-2 border rounded mt-1"
                value={newDocument.lastUpdated}
                onChange={(e) => setNewDocument({ ...newDocument, lastUpdated: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDocument(false)}>Cancel</Button>
              <Button onClick={handleAddDocument}>Add Document</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Trust Dialog */}
      <Dialog open={showAddTrust} onOpenChange={setShowAddTrust}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trust</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Trust Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newTrust.name}
                onChange={(e) => setNewTrust({ ...newTrust, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Settlor</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newTrust.settlor}
                onChange={(e) => setNewTrust({ ...newTrust, settlor: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Jurisdiction</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newTrust.jurisdiction}
                onChange={(e) => setNewTrust({ ...newTrust, jurisdiction: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded mt-1"
                value={newTrust.startDate}
                onChange={(e) => setNewTrust({ ...newTrust, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="w-full p-2 border rounded mt-1"
                value={newTrust.notes}
                onChange={(e) => setNewTrust({ ...newTrust, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddTrust(false)}>Cancel</Button>
              <Button onClick={handleAddTrust}>Add Trust</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Action Dialog */}
      <Dialog open={showAddAction} onOpenChange={setShowAddAction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Action Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newAction.title}
                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full p-2 border rounded mt-1"
                value={newAction.description}
                onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={newAction.priority}
                onChange={(e) => setNewAction({ ...newAction, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded mt-1"
                value={newAction.dueDate}
                onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Assigned To</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newAction.assignedTo}
                onChange={(e) => setNewAction({ ...newAction, assignedTo: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddAction(false)}>Cancel</Button>
              <Button onClick={handleAddAction}>Add Action</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Beneficiary Dialog */}
      <Dialog open={showAddBeneficiary} onOpenChange={setShowAddBeneficiary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Beneficiary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newBeneficiary.name}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Relationship</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newBeneficiary.relationship}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, relationship: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Allocation (%)</label>
              <input
                type="number"
                className="w-full p-2 border rounded mt-1"
                value={newBeneficiary.allocation}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, allocation: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contact</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={newBeneficiary.contact}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, contact: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="w-full p-2 border rounded mt-1"
                value={newBeneficiary.notes}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddBeneficiary(false)}>Cancel</Button>
              <Button onClick={handleAddBeneficiary}>Add Beneficiary</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
