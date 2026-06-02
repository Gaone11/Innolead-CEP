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

export function generateDynamicQuestions(documents: KBDocument[]): DynamicQuestion[] {
  if (documents.length === 0) return [];

  const questions: DynamicQuestion[] = [];
  let qIndex = 0;

  for (const [dimId, keywords] of Object.entries(DIMENSION_KEYWORDS)) {
    for (const doc of documents) {
      const textLower = doc.text.toLowerCase();
      const sentences = doc.text.split(/[.!?\n]+/).filter(s => s.trim().length > 30 && s.trim().length < 300);

      // Find sentences that mention dimension-relevant topics
      const relevantSentences = sentences.filter(s => {
        const sLower = s.toLowerCase();
        return keywords.some(kw => sLower.includes(kw));
      });

      for (const sentence of relevantSentences.slice(0, 2)) {
        // Convert the document statement into an assessment question
        const cleaned = sentence.trim().replace(/^[-•*]\s*/, "");
        // Skip very short or very generic sentences
        if (cleaned.split(/\s+/).length < 5) continue;

        qIndex++;
        questions.push({
          id: `kb_${dimId}_${qIndex}`,
          text: `Based on "${doc.name}": Our organisation effectively implements — "${cleaned}"`,
          sourceDoc: doc.name,
          dimension: dimId,
          options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        });

        if (questions.filter(q => q.dimension === dimId).length >= 3) break;
      }
      if (questions.filter(q => q.dimension === dimId).length >= 3) break;
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
