export interface SoftSkillDayData {
  day: number;
  title: string;
  module: string;
  meaning?: string;
  importance?: string[];
  benefits?: string[];
  steps?: string[];
  skills?: string[];
  positivePoints?: string[];
  negativePoints?: string[];
  comparison?: { feature: string; col1: string; col2: string }[];
  matrix?: { category: string; action: string }[];
  sampleSchedule?: { activity: string; time: string }[];
  structure?: string[];
  tips?: string[];
  phrases?: { category?: string; items: string[] }[];
  example?: string;
  sampleAnswer?: string;
  hrQuestions?: { q: string; a: string }[];
  practiceQuestions: string[];
  dailyActivity: string;
  practicalTask?: string;
}

export const SOFT_SKILLS_CURRICULUM: Record<number, SoftSkillDayData> = {
  1: {
    day: 1,
    title: 'Introduction to Active Listening',
    module: 'Part 1: Active Listening (Days 1–10)',
    meaning: 'Active listening means listening carefully, understanding the speaker and responding properly.',
    importance: [
      'Helps understand instructions clearly.',
      'Avoids misunderstandings and costly errors.',
      'Improves professional communication and collaboration.',
      'Builds confidence during discussions.',
      'Crucial during technical and HR interviews.'
    ],
    example: 'An interviewer asks, "Tell me about your final-year project." Listen attentively to the complete question and context before jumping into an answer.',
    practiceQuestions: [
      'What is active listening?',
      'Why is active listening important?',
      'What is the difference between hearing and listening?'
    ],
    dailyActivity: 'Listen to a 2-minute English speech or technical talk and write down five important points.'
  },
  2: {
    day: 2,
    title: 'Hearing vs Active Listening',
    module: 'Part 1: Active Listening (Days 1–10)',
    comparison: [
      { feature: 'Process', col1: 'Natural involuntary physical process', col2: 'Conscious intentional effort' },
      { feature: 'Focus', col1: 'Only receiving sound vibrations', col2: 'Understanding meaning and intent' },
      { feature: 'Attention', col1: 'May not require attention or focus', col2: 'Requires sustained concentration' },
      { feature: 'Nature', col1: 'Passive reception', col2: 'Active engagement and response' }
    ],
    example: 'Hearing a teacher speak is just auditory awareness; active listening is understanding the concepts and noting down the key instructions.',
    practiceQuestions: [
      'Define hearing.',
      'Define active listening.',
      'Give two key differences between hearing and active listening.'
    ],
    dailyActivity: 'Listen to a short video without looking at subtitles. Write a concise 3-line summary of what was communicated.'
  },
  3: {
    day: 3,
    title: 'Importance of Eye Contact',
    module: 'Part 1: Active Listening (Days 1–10)',
    meaning: 'Eye contact means looking at the speaker naturally and comfortably while communicating.',
    benefits: [
      'Shows genuine attention and interest.',
      'Builds interpersonal trust and credibility.',
      'Demonstrates confidence and professionalism.',
      'Helps create a strong, positive first impression in interviews.'
    ],
    tips: [
      'Maintain natural eye contact (the 50/70 rule: 50% while speaking, 70% while listening).',
      'Avoid continuously staring unblinkingly; blink and nod naturally.',
      'Look at the speaker when they explain critical instructions or questions.'
    ],
    practiceQuestions: [
      'What is eye contact?',
      'How does eye contact improve communication?',
      'Why should we avoid unblinking staring?'
    ],
    dailyActivity: 'Practise speaking for one minute while maintaining natural eye contact with a mirror.'
  },
  4: {
    day: 4,
    title: 'Body Language',
    module: 'Part 1: Active Listening (Days 1–10)',
    meaning: 'Body language is non-verbal communication expressed through facial expressions, gestures, posture and movements.',
    positivePoints: [
      'Straight, open and upright posture.',
      'Friendly and approachable facial expression.',
      'Natural, calm hand gestures.',
      'Appropriate and confident eye contact.'
    ],
    negativePoints: [
      'Looking down continuously at the floor or lap.',
      'Crossing arms defensively across the chest.',
      'Fidgeting with pens, fingers or clothes.',
      'Constantly avoiding eye contact.'
    ],
    practiceQuestions: [
      'What is body language?',
      'Mention four positive body-language habits.',
      'How does body language affect interviewer perception in placements?'
    ],
    dailyActivity: 'Record a one-minute video of your self-introduction and observe your posture, facial expression and gestures.'
  },
  5: {
    day: 5,
    title: 'Understanding Instructions',
    module: 'Part 1: Active Listening (Days 1–10)',
    steps: [
      'Listen to the complete instruction without interrupting.',
      'Identify the main deliverable or task.',
      'Note down important details (format, constraints, technology).',
      'Ask clarifying questions if anything is ambiguous.',
      'Repeat the instruction in your own words to confirm alignment.'
    ],
    example: 'A team leader asks you to prepare a presentation with five slides by Friday. Identify the task (presentation), slide count (5), and deadline (Friday).',
    practiceQuestions: [
      'Why should instructions be understood clearly before starting work?',
      'What should you do when instructions are unclear or incomplete?',
      'What key details should you note from a project instruction?'
    ],
    dailyActivity: 'Listen to a software tutorial and write down its instructions in sequential order.'
  },
  6: {
    day: 6,
    title: 'Asking Questions and Clarification',
    module: 'Part 1: Active Listening (Days 1–10)',
    meaning: 'Asking clarifying questions demonstrates attentiveness, prevents costly mistakes, and ensures exact alignment with expectations.',
    phrases: [
      {
        category: 'Polite Clarification Phrases',
        items: [
          '"Could you please explain that again?"',
          '"Can you clarify this specific point?"',
          '"Did you mean that we should submit the draft today?"',
          '"Could you give me an example to illustrate this?"'
        ]
      }
    ],
    practiceQuestions: [
      'Why is clarification important in workplace communication?',
      'When is the right time to ask questions during a briefing?',
      'Write three polite clarification phrases you can use in an interview or team meeting.'
    ],
    dailyActivity: 'Prepare five thoughtful questions you could politely ask a trainer or manager about a new technical architecture.'
  },
  7: {
    day: 7,
    title: 'Listening to Different Speakers',
    module: 'Part 1: Active Listening (Days 1–10)',
    meaning: 'In global IT companies, you collaborate with colleagues and clients who speak with diverse accents, paces, and communication styles.',
    tips: [
      'Focus primarily on the core message and main idea rather than accent.',
      'Never interrupt or make assumptions.',
      'Listen actively for technical keywords and action verbs.',
      'Ask for polite repetition or written confirmation if unclear.',
      'Regularly expose yourself to podcasts, tech talks, and interviews with diverse English speakers.'
    ],
    practiceQuestions: [
      'Why is listening to diverse speakers an essential skill for IT engineers?',
      'What should you do if you cannot understand an unfamiliar accent?',
      'How can you systematically improve your listening comprehension?'
    ],
    dailyActivity: 'Listen to two short English talks by speakers from different regions (e.g. US, UK, India) and summarize their main ideas.'
  },
  8: {
    day: 8,
    title: 'Listening in Group Discussions',
    module: 'Part 1: Active Listening (Days 1–10)',
    positivePoints: [
      'Allow others to finish speaking before responding.',
      'Understand their perspectives before forming a counter-argument.',
      'Never interrupt rudely or talk over others.',
      'Build upon what previous speakers contributed.',
      'Respect differing viewpoints with maturity.'
    ],
    phrases: [
      {
        category: 'Group Discussion Useful Phrases',
        items: [
          '"I understand your point, and..."',
          '"That is an interesting idea; building on that..."',
          '"I would like to add an important dimension to this..."',
          '"I agree with your suggestion because the data indicates..."'
        ]
      }
    ],
    practiceQuestions: [
      'What is the role of active listening in placement group discussions?',
      'How should you constructively respond to an opposing opinion?',
      'Why should you avoid interrupting other candidates?'
    ],
    dailyActivity: 'Watch or listen to a mock group discussion and write down three distinct perspectives shared by participants.'
  },
  9: {
    day: 9,
    title: 'Listening and Note-Taking',
    module: 'Part 1: Active Listening (Days 1–10)',
    meaning: 'Note-taking is capturing essential information, constraints, decisions and action points while listening to a speaker or meeting.',
    positivePoints: [
      'Main topic and core objective.',
      'Key technical terminology and variables.',
      'Specific dates, milestones and deadlines.',
      'Action items assigned to individuals.',
      'Key illustrative examples or caveats.'
    ],
    example: 'Meeting instruction: "Complete the homepage layout, test the login authentication flow, and submit the PR by Monday 5 PM." Notes: 1. Homepage layout complete 2. Login auth testing 3. Monday 5 PM PR deadline.',
    practiceQuestions: [
      'What is effective note-taking?',
      'Mention four critical elements to capture during a project sync meeting.',
      'How does note-taking help students retain technical briefings?'
    ],
    dailyActivity: 'Listen to a 3-minute educational video or podcast and prepare five clear, structured bullet points.'
  },
  10: {
    day: 10,
    title: 'Active Listening Assessment',
    module: 'Part 1: Active Listening (Days 1–10)',
    meaning: 'Comprehensive milestone test reviewing Hearing vs Listening, Eye Contact, Body Language, Instruction Comprehension, Clarifications, Group Discussions, and Note-taking.',
    practiceQuestions: [
      '1. Define active listening.',
      '2. Mention five benefits of active listening.',
      '3. Give two differences between hearing and listening.',
      '4. What is the importance of eye contact?',
      '5. How can body language affect communication?',
      '6. What should you do when instructions are unclear?',
      '7. Why is note-taking important in meetings?',
      '8. How can listening help during an interview?',
      '9. How should you respond to another person\'s opinion?',
      '10. Give three ways to improve listening skills.'
    ],
    dailyActivity: 'Listen to a 3-minute English speech and deliver a 1-minute oral or written summary without reading from notes.',
    practicalTask: 'Record your answers to all 10 assessment questions in your activity notes and grade your confidence.'
  },
  11: {
    day: 11,
    title: 'Introduction to Problem Solving',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Problem solving is the cognitive ability to identify an issue, understand its root cause, and systematically develop a feasible solution.',
    steps: [
      '1. Identify and define the problem clearly.',
      '2. Understand the root cause and underlying factors.',
      '3. Brainstorm multiple possible solutions.',
      '4. Select the best solution based on feasibility, cost and impact.',
      '5. Implement the solution and evaluate results.'
    ],
    example: 'Your web application is not opening. Check internet connection, browser console errors, server terminal logs, and recent code changes to pinpoint the failure.',
    practiceQuestions: [
      'What is problem solving?',
      'List the five steps of the problem-solving framework.',
      'Why is problem solving rated the #1 skill sought by IT recruiters?'
    ],
    dailyActivity: 'Identify one practical bug or problem you faced today and document your step-by-step resolution.'
  },
  12: {
    day: 12,
    title: 'Identifying Problems',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Problem identification means diagnosing the exact discrepancy between what was expected and what is actually occurring before attempting fixes.',
    steps: [
      'Carefully observe the situation or error message.',
      'Collect relevant log data, inputs and context.',
      'Compare Expected Result vs Actual Result.',
      'Isolate the core bottleneck from secondary symptoms.'
    ],
    example: 'Expected result: Submitting the form logs in the user and redirects to dashboard. Actual result: Form button hangs and console logs 500 Internal Server Error. Problem: The server authentication endpoint failed to respond.',
    practiceQuestions: [
      'What is problem identification?',
      'Why is it dangerous to attempt solving an issue before identifying it precisely?',
      'Give one real-world software issue and specify the Expected vs Actual result.'
    ],
    dailyActivity: 'Identify three inefficiencies or friction points in your daily college study routine and write them down clearly.'
  },
  13: {
    day: 13,
    title: 'Root Cause Analysis',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Root cause analysis means uncovering the fundamental source of a failure rather than merely treating its surface symptoms.',
    example: '5 Whys Technique:\n• Why is the website down? The backend server crashed.\n• Why did the server crash? It threw an unhandled database exception.\n• Why did it throw an exception? The database connection pool was exhausted.\n• Why was it exhausted? Connections were not closed after requests.\n• Why were connections left open? There was no connection pool cleanup middleware.\n-> Root cause: Missing connection pool lifecycle management.',
    practiceQuestions: [
      'What is root cause analysis?',
      'Explain the "5 Whys" technique with an example.',
      'Why is addressing root causes better than repeatedly fixing symptoms?'
    ],
    dailyActivity: 'Select an error or problem you recently experienced and run a 5 Whys drill down to the fundamental cause.'
  },
  14: {
    day: 14,
    title: 'Critical Thinking',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Critical thinking is the objective analysis and evaluation of an issue or claim to form a rational judgment.',
    skills: [
      'Observe verifiable facts rather than emotions.',
      'Question assumptions and established defaults.',
      'Scrutinize evidence and source credibility.',
      'Weigh trade-offs across competing alternatives.',
      'Avoid cognitive biases and hasty generalizations.',
      'Reach conclusions through sound logic.'
    ],
    example: 'Before choosing an online certification, critically evaluate its curriculum rigor, instructor credibility, hands-on labs, industry recognition, and prerequisite requirements.',
    practiceQuestions: [
      'Define critical thinking in a software engineering context.',
      'Mention four foundational critical-thinking skills.',
      'Why should technical decisions be based on empirical facts rather than opinion?'
    ],
    dailyActivity: 'Compare two free web development learning platforms (e.g. freeCodeCamp vs Cisco NetAcad) and write a short critical evaluation.'
  },
  15: {
    day: 15,
    title: 'Decision Making',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Decision making is selecting the most effective course of action among multiple competing alternatives.',
    steps: [
      '1. Define the decision to be made clearly.',
      '2. Gather all relevant constraints (time, budget, skillset).',
      '3. Enumerate possible options.',
      '4. Compare pros, cons and trade-offs of each option.',
      '5. Select the optimal choice with calculated confidence.',
      '6. Execute and review the outcome against objectives.'
    ],
    example: 'You have two final-year project ideas (e.g. AI chatbot vs Hospital Management System). Compare complexity, timeline, tools, database requirements, and interview impact before committing.',
    practiceQuestions: [
      'What is decision making?',
      'Outline the six-step decision-making process.',
      'What criteria should be prioritized when deciding on technical architectures?'
    ],
    dailyActivity: 'Pick an upcoming academic or career decision, list three options, and outline their advantages and trade-offs.'
  },
  16: {
    day: 16,
    title: 'Creative Thinking',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Creative thinking is looking at challenges from unconventional angles to generate innovative solutions and design better systems.',
    tips: [
      'Brainstorming without premature criticism.',
      'Mind mapping ideas and interconnecting concepts.',
      'Reframing the problem from the end-user\'s viewpoint.',
      'Combining established technologies in novel workflows.',
      'Testing lateral solutions and prototypes.'
    ],
    example: 'Instead of manually recording classroom attendance on paper sheets, design a progressive web app with QR code scanning or student ID barcode check-in.',
    practiceQuestions: [
      'What is creative thinking?',
      'What is brainstorming and what are its key rules?',
      'Mention three workplace benefits of innovative problem solving.'
    ],
    dailyActivity: 'Brainstorm and write five creative project ideas for applications that solve real student problems.'
  },
  17: {
    day: 17,
    title: 'Time Management and Prioritisation',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Time management is the discipline of planning and controlling how to divide your hours between specific activities to maximize output.',
    matrix: [
      { category: 'Urgent & Important (Quadrant 1)', action: 'Do Immediately (e.g. submission deadlines, critical bugs)' },
      { category: 'Important, Not Urgent (Quadrant 2)', action: 'Schedule & Protect Time (e.g. placement prep, skill learning, projects)' },
      { category: 'Urgent, Not Important (Quadrant 3)', action: 'Delegate or Minimize (e.g. interruptions, routine notifications)' },
      { category: 'Neither Urgent Nor Important (Quadrant 4)', action: 'Eliminate or Restrict (e.g. mindless social scrolling)' }
    ],
    sampleSchedule: [
      { activity: 'Quantitative Aptitude practice', time: '20 minutes' },
      { activity: 'Logical Reasoning quiz', time: '20 minutes' },
      { activity: 'Soft skills & interview prep', time: '10 minutes' },
      { activity: 'Formula & mistake revision', time: '10 minutes' }
    ],
    practiceQuestions: [
      'What is time management?',
      'What is task prioritisation?',
      'Explain the Eisenhower Decision Matrix and how it guides daily productivity.'
    ],
    dailyActivity: 'Draft your hourly schedule for tomorrow using the Eisenhower Matrix to prioritize placement preparation.'
  },
  18: {
    day: 18,
    title: 'Handling Challenges and Stress',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Resilience is maintaining emotional composure, analytical clarity, and focus when facing unexpected roadblocks or high-pressure situations.',
    positivePoints: [
      'Stay calm and breathe before reacting.',
      'Deconstruct overwhelming problems into small, manageable units.',
      'Seek guidance from mentors or documentation when stuck.',
      'Direct energy toward actionable solutions rather than frustration.',
      'Treat setbacks as diagnostic learning experiences.'
    ],
    example: 'If your project submission is 24 hours away and unexpected bugs emerge, do not panic. Triage bugs by severity, fix critical blockers first, and test methodically.',
    practiceQuestions: [
      'How do you manage stress and pressure in difficult situations?',
      'Why is emotional composure essential for effective debugging and problem solving?',
      'What structured steps should you take when you hit a coding dead end?'
    ],
    dailyActivity: 'Write a brief reflection on a challenging situation you overcame and what it taught you about problem solving under pressure.'
  },
  19: {
    day: 19,
    title: 'Teamwork and Collaborative Problem Solving',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Teamwork is the collaborative effort of a group to achieve a common goal effectively and harmoniously.',
    skills: [
      'Active cooperation and reliability.',
      'Mutual respect and openness to diverse ideas.',
      'Transparent and consistent communication.',
      'Accountability for assigned modules and deliverables.',
      'Proactively assisting teammates facing bottlenecks.'
    ],
    example: 'In a full-stack project, one engineer crafts the React UI, another develops Express API endpoints, and a third designs PostgreSQL schemas and runs automated tests.',
    practiceQuestions: [
      'What is teamwork in modern software engineering?',
      'Mention five essential qualities of an exceptional team player.',
      'How does collaborative problem solving outperform isolated effort?'
    ],
    dailyActivity: 'Pair up with a peer or classmate to solve a logical puzzle or review each other\'s project architecture.'
  },
  20: {
    day: 20,
    title: 'Problem Solving Assessment',
    module: 'Part 2: Problem Solving (Days 11–20)',
    meaning: 'Comprehensive assessment covering Problem Identification, Root Cause Analysis, Critical Thinking, Decision Making, Creative Thinking, Time Management, and Teamwork.',
    practiceQuestions: [
      '1. Define problem solving.',
      '2. What are the five steps of the problem-solving cycle?',
      '3. What is root cause analysis?',
      '4. Explain the 5 Whys technique.',
      '5. What is critical thinking?',
      '6. What is the difference between creative thinking and critical thinking?',
      '7. Explain the decision-making framework.',
      '8. What is prioritisation and the Eisenhower Matrix?',
      '9. How do you handle a complex, high-pressure task?',
      '10. Why is collaborative problem solving vital in IT organizations?'
    ],
    dailyActivity: 'Scenario: Your college project demo website crashes 30 minutes before the review panel starts. Write a detailed, step-by-step diagnostic and recovery plan.',
    practicalTask: 'Write out your troubleshooting plan in the notes area and rate your confidence from 1 to 10.'
  },
  21: {
    day: 21,
    title: 'Self-Introduction',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'A self-introduction (Tell Me About Yourself) is a professional overview of your identity, educational background, technical competencies, projects, and career aspirations.',
    structure: [
      '1. Professional Greeting ("Good morning/afternoon, Sir/Ma\'am")',
      '2. Full Name',
      '3. Educational Degree and Institution',
      '4. Core Technical Skills and Languages',
      '5. Key Projects and Practical Work',
      '6. Key Strengths (quick learner, problem solver)',
      '7. Professional Career Goal',
      '8. Polite Closing ("Thank you for this opportunity")'
    ],
    sampleAnswer: '"Good morning. I am a final-year computer applications student. I have developed strong foundational knowledge in data structures, JavaScript, TypeScript, React, and relational database systems. I have built practical applications, including a placement tracking portal and student management systems. My strengths include rapid learning, systematic debugging, and adaptability to new technologies. My goal is to begin my career in an innovative IT organization where I can contribute to production software and expand my engineering expertise. Thank you."',
    practiceQuestions: [
      'Tell me about yourself.',
      'What are your primary educational qualifications and highlights?',
      'What are your key strengths that make you suited for this role?',
      'What is your short-term and long-term career goal?'
    ],
    dailyActivity: 'Draft your personalized self-introduction following the 8-step structure, practice speaking aloud for 1–2 minutes, and refine your delivery.'
  },
  22: {
    day: 22,
    title: 'Resume Explanation',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'Resume explanation is the ability to articulate every line of your resume with authenticity, depth, and technical clarity.',
    positivePoints: [
      'Career Objective: Clear, professional and value-focused.',
      'Education: College, degree, GPA and academic achievements.',
      'Technical Skills: Languages, frameworks, tools and databases.',
      'Projects: Real problem, architecture, stack, your role and impact.',
      'Certifications: Credential names, issuing organizations and verified skills.'
    ],
    example: 'Interviewer: "You listed PostgreSQL and Drizzle ORM on your resume. Where did you use them?" Answer: "I used PostgreSQL with Drizzle ORM to build the persistent database layer for our placement quest application, defining relational schemas with foreign key cascades and using connection pooling for queries."',
    practiceQuestions: [
      'Walk me through your resume.',
      'Why did you choose your degree and field of study?',
      'What are your top three technical proficiencies?',
      'Which certification on your resume provided the greatest practical knowledge?'
    ],
    dailyActivity: 'Review every item on your resume and write a concise 1–2 sentence explanation for each section.'
  },
  23: {
    day: 23,
    title: 'Project Explanation',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'Project explanation is presenting the problem statement, technical stack, architecture, features, engineering challenges, and future roadmap of your work.',
    structure: [
      '1. Project Title & Overview',
      '2. Real-World Problem Statement',
      '3. Target Users & Objectives',
      '4. Technologies Used (Frontend, Backend, Database)',
      '5. Key Functional Modules & Architecture',
      '6. Your Personal Role & Contributions',
      '7. Technical Challenges Faced & How You Overcame Them',
      '8. Future Enhancements & Live Demo URL'
    ],
    example: '"My project is Placement Quest, an interactive gamified web portal built to help students systematically master Aptitude, Logical Reasoning, and Soft Skills. I developed the frontend in React and TypeScript with Tailwind CSS, implemented authentication and real-time synchronization, and structured relational PostgreSQL database tables. One key challenge was handling state synchronization across tabs, which I solved by creating debounced sync queues."',
    practiceQuestions: [
      'Can you explain the architecture and purpose of your main project?',
      'Why did you select this particular technical stack?',
      'What was the toughest technical bug or roadblock you encountered, and how did you resolve it?',
      'If you had two more weeks to work on this project, what enhancements would you implement?'
    ],
    dailyActivity: 'Practice explaining your flagship project in 2 minutes using the 8-step structure without hesitation.'
  },
  24: {
    day: 24,
    title: 'Communication Skills',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'Communication is the structured exchange of information, thoughts, and technical concepts with clarity, conciseness, and empathy.',
    steps: [
      'Verbal Communication: Spoken words, clarity, tone and pace.',
      'Non-Verbal Communication: Eye contact, posture, gestures and listening.',
      'Written Communication: Clean emails, documentation, pull request notes.',
      'Visual Communication: Diagrams, wireframes, architectural flows.'
    ],
    tips: [
      'Use crisp, direct sentences rather than long, confusing paragraphs.',
      'Pace your speech deliberately; avoid rushing.',
      'Pause for a second before answering to organize your thoughts.',
      'Eliminate filler words (e.g. "like", "um", "you know").',
      'Listen fully before formulating your response.'
    ],
    practiceQuestions: [
      'Define effective professional communication.',
      'What are the four pillars of communication?',
      'How can an engineer improve clarity when explaining complex technical concepts?',
      'Why is communication as important as coding skills in IT careers?'
    ],
    dailyActivity: 'Pick your favorite technical concept (e.g. APIs, database indexing, Git branches) and explain it in simple English for two minutes.'
  },
  25: {
    day: 25,
    title: 'Group Discussion Skills',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'A Group Discussion (GD) evaluates candidate knowledge, listening ability, critical thinking, leadership, and constructive teamwork.',
    phrases: [
      {
        category: 'To Initiate the Discussion',
        items: [
          '"Good morning everyone. The topic given to us is... I would like to begin by highlighting..."',
          '"In my opinion, this topic has two crucial dimensions..."'
        ]
      },
      {
        category: 'To Agree and Build Upon Ideas',
        items: [
          '"I agree with my friend\'s point regarding..., and I would like to add that..."',
          '"That is a valid observation. Looking at the industry perspective..."'
        ]
      },
      {
        category: 'To Disagree Diplomatically',
        items: [
          '"I respect your viewpoint, however, from a different angle..."',
          '"While that holds true in some cases, empirical data suggests..."'
        ]
      },
      {
        category: 'To Summarize or Conclude',
        items: [
          '"To summarize the insightful points raised today..."',
          '"We can conclude that while both sides have merit, the optimal balance is..."'
        ]
      }
    ],
    practiceQuestions: [
      'What evaluation metrics do GD evaluators look for?',
      'How do you diplomatically enter a discussion without interrupting aggressively?',
      'Practice topics: 1. Artificial Intelligence: Boon or Bane? 2. Work From Home vs Office Collaboration 3. Social Media Impact on Youth 4. Skillset vs Degree in IT Hiring'
    ],
    dailyActivity: 'Choose one of the GD practice topics, speak on it for 1 minute presenting both benefits and challenges, and conclude thoughtfully.'
  },
  26: {
    day: 26,
    title: 'HR Interview Questions',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'HR interviews assess candidate personality, values, cultural alignment, communication maturity, and long-term career motivation.',
    hrQuestions: [
      {
        q: 'What are your strengths?',
        a: '"My core strengths are rapid learning, disciplined time management, and systematic problem solving. When introduced to new technologies like TypeScript or cloud databases, I break down the documentation and build working projects quickly."'
      },
      {
        q: 'What is your weakness?',
        a: '"Earlier, I tended to spend excessive time perfecting minor UI details before completing core logic. I now use prioritization matrices and set strict timeboxes for each task to ensure balanced progress."'
      },
      {
        q: 'Why should we hire you?',
        a: '"I combine strong fundamentals in computer science and web technologies with an eagerness to learn and adapt. My projects demonstrate hands-on initiative, and I am committed to contributing high-quality work to your engineering teams."'
      },
      {
        q: 'Why do you want to join our company?',
        a: '"Your company is renowned for innovation, collaborative engineering culture, and large-scale technical impact. I want to build my career in an environment where I can learn from experienced engineers and deliver impactful solutions."'
      },
      {
        q: 'Where do you see yourself in five years?',
        a: '"In five years, I envision myself as a seasoned software engineer with deep full-stack and architectural expertise, mentoring junior developers and taking ownership of critical product modules."'
      }
    ],
    practiceQuestions: [
      'How do you answer the "Tell me about your weakness" question without sounding negative?',
      'How do you effectively research a company before an HR interview?',
      'What questions should you ask the interviewer when they ask, "Do you have any questions for us?"'
    ],
    dailyActivity: 'Practice answering all five core HR interview questions aloud in front of a mirror or recorder until your responses feel natural and confident.'
  },
  27: {
    day: 27,
    title: 'Professional Email Writing',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'Professional email writing is formal, clear, and courteous written communication that conveys information and requests respectfully.',
    structure: [
      '1. Clear, Specific Subject Line',
      '2. Professional Salutation (e.g. "Dear Hiring Manager," / "Dear Mr./Ms. [Last Name],")',
      '3. Purpose of Writing in the Opening Sentence',
      '4. Concise Context and Background Details',
      '5. Action Required / Next Steps',
      '6. Courteous Sign-off (e.g. "Warm regards," / "Sincerely,")',
      '7. Professional Signature (Name, Degree, Contact Details, Portfolio/GitHub links)'
    ],
    example: 'Subject: Application for Graduate Software Developer Role - [Your Name]\n\nDear Hiring Team,\n\nI am writing to express my strong interest in the Graduate Software Developer position at [Company Name].\n\nI recently completed my degree in Computer Applications with a focus on web technologies, data structures, and relational databases. I have hands-on experience building full-stack applications with React, TypeScript, and PostgreSQL. I have attached my resume and project portfolio for your review.\n\nThank you for your time and consideration. I welcome the opportunity to discuss how my skillset can add value to your team.\n\nSincerely,\n[Your Name]\n[Phone Number] | [LinkedIn URL] | [GitHub URL]',
    practiceQuestions: [
      'What are the essential elements of an effective business email?',
      'Why is an accurate, informative subject line crucial?',
      'Write a formal follow-up email after attending an interview.'
    ],
    dailyActivity: 'Draft a complete professional email requesting an internship opportunity at an IT firm and review it against formal etiquette standards.'
  },
  28: {
    day: 28,
    title: 'Confidence and Presentation Skills',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'Presentation skills are the ability to convey structured technical and business information clearly and compellingly to an audience.',
    tips: [
      'Preparation is 90% of confidence: know your slides and code thoroughly.',
      'Maintain an upright, relaxed posture with open shoulders.',
      'Speak at a steady cadence and project your voice clearly.',
      'Use clean visual aids with minimal text clutter.',
      'Anticipate common questions from interviewers or reviewers.',
      'If you don\'t know an answer, respond honestly: "I haven\'t explored that aspect yet, but I would approach it by..."'
    ],
    structure: [
      '1. Introduction: Hook the audience and state the goal.',
      '2. Core Body: Break into 3 digestible sub-points with examples.',
      '3. Live Demonstration / Proof of Work.',
      '4. Summary and Key Takeaways.',
      '5. Q&A Session.'
    ],
    practiceQuestions: [
      'What are the key pillars of confident technical presentations?',
      'How do you manage presentation anxiety before speaking to a panel?',
      'How should you professionally handle tough questions from an audience?'
    ],
    dailyActivity: 'Deliver a 3-minute presentation on your favorite project or technical topic using a structured beginning, middle, and conclusion.'
  },
  29: {
    day: 29,
    title: 'Workplace Etiquette and Professionalism',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'Workplace etiquette encompasses the professional norms, ethics, accountability, and interpersonal courtesy expected in corporate environments.',
    positivePoints: [
      'Punctuality: Arrive on time for meetings, sprints, and deadlines.',
      'Respect: Treat colleagues across all roles and backgrounds with dignity.',
      'Accountability: Own your commitments and communicate blockers proactively.',
      'Constructive Feedback: Accept feedback with openness and a growth mindset.',
      'Professional Demeanor: Dress appropriately and maintain clean digital hygiene.',
      'Confidentiality: Protect sensitive customer and proprietary code data.'
    ],
    example: 'If an unexpected roadblock will prevent you from meeting a sprint deadline, inform your team lead early with a concise status update and revised timeline, rather than staying silent until the deadline passes.',
    practiceQuestions: [
      'What constitutes workplace etiquette in modern tech companies?',
      'Why is proactive communication better than silence when facing deadlines?',
      'How should an engineer receive and implement critical feedback from code reviews?'
    ],
    dailyActivity: 'Write down five professional habits you intend to practice every day in your future workplace.'
  },
  30: {
    day: 30,
    title: 'Final Soft Skills Assessment',
    module: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
    meaning: 'Comprehensive final evaluation synthesizing Self-Introduction, Resume Mastery, Project Explanation, Communication, Group Discussions, HR Interviews, Email Writing, and Workplace Professionalism.',
    practiceQuestions: [
      '1. Deliver your polished self-introduction in exactly two minutes.',
      '2. Explain your educational background and key achievements.',
      '3. What are your core technical strengths and how do you apply them?',
      '4. Describe your flagship project, architecture and personal contribution.',
      '5. What are your strengths and how are you managing your weaknesses?',
      '6. Why should a top IT company hire you as a graduate software engineer?',
      '7. How do you resolve conflicts or technical disagreements within a team?',
      '8. How do you prioritize tasks when facing multiple simultaneous deadlines?',
      '9. Write an error-free professional email requesting an interview rescheduling.',
      '10. How do you respond constructively when your code is criticized in review?',
      '11. What is your response strategy when an interviewer asks a question you do not know?',
      '12. What does workplace professionalism mean to you in day-to-day actions?',
      '13. How would you explain a complex database concept to a non-technical stakeholder?',
      '14. Describe a scenario where you overcame failure or stress.',
      '15. What are your concrete 1-year and 3-year professional goals in the IT industry?'
    ],
    dailyActivity: 'Conduct a comprehensive mock placement assessment: Record a 2-minute self-introduction, deliver a 3-minute project walkthrough, and draft a formal follow-up email.',
    practicalTask: 'Check off all 6 assessment milestones below and log your final soft skills readiness percentage score.'
  }
};
