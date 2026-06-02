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

// Clean, predefined question templates per dimension.
// Each dimension has a pool of questions — we pick ones that match KB document topics.
const KB_QUESTION_POOL: Record<string, { trigger: string[]; text: string }[]> = {
  strategy: [
    { trigger: ["strategy", "strategic"], text: "Our organisation has a clearly defined strategic framework informed by our internal documentation." },
    { trigger: ["vision", "mission"], text: "Our vision and mission are well-communicated and guide day-to-day decision-making." },
    { trigger: ["kpi", "objective", "goal"], text: "We track strategic KPIs and objectives consistently across all departments." },
    { trigger: ["roadmap", "planning"], text: "Our strategic roadmap is reviewed and updated at least annually." },
    { trigger: ["competitive", "market"], text: "We conduct regular market and competitive analysis to inform our strategy." },
    { trigger: ["swot", "pestle"], text: "We use structured analytical frameworks (e.g. SWOT, PESTLE) to assess strategic positioning." },
    { trigger: ["alignment", "direction"], text: "There is strong alignment between our strategy and operational execution." },
    { trigger: ["growth"], text: "Our growth strategy is documented with clear milestones and accountability." },
  ],
  governance: [
    { trigger: ["governance", "board"], text: "Our governance structures are clearly documented and regularly reviewed." },
    { trigger: ["compliance", "regulation"], text: "We have a systematic approach to tracking and meeting compliance obligations." },
    { trigger: ["risk"], text: "Our risk management framework is proactive rather than reactive." },
    { trigger: ["audit"], text: "Internal and external audit findings are acted upon within defined timeframes." },
    { trigger: ["policy"], text: "Our organisational policies are accessible, up-to-date, and consistently enforced." },
    { trigger: ["oversight", "accountability"], text: "There are clear accountability structures for governance oversight." },
    { trigger: ["ethics", "transparency"], text: "We have a strong culture of ethical conduct and transparency in reporting." },
    { trigger: ["controls", "framework"], text: "Our internal controls framework is robust and regularly tested." },
  ],
  execution: [
    { trigger: ["project", "programme"], text: "Our project and programme management practices follow a standardised methodology." },
    { trigger: ["delivery", "implementation"], text: "We consistently deliver initiatives on time and within scope." },
    { trigger: ["budget"], text: "Projects are tracked against budget with regular variance reporting." },
    { trigger: ["change management", "change"], text: "Change management is embedded in how we deliver projects and initiatives." },
    { trigger: ["agile", "waterfall"], text: "We select and apply appropriate delivery methodologies based on project needs." },
    { trigger: ["milestone", "timeline"], text: "Project milestones and timelines are clearly defined and monitored." },
    { trigger: ["resource", "capacity"], text: "We have effective resource and capacity planning processes in place." },
    { trigger: ["pmo", "portfolio"], text: "Our portfolio and PMO function provides effective oversight of all initiatives." },
  ],
  people: [
    { trigger: ["talent", "succession"], text: "We have a formal talent development and succession planning programme." },
    { trigger: ["engagement"], text: "Employee engagement is measured regularly and results drive meaningful action." },
    { trigger: ["leadership"], text: "Our leadership development programmes are effective and well-attended." },
    { trigger: ["training", "development"], text: "Staff have access to relevant training and professional development opportunities." },
    { trigger: ["retention", "wellbeing"], text: "We invest in employee wellbeing and have strong retention strategies." },
    { trigger: ["diversity", "inclusion"], text: "Diversity and inclusion are prioritised with measurable goals and outcomes." },
    { trigger: ["performance"], text: "Our performance management system is fair, transparent, and development-focused." },
    { trigger: ["culture"], text: "Our organisational culture is intentionally shaped and regularly assessed." },
  ],
};

export function generateDynamicQuestions(documents: KBDocument[]): DynamicQuestion[] {
  if (documents.length === 0) return [];

  // Collect all keywords from all documents
  const allKeywords = new Set<string>();
  const keywordToDoc = new Map<string, string>();
  for (const doc of documents) {
    for (const kw of doc.keywords) {
      allKeywords.add(kw);
      if (!keywordToDoc.has(kw)) keywordToDoc.set(kw, doc.name);
    }
  }

  const questions: DynamicQuestion[] = [];
  let qIndex = 0;

  for (const [dimId, pool] of Object.entries(KB_QUESTION_POOL)) {
    let dimCount = 0;
    for (const item of pool) {
      if (dimCount >= 2) break;

      // Check if any trigger keyword appears in the KB document keywords
      const matched = item.trigger.some(t => {
        for (const kw of allKeywords) {
          if (kw.includes(t) || t.includes(kw)) return true;
        }
        return false;
      });

      if (matched) {
        // Find which document matched
        const matchedTrigger = item.trigger.find(t => {
          for (const kw of allKeywords) {
            if (kw.includes(t) || t.includes(kw)) return true;
          }
          return false;
        }) || item.trigger[0];

        let sourceDoc = "";
        for (const kw of allKeywords) {
          if (kw.includes(matchedTrigger) || matchedTrigger.includes(kw)) {
            sourceDoc = keywordToDoc.get(kw) || "";
            break;
          }
        }

        qIndex++;
        dimCount++;
        questions.push({
          id: `kb_${dimId}_${qIndex}`,
          text: item.text,
          sourceDoc,
          dimension: dimId,
          options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        });
      }
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
