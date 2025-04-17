import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
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
import { Plus, Trash2, Check } from "lucide-react";
import { mockVendors } from "@/mockData";
import { LpoItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

const LpoCreate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [items, setItems] = useState<LpoItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<LpoItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
  
  // Dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lpoStatus, setLpoStatus] = useState<string>("Pending");
  
  // Step state
  const [step, setStep] = useState<number>(1);
  
  // Handle vendor selection
  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
    const vendor = mockVendors.find((v) => v.id === value);
    if (vendor) {
      setVendorName(vendor.name);
    }
  };
  
  // Calculate total price for current item
  const calculateItemTotal = () => {
    return (currentItem.quantity || 0) * (currentItem.unitPrice || 0);
  };
  
  // Add item to list
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
  
  // Remove item from list
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };
  
  // Calculate total LPO amount
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };
  
  // Submit LPO
  const handleSubmit = () => {
    // In a real app, this would send data to a backend
    // For demo, we're just showing a success dialog
    setShowSuccessDialog(true);
    
    // Randomly assign a status for demo purposes
    const statuses = ["Pending", "Approved", "Rejected"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setLpoStatus(randomStatus);
  };
  
  // Go to next step
  const nextStep = () => {
    if (step === 1 && !selectedVendor) {
      return; // Don't proceed without a vendor
    }
    if (step === 2 && items.length === 0) {
      return; // Don't proceed without items
    }
    setStep(step + 1);
  };
  
  // Go to previous step
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Finish process
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
                <CardDescription>Choose a vendor from the list</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor</Label>
                    <Select value={selectedVendor} onValueChange={handleVendorChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVendors.map((vendor) => (
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
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
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
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
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
    </div>
  );
};

export default LpoCreate;
