import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { lpoService } from "@/services/lpoService";
import { vendorService } from "@/services/vendorService";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import Header from "@/components/Header";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check } from "lucide-react";
import { LpoItem, Vendor } from "@/types";
import { toast } from "sonner";
import { VendorSelection } from "@/components/lpo/VendorSelection";
import { ItemsEntry } from "@/components/lpo/ItemsEntry";
import { ReviewSubmit } from "@/components/lpo/ReviewSubmit";
import { useVendors } from "@/hooks/useVendors";
import { format } from 'date-fns';

const LpoCreate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { vendors, setVendors } = useVendors();
  
  const [selectedVendor, setSelectedVendor] = useState("");
  const [items, setItems] = useState<LpoItem[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lpoStatus, setLpoStatus] = useState<string>("Pending");
  const [step, setStep] = useState<number>(1);
  const [paymentPercentage, setPaymentPercentage] = useState(0);
  const [notes, setNotes] = useState("");
  
  const [createdLpoId, setCreatedLpoId] = useState<string>("");
  const [createdLpoNumber, setCreatedLpoNumber] = useState<string>("");
  
  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
  };
  
  const handleCreateVendor = async (vendorData: Omit<Vendor, "id">) => {
    try {
      const newVendor = await vendorService.createVendor(vendorData);
      setVendors([...vendors, newVendor]);
      setSelectedVendor(newVendor.id);
      toast.success(`Vendor "${newVendor.name}" added successfully`);
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast.error('Failed to create vendor');
    }
  };
  
  const addItem = (newItem: Omit<LpoItem, "id">) => {
    setItems([...items, { ...newItem, id: `item_${Date.now()}` }]);
  };
  
  const updateItem = (updatedItem: LpoItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };
  
  const handleSubmit = async () => {
    try {
      if (!selectedVendor || items.length === 0) return;

      const currentVendor = vendors.find(v => v.id === selectedVendor);
      if (!currentVendor) return;

      const lpoData = {
        vendorId: selectedVendor,
        items: items,
        totalAmount: items.reduce((total, item) => total + item.totalPrice, 0),
        additionalPercentage: paymentPercentage,
        additionalNotes: notes,
      };

      const lpoId = await lpoService.createLpo(lpoData);
      setCreatedLpoId(lpoId);
      
      // Get the created LPO to display its generated number
      const { data: createdLpo } = await supabase
        .from('lpos')
        .select('lpo_number')
        .eq('id', lpoId)
        .single();
        
      if (createdLpo?.lpo_number) {
        setCreatedLpoNumber(createdLpo.lpo_number);
      }
      
      setShowSuccessDialog(true);
      
      const statuses = ["Pending", "Approved", "Rejected"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setLpoStatus(randomStatus);
    } catch (error) {
      console.error('Error creating LPO:', error);
      toast.error('Failed to create LPO. Please try again.');
    }
  };
  
  const nextStep = () => {
    if (step === 1 && !selectedVendor) {
      return;
    }
    if (step === 2 && items.length === 0) {
      return;
    }
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const finishProcess = () => {
    setShowSuccessDialog(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Raise LPO</h1>
          <p className="text-gray-600 mt-2">Create a new Local Purchase Order</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}>1</span>
              <span className="text-sm font-medium">Select Vendor</span>
            </div>
            <div className="border-b border-gray-300 flex-1 mx-4" />
            <div className="flex items-center space-x-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}>2</span>
              <span className="text-sm font-medium">Enter Items</span>
            </div>
            <div className="border-b border-gray-300 flex-1 mx-4" />
            <div className="flex items-center space-x-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}>3</span>
              <span className="text-sm font-medium">Review & Submit</span>
            </div>
          </div>
          
          {step === 1 && (
            <VendorSelection
              vendors={vendors}
              selectedVendor={selectedVendor}
              onVendorChange={handleVendorChange}
              onCreateVendor={handleCreateVendor}
              onNext={nextStep}
            />
          )}
          
          {step === 2 && (
            <ItemsEntry
              items={items}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          
          {step === 3 && (
            <ReviewSubmit
              vendor={vendors.find(v => v.id === selectedVendor)!}
              items={items}
              paymentPercentage={paymentPercentage}
              onPaymentPercentageChange={setPaymentPercentage}
              notes={notes}
              onNotesChange={setNotes}
              onSubmit={handleSubmit}
              onBack={prevStep}
            />
          )}
        </div>
      </main>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              LPO Submitted Successfully
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">
                Your LPO has been submitted successfully and is now {lpoStatus.toLowerCase()}.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <p><span className="font-medium">LPO ID:</span> {createdLpoNumber || `LPO-${Math.floor(Math.random() * 10000)}`}</p>
                  <p><span className="font-medium">Date:</span> {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                  <p><span className="font-medium">Vendor:</span> {
                    vendors.find(v => v.id === selectedVendor)?.name
                  }</p>
                  <p><span className="font-medium">Status:</span> <span className={`font-medium ${
                    lpoStatus === "Approved" 
                      ? "text-green-600" 
                      : lpoStatus === "Rejected" 
                      ? "text-red-600" 
                      : "text-amber-600"
                  }`}>{lpoStatus}</span></p>
                  <p><span className="font-medium">Total Amount:</span> {formatCurrency(items.reduce((total, item) => total + item.totalPrice, 0))}</p>
                  <p><span className="font-medium">Items:</span> {items.length}</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={finishProcess}>
              Back to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LpoCreate;
