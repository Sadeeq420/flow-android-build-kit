import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VendorForm } from "@/components/VendorForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { Vendor } from "@/types";
interface VendorSelectionProps {
  vendors: Vendor[];
  selectedVendor: string;
  onVendorChange: (value: string) => void;
  onCreateVendor: (vendorData: Omit<Vendor, "id">) => void;
  onNext: () => void;
}
export const VendorSelection = ({
  vendors,
  selectedVendor,
  onVendorChange,
  onCreateVendor,
  onNext
}: VendorSelectionProps) => {
  const [showNewVendorDialog, setShowNewVendorDialog] = useState(false);
  return <Card>
      <CardHeader>
        <CardTitle>Select Supplier</CardTitle>
        <CardDescription>Choose a supplier from the list or create a new one</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="vendor">Supplier</Label>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setShowNewVendorDialog(true)}>
                <UserPlus className="h-4 w-4" />
                <span>Add Supplier</span>
              </Button>
            </div>
            <Select value={selectedVendor} onValueChange={onVendorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map(vendor => <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          {selectedVendor && <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Supplier Details</h3>
              {vendors.filter(vendor => vendor.id === selectedVendor).map(vendor => <div key={vendor.id} className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {vendor.name}</p>
                    <p><span className="font-medium">Email:</span> {vendor.email}</p>
                    <p><span className="font-medium">Phone:</span> {vendor.phone}</p>
                    <p><span className="font-medium">Address:</span> {vendor.address}</p>
                    {vendor.bank_name && <>
                        <p><span className="font-medium">Bank Name:</span> {vendor.bank_name}</p>
                        <p><span className="font-medium">Account Number:</span> {vendor.account_number}</p>
                        <p><span className="font-medium">Account Name:</span> {vendor.account_name}</p>
                      </>}
                  </div>)}
            </div>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} disabled={!selectedVendor}>
          Continue
        </Button>
      </CardFooter>

      <Dialog open={showNewVendorDialog} onOpenChange={setShowNewVendorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter the details for the new supplier below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <VendorForm onSubmit={vendorData => {
            onCreateVendor(vendorData);
            setShowNewVendorDialog(false);
          }} onCancel={() => setShowNewVendorDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </Card>;
};