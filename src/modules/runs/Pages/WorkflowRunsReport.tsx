import { Button } from '@/components/common/buttons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import ReportsFilterHeader from '@/modules/runs/components/workflowRunsReports/reportsFilter';
import ReportsContent from '@/modules/runs/components/workflowRunsReports/reportsContent';
import { Dialog } from '@/components/dialogs';
import toaster from '@/components/common/toaster';
import { PdfIcon } from '@/assets/icons/pdfIcon';
import { HtmlIcon } from '@/assets/icons/htmlIcon';
import ReportExportButton from '@/modules/runs/components/workflowRunsReports/reportExportButton';

const WorkflowRunsReport = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isOpenExportDialog, setIsOpenExportDialog] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<'pdf' | 'html' | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'html') => {
    setPreviewFormat(format);
    setIsExporting(true);
    setIsPreviewOpen(true);
    setIsOpenExportDialog(false);
  };

  const exportAsPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      if (imgHeight > 297) {
        let remainingHeight = imgHeight;
        let position = -297;

        while (remainingHeight > 0) {
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          remainingHeight -= 297;
          position -= 297;
        }
      }

      pdf.save('workflow-runs-report.pdf');
      toaster.success({ title: 'Exported PDF successfully' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toaster.error({ title: 'Error exporting PDF' });
    } finally {
      setIsExporting(false);
      setIsPreviewOpen(false);
      setPreviewFormat(null);
    }
  };

  const exportAsHTML = () => {
    if (!reportRef.current) return;

    try {
      const styleSheets = Array.from(document.styleSheets);
      let styles = '';
      styleSheets.forEach((sheet) => {
        try {
          if (sheet.href === null || sheet.href.startsWith(window.location.origin)) {
            styles += Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join('\n');
          } else {
            styles += `@import url("${sheet.href}");\n`;
          }
        } catch (e) {
          console.error('Error importing stylesheet:', e);
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
      toaster.success({ title: 'Exported HTML successfully' });
    } catch (error) {
      console.error('Error exporting HTML:', error);
      toaster.error({ title: 'Error exporting HTML' });
    } finally {
      setIsExporting(false);
      setIsPreviewOpen(false);
      setPreviewFormat(null);
    }
  };

  return (
    <>
      <div ref={reportRef}>
        <div className='flex flex-row justify-between'>
          <div className='text-3xl font-bold py-2'>Workflow Runs Report</div>
          <div className='space-x-2'>
            <Button onClick={() => setIsOpenExportDialog(true)}>Export</Button>
          </div>
        </div>

        <div>
          <ReportsFilterHeader />
        </div>
        <div>
          <ReportsContent />
        </div>
      </div>

      {/* Export Format Selection Dialog */}
      <Dialog
        open={isOpenExportDialog}
        title='Select Export Format'
        onClose={() => setIsOpenExportDialog(false)}
        content={
          <div className='flex flex-row gap-2'>
            <ReportExportButton
              onClick={() => {
                handleExport('html');
              }}
              label='Export as HTML'
              icon={<HtmlIcon />}
            />

            <ReportExportButton
              onClick={() => {
                handleExport('pdf');
              }}
              label='Export as PDF'
              icon={<PdfIcon />}
            />
          </div>
        }
      />

      {/* Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        title={`Preview ${previewFormat?.toUpperCase()} Export`}
        onClose={() => {
          setIsPreviewOpen(false);
          setIsExporting(false);
          setPreviewFormat(null);
        }}
        content={
          <div className='max-h-[80vh] overflow-auto'>
            <div className='mb-4'>
              <div className='preview-content'>
                <ReportsContent isExporting={isExporting} />
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                onClick={() => {
                  if (previewFormat === 'pdf') exportAsPDF();
                  else exportAsHTML();
                }}
                type='light'
              >
                Confirm Export
              </Button>

              <Button
                onClick={() => {
                  setIsPreviewOpen(false);
                  setIsExporting(false);
                  setPreviewFormat(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default WorkflowRunsReport;
