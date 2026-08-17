export interface SubjectSEO {
  slug: string;
  subjectName: string;
  targetGrades: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
  avgHourlyFee: string;
  avgMonthlyFee: string;
}

export const SUBJECT_SEO_PAGES: SubjectSEO[] = [
  {
    slug: 'maths-home-tutor-in-gurgaon',
    subjectName: 'Mathematics',
    targetGrades: 'Class 6 to 12 (CBSE, ICSE, IB, JEE Foundation)',
    metaTitle: 'Best Maths Home Tutors in Gurgaon (CBSE, ICSE, IB) | SSSAM Academy',
    metaDesc: 'Hire verified 1-on-1 Maths home tutors across Gurgaon (DLF Phase 1-5, Golf Course Rd, Sohna Rd, Sector 56). Conceptual clarity, board exam 95+ score strategy & 1 Free Demo.',
    h1: 'Best Mathematics Home Tutors in Gurgaon',
    intro: 'Mathematics requires conceptual clarity, step-by-step problem-solving discipline, and continuous practice. Our verified Maths tutors in Gurgaon specialize in transforming math anxiety into high exam confidence.',
    highlights: [
      'NCERT, RD Sharma, RS Aggarwal & Exemplar mastery for Class 9 & 10',
      'Calculus, Trigonometry & Coordinate Geometry specialized mentoring for Class 11 & 12',
      'IB Diploma Maths (AA & AI HL/SL) & Cambridge IGCSE international syllabus support',
      'Weekly chapter tests and speed-building shortcut techniques for competitive exams',
    ],
    faqs: [
      {
        question: 'How do your Maths home tutors in Gurgaon teach weak students?',
        answer: 'Our tutors start from foundational basics, identify exact calculation or conceptual gaps, and use step-by-step visual examples before moving to complex board exam questions.',
      },
      {
        question: 'What is the monthly fee for Class 10 & 12 Maths home tuition in Gurgaon?',
        answer: 'Fees typically range between ₹7,000 to ₹12,000 per month depending on frequency (3 to 5 classes per week) and board curriculum.',
      },
    ],
    avgHourlyFee: '₹800 – ₹1,200/hr',
    avgMonthlyFee: '₹7,500 – ₹11,000/mo',
  },
  {
    slug: 'physics-home-tutor-in-gurgaon',
    subjectName: 'Physics',
    targetGrades: 'Class 11 & 12 (CBSE, ISC, NEET & JEE Main)',
    metaTitle: 'Top Physics Home Tutors in Gurgaon (NEET & JEE) | SSSAM Academy',
    metaDesc: 'Book verified Physics home tutors in Gurgaon. Mechanics, Electromagnetism, Optics & numerical problem solving for CBSE Class 11-12 & competitive exams. 1 Free Demo.',
    h1: 'Expert Physics Home Tutors in Gurgaon',
    intro: 'Physics is the science of understanding nature through mathematical concepts. Our Gurgaon Physics educators focus heavily on derivation clarity and numerical problem solving without rote memorization.',
    highlights: [
      'Comprehensive coverage of Mechanics, Thermodynamics, Electrodynamics & Modern Physics',
      'HC Verma and SL Arora numerical problem-solving sessions',
      'NEET & JEE Main foundation question banks and past 10-year paper solutions',
      'Practical lab experiment concepts and viva preparation',
    ],
    faqs: [
      {
        question: 'Do your Physics tutors help with numericals for Class 12 Boards and NEET?',
        answer: 'Yes! Over 60% of class time is dedicated to solving standard HC Verma and previous year board/NEET numerical questions step-by-step.',
      },
    ],
    avgHourlyFee: '₹900 – ₹1,400/hr',
    avgMonthlyFee: '₹8,000 – ₹13,000/mo',
  },
  {
    slug: 'chemistry-home-tutor-in-gurgaon',
    subjectName: 'Chemistry',
    targetGrades: 'Class 9 to 12 (Organic, Inorganic, Physical Chemistry)',
    metaTitle: 'Best Chemistry Home Tutors in Gurgaon | SSSAM Academy',
    metaDesc: 'Find top Organic, Inorganic & Physical Chemistry home tutors in Gurgaon for CBSE 12th boards & NEET. Conceptual mechanism clarity with free demo class.',
    h1: 'Top Chemistry Home Tutors in Gurgaon',
    intro: 'Mastering Organic reaction mechanisms, Inorganic chemical bonding trends, and Physical Chemistry numericals with personalized 1-on-1 home tutoring in Gurgaon.',
    highlights: [
      'In-depth Organic reaction mechanisms, named reactions, and conversion charts',
      'Physical Chemistry formula practice and stoichiometric calculations',
      'Periodic trends, coordination compounds, and block chemistry memory maps',
      'CBSE, ICSE & IB Diploma chemistry laboratory concepts',
    ],
    faqs: [
      {
        question: 'How do tutors simplify Organic Chemistry for Class 12?',
        answer: 'Tutors use reaction roadmaps and electron-pushing mechanisms so students understand why a reaction happens rather than memorizing blindly.',
      },
    ],
    avgHourlyFee: '₹850 – ₹1,300/hr',
    avgMonthlyFee: '₹7,500 – ₹12,000/mo',
  },
  {
    slug: 'computer-science-python-tutor-in-gurgaon',
    subjectName: 'Computer Science, Python & AI',
    targetGrades: 'Class 8 to 12 (CBSE / ICSE / Coding for Kids)',
    metaTitle: 'Python & Computer Science Home Tutors in Gurgaon | SSSAM Academy',
    metaDesc: 'Expert Computer Science & Python home tutors in Gurgaon powered by SSSAM Academy Sector 14. CBSE Class 11-12 Python, SQL, DSA & Web Development for school kids.',
    h1: 'Python & Computer Science Tutors in Gurgaon',
    intro: 'Powered by SSSAM Academy (Sector 14 Gurugram), our computer science educators teach practical coding, algorithmic logic, CBSE Python syllabus, MySQL database connectivity, and modern AI/Web development.',
    highlights: [
      'CBSE Class 11 & 12 Computer Science (Python, File Handling, Stack, SQL & Networks)',
      'Practical coding sessions on IDEs with live debugging exercises',
      'Project file submission, practical exam preparation & viva coaching',
      'Kid coding courses: Scratch, Python, HTML/CSS, and Web Development basics',
    ],
    faqs: [
      {
        question: 'Are your CS tutors experienced with the latest CBSE Python syllabus?',
        answer: 'Yes! All computer science mentors are verified software instructors from SSSAM Academy with deep mastery of the latest CBSE 2026 curriculum.',
      },
    ],
    avgHourlyFee: '₹950 – ₹1,500/hr',
    avgMonthlyFee: '₹8,500 – ₹14,000/mo',
  },
  {
    slug: 'accounts-commerce-home-tutor-in-gurgaon',
    subjectName: 'Accountancy, Commerce & Economics',
    targetGrades: 'Class 11 & 12 (CBSE / ISC / Foundation)',
    metaTitle: 'Best Accounts & Commerce Home Tutors in Gurgaon | SSSAM Academy',
    metaDesc: 'Hire top Class 11 & 12 Accountancy, Economics & Business Studies home tutors in Gurgaon (DLF, Golf Course, Sohna Rd). Practical balance sheet solving & free demo.',
    h1: 'Accounts & Commerce Home Tutors in Gurgaon',
    intro: 'Clear journal entries, partnership accounts, company balance sheets, cash flow statements, and micro/macroeconomics with Gurgaon’s top commerce educators.',
    highlights: [
      'Partnership firms, admission, retirement, dissolution & company share capital accounts',
      'Microeconomics, Macroeconomics & Indian Economic Development case study analysis',
      'TS Grewal, DK Goel & Sandeep Garg standard textbook problem solving',
      'Preparation for CA Foundation and CUET commerce domain entrance exams',
    ],
    faqs: [
      {
        question: 'Do you provide home tutors for both Accounts and Economics together?',
        answer: 'Yes! We have specialized commerce educators who take combined packages for Accountancy, Business Studies, and Economics.',
      },
    ],
    avgHourlyFee: '₹850 – ₹1,250/hr',
    avgMonthlyFee: '₹7,500 – ₹11,500/mo',
  },
  {
    slug: 'ib-igcse-tutors-in-gurgaon',
    subjectName: 'IB (MYP/DP) & Cambridge IGCSE Elite',
    targetGrades: 'International Baccalaureate & Cambridge Board',
    metaTitle: 'Elite IB & IGCSE Home Tutors in Gurgaon | SSSAM Academy',
    metaDesc: 'Top-tier IB Diploma (HL/SL) & Cambridge IGCSE home and online tutors in Gurgaon for students of The Shri Ram School, Heritage, Pathways & DPS International.',
    h1: 'Elite IB & IGCSE International Tutors in Gurgaon',
    intro: 'Tailored 1-on-1 mentorship for students of premier international schools in Gurgaon. Our certified IB/IGCSE educators assist with internal assessments (IAs), extended essays (EEs), and past paper exam training.',
    highlights: [
      'IB DP Mathematics (Analysis & Approaches, Applications & Interpretation HL/SL)',
      'IB Physics, Chemistry, Biology & Economics IA mentorship',
      'Cambridge IGCSE past paper mastery with marking scheme rubrics',
      'Tutors experienced with The Shri Ram School, Heritage, Pathways, and Scottish High curricula',
    ],
    faqs: [
      {
        question: 'Are your tutors familiar with IB Internal Assessments (IAs) and criteria?',
        answer: 'Yes, our IB specialist mentors guide students on IA research questions, experimental data analysis, and rubric evaluation.',
      },
    ],
    avgHourlyFee: '₹1,500 – ₹2,500/hr',
    avgMonthlyFee: '₹14,000 – ₹24,000/mo',
  },
  {
    slug: 'female-home-tutors-in-gurgaon',
    subjectName: 'Female Home Tutors (Verified Lady Teachers)',
    targetGrades: 'Primary to Class 10 & Girl Student Mentorship',
    metaTitle: 'Verified Female Home Tutors in Gurgaon | SSSAM Academy',
    metaDesc: 'Hire verified, police-cleared lady home tutors in Gurgaon for girl students and primary classes (DLF, Golf Course, Nirvana, Sohna Rd). 100% safety & free demo.',
    h1: 'Verified Female Home Tutors in Gurgaon',
    intro: 'Trusted, background-verified lady educators for primary foundation, ICSE/CBSE board prep, and dedicated girl student home tutoring across Gurgaon residential complexes.',
    highlights: [
      '100% ID, Degree & Police Background Checked Female Educators',
      'Patient, child-friendly teaching methods for early childhood and primary classes',
      'Dedicated guidance for girl students in Science, Maths, Social Studies & English',
      'Regular WhatsApp attendance and progress reports shared directly with parents',
    ],
    faqs: [
      {
        question: 'Can I request a verified female tutor for my daughter in Gurgaon?',
        answer: 'Yes, absolutely! Over 45% of our Gurgaon tutor matches are dedicated female educators. We ensure strict background verification and counselor monitoring.',
      },
      {
        question: 'What subjects do female home tutors cover?',
        answer: 'Our female educators cover all subjects from Class 1 to 5, as well as specialized Maths, Science, English, and Humanities for Class 6 to 12.',
      },
    ],
    avgHourlyFee: '₹750 – ₹1,200/hr',
    avgMonthlyFee: '₹7,000 – ₹11,000/mo',
  },
  {
    slug: 'primary-school-home-tutor-in-gurgaon',
    subjectName: 'Primary School (Class 1 to 5 All Subjects)',
    targetGrades: 'Class 1 to 5 (CBSE, ICSE, IB Primary Years Programme)',
    metaTitle: 'Best Primary School Home Tutors in Gurgaon (Class 1-5) | SSSAM Academy',
    metaDesc: 'Hire experienced Class 1 to 5 home tutors in Gurgaon for all subjects (English, Maths, EVS, Hindi). Phonics, handwriting & mental math foundation. 1 Free Demo.',
    h1: 'Best Primary School Home Tutors in Gurgaon (Class 1 - 5)',
    intro: 'Build strong early academic foundations with caring, experienced primary educators. We focus on reading fluency, mental maths, conceptual understanding, and consistent homework discipline.',
    highlights: [
      'All-subject homework support: English, Mathematics, Science/EVS, Hindi',
      'Phonics, reading comprehension, vocabulary, and creative writing',
      'Mental math speed, tables mastery, and logical puzzle solving',
      'Alignment with DPS, Heritage, Pathways, Shri Ram, and Shiv Nadar school homework',
    ],
    faqs: [
      {
        question: 'Does one tutor teach all subjects for primary classes?',
        answer: 'Yes, for Class 1 to 5, our primary specialists teach all core school subjects (Maths, English, Science/EVS, Hindi) in a daily structured schedule.',
      },
    ],
    avgHourlyFee: '₹600 – ₹900/hr',
    avgMonthlyFee: '₹6,000 – ₹9,000/mo',
  },
  {
    slug: 'biology-neet-home-tutor-in-gurgaon',
    subjectName: 'Biology & NEET Medical Prep',
    targetGrades: 'Class 9 to 12 (Botany, Zoology, NEET-UG)',
    metaTitle: 'Top Biology & NEET Home Tutors in Gurgaon | SSSAM Academy',
    metaDesc: 'Expert Biology home tutors in Gurgaon for CBSE 12th Boards & NEET-UG 360/360 score target. Line-by-line NCERT diagrams, genetics & physiology clarity. 1 Free Demo.',
    h1: 'Expert Biology & NEET Medical Tutors in Gurgaon',
    intro: 'Master NCERT line-by-line Botany, Zoology, Genetics, Human Physiology, and NEET-UG high-yield question patterns with Gurgaon’s top medical educators.',
    highlights: [
      '100% NCERT line-by-line diagram, flowchart, and keyword retention techniques',
      'Genetics, Molecular Biology, Biotechnology & Ecology deep conceptual clarity',
      'NEET past 15-year assertion-reason questions and timed mock tests',
      'CBSE Class 12 board practicals, spotting, and viva coaching',
    ],
    faqs: [
      {
        question: 'Do your biology tutors help targeting 350+ marks in NEET Biology?',
        answer: 'Yes! Our tutors use NCERT highlight trackers, mnemonic techniques, and chapter-wise NEET PYQs to ensure maximum speed and accuracy.',
      },
    ],
    avgHourlyFee: '₹900 – ₹1,400/hr',
    avgMonthlyFee: '₹8,000 – ₹13,000/mo',
  },
  {
    slug: 'economics-business-studies-tutor-in-gurgaon',
    subjectName: 'Economics & Business Studies',
    targetGrades: 'Class 11 & 12 (CBSE / ISC / CUET Commerce)',
    metaTitle: 'Best Economics & Business Studies Tutors in Gurgaon | SSSAM Academy',
    metaDesc: 'Hire top Class 11-12 Economics (Micro/Macro) and Business Studies tutors in Gurgaon. Case study mastery, CUET commerce preparation & free trial class.',
    h1: 'Economics & Business Studies Tutors in Gurgaon',
    intro: 'Master Microeconomics, Macroeconomic models, Indian Economic Development, and Business Management case studies with Gurgaon’s experienced commerce faculty.',
    highlights: [
      'Microeconomics diagrams, elasticity calculations, and cost-revenue curves',
      'Macroeconomics national income accounting, banking, and government budget models',
      'Business Studies case study decoding methods for CBSE 95+ score target',
      'CUET Commerce domain preparation and sample paper evaluation',
    ],
    faqs: [
      {
        question: 'How do tutors teach Business Studies case studies for Class 12 Boards?',
        answer: 'Tutors teach keyword identification techniques to pinpoint exact management principles and financial decisions asked in 4-mark and 6-mark board case studies.',
      },
    ],
    avgHourlyFee: '₹800 – ₹1,200/hr',
    avgMonthlyFee: '₹7,500 – ₹11,000/mo',
  },
];
