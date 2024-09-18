interface GeneratedData {
  [key: string]: string;
}

const generateFastqDataArray = (numRecords: number): GeneratedData[] => {
  const dataArray: GeneratedData[] = [];

  for (let i = 0; i < numRecords; i++) {
    const record: GeneratedData = {
      SubjectID: `SBJ${Math.floor(10000 + Math.random() * 90000).toString()}`,
      LibraryID: `L${Math.floor(1000000 + Math.random() * 9000000).toString()}`,
      SampleID: `PRJ${Math.floor(1000000 + Math.random() * 9000000).toString()}`,
      size_num: (Math.floor(Math.random() * 50) + 20).toString(),
      size_chr: `${(Math.floor(Math.random() * 20) + 10).toFixed(1)}G`,
      Type: 'WGS',
      Phenotype: 'normal',
      Workflow: 'qc',
      Assay: 'TsqNano',
      path: `gds://production/primary_data/0000_A00000_0000_AAAAAA/${Math.random().toString(36).substring(7)}/WGS_TsqNano/Sample_${i}.fastq.gz`,
      topup: Math.random() > 0.5 ? 'True' : 'False',
      rgid: `${Math.random().toString(36).substring(7)}.${Math.random().toString(36).substring(7)}.4`,
      read: (Math.floor(Math.random() * 2) + 1).toString(),
      lane: (Math.floor(Math.random() * 8) + 1).toString(),
      sbj_url: `<a href=https://test.org/subjects/SBJ${Math.floor(10000 + Math.random() * 90000).toString()}/overview style='background-color:#${Math.floor(Math.random() * 16777215).toString(16)}'>SBJ${Math.floor(10000 + Math.random() * 90000).toString()}</a>`,
    };

    dataArray.push(record);
  }

  return dataArray;
};

export default generateFastqDataArray;

// Example usage:
// const generatedData = generateDataArray(5); // Generates an array of 5 objects
// console.log(generatedData);
