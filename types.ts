
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  driveUrl?: string; // Link to the file in Google Drive
}

export interface AnalysisResult {
  name: string;
  category: string;
  description: string;
  suggestedPrice: number;
}

export enum CarouselDirection {
  LEFT = 'left',
  RIGHT = 'right'
}
