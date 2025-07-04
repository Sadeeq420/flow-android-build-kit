
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
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 20px; 
            font-size: 12px; 
            line-height: 1.4;
            color: #333;
        }
        .header-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px 30px;
            margin: -20px -20px 30px -20px;
            border-bottom: 3px solid #6c757d;
            position: relative;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            max-width: 100%;
        }
        .logo-section {
            flex: 1;
            display: flex;
            align-items: center;
        }
        .logo-design {
            position: relative;
            margin-right: 15px;
        }
        .logo-curve {
            width: 60px;
            height: 40px;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            border-radius: 50px 50px 0 50px;
            position: absolute;
            top: -5px;
            left: -5px;
            z-index: 1;
        }
        .logo-text {
            position: relative;
            z-index: 2;
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 28px;
            letter-spacing: 2px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .logo-subtitle {
            font-size: 11px;
            color: #6c757d;
            text-align: center;
            margin-top: 5px;
            font-weight: 600;
            letter-spacing: 1px;
        }
        .middle-address {
            flex: 1;
            text-align: center;
            font-size: 11px;
            color: #495057;
            padding: 0 20px;
            line-height: 1.6;
        }
        .company-details {
            flex: 1;
            text-align: right;
            font-size: 11px;
            color: #495057;
            line-height: 1.6;
        }
        .company-details strong {
            color: #2c3e50;
            font-size: 12px;
        }
        .title { 
            text-align: center; 
            margin: 30px 0; 
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .lpo-details { 
            display: flex; 
            justify-content: space-between; 
            margin: 25px 0;
            gap: 30px;
        }
        .vendor-details, .lpo-info { 
            flex: 1;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        .vendor-details h4, .lpo-info h4 {
            margin: 0 0 15px 0;
            color: #2c3e50;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 25px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        th { 
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        td { 
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
            background: white;
        }
        tr:nth-child(even) td {
            background: #f8f9fa;
        }
        .total-row { 
            font-weight: bold; 
            background: linear-gradient(135deg, #e8f4f8, #d1ecf1) !important;
            color: #2c3e50;
        }
        .total-row td {
            background: linear-gradient(135deg, #e8f4f8, #d1ecf1) !important;
            font-size: 13px;
        }
        .terms { 
            margin-top: 30px; 
            font-size: 10px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
        }
        .terms strong {
            color: #2c3e50;
            font-size: 12px;
            display: block;
            margin-bottom: 10px;
        }
        .signature-section { 
            margin-top: 50px; 
            display: flex; 
            justify-content: space-between;
            align-items: flex-end;
        }
        .signature-left {
            flex: 1;
            font-size: 11px;
            color: #6c757d;
        }
        .signature-right {
            flex: 1;
            text-align: right;
        }
        .signature-box {
            border: 2px solid #dee2e6;
            padding: 40px 20px 20px 20px;
            border-radius: 8px;
            background: #f8f9fa;
            margin-top: 20px;
            text-align: center;
        }
        .footer-address {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #6c757d;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        @media print { 
            body { margin: 0; padding: 15px; }
            .header-container { margin: -15px -15px 20px -15px; }
        }
    </style>
</head>
<body>
    <div class="header-container">
        <div class="header">
            <div class="logo-section">
                <div class="logo-design">
                    <div class="logo-curve"></div>
                    <div class="logo-text">QUMECS</div>
                </div>
                <div class="logo-subtitle">NIGERIA LIMITED</div>
            </div>
            <div class="middle-address">
                <strong>Operation Address:</strong><br>
                2, Avenue Road,<br>
                Light Industry Area,<br>
                Western By-Pass, Kaduna.
            </div>
            <div class="company-details">
                <strong>Registered Address:</strong><br>
                5A Gwani Muktar,<br>
                Malali GRA, Kaduna.<br>
                <strong>Tel:</strong> 062-835944<br>
                <strong>Email:</strong> info@qumecs.com<br>
                <strong>Web:</strong> www.qumecs.com
            </div>
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
