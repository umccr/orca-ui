// Taken from https://igv.org/genomes/genomes.json

export const genomes = [
  {
    id: 'hg38',
    name: 'Human (GRCh38/hg38)',
    fastaURL: 'https://igv.org/genomes/data/hg38/hg38.fa',
    indexURL: 'https://igv.org/genomes/data/hg38/hg38.fa.fai',
    cytobandURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/cytoBandIdeo.txt.gz',
    aliasURL: 'https://igv.org/genomes/data/hg38/hg38_alias.tab',
    twoBitURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.2bit',
    chromSizesURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.chrom.sizes',
    chromosomeOrder:
      'chr1,chr2,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY',
    tracks: [
      {
        name: 'Refseq Select',
        format: 'refgene',
        url: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/ncbiRefSeqSelect.txt.gz',
        indexed: false,
        order: 1000001,
        infoURL: 'https://www.ncbi.nlm.nih.gov/gene/?term=$$',
      },
    ],
  },
  {
    id: 'hg38_1kg',
    ucscID: 'hg38',
    blatDB: 'hg38',
    name: 'Human (hg38 1kg/GATK)',
    fastaURL:
      'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome/GRCh38_full_analysis_set_plus_decoy_hla.fa',
    indexURL:
      'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome/GRCh38_full_analysis_set_plus_decoy_hla.fa.fai',
    cytobandURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/cytoBandIdeo.txt.gz',
    aliasURL: 'https://igv.org/genomes/data/hg38/hg38_alias.tab',
    chromSizesURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.chrom.sizes',
    tracks: [
      {
        name: 'Refseq Select',
        format: 'refgene',
        url: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/ncbiRefSeqSelect.txt.gz',
        indexed: false,
        order: 1000001,
        infoURL: 'https://www.ncbi.nlm.nih.gov/gene/?term=$$',
      },
    ],
    chromosomeOrder:
      'chr1,chr2,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY',
  },
  {
    id: 'hg19',
    name: 'Human (GRCh37/hg19)',
    fastaURL: 'https://igv.org/genomes/data/hg19/hg19.fasta',
    indexURL: 'https://igv.org/genomes/data/hg19/hg19.fasta.fai',
    cytobandURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg19/database/cytoBand.txt.gz',
    aliasURL: 'https://igv.org/genomes/data/hg19/hg19_alias.tab',
    twoBitURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg19/bigZips/hg19.2bit',
    chromSizesURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg19/bigZips/hg19.chrom.sizes',
    tracks: [
      {
        name: 'Refseq Select',
        format: 'refgene',
        url: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg19/database/ncbiRefSeqSelect.txt.gz',
        indexed: false,
        order: 1000000,
        infoURL: 'https://www.ncbi.nlm.nih.gov/gene/?term=$$',
      },
    ],
    chromosomeOrder:
      'chr1,chr2,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY',
  },
  {
    id: 'hg18',
    name: 'Human (hg18)',
    fastaURL: 'https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg18/hg18.fasta',
    indexURL: 'https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg18/hg18.fasta.fai',
    cytobandURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg18/database/cytoBandIdeo.txt.gz',
    tracks: [
      {
        name: 'Refseq Genes',
        format: 'refgene',
        url: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg18/database/refGene.txt.gz',
        indexed: false,
        visibilityWindow: -1,
        order: 1000000,
        searchable: true,
      },
    ],
    chromosomeOrder:
      'chr1,chr2,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY',
  },
];
