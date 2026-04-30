export type Country = "india" | "usa" | "france" | "uk" | "germany";

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
    id: "france", 
    label: "France", 
    flag: "🇫🇷",
    suggestions: [
      "How is the President of France elected?",
      "What is the two-round voting system?",
      "Explain the role of the National Assembly.",
      "What are the rules for election campaigning?"
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
  { 
    id: "germany", 
    label: "Germany", 
    flag: "🇩🇪",
    suggestions: [
      "What is the Mixed-Member Proportional system?",
      "How does the five-percent hurdle work?",
      "Explain the role of the Bundestag.",
      "How is the Federal Chancellor elected?"
    ]
  },
];
