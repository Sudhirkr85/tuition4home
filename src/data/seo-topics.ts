export interface SEOTopic {
  topic: string; // Slug (e.g. 'cbse-maths', 'physics', 'python-coding', 'ib-diploma')
  label: string; // Display Title
  category: 'Academics' | 'STEM & Coding' | 'Competitive Exams' | 'Commerce & Arts' | 'Languages';
  keywords: string[];
  description: string;
  price: string;
  duration: string;
  level: string;
  icon: string; // Lucide icon identifier
  curriculumHighlights: string[];
  isTopTopic?: boolean;
}

export const SEO_TOPICS: SEOTopic[] = [
  // --- ACADEMICS (CBSE / ICSE / IB / CAMBRIDGE) ---
  {
    topic: 'maths',
    label: 'Mathematics & Vedic Maths',
    category: 'Academics',
    keywords: [
      'maths home tutor',
      'mathematics private tuition',
      'maths teacher near me',
      'vedic maths classes',
      'class 10 maths tutor',
      'class 12 calculus tutor',
    ],
    description:
      'Master concept clarity, speed arithmetic, NCERT exemplars, RD Sharma, and board exam problem-solving with top 1% certified mathematics tutors.',
    price: '₹600 - ₹1,200/hr',
    duration: '1 hr (2-4 sessions/week)',
    level: 'Class 1st to 12th & Olympiads',
    icon: 'Calculator',
    curriculumHighlights: [
      'Algebra, Coordinate Geometry & Quadratic Equations',
      'Calculus (Differential & Integral) for Class 11-12',
      'Vedic Speed Maths Tricks & Calculation Accuracy',
      'Chapter-wise Mock Tests & Previous 10 Years Papers',
    ],
    isTopTopic: true,
  },
  {
    topic: 'physics',
    label: 'Physics (Class 9-12 & JEE/NEET)',
    category: 'Academics',
    keywords: [
      'physics home tutor',
      'physics tutor near me',
      'cbse physics private tutor',
      'jee mains physics teacher',
      'class 11 physics numericals tutor',
    ],
    description:
      'Learn conceptual physics with real-world analogies, rigorous numerical problem-solving, and laboratory concept mastery for CBSE, ICSE, and competitive exams.',
    price: '₹700 - ₹1,400/hr',
    duration: '1.5 hrs (2-3 sessions/week)',
    level: 'Class 9 to 12, JEE & NEET Foundation',
    icon: 'Atom',
    curriculumHighlights: [
      'Kinematics, Laws of Motion & Gravitation',
      'Thermodynamics, Waves & Oscillations',
      'Electrostatics, Magnetism & Electromagnetic Waves',
      'Optics & Modern Physics with JEE Problem Sets',
    ],
    isTopTopic: true,
  },
  {
    topic: 'chemistry',
    label: 'Chemistry (Organic, Inorganic & Physical)',
    category: 'Academics',
    keywords: [
      'chemistry home tutor',
      'chemistry tuition near me',
      'organic chemistry tutor',
      'class 12 chemistry teacher',
      'neet chemistry tutor',
    ],
    description:
      'Simplify complex chemical reactions, organic synthesis mechanisms, and periodic table trends with structured 1-on-1 tutoring sessions.',
    price: '₹700 - ₹1,400/hr',
    duration: '1 hr (3 sessions/week)',
    level: 'Class 9 to 12 & Pre-Medical',
    icon: 'FlaskConical',
    curriculumHighlights: [
      'Mole Concept & Chemical Thermodynamics',
      'Organic Reaction Mechanisms & Named Reactions',
      'Coordination Compounds & Transition Metals',
      'Balancing Chemical Equations & Lab Experiment Viva',
    ],
    isTopTopic: true,
  },
  {
    topic: 'biology',
    label: 'Biology & NEET Life Sciences',
    category: 'Academics',
    keywords: [
      'biology home tutor',
      'biology private classes',
      'neet biology tutor',
      'botany zoology tutor',
      'class 10 science biology tutor',
    ],
    description:
      'Comprehensive diagram-based learning, anatomical understanding, and NCERT-line-by-line preparation for top scores in school and NEET examinations.',
    price: '₹600 - ₹1,200/hr',
    duration: '1 hr (2-3 sessions/week)',
    level: 'Class 8 to 12 & NEET',
    icon: 'Dna',
    curriculumHighlights: [
      'Cell Biology, Genetics & Evolution',
      'Human Physiology & Organ Systems',
      'Plant Physiology, Ecology & Environment',
      'High-Yield Diagram Practice & NEET MCQs',
    ],
    isTopTopic: true,
  },
  {
    topic: 'science',
    label: 'All Science (Class 6-10 PCB)',
    category: 'Academics',
    keywords: [
      'science home tutor',
      'class 10 science tutor',
      'middle school science tuition',
      'cbse class 9 science teacher',
      'science classes near me',
    ],
    description:
      'Build strong foundational curiosity and academic excellence across Physics, Chemistry, and Biology for middle and high school students.',
    price: '₹550 - ₹1,000/hr',
    duration: '1 hr (3 sessions/week)',
    level: 'Class 6th to 10th',
    icon: 'Microscope',
    curriculumHighlights: [
      'Matter, Chemical Reactions & Acids/Bases',
      'Light Reflection/Refraction & Electricity',
      'Life Processes, Heredity & Ecosystems',
      'School Lab Exam Assistance & NTSE Foundation',
    ],
    isTopTopic: true,
  },
  {
    topic: 'english',
    label: 'English Literature, Grammar & Writing',
    category: 'Languages',
    keywords: [
      'english home tutor',
      'english tuition teacher',
      'english grammar tutor near me',
      'cbse english class 10 tutor',
      'creative writing mentor',
    ],
    description:
      'Enhance vocabulary, grammatical precision, creative comprehension, essay writing, and literature analysis with certified language mentors.',
    price: '₹500 - ₹1,000/hr',
    duration: '1 hr (2 sessions/week)',
    level: 'Class 1st to 12th & Spoken English',
    icon: 'BookOpen',
    curriculumHighlights: [
      'Tenses, Active-Passive Voice & Sentence Construction',
      'Formal Letter, Essay, Debate & Notice Writing',
      'Prose & Poetry Deep Reading & Theme Analysis',
      'Public Speaking, Accent & Pronunciation Coaching',
    ],
    isTopTopic: true,
  },

  // --- CODING, AI & TECH ---
  {
    topic: 'coding-for-kids',
    label: 'Coding for Kids & Young Innovators',
    category: 'STEM & Coding',
    keywords: [
      'coding for kids tutor',
      'kids programming classes',
      'scratch coding home tutor',
      'roblox game coding tutor',
      'stem coding teacher',
    ],
    description:
      'Introduce children aged 6-16 to block-based coding, game development, logic building, and creative animation with fun, interactive 1-on-1 mentorship.',
    price: '₹750 - ₹1,500/hr',
    duration: '1 hr (2 sessions/week)',
    level: 'Ages 6 to 16 (Beginner to Intermediate)',
    icon: 'Gamepad2',
    curriculumHighlights: [
      'Scratch 3.0 Game & Story Animation',
      'MIT App Inventor & Mobile App Creation',
      'Roblox Studio & Minecraft Lua Scripting',
      'Computational Thinking & Algorithmic Logic',
    ],
    isTopTopic: true,
  },
  {
    topic: 'python-programming',
    label: 'Python Programming & AI Basics',
    category: 'STEM & Coding',
    keywords: [
      'python home tutor',
      'python tutor near me',
      'learn python 1 on 1',
      'cbse class 11 12 computer science python',
      'python for data science tutor',
    ],
    description:
      'Learn the world’s #1 programming language from fundamentals to data structures, OOPs, CBSE CS Class 11-12 curriculum, and intro to Machine Learning.',
    price: '₹800 - ₹1,600/hr',
    duration: '1 hr (2-3 sessions/week)',
    level: 'School CBSE CS/IP, College & Professionals',
    icon: 'Code',
    curriculumHighlights: [
      'Variables, Loops, Functions & Data Structures',
      'Object-Oriented Programming (OOP) in Python',
      'Pandas, NumPy & Data Visualization (Matplotlib)',
      'CBSE Computer Science (083) Project & Exam Prep',
    ],
    isTopTopic: true,
  },
  {
    topic: 'web-development',
    label: 'Full-Stack Web Development (HTML/CSS/JS/React)',
    category: 'STEM & Coding',
    keywords: [
      'web development tutor',
      'html css javascript tutor',
      'react js mentor near me',
      'frontend web developer 1 on 1',
      'nextjs private tutor',
    ],
    description:
      'Build responsive, production-ready websites and modern full-stack web applications from scratch with individualized hands-on coding guidance.',
    price: '₹850 - ₹1,800/hr',
    duration: '1.5 hrs (2 sessions/week)',
    level: 'Beginner to Advanced (Project-Based)',
    icon: 'Globe',
    curriculumHighlights: [
      'HTML5 Semantic Markup & Modern CSS3 Flexbox/Grid',
      'JavaScript ES6+, DOM Manipulation & Async/Await',
      'React.js Component Architecture & State Hooks',
      'Full-Stack Portfolio Project Deployment',
    ],
    isTopTopic: false,
  },

  // --- BOARDS & INTERNATIONAL CURRICULA ---
  {
    topic: 'cbse-board',
    label: 'CBSE Board Prep (Classes 9, 10, 11 & 12)',
    category: 'Academics',
    keywords: [
      'cbse home tutor',
      'cbse class 10 board tutor',
      'cbse class 12 board coaching',
      'cbse private tutor near me',
    ],
    description:
      'Target 95%+ in CBSE Board exams with systematic NCERT coverage, case-based questions, exemplar problems, and weekly answer-sheet evaluation.',
    price: '₹600 - ₹1,300/hr',
    duration: '1-1.5 hrs (3 sessions/week)',
    level: 'Classes 9 to 12',
    icon: 'GraduationCap',
    curriculumHighlights: [
      '100% NCERT Textbook & Exemplar Coverage',
      'CBSE Blueprint & Competency-Based Questions',
      'Timed Full-Syllabus Mock Board Tests',
      'Answer Presentation & Step-Marking Strategies',
    ],
    isTopTopic: true,
  },
  {
    topic: 'icse-board',
    label: 'ICSE & ISC Board Tuition',
    category: 'Academics',
    keywords: [
      'icse home tutor',
      'isc board private tutor',
      'icse class 10 teacher',
      'icse maths science tutor',
    ],
    description:
      'Comprehensive tutoring tailored specifically for the rigorous ICSE & ISC syllabi with deep focus on detailed theoretical answers and numerical rigor.',
    price: '₹700 - ₹1,400/hr',
    duration: '1-1.5 hrs (3 sessions/week)',
    level: 'Classes 6 to 12 (ICSE / ISC)',
    icon: 'Award',
    curriculumHighlights: [
      'Selina & Frank textbook question solving',
      'In-depth English Literature & Merchant of Venice',
      'ICSE Numerical Physics & Chemistry Equations',
      'Past 10 Years ICSE Specimen Papers and Prelims',
    ],
    isTopTopic: false,
  },
  {
    topic: 'ib-diploma',
    label: 'IB DP (International Baccalaureate) & MYP',
    category: 'Academics',
    keywords: [
      'ib tutor near me',
      'ib diploma home tutor',
      'ib maths hl sl tutor',
      'ib physics internal assessment mentor',
      'ib extended essay guidance',
    ],
    description:
      'Specialized IB examiners and experienced educators guiding students through MYP and IB DP (HL/SL), Internal Assessments (IA), and Extended Essays (EE).',
    price: '₹1,500 - ₹3,000/hr',
    duration: '1 hr (2-3 sessions/week)',
    level: 'IB MYP & IB DP (HL & SL)',
    icon: 'Sparkles',
    curriculumHighlights: [
      'Maths Analysis & Approaches (AA) / Applications (AI)',
      'Physics, Chemistry & Biology HL/SL',
      'Internal Assessment (IA) Topic Selection & Structuring',
      'TOK & Extended Essay (EE) Academic Support',
    ],
    isTopTopic: true,
  },
  {
    topic: 'igcse-cambridge',
    label: 'Cambridge IGCSE & A-Levels',
    category: 'Academics',
    keywords: [
      'igcse home tutor',
      'cambridge a level tutor',
      'igcse past paper revision',
      'cambridge international tutor near me',
    ],
    description:
      'Expert tutoring aligned with Cambridge Assessment International Education (CAIE) syllabus, past paper marking schemes, and exam techniques.',
    price: '₹1,400 - ₹2,800/hr',
    duration: '1 hr (2-3 sessions/week)',
    level: 'IGCSE & A/AS Levels',
    icon: 'BookOpen',
    curriculumHighlights: [
      'Cambridge Core & Extended Math, Physics, Chemistry',
      'Past Paper 2, 4 & 6 Alternative to Practical revision',
      'Command words & Examiner report analysis',
      'Grade A* Strategic Revision Framework',
    ],
    isTopTopic: false,
  },

  // --- COMMERCE & ARTS ---
  {
    topic: 'accountancy',
    label: 'Accountancy (Class 11, 12, B.Com & CA Foundation)',
    category: 'Commerce & Arts',
    keywords: [
      'accountancy home tutor',
      'accounts tutor near me',
      'class 12 accounts private teacher',
      'ca foundation accounts tutor',
      'ts grewal accountancy tutor',
    ],
    description:
      'Master journal entries, balance sheets, partnership accounts, company accounts, and cash flow statements with top commerce educators.',
    price: '₹650 - ₹1,300/hr',
    duration: '1 hr (3 sessions/week)',
    level: 'Class 11, 12, B.Com & CA Foundation',
    icon: 'Briefcase',
    curriculumHighlights: [
      'Journalizing, Ledger Posting & Trial Balance',
      'Partnership Accounts (Admission, Retirement, Dissolution)',
      'Company Accounts: Shares & Debentures Issue',
      'Financial Statement Analysis & Cash Flow Statements',
    ],
    isTopTopic: true,
  },
  {
    topic: 'economics',
    label: 'Economics (Micro, Macro & Statistics)',
    category: 'Commerce & Arts',
    keywords: [
      'economics home tutor',
      'class 12 economics tutor near me',
      'macroeconomics private teacher',
      'ib economics hl sl tutor',
    ],
    description:
      'Understand economic models, market equilibrium, national income accounting, monetary policy, and statistical tools with clarity.',
    price: '₹600 - ₹1,200/hr',
    duration: '1 hr (2-3 sessions/week)',
    level: 'Class 11, 12, College & IB DP',
    icon: 'TrendingUp',
    curriculumHighlights: [
      'Consumer Behavior & Elasticity of Demand',
      'National Income & Aggregate Demand/Supply',
      'Indian Economic Development & Global Trends',
      'Data Interpretation & Graphical Curve Analysis',
    ],
    isTopTopic: false,
  },

  // --- COMPETITIVE EXAMS ---
  {
    topic: 'neet-prep',
    label: 'NEET UG Medical Entrance Preparation',
    category: 'Competitive Exams',
    keywords: [
      'neet home tutor',
      'neet 1 on 1 coaching',
      'neet private tutor near me',
      'neet biology physics chemistry tutor',
    ],
    description:
      'Intensive 1-on-1 coaching for NEET UG aspirants focusing on rapid NCERT revision, high-speed problem solving, and error-reduction strategies.',
    price: '₹1,000 - ₹2,200/hr',
    duration: '1.5-2 hrs (3-4 sessions/week)',
    level: 'Class 11, 12 & Droppers',
    icon: 'HeartPulse',
    curriculumHighlights: [
      'NCERT 360-degree Line-by-Line Life Science Coverage',
      'High-Yield Physics Numerical Shortcuts',
      'Organic & Inorganic Chemistry Speed Recall',
      'Full-Length Mock Test Analysis & Rank Improvement',
    ],
    isTopTopic: true,
  },
  {
    topic: 'jee-mains',
    label: 'JEE Main & Advanced Coaching',
    category: 'Competitive Exams',
    keywords: [
      'jee mains home tutor',
      'jee advanced physics maths tutor',
      'iit jee private tutor near me',
      'jee 1 on 1 mentor',
    ],
    description:
      'Personalized guidance from top IITian and NITian faculty to crack JEE Main & Advanced with deep conceptual foundations and speed math.',
    price: '₹1,200 - ₹2,500/hr',
    duration: '2 hrs (3-4 sessions/week)',
    level: 'Class 11, 12 & Droppers (IIT-JEE)',
    icon: 'Target',
    curriculumHighlights: [
      'Advanced Mechanics, Electrodynamics & Optics',
      'Complex Numbers, Calculus & Coordinate Geometry',
      'Physical Chemistry Multi-Concept Problems',
      'Time Management & Negative Marking Elimination',
    ],
    isTopTopic: true,
  },
];

// In-memory index map for O(1) query performance
const topicMap = new Map<string, SEOTopic>();
SEO_TOPICS.forEach((t) => {
  topicMap.set(t.topic.toLowerCase(), t);
});

export function getTopicBySlug(slug: string): SEOTopic | undefined {
  if (!slug) return undefined;
  return topicMap.get(slug.toLowerCase().trim());
}

export function getAllTopicSlugs(): string[] {
  return SEO_TOPICS.map((t) => t.topic);
}

export function getTopTopics(): SEOTopic[] {
  return SEO_TOPICS.filter((t) => t.isTopTopic);
}

export function getRelatedTopics(currentSlug: string, count: number = 6): SEOTopic[] {
  const current = getTopicBySlug(currentSlug);
  if (!current) return SEO_TOPICS.slice(0, count);

  const sameCategory = SEO_TOPICS.filter(
    (t) => t.topic !== current.topic && t.category === current.category
  );

  if (sameCategory.length >= count) {
    return sameCategory.slice(0, count);
  }

  const others = SEO_TOPICS.filter(
    (t) => t.topic !== current.topic && t.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, count);
}
