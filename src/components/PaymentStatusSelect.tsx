
import { PaymentStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentStatusSelectProps {
  status: PaymentStatus;
  onStatusChange: (newStatus: PaymentStatus) => void;
}

const PaymentStatusSelect = ({ status, onStatusChange }: PaymentStatusSelectProps) => {
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue>{status}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Paid">Paid</SelectItem>
        <SelectItem value="Unpaid">Unpaid</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentStatusSelect;
