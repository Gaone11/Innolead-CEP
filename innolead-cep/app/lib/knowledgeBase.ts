// Knowledge Base — IndexedDB storage + client-side text extraction
// All data stays in-browser. No backend required.

export interface KBDocument {
  id: string;
  name: string;
  type: string;          // "pdf" | "docx" | "txt" | "csv"
  size: number;
  uploadedAt: number;    // timestamp
  text: string;          // extracted plain text
  keywords: string[];    // top keywords for matching
}

const DB_NAME = "innolead-kb";
const DB_VERSION = 1;
const STORE_NAME = "documents";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ── CRUD ──

export async function saveDocument(doc: KBDocument): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(doc);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllDocuments(): Promise<KBDocument[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllDocuments(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Text Extraction ──

export async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "txt" || ext === "csv" || ext === "md") {
    return file.text();
  }

  if (ext === "pdf") {
    return extractPdfText(file);
  }

  if (ext === "docx") {
    return extractDocxText(file);
  }

  if (ext === "xlsx" || ext === "xls") {
    return extractExcelText(file);
  }

  if (ext === "pptx") {
    return extractPptxText(file);
  }

  // Fallback: try reading as text
  return file.text();
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  // Use the bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: unknown) => (item as { str?: string }).str ?? "").join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractExcelText(file: File): Promise<string> {
  const XLSX = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheets: string[] = [];
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    const text = XLSX.utils.sheet_to_csv(sheet);
    sheets.push(`[Sheet: ${name}]\n${text}`);
  }
  return sheets.join("\n\n");
}

async function extractPptxText(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slides: string[] = [];

  // PPTX slides are stored as XML in ppt/slides/slide*.xml
  const slideFiles = Object.keys(zip.files)
    .filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] ?? "0");
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] ?? "0");
      return numA - numB;
    });

  for (const path of slideFiles) {
    const xml = await zip.files[path].async("text");
    // Extract text content from <a:t> tags
    const textMatches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || [];
    const texts = textMatches.map(m => m.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
    if (texts.length > 0) {
      const slideNum = path.match(/slide(\d+)/)?.[1] ?? "?";
      slides.push(`[Slide ${slideNum}]\n${texts.join(" ")}`);
    }
  }

  return slides.join("\n\n");
}

// ── Keyword Extraction ──

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","is","it","this","that","are","was","were","be","been","being","have",
  "has","had","do","does","did","will","would","could","should","may","might",
  "shall","can","not","no","so","if","then","than","too","very","just","about",
  "also","into","over","such","its","our","their","your","my","his","her","we",
  "they","them","us","he","she","you","i","me","up","out","all","any","each",
  "every","both","few","more","most","other","some","as","only","own","same",
  "which","what","when","where","who","how","why","after","before","between",
]);

export function extractKeywords(text: string, topN = 50): string[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

// ── Search / Match ──

// ── Dimension-Aware Search ──

// Maps diagnostic dimensions to keywords for matching against KB documents
const DIMENSION_KEYWORDS: Record<string, string[]> = {
  strategy: ["strategy", "strategic", "vision", "mission", "kpi", "objective", "goal", "roadmap", "planning", "competitive", "market", "growth", "alignment", "direction", "swot", "pestle", "balanced scorecard"],
  governance: ["governance", "compliance", "risk", "audit", "policy", "regulation", "board", "oversight", "accountability", "ethics", "transparency", "reporting", "controls", "framework", "iso", "king iv"],
  execution: ["execution", "project", "delivery", "implementation", "budget", "timeline", "change management", "agile", "waterfall", "milestone", "resource", "capacity", "programme", "portfolio", "pmo"],
  people: ["people", "culture", "talent", "engagement", "leadership", "succession", "development", "training", "retention", "wellbeing", "diversity", "inclusion", "performance", "hr", "human resource", "employee"],
};

export function searchByDimension(dimensionId: string, documents: KBDocument[]): { doc: KBDocument; score: number; snippets: string[] }[] {
  const keywords = DIMENSION_KEYWORDS[dimensionId] || [];
  if (keywords.length === 0 || documents.length === 0) return [];

  const results = documents.map(doc => {
    const textLower = doc.text.toLowerCase();
    let score = 0;
    const matchedSnippets: string[] = [];

    for (const kw of keywords) {
      const regex = new RegExp(kw, "gi");
      const matches = textLower.match(regex);
      if (matches) {
        score += matches.length;
        if (doc.keywords.some(dk => dk.includes(kw) || kw.includes(dk))) score += 2;
      }
    }

    if (score > 0) {
      const sentences = doc.text.split(/[.!?\n]+/).filter(s => s.trim().length > 20);
      for (const sentence of sentences) {
        const sLower = sentence.toLowerCase();
        if (keywords.some(kw => sLower.includes(kw))) {
          matchedSnippets.push(sentence.trim());
          if (matchedSnippets.length >= 3) break;
        }
      }
      if (matchedSnippets.length === 0 && sentences.length > 0) {
        matchedSnippets.push(sentences[0].trim());
      }
    }

    return { doc, score, snippets: matchedSnippets.map(s => s.length > 250 ? s.slice(0, 250) + "..." : s) };
  });

  return results.filter(r => r.score > 0).sort((a, b) => b.score - a.score);
}

export interface DynamicQuestion {
  id: string;
  text: string;
  sourceDoc: string;
  dimension: string;
  options: string[];
}

// Question templates per dimension — filled with topics extracted from KB docs
const QUESTION_TEMPLATES: Record<string, string[]> = {
  strategy: [
    "Our organisation has a clear approach to {topic}.",
    "We regularly review and adapt our {topic} practices.",
    "Leadership actively drives {topic} across the organisation.",
  ],
  governance: [
    "Our {topic} processes are well-documented and consistently followed.",
    "We have effective {topic} mechanisms in place.",
    "Our organisation proactively manages {topic} requirements.",
  ],
  execution: [
    "Our {topic} capabilities meet organisational needs.",
    "We apply {topic} principles consistently across projects.",
    "Our {topic} processes are standardised and effective.",
  ],
  people: [
    "Our organisation invests adequately in {topic}.",
    "We have formal programmes supporting {topic}.",
    "Leadership prioritises {topic} as a strategic objective.",
  ],
};

// Extract the most relevant topic phrases from documents for a dimension
function extractTopics(dimId: string, documents: KBDocument[]): { topic: string; sourceDoc: string }[] {
  const keywords = DIMENSION_KEYWORDS[dimId] || [];
  const topics: { topic: string; sourceDoc: string; score: number }[] = [];
  const seen = new Set<string>();

  for (const doc of documents) {
    const sentences = doc.text.split(/[.!?\n]+/).filter(s => {
      const trimmed = s.trim();
      return trimmed.length > 15 && trimmed.length < 200;
    });

    for (const sentence of sentences) {
      const sLower = sentence.toLowerCase();
      const matchedKws = keywords.filter(kw => sLower.includes(kw));
      if (matchedKws.length === 0) continue;

      // Extract a short topic phrase (2–5 words) around the matched keyword
      for (const kw of matchedKws) {
        const idx = sLower.indexOf(kw);
        const words = sentence.trim().split(/\s+/);
        const kwWordIdx = words.findIndex(w => w.toLowerCase().includes(kw));
        if (kwWordIdx < 0) continue;

        // Take the keyword and 1-3 surrounding words to form a natural topic
        const start = Math.max(0, kwWordIdx - 1);
        const end = Math.min(words.length, kwWordIdx + 3);
        let topic = words.slice(start, end).join(" ")
          .replace(/^[^a-zA-Z]+/, "")  // strip leading punctuation
          .replace(/[^a-zA-Z]+$/, "")   // strip trailing punctuation
          .toLowerCase();

        // Clean up common filler starts
        topic = topic.replace(/^(the|a|an|our|your|their|its|and|or|to|for|in|on|of|with)\s+/i, "");

        if (topic.length < 4 || topic.split(/\s+/).length < 1 || seen.has(topic)) continue;
        seen.add(topic);
        topics.push({ topic, sourceDoc: doc.name, score: matchedKws.length });
      }
    }
  }

  return topics
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function generateDynamicQuestions(documents: KBDocument[]): DynamicQuestion[] {
  if (documents.length === 0) return [];

  const questions: DynamicQuestion[] = [];
  let qIndex = 0;

  for (const dimId of Object.keys(DIMENSION_KEYWORDS)) {
    const templates = QUESTION_TEMPLATES[dimId] || [];
    const topics = extractTopics(dimId, documents);

    for (let i = 0; i < Math.min(topics.length, 2); i++) {
      const template = templates[i % templates.length];
      const { topic, sourceDoc } = topics[i];
      qIndex++;
      questions.push({
        id: `kb_${dimId}_${qIndex}`,
        text: template.replace("{topic}", topic),
        sourceDoc,
        dimension: dimId,
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      });
    }
  }

  return questions;
}

export function getDimensionInsights(dimensionId: string, score: number, documents: KBDocument[]): string[] {
  const results = searchByDimension(dimensionId, documents);
  if (results.length === 0) return [];

  const insights: string[] = [];
  const level = score >= 70 ? "strong" : score >= 45 ? "developing" : "foundational";

  for (const r of results.slice(0, 2)) {
    for (const snippet of r.snippets.slice(0, 1)) {
      if (level === "foundational") {
        insights.push(`From "${r.doc.name}": Consider focusing on — ${snippet}`);
      } else if (level === "developing") {
        insights.push(`From "${r.doc.name}": To strengthen this area — ${snippet}`);
      } else {
        insights.push(`From "${r.doc.name}": Continue leveraging — ${snippet}`);
      }
    }
  }

  return insights;
}

// ── General Search ──

export function searchDocuments(query: string, documents: KBDocument[]): { doc: KBDocument; score: number; snippet: string }[] {
  const queryWords = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2);
  if (queryWords.length === 0 || documents.length === 0) return [];

  const results = documents.map(doc => {
    const textLower = doc.text.toLowerCase();
    let score = 0;

    // Keyword match score
    for (const qw of queryWords) {
      if (doc.keywords.includes(qw)) score += 3;
      const regex = new RegExp(qw, "gi");
      const matches = textLower.match(regex);
      if (matches) score += matches.length;
    }

    // Find best snippet
    let snippet = "";
    if (score > 0) {
      const sentences = doc.text.split(/[.!?\n]+/).filter(s => s.trim().length > 20);
      let bestSentence = "";
      let bestScore = 0;
      for (const sentence of sentences) {
        const sLower = sentence.toLowerCase();
        let sScore = 0;
        for (const qw of queryWords) {
          if (sLower.includes(qw)) sScore++;
        }
        if (sScore > bestScore) {
          bestScore = sScore;
          bestSentence = sentence.trim();
        }
      }
      snippet = bestSentence || sentences[0]?.trim() || doc.text.slice(0, 200);
      if (snippet.length > 300) snippet = snippet.slice(0, 300) + "...";
    }

    return { doc, score, snippet };
  });

  return results.filter(r => r.score > 0).sort((a, b) => b.score - a.score);
}
