
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { LpoItem, Vendor } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ReviewSubmitProps {
  vendor: Vendor;
  items: LpoItem[];
  paymentPercentage: number;
  onPaymentPercentageChange: (value: number) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const ReviewSubmit = ({
  vendor,
  items,
  paymentPercentage,
  onPaymentPercentageChange,
  notes,
  onNotesChange,
  onSubmit,
  onBack,
}: ReviewSubmitProps) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateTotalWithPercentage = () => {
    const baseTotal = calculateTotal();
    const percentageAmount = (paymentPercentage / 100) * baseTotal;
    return baseTotal + percentageAmount;
  };

  return (
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
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {vendor.name}</p>
                <p><span className="font-medium">Email:</span> {vendor.email}</p>
                <p><span className="font-medium">Phone:</span> {vendor.phone}</p>
                <p><span className="font-medium">Address:</span> {vendor.address}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">LPO Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
              <p><span className="font-medium">Total Items:</span> {items.length}</p>
              <p><span className="font-medium">Base Amount:</span> {formatCurrency(calculateTotal())}</p>
              <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
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
                <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(calculateTotal())}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional information..."
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
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
                    onChange={(e) => onPaymentPercentageChange(parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount (with percentage):</span>
                <span>{formatCurrency(calculateTotalWithPercentage())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Additional Amount:</span>
                <span>{formatCurrency(calculateTotalWithPercentage() - calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit}>
          Submit LPO
        </Button>
      </CardFooter>
    </Card>
  );
};
