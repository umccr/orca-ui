import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import ReportsFilterHeader from '@/modules/runs/components/workflowRunsReports/reportsFilter';
import ReportsContent from '@/modules/runs/components/workflowRunsReports/reportsContent';
import { Dialog } from '@/components/dialogs';
import toaster from '@/components/common/toaster';
import { PdfIcon } from '@/assets/icons/pdfIcon';
import { HtmlIcon } from '@/assets/icons/htmlIcon';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import ReportExportButton from '@/modules/runs/components/workflowRunsReports/reportExportButton';
import { IconButton } from '@/components/common/buttons';
import { useQueryParams } from '@/hooks/useQueryParams';
import { dayjs } from '@/utils/dayjs';

const WorkflowRunsReport = () => {
  const { getQueryParams } = useQueryParams();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isOpenExportDialog, setIsOpenExportDialog] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<'pdf' | 'html' | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const getSelectTimeRange = (isExporting: boolean = false) => {
    const startDate = getQueryParams().startDate;
    const endDate = getQueryParams().endDate;
    if (isExporting) return `${dayjs(startDate).format('llll')} - ${dayjs(endDate).format('llll')}`;
    return `${dayjs(startDate).format('MM-DD-YYYY')} - ${dayjs(endDate).format('MM-DD-YYYY')}`;
  };

  const handleExport = async (format: 'pdf' | 'html') => {
    setPreviewFormat(format);
    setIsExporting(true);
    if (format === 'pdf') setIsPreviewOpen(true);
    else exportAsHTML();
    setIsOpenExportDialog(false);
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
      link.download = `workflow-runs-report-${getSelectTimeRange()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toaster.success({
        title: 'Exported HTML successfully!',
        message: `workflow-runs-report-${getSelectTimeRange()}.html has been downloaded.`,
      });
    } catch (error) {
      console.error('Error exporting HTML:', error);
      toaster.error({ title: 'Error exporting HTML' });
    } finally {
      setIsExporting(false);
      setIsPreviewOpen(false);
      setPreviewFormat(null);
    }
  };

  const exportAsPDF = async () => {
    if (!reportRef.current) return;

    try {
      // First modify the element for better rendering
      const element = reportRef.current.cloneNode(true) as HTMLElement;
      element.style.width = '1024px'; // Fixed width for better quality
      document.body.appendChild(element);

      // Create canvas with better settings
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        logging: false,
        removeContainer: true,
        onclone: (clonedDoc) => {
          const gradientElements = clonedDoc.querySelectorAll('[class*="gradient"]');
          gradientElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.background = '#f0f7ff';
              // Remove all gradient-related classes
              const classList = Array.from(el.classList);
              classList.forEach((className) => {
                if (
                  className.includes('gradient') ||
                  className.includes('from-') ||
                  className.includes('to-')
                ) {
                  el.classList.remove(className);
                }
              });
            }
          });
        },
      });

      // Remove the temporary element
      document.body.removeChild(element);

      // Create PDF with A4 size
      const imgWidth = 210; // A4 width in mm
      const pixelRatio = canvas.width / imgWidth;
      const imgHeight = canvas.height / pixelRatio;

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'p' : 'l',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate the number of pages needed
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pagesCount = Math.ceil(imgHeight / pageHeight);

      // Add pages
      for (let i = 0; i < pagesCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const position = -(i * pageHeight);
        pdf.addImage({
          imageData: canvas.toDataURL('image/jpeg', 1.0),
          format: 'JPEG',
          x: 0,
          y: position,
          width: imgWidth,
          height: imgHeight,
          compression: 'FAST',
          alias: `page${i}`,
        });
      }

      // Save the PDF
      const fileName = `workflow-runs-report-${getSelectTimeRange()}.pdf`;
      pdf.save(fileName);

      toaster.success({
        title: 'Exported PDF successfully!',
        message: `${fileName} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toaster.error({
        title: 'Error exporting PDF',
        message: 'Please try again or contact support if the issue persists.',
      });
    } finally {
      setIsExporting(false);
      setIsPreviewOpen(false);
      setPreviewFormat(null);
    }
  };

  return (
    <>
      <div>
        <div className='flex flex-row justify-between items-end bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg'>
          <div className='text-3xl font-bold py-2'>Workflow Runs Report</div>
          <div className='space-x-2'>
            <IconButton
              onClick={() => setIsOpenExportDialog(true)}
              icon={<ArrowDownOnSquareIcon className='h-5 w-5' />}
              tooltip='Export'
              tooltipPosition='top'
              tooltipBackground='white'
            />
          </div>
        </div>

        <div>
          <ReportsFilterHeader />
        </div>
        <div>
          <ReportsContent />
        </div>
      </div>

      {/**
       * hidden elemment for export format selection
       */}
      <div className='hidden'>
        <div ref={reportRef} className='p-10'>
          <div className='flex flex-row justify-between items-end bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg'>
            <div className='text-3xl font-bold py-2'>Workflow Runs Report</div>
          </div>

          <div>
            <div className='bg-white p-4 rounded-lg'>
              <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0'>
                <div className='flex items-center'>
                  <span className='text-sm font-medium text-gray-600 mr-3'>Time Period:</span>
                  <div>{getSelectTimeRange(true)}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ReportsContent isExporting={true} />
          </div>
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
          /**
           * TODO:  preview pdf with page break
           * have preview page display the pdf page and page selection
           */
          <div className='max-h-[80vh] overflow-auto p-6 bg-gray-100'>
            <div
              className='bg-white shadow-lg mx-auto'
              style={{
                width: '794/2px', // A4 width in pixels at 96dpi
                minHeight: '1123px', // A4 height
                transformOrigin: 'top center',
                marginBottom: '20px',
              }}
            >
              <div className='mb-4'>
                <div className='preview-content'>
                  <ReportsContent isExporting={isExporting} />
                </div>
              </div>
            </div>
          </div>
        }
        closeBtn={{
          label: 'Cancel',
          onClick: () => {
            setIsPreviewOpen(false);
            setIsExporting(false);
            setPreviewFormat(null);
          },
        }}
        confirmBtn={{
          label: 'Confirm Export',
          onClick: () => {
            exportAsPDF();
          },
        }}
      />
    </>
  );
};

export default WorkflowRunsReport;
