
import { LpoStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LpoStatusSelectProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const LpoStatusSelect = ({ status, onStatusChange }: LpoStatusSelectProps) => {
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue>{status}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Approved">Approved</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LpoStatusSelect;
