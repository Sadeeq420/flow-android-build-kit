
import { Lpo } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const pdfService = {
  /**
   * Generate PDF for an LPO and open it in a new tab
   * 
   * @param lpo The LPO data to generate PDF from
   * @param email The admin email (for reference)
   */
  async exportLpoToDrive(lpo: Lpo, email: string): Promise<boolean> {
    try {
      // Check if user is authenticated
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("You must be logged in to export documents");
        return false;
      }
      
      // Generate PDF content as HTML (in a real app, you'd use a proper PDF library)
      const pdfContent = this.generateLpoPdfContent(lpo);
      
      // Create a blob and open in new tab
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new tab
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.document.title = `LPO-${lpo.lpoNumber}.pdf`;
        toast.success(`LPO PDF generated and opened`);
        
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return true;
      } else {
        toast.error("Please allow popups to view the PDF");
        return false;
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate LPO PDF");
      return false;
    }
  },

  /**
   * Generate HTML content for LPO PDF (styled to match the reference image)
   */
  generateLpoPdfContent(lpo: Lpo): string {
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>LPO-${lpo.lpoNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #4A90E2; }
        .company-details { text-align: right; font-size: 10px; }
        .title { text-align: center; margin: 20px 0; }
        .lpo-details { display: flex; justify-content: space-between; margin: 20px 0; }
        .vendor-details, .lpo-info { width: 48%; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; font-weight: bold; }
        .terms { margin-top: 20px; font-size: 10px; }
        .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
        .total-row { font-weight: bold; background-color: #f9f9f9; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">QUMECS</div>
        <div class="company-details">
            Registered Address:<br>
            6A Gwani Muktar<br>
            Maiduguri, Borno State<br>
            Nigeria<br>
            www.qumecs.com
        </div>
    </div>
    
    <div style="border: 2px solid #000; padding: 20px;">
        <h2 class="title">LOCAL PURCHASE ORDER</h2>
        
        <div class="lpo-details">
            <div class="vendor-details">
                <strong>TO:</strong><br>
                ${lpo.vendorName}<br>
                <strong>ACCOUNT DETAILS:</strong><br>
                Account Name: [Account Name]<br>
                Access Bank, Account No.: [Account Number]
            </div>
            <div class="lpo-info">
                <strong>WULARI OFFICE</strong><br>
                LPO No: ${lpo.lpoNumber}<br>
                Date: ${currentDate}<br>
                INTM. GROUP HQ<br>
                Tel: [Phone]<br>
                Reference: DISCLOSED AND APPROVED BY EC
            </div>
        </div>
        
        <p><strong>Subject:</strong> The following goods subject to the terms and conditions mentioned below.</p>
        
        <table>
            <thead>
                <tr>
                    <th>S/No.</th>
                    <th>Items Description</th>
                    <th>Delivery</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Rate (₦)</th>
                    <th>Amount(₦)</th>
                </tr>
            </thead>
            <tbody>
                ${lpo.items.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.description}</td>
                    <td>Fortikeem</td>
                    <td>${item.quantity}</td>
                    <td>DRUM</td>
                    <td>${item.unitPrice.toLocaleString()}</td>
                    <td>${item.totalPrice.toLocaleString()}</td>
                </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="6"><strong>TOTAL</strong></td>
                    <td><strong>₦${lpo.totalAmount.toLocaleString()}</strong></td>
                </tr>
            </tbody>
        </table>
        
        <div class="terms">
            <strong>Terms & Condition</strong><br>
            Reference: Same as above<br>
            Price: Above indicated price shall remain firm throughout supply of ordered as per schedule given to you.<br>
            Quality: Supply must be in good quality and meets our requirement standards.<br>
            Address & Contact Person @ Respective Site: NIL ALL MUKERIA 0803508746<br>
            Rejection of Materials: Any discrepancy is found in respect of quality you will have to take the material back from our site at your own cost.<br>
            Taxes: All rates mentioned above is inclusive of all taxes and any other duties...<br>
            Packing & forwarding: Your carrier should carry delivery invoice along with material Acknowledgement from Site<br>
            Guarantee/Warranty: You will have to take back your material against any QUALITY defect.<br>
            Payment Terms: PAYMENT TO BE MADE AFTER DELIVERY<br>
        </div>
        
        <div class="signature-section">
            <div>
                For How to deliver the above ordered visit to our address<br>
                mentioned above.
            </div>
            <div>
                For: QUMECS NIGERIA LIMITED<br><br><br>
                _________________<br>
                Signature
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 10px;">
            SA Gwani Muktar Mobil GRA, Kaduna, Kaduna State
        </div>
    </div>
</body>
</html>`;
  }
};
