export enum AppURLs {
  // auth
  SignIn = '/signIn',

  // Lab
  Lab = '/lab',
  LabLibraryOverview = '/lab/library/:id/overview',
  LabLibraryFileView = '/lab/library/:id/fileview',
  LabLibraryReportsWgs = '/lab/library/:id/reports/wgs',
  LabLibraryReportsWts = '/lab/library/:id/reports/wts',
  LabLibraryReportsTso500 = '/lab/library/:id/reports/tso500',
  LabLibraryReportsTso500v2 = '/lab/library/:id/reports/tso500v2',
  LabLibraryReportsWgsbcbio = '/lab/library/:id/reports/wgsbcbio',
  LabLibraryReportsWtsbcbio = '/lab/library/:id/reports/wtsbcbio',
  LabLibraryReportsWgssash = '/lab/library/:id/reports/wgssash',

  // Runs
  Runs = '/runs',
  RunsSequence = '/runs/sequence',
  RunsSequenceDeatilsTable = '/runs/sequence/:id/table',
  RunsSequenceDeatilsDiagram = '/runs/sequence/:id/diagram',
  RunsSequenceDeatilsReport = '/runs/sequence/:id/report',
  RunsLibrary = '/runs/library',
  RunsWorkflow = '/runs/workflow',

  // sscheck
  Sscheck = '/sscheck',

  // 404
  NotFound = '/404',
}
