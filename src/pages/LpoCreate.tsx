import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { lpoService } from "@/services/lpoService";
import { vendorService } from "@/services/vendorService";
import Header from "@/components/Header";
import { VendorForm } from "@/components/VendorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Check, UserPlus } from "lucide-react";
import { mockVendors, addVendor } from "@/mockData";
import { LpoItem, Vendor, PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const LpoCreate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [items, setItems] = useState<LpoItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<LpoItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
  
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showNewVendorDialog, setShowNewVendorDialog] = useState(false);
  const [lpoStatus, setLpoStatus] = useState<string>("Pending");
  
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  
  const [step, setStep] = useState<number>(1);
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Yet To Be Paid");
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentPercentage, setPaymentPercentage] = useState(0);
  
  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
    const vendor = vendors.find((v) => v.id === value);
    if (vendor) {
      setVendorName(vendor.name);
    }
  };
  
  const calculateItemTotal = () => {
    return (currentItem.quantity || 0) * (currentItem.unitPrice || 0);
  };
  
  const addItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      return;
    }
    
    const newItem: LpoItem = {
      id: `item_${Date.now()}`,
      description: currentItem.description || "",
      quantity: currentItem.quantity || 0,
      unitPrice: currentItem.unitPrice || 0,
      totalPrice: calculateItemTotal(),
    };
    
    setItems([...items, newItem]);
    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateTotalWithPercentage = () => {
    const baseTotal = calculateTotal();
    const percentageAmount = (paymentPercentage / 100) * baseTotal;
    return baseTotal + percentageAmount;
  };
  
  const handleCreateVendor = (vendorData: Omit<Vendor, "id">) => {
    const newVendor = addVendor(vendorData);
    setVendors([...vendors, newVendor]);
    
    setSelectedVendor(newVendor.id);
    setVendorName(newVendor.name);
    
    setShowNewVendorDialog(false);
    
    toast.success(`Vendor "${newVendor.name}" added successfully`);
  };
  
  const handleSubmit = async () => {
    try {
      if (!selectedVendor || items.length === 0) return;

      const lpoData = {
        vendorId: selectedVendor,
        items: items,
        totalAmount: calculateTotal(),
        additionalPercentage: paymentPercentage,
        additionalNotes: "",
      };

      await lpoService.createLpo(lpoData);
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

  const handleQuantityChange = (item: LpoItem, newQuantity: number) => {
    setItems(items.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          quantity: newQuantity,
          totalPrice: newQuantity * i.unitPrice
        };
      }
      return i;
    }));
  };

  const handleUnitPriceChange = (item: LpoItem, newPrice: number) => {
    setItems(items.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          unitPrice: newPrice,
          totalPrice: i.quantity * newPrice
        };
      }
      return i;
    }));
  };

  const handlePercentageChange = (value: number) => {
    setPaymentPercentage(value);
    const totalWithPercentage = calculateTotalWithPercentage();
    setPaidAmount(totalWithPercentage);
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
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>1</span>
              <span className="text-sm font-medium">Select Vendor</span>
            </div>
            <div className="border-b border-gray-300 flex-1 mx-4" />
            <div className="flex items-center space-x-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>2</span>
              <span className="text-sm font-medium">Enter Items</span>
            </div>
            <div className="border-b border-gray-300 flex-1 mx-4" />
            <div className="flex items-center space-x-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>3</span>
              <span className="text-sm font-medium">Review & Submit</span>
            </div>
          </div>
          
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Vendor</CardTitle>
                <CardDescription>Choose a vendor from the list or create a new one</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vendor">Vendor</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => setShowNewVendorDialog(true)}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Add Vendor</span>
                      </Button>
                    </div>
                    <Select value={selectedVendor} onValueChange={handleVendorChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedVendor && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Vendor Details</h3>
                      {vendors
                        .filter((vendor) => vendor.id === selectedVendor)
                        .map((vendor) => (
                          <div key={vendor.id} className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {vendor.name}</p>
                            <p><span className="font-medium">Email:</span> {vendor.email}</p>
                            <p><span className="font-medium">Phone:</span> {vendor.phone}</p>
                            <p><span className="font-medium">Address:</span> {vendor.address}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={nextStep} disabled={!selectedVendor}>
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Enter Item Details</CardTitle>
                <CardDescription>Add items to your LPO for {vendorName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Item Description</Label>
                    <Input
                      id="description"
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                      placeholder="e.g. Office Chairs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentItem.unitPrice}
                      onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Total for this item: {formatCurrency(calculateItemTotal())}
                  </div>
                  <Button
                    size="sm"
                    onClick={addItem}
                    disabled={!currentItem.description || !currentItem.quantity || !currentItem.unitPrice}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
                
                {items.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Added Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
                                className="w-20 text-right"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => handleUnitPriceChange(item, parseFloat(e.target.value) || 0)}
                                className="w-28 text-right"
                              />
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(calculateTotal())}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={items.length === 0}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit LPO</CardTitle>
                <CardDescription>Review your LPO details before submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Vendor Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {mockVendors
                        .filter((vendor) => vendor.id === selectedVendor)
                        .map((vendor) => (
                          <div key={vendor.id} className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {vendor.name}</p>
                            <p><span className="font-medium">Email:</span> {vendor.email}</p>
                            <p><span className="font-medium">Phone:</span> {vendor.phone}</p>
                            <p><span className="font-medium">Address:</span> {vendor.address}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">LPO Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Total Items:</span> {items.length}
                      </p>
                      <p>
                        <span className="font-medium">Total Amount:</span> {formatCurrency(calculateTotal())}
                      </p>
                      <p>
                        <span className="font-medium">Date Created:</span> {new Date().toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Created By:</span> {user?.name}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
                              className="w-20 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleUnitPriceChange(item, parseFloat(e.target.value) || 0)}
                              className="w-28 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(calculateTotal())}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional information..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Base Amount:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="percentage" className="text-sm font-medium">Additional Percentage:</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="percentage"
                          type="number"
                          min={0}
                          max={100}
                          value={paymentPercentage}
                          onChange={(e) => handlePercentageChange(parseFloat(e.target.value) || 0)}
                          className="w-32"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paidAmount" className="text-sm font-medium">Total Amount (with percentage):</Label>
                      <Input
                        id="paidAmount"
                        type="number"
                        min={calculateTotal()}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                        className="w-full"
                        disabled
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Additional Amount:</span>
                      <span>{formatCurrency(paidAmount - calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>
                  Submit LPO
                </Button>
              </CardFooter>
            </Card>
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
                  <p><span className="font-medium">LPO ID:</span> LPO{Math.floor(Math.random() * 10000)}</p>
                  <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                  <p><span className="font-medium">Vendor:</span> {vendorName}</p>
                  <p><span className="font-medium">Status:</span> <span className={`font-medium ${
                    lpoStatus === "Approved" 
                      ? "text-green-600" 
                      : lpoStatus === "Rejected" 
                      ? "text-red-600" 
                      : "text-amber-600"
                  }`}>{lpoStatus}</span></p>
                  <p><span className="font-medium">Total Amount:</span> {formatCurrency(calculateTotal())}</p>
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

      <Dialog open={showNewVendorDialog} onOpenChange={setShowNewVendorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>
              Enter the details for the new vendor below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <VendorForm 
              onSubmit={handleCreateVendor}
              onCancel={() => setShowNewVendorDialog(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LpoCreate;
