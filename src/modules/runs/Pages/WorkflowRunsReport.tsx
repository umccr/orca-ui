import { Button } from '@/components/common/buttons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import ReportsFilterHeader from '@/modules/runs/components/workflowRunsReports/reportsFilter';
import ReportsContent from '@/modules/runs/components/workflowRunsReports/reportsContent';
import { Dialog } from '@/components/dialogs';
import toaster from '@/components/common/toaster';

const WorkflowRunsReport = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const exportAsPDF = async () => {
    if (!reportRef.current) return;

    try {
      // Show loading state
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true, // If you have external images
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      // If content spans multiple pages
      if (imgHeight > 297) {
        // A4 height
        let remainingHeight = imgHeight;
        let position = -297; // Starting position for the second page

        while (remainingHeight > 0) {
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          remainingHeight -= 297;
          position -= 297;
        }
      }

      pdf.save('workflow-runs-report.pdf');
      toaster.success({
        title: 'Exported PDF successfully',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toaster.error({
        title: 'Error exporting PDF',
      });
      // Handle error (show toast notification, etc.)
    }
    setIsOpenExportDialog(false);
  };

  const exportAsHTML = () => {
    if (!reportRef.current) return;

    // Collect all stylesheet links
    const styleSheets = Array.from(document.styleSheets);
    let styles = '';
    styleSheets.forEach((sheet) => {
      try {
        // Only process same-origin stylesheets
        if (sheet.href === null || sheet.href.startsWith(window.location.origin)) {
          styles += Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } else {
          // For external stylesheets, use @import
          styles += `@import url("${sheet.href}");\n`;
        }
      } catch (e) {
        console.error('Error accessing stylesheet:', e);
        // If we can't access the rules, add a link to the stylesheet
        if (sheet.href) {
          styles += `@import url("${sheet.href}");\n`;
        }
      }
    });

    const html = `
      <html>
        <head>
          <title>Workflow Runs Report</title>
          <style>${styles}</style>
        </head>
        <body>
          ${reportRef.current.outerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow-runs-report.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toaster.success({
      title: 'Exported HTML successfully',
    });
    setIsOpenExportDialog(false);
  };

  const [isOpenExportDialog, setIsOpenExportDialog] = useState(false);
  return (
    <div ref={reportRef}>
      <div className='flex flex-row justify-between'>
        <div className='text-3xl font-bold py-2'>Workflow Runs Report</div>
        <div className='space-x-2'>
          <Button onClick={() => setIsOpenExportDialog(true)}>Export</Button>
        </div>
      </div>
      <Dialog
        open={isOpenExportDialog}
        title='Export Report'
        content={
          <div className='flex flex-row gap-2'>
            <Button onClick={exportAsPDF}>Export PDF Format</Button>
            <Button onClick={exportAsHTML}>Export HTML Format</Button>
          </div>
        }
        onClose={() => setIsOpenExportDialog(false)}
      />

      <div>
        <ReportsFilterHeader />
      </div>
      <div>
        <ReportsContent />
      </div>
    </div>
  );
};

export default WorkflowRunsReport;
