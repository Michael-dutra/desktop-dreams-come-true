import { User, MapPin, Heart, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { X, Plus, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ClientInfo = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientData, setClientData] = useState({
    fullName: "Michael Smith",
    dateOfBirth: "1989-06-15",
    province: "Ontario",
    maritalStatus: "Married",
    occupation: "Business Owner",
    email: "michael.smith@email.com",
    phone: "+1 (416) 555-0123",
    address: "123 Main Street, Toronto, ON M5V 3A8",
    personalNotes: "Business owner, planning estate freeze",
    familyMembers: [
      { id: 1, name: "Sarah Smith", relation: "Spouse", dateOfBirth: "1991-08-22" },
      { id: 2, name: "Emma Smith", relation: "Daughter", dateOfBirth: "2015-03-10" },
      { id: 3, name: "Liam Smith", relation: "Son", dateOfBirth: "2017-11-05" }
    ]
  });

  const [customFields, setCustomFields] = useState([]);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveChanges = () => {
    // Here you would typically save to your backend
    setIsEditModalOpen(false);
  };

  const addFamilyMember = () => {
    const newMember = {
      id: Date.now(),
      name: "",
      relation: "",
      dateOfBirth: ""
    };
    setClientData({
      ...clientData,
      familyMembers: [...clientData.familyMembers, newMember]
    });
  };

  const removeFamilyMember = (id) => {
    setClientData({
      ...clientData,
      familyMembers: clientData.familyMembers.filter(member => member.id !== id)
    });
  };

  const updateFamilyMember = (id, field, value) => {
    setClientData({
      ...clientData,
      familyMembers: clientData.familyMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    });
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      label: "",
      value: ""
    };
    setCustomFields([...customFields, newField]);
  };

  const removeCustomField = (id) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const updateCustomField = (id, field, value) => {
    setCustomFields(customFields.map(customField =>
      customField.id === id ? { ...customField, [field]: value } : customField
    ));
  };

  return (
    <>
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-foreground">Client: {clientData.fullName}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold text-foreground">{calculateAge(clientData.dateOfBirth)} years</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Province</p>
                  <p className="font-semibold text-foreground">{clientData.province}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Family</p>
                  <p className="font-semibold text-foreground">{clientData.maritalStatus}, {clientData.familyMembers.filter(m => m.relation.toLowerCase().includes('child') || m.relation.toLowerCase().includes('son') || m.relation.toLowerCase().includes('daughter')).length} kids</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client Profile – {clientData.fullName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={clientData.fullName}
                  onChange={(e) => setClientData({ ...clientData, fullName: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={clientData.dateOfBirth}
                  onChange={(e) => setClientData({ ...clientData, dateOfBirth: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="province">Province</Label>
                <Select value={clientData.province} onValueChange={(value) => setClientData({ ...clientData, province: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alberta">Alberta</SelectItem>
                    <SelectItem value="British Columbia">British Columbia</SelectItem>
                    <SelectItem value="Manitoba">Manitoba</SelectItem>
                    <SelectItem value="New Brunswick">New Brunswick</SelectItem>
                    <SelectItem value="Newfoundland and Labrador">Newfoundland and Labrador</SelectItem>
                    <SelectItem value="Northwest Territories">Northwest Territories</SelectItem>
                    <SelectItem value="Nova Scotia">Nova Scotia</SelectItem>
                    <SelectItem value="Nunavut">Nunavut</SelectItem>
                    <SelectItem value="Ontario">Ontario</SelectItem>
                    <SelectItem value="Prince Edward Island">Prince Edward Island</SelectItem>
                    <SelectItem value="Quebec">Quebec</SelectItem>
                    <SelectItem value="Saskatchewan">Saskatchewan</SelectItem>
                    <SelectItem value="Yukon">Yukon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select value={clientData.maritalStatus} onValueChange={(value) => setClientData({ ...clientData, maritalStatus: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Common-law">Common-law</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={clientData.occupation}
                  onChange={(e) => setClientData({ ...clientData, occupation: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={clientData.address}
                onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
              />
            </div>

            {/* Family Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Family Members</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFamilyMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Family Member
                </Button>
              </div>
              
              <div className="space-y-3">
                {clientData.familyMembers.map((member) => (
                  <div key={member.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="Full name"
                        value={member.name}
                        onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Relation</Label>
                      <Input
                        placeholder="e.g., Spouse, Daughter"
                        value={member.relation}
                        onChange={(e) => updateFamilyMember(member.id, 'relation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Date of Birth</Label>
                      <Input
                        type="date"
                        value={member.dateOfBirth}
                        onChange={(e) => updateFamilyMember(member.id, 'dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center space-x-2">
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                              <span>Are you sure you want to delete this family member?</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove {member.name || 'this family member'} from the client profile.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeFamilyMember(member.id)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div>
                <Label>Custom Fields</Label>
                <div className="space-y-3 mt-2">
                  {customFields.map((field) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
                      <div>
                        <Label className="text-xs">Field Label</Label>
                        <Input
                          placeholder="Field name"
                          value={field.label}
                          onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Value</Label>
                        <Input
                          placeholder="Field value"
                          value={field.value}
                          onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <span>Are you sure you want to delete this custom field?</span>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently remove the custom field "{field.label || 'Untitled Field'}" from the client profile.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeCustomField(field.id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button type="button" variant="outline" onClick={addCustomField}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>

            {/* Personal Notes */}
            <div>
              <Label htmlFor="personalNotes">Personal Notes</Label>
              <Textarea
                id="personalNotes"
                placeholder="e.g., Business owner, planning estate freeze"
                value={clientData.personalNotes}
                onChange={(e) => setClientData({ ...clientData, personalNotes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientInfo;
