
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { LpoItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ItemsEntryProps {
  items: LpoItem[];
  onAddItem: (item: Omit<LpoItem, "id">) => void;
  onUpdateItem: (item: LpoItem) => void;
  onRemoveItem: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ItemsEntry = ({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onNext,
  onBack,
}: ItemsEntryProps) => {
  const [currentItem, setCurrentItem] = useState<Partial<LpoItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });

  const calculateItemTotal = () => {
    return (currentItem.quantity || 0) * (currentItem.unitPrice || 0);
  };

  const handleAddItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      return;
    }

    onAddItem({
      description: currentItem.description || "",
      quantity: currentItem.quantity || 0,
      unitPrice: currentItem.unitPrice || 0,
      totalPrice: calculateItemTotal(),
    });

    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Item Details</CardTitle>
        <CardDescription>Add items to your LPO</CardDescription>
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
            onClick={handleAddItem}
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
                        onChange={(e) => onUpdateItem({
                          ...item,
                          quantity: parseInt(e.target.value) || 0,
                          totalPrice: (parseInt(e.target.value) || 0) * item.unitPrice
                        })}
                        className="w-20 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => onUpdateItem({
                          ...item,
                          unitPrice: parseFloat(e.target.value) || 0,
                          totalPrice: item.quantity * (parseFloat(e.target.value) || 0)
                        })}
                        className="w-28 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={items.length === 0}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};
