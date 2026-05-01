export type Country = "india" | "usa" | "uk";

export interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
  language?: string;
}

export const COUNTRIES: { id: Country; label: string; flag: string; suggestions: string[] }[] = [
  { 
    id: "india", 
    label: "India", 
    flag: "🇮🇳",
    suggestions: [
      "How does the Lok Sabha election work?",
      "What is the role of the Election Commission?",
      "Explain the VVPAT system.",
      "What are the eligibility criteria for voters?"
    ]
  },
  { 
    id: "usa", 
    label: "USA", 
    flag: "🇺🇸",
    suggestions: [
      "How does the Electoral College work?",
      "What is the difference between primaries and caucuses?",
      "Explain the role of swing states.",
      "How are Congressional districts redrawn?"
    ]
  },
  { 
    id: "uk", 
    label: "UK", 
    flag: "🇬🇧",
    suggestions: [
      "How does the First-Past-The-Post system work?",
      "What happens during a hung parliament?",
      "Explain the role of the House of Commons.",
      "How is the Prime Minister chosen?"
    ]
  },
];

export interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  source: string;
  date: string;
  image: string | null;
}
