import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Building, User, X } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface EstateDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EstateDetailDialog = ({ isOpen, onClose }: EstateDetailDialogProps) => {
  const [estateDocuments, setEstateDocuments] = useState(["Will", "Trust", "Power of Attorney"]);
  const [trustStructures, setTrustStructures] = useState(["Living Trust", "Irrevocable Trust"]);
  const [documentActions, setDocumentActions] = useState(["Review", "Update", "Execute"]);
  const [beneficiaries, setBeneficiaries] = useState(["John Doe", "Jane Smith"]);

  const [newDocument, setNewDocument] = useState("");
  const [newTrust, setNewTrust] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newBeneficiary, setNewBeneficiary] = useState("");

  const addEstateDocument = () => {
    if (newDocument) {
      setEstateDocuments([...estateDocuments, newDocument]);
      setNewDocument("");
    }
  };

  const addTrustStructure = () => {
    if (newTrust) {
      setTrustStructures([...trustStructures, newTrust]);
      setNewTrust("");
    }
  };

  const addDocumentAction = () => {
    if (newAction) {
      setDocumentActions([...documentActions, newAction]);
      setNewAction("");
    }
  };

  const addBeneficiary = () => {
    if (newBeneficiary) {
      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setNewBeneficiary("");
    }
  };

  const removeEstateDocument = (index: number) => {
    const newDocuments = [...estateDocuments];
    newDocuments.splice(index, 1);
    setEstateDocuments(newDocuments);
  };

  const removeTrustStructure = (index: number) => {
    const newTrusts = [...trustStructures];
    newTrusts.splice(index, 1);
    setTrustStructures(newTrusts);
  };

  const removeDocumentAction = (index: number) => {
    const newActions = [...documentActions];
    newActions.splice(index, 1);
    setDocumentActions(newActions);
  };

  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries.splice(index, 1);
    setBeneficiaries(newBeneficiaries);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Estate Plan Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="legacy">Legacy</TabsTrigger>
            <TabsTrigger value="digital">Digital Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <p>This section provides a high-level overview of your estate plan.</p>
          </TabsContent>

          <TabsContent value="legacy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estate Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Estate Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {estateDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 p-1">
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove "{doc}" from your estate documents. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeEstateDocument(index)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Document name"
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addEstateDocument} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Structures */}
              <Card>
                <CardHeader>
                  <CardTitle>Trust Structures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trustStructures.map((trust, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">{trust}</span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 p-1">
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove "{trust}" from your trust structures. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeTrustStructure(index)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Trust structure"
                      value={newTrust}
                      onChange={(e) => setNewTrust(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addTrustStructure} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Document Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {documentActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{action}</span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 p-1">
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove "{action}" from your document actions. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeDocumentAction(index)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Document action"
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addDocumentAction} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Beneficiaries */}
              <Card>
                <CardHeader>
                  <CardTitle>Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {beneficiaries.map((beneficiary, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{beneficiary}</span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 p-1">
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove "{beneficiary}" from your beneficiaries list. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeBeneficiary(index)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Beneficiary name"
                      value={newBeneficiary}
                      onChange={(e) => setNewBeneficiary(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addBeneficiary} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="digital" className="space-y-6">
            <p>Manage your digital assets and online accounts.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
