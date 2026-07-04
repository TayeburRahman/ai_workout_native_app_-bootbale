export interface ContructRequest {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export interface ContructResponse {
  success: boolean;
  message: string;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface FaqsResponse {
  success: boolean;
  faqs: FaqItem[];
}
