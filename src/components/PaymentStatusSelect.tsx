
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentStatusSelectProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const PaymentStatusSelect = ({ status, onStatusChange }: PaymentStatusSelectProps) => {
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue>{status}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Paid">Paid</SelectItem>
        <SelectItem value="Yet To Be Paid">Yet To Be Paid</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentStatusSelect;
