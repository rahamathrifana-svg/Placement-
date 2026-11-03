import allAptitudeQuestionsRaw from './allAptitudeQuestions.json';
import allReasoningQuestionsRaw from './allReasoningQuestions.json';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NumberSystemPracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  answerLabel: string;
  explanation: string;
}

export const DAY_1_NUMBER_SYSTEM_QUESTIONS: NumberSystemPracticeQuestion[] = [
  {
    id: 1,
    question: 'Which of the following is a prime number?',
    options: ['21', '29', '33', '39'],
    correctIndex: 1,
    answerLabel: 'B) 29',
    explanation: 'A prime number has exactly two factors: 1 and itself. 29 is divisible only by 1 and 29.',
  },
  {
    id: 2,
    question: 'Find the smallest 3-digit number divisible by 7.',
    options: ['101', '105', '112', '119'],
    correctIndex: 1,
    answerLabel: 'B) 105',
    explanation: '7 × 15 = 105. It is the first multiple of 7 after 100.',
  },
  {
    id: 3,
    question: 'What is the remainder when 157 is divided by 12?',
    options: ['1', '3', '5', '7'],
    correctIndex: 0,
    answerLabel: 'A) 1',
    explanation: '12 × 13 = 156. Remainder = 157 − 156 = 1.',
  },
  {
    id: 4,
    question: 'Which of these is an irrational number?',
    options: ['4/5', '0.25', '√2', '9'],
    correctIndex: 2,
    answerLabel: 'C) √2',
    explanation: '√2 cannot be expressed as a fraction of two integers.',
  },
  {
    id: 5,
    question: 'Find the sum of the first 10 natural numbers.',
    options: ['45', '50', '55', '60'],
    correctIndex: 2,
    answerLabel: 'C) 55',
    explanation: 'Formula: n(n+1)/2 = 10 × 11 / 2 = 55.',
  },
  {
    id: 6,
    question: 'Which number is divisible by 9?',
    options: ['234', '235', '236', '238'],
    correctIndex: 0,
    answerLabel: 'A) 234',
    explanation: 'Add the digits: 2 + 3 + 4 = 9. Since 9 is divisible by 9, 234 is divisible by 9.',
  },
  {
    id: 7,
    question: 'Find the product of the first five natural numbers.',
    options: ['100', '120', '150', '125'],
    correctIndex: 1,
    answerLabel: 'B) 120',
    explanation: '1 × 2 × 3 × 4 × 5 = 120.',
  },
  {
    id: 8,
    question: 'What is the smallest prime number?',
    options: ['0', '1', '2', '3'],
    correctIndex: 2,
    answerLabel: 'C) 2',
    explanation: '2 is the smallest prime number and the only even prime number.',
  },
  {
    id: 9,
    question: 'Find the greatest 3-digit number divisible by 8.',
    options: ['984', '988', '992', '996'],
    correctIndex: 2,
    answerLabel: 'C) 992',
    explanation: '8 × 124 = 992. The next multiple, 8 × 125 = 1000, is not a 3-digit number.',
  },
  {
    id: 10,
    question: 'What is the square of 15?',
    options: ['125', '200', '225', '250'],
    correctIndex: 2,
    answerLabel: 'C) 225',
    explanation: '15 × 15 = 225.',
  },
  {
    id: 11,
    question: 'Find the number of factors of 24.',
    options: ['6', '7', '8', '9'],
    correctIndex: 2,
    answerLabel: 'C) 8',
    explanation: 'Factors are 1, 2, 3, 4, 6, 8, 12 and 24. Total = 8.',
  },
  {
    id: 12,
    question: 'Which of the following is a whole number but not a natural number?',
    options: ['1', '2', '0', '3'],
    correctIndex: 2,
    answerLabel: 'C) 0',
    explanation: 'Whole numbers include 0, whereas natural numbers generally begin with 1.',
  },
  {
    id: 13,
    question: 'Find the cube of 4.',
    options: ['16', '32', '48', '64'],
    correctIndex: 3,
    answerLabel: 'D) 64',
    explanation: '4³ = 4 × 4 × 4 = 64.',
  },
  {
    id: 14,
    question: 'What is the remainder when 245 is divided by 5?',
    options: ['0', '1', '2', '5'],
    correctIndex: 0,
    answerLabel: 'A) 0',
    explanation: '245 ÷ 5 = 49 exactly. Therefore, remainder = 0.',
  },
  {
    id: 15,
    question: 'Find the smallest number that must be added to 568 to make it divisible by 10.',
    options: ['1', '2', '8', '10'],
    correctIndex: 1,
    answerLabel: 'B) 2',
    explanation: 'The next multiple of 10 is 570. 570 − 568 = 2.',
  },
  {
    id: 16,
    question: 'What is the value of 2⁵?',
    options: ['16', '24', '32', '64'],
    correctIndex: 2,
    answerLabel: 'C) 32',
    explanation: '2 × 2 × 2 × 2 × 2 = 32.',
  },
  {
    id: 17,
    question: 'Find the sum of the first 20 even natural numbers.',
    options: ['400', '420', '440', '460'],
    correctIndex: 1,
    answerLabel: 'B) 420',
    explanation: 'Sum of first n even numbers = n(n + 1) = 20 × 21 = 420.',
  },
  {
    id: 18,
    question: 'Which number is divisible by both 3 and 5?',
    options: ['125', '135', '142', '148'],
    correctIndex: 1,
    answerLabel: 'B) 135',
    explanation: '135 ends in 5, so it is divisible by 5. Its digit sum is 1 + 3 + 5 = 9, so it is divisible by 3.',
  },
  {
    id: 19,
    question: 'A number is multiplied by 6 and the result is 144. Find the number.',
    options: ['18', '20', '24', '28'],
    correctIndex: 2,
    answerLabel: 'C) 24',
    explanation: 'Number = 144 ÷ 6 = 24.',
  },
  {
    id: 20,
    question: 'Find the difference between the largest and smallest 2-digit numbers.',
    options: ['88', '89', '90', '91'],
    correctIndex: 1,
    answerLabel: 'B) 89',
    explanation: 'Largest = 99; smallest = 10. Difference = 99 − 10 = 89.',
  },
];

export const DAY_2_SIMPLIFICATION_QUESTIONS: NumberSystemPracticeQuestion[] = [
  {
    id: 1,
    question: 'Find the value of 25 + 15 × 2.',
    options: ['80', '55', '65', '50'],
    correctIndex: 1,
    answerLabel: 'B) 55',
    explanation: 'Multiplication first. 25 + 30 = 55.',
  },
  {
    id: 2,
    question: 'Calculate: 100 ÷ 5 + 12.',
    options: ['20', '30', '32', '35'],
    correctIndex: 2,
    answerLabel: 'C) 32',
    explanation: '100 ÷ 5 = 20; 20 + 12 = 32.',
  },
  {
    id: 3,
    question: 'Find: 48 − 12 ÷ 3.',
    options: ['12', '36', '44', '40'],
    correctIndex: 2,
    answerLabel: 'C) 44',
    explanation: 'Division first: 12 ÷ 3 = 4. Then 48 − 4 = 44.',
  },
  {
    id: 4,
    question: 'Calculate: (15 + 5) × 3.',
    options: ['45', '50', '60', '65'],
    correctIndex: 2,
    answerLabel: 'C) 60',
    explanation: 'Brackets first: 20 × 3 = 60.',
  },
  {
    id: 5,
    question: 'Find: 144 ÷ 12 × 2.',
    options: ['6', '12', '24', '36'],
    correctIndex: 2,
    answerLabel: 'C) 24',
    explanation: 'Division and multiplication from left to right: 12 × 2 = 24.',
  },
  {
    id: 6,
    question: 'Calculate: 75 + 25 − 40.',
    options: ['50', '60', '70', '80'],
    correctIndex: 1,
    answerLabel: 'B) 60',
    explanation: '100 − 40 = 60.',
  },
  {
    id: 7,
    question: 'Find the value of 8² − 4².',
    options: ['32', '40', '48', '64'],
    correctIndex: 2,
    answerLabel: 'C) 48',
    explanation: '64 − 16 = 48.',
  },
  {
    id: 8,
    question: 'Calculate: 120 ÷ (5 × 4).',
    options: ['5', '6', '8', '10'],
    correctIndex: 1,
    answerLabel: 'B) 6',
    explanation: '5 × 4 = 20; 120 ÷ 20 = 6.',
  },
  {
    id: 9,
    question: 'Find: 18 × 5 − 30.',
    options: ['50', '60', '70', '80'],
    correctIndex: 1,
    answerLabel: 'B) 60',
    explanation: '90 − 30 = 60.',
  },
  {
    id: 10,
    question: 'Calculate: 250 ÷ 10 + 15 × 2.',
    options: ['45', '50', '55', '60'],
    correctIndex: 2,
    answerLabel: 'C) 55',
    explanation: '25 + 30 = 55.',
  },
  {
    id: 11,
    question: 'Find: ⅓ of 90 + 20.',
    options: ['40', '50', '60', '70'],
    correctIndex: 1,
    answerLabel: 'B) 50',
    explanation: '90 ÷ 3 = 30; 30 + 20 = 50.',
  },
  {
    id: 12,
    question: 'Calculate: 5 × (12 − 4) + 10.',
    options: ['40', '45', '50', '55'],
    correctIndex: 2,
    answerLabel: 'C) 50',
    explanation: '5 × 8 + 10 = 40 + 10 = 50.',
  },
  {
    id: 13,
    question: 'Find: 200 − (25 × 4).',
    options: ['75', '100', '125', '150'],
    correctIndex: 1,
    answerLabel: 'B) 100',
    explanation: '200 − 100 = 100.',
  },
  {
    id: 14,
    question: 'Calculate: 2³ + 3².',
    options: ['15', '17', '19', '21'],
    correctIndex: 1,
    answerLabel: 'B) 17',
    explanation: '8 + 9 = 17.',
  },
  {
    id: 15,
    question: 'Find: 64 ÷ 8 + 7 × 3.',
    options: ['27', '29', '30', '32'],
    correctIndex: 1,
    answerLabel: 'B) 29',
    explanation: '8 + 21 = 29.',
  },
  {
    id: 16,
    question: 'Calculate: (36 ÷ 6) × (15 ÷ 3).',
    options: ['20', '25', '30', '35'],
    correctIndex: 2,
    answerLabel: 'C) 30',
    explanation: '6 × 5 = 30.',
  },
  {
    id: 17,
    question: 'Find: 150 ÷ 3 − 20 + 5.',
    options: ['30', '35', '40', '45'],
    correctIndex: 1,
    answerLabel: 'B) 35',
    explanation: '50 − 20 + 5 = 35.',
  },
  {
    id: 18,
    question: 'Calculate: 0.5 × 100 + 25.',
    options: ['50', '65', '75', '85'],
    correctIndex: 2,
    answerLabel: 'C) 75',
    explanation: '50 + 25 = 75.',
  },
  {
    id: 19,
    question: 'Find: ¾ of 80 − 15.',
    options: ['35', '40', '45', '50'],
    correctIndex: 2,
    answerLabel: 'C) 45',
    explanation: '80 × 3/4 = 60; 60 − 15 = 45.',
  },
  {
    id: 20,
    question: 'Calculate: 500 − 120 ÷ 4 × 5.',
    options: ['300', '350', '400', '450'],
    correctIndex: 1,
    answerLabel: 'B) 350',
    explanation: '120 ÷ 4 = 30; 30 × 5 = 150; 500 − 150 = 350.',
  },
];

export const CURATED_APTITUDE_PRACTICE: Record<number, NumberSystemPracticeQuestion[]> = allAptitudeQuestionsRaw.days as unknown as Record<number, NumberSystemPracticeQuestion[]>;

export const FINAL_MOCK_TEST_QUESTIONS: NumberSystemPracticeQuestion[] = allAptitudeQuestionsRaw.finalMock as unknown as NumberSystemPracticeQuestion[];

export const CURATED_REASONING_PRACTICE: Record<number, NumberSystemPracticeQuestion[]> = allReasoningQuestionsRaw.days as unknown as Record<number, NumberSystemPracticeQuestion[]>;

export const FINAL_REASONING_REVISION_QUESTIONS: NumberSystemPracticeQuestion[] = allReasoningQuestionsRaw.finalRevision as unknown as NumberSystemPracticeQuestion[];


export interface LearnTopic {
  title: string;
  tips: string[];
  quiz: QuizQuestion[];
}

export const TOP: string[] = [
  'Number Series', 'Alphabet Series', 'Coding and Decoding', 'Analogy', 'Classification',
  'Blood Relations', 'Sunday Test 1', 'Direction Sense', 'Ranking and Ordering', 'Seating Arrangement',
  'Circular Arrangement', 'Syllogism', 'Venn Diagrams', 'Sunday Test 2', 'Statement and Conclusion',
  'Statement and Assumption', 'Statement and Argument', 'Data Sufficiency', 'Logical Puzzles', 'Input and Output',
  'Sunday Test 3', 'Calendar Reasoning', 'Clock Reasoning', 'Non-Verbal Reasoning', 'Mirror and Water Images',
  'Paper Folding and Cutting', 'Cubes and Dice', 'Sunday Test 4', 'Mixed Reasoning', 'Full Mock Test'
];

export const LEARN: Record<number, LearnTopic> = {
  0: {
    title: 'A number series follows a hidden rule. Find the rule from the gaps between terms, then apply it to the next term.',
    tips: [
      'Check differences (+, −).',
      'Check multiples (×2, ×3).',
      'Check squares, cubes and alternating patterns.'
    ],
    quiz: [
      { question: 'Next: 2, 4, 6, 8, ?', options: ['9', '10', '12', '14'], correctIndex: 1, explanation: 'Add 2 each time.' },
      { question: 'Next: 3, 6, 12, 24, ?', options: ['36', '42', '48', '30'], correctIndex: 2, explanation: 'Multiply by 2.' },
      { question: 'Next: 1, 4, 9, 16, ?', options: ['20', '25', '36', '24'], correctIndex: 1, explanation: 'Squares of 1, 2, 3, 4, 5.' },
      { question: 'Next: 5, 6, 8, 11, 15, ?', options: ['18', '19', '20', '21'], correctIndex: 2, explanation: 'Differences grow +1, +2, +3, +4, +5.' },
      { question: 'Next: 2, 3, 5, 9, 17, ?', options: ['25', '31', '33', '35'], correctIndex: 2, explanation: 'Differences 1, 2, 4, 8, 16 → 17 + 16 = 33.' }
    ]
  },
  1: {
    title: 'Alphabet series use letter positions (A=1 … Z=26). Look at the jump between letters.',
    tips: [
      'Write positions: A1 B2 … Z26.',
      'Check forward and backward jumps.',
      'Opposite letter pairs sum to 27.'
    ],
    quiz: [
      { question: 'Next: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correctIndex: 1, explanation: 'Skip one letter each time.' },
      { question: 'Next: Z, X, V, T, ?', options: ['S', 'R', 'Q', 'P'], correctIndex: 1, explanation: 'Go back by 2.' },
      { question: 'Opposite of D (position from the end)?', options: ['W', 'V', 'X', 'U'], correctIndex: 0, explanation: 'D=4, 27−4=23 → W.' },
      { question: 'Next: B, E, H, K, ?', options: ['L', 'M', 'N', 'O'], correctIndex: 2, explanation: 'Jump of 3.' },
      { question: 'Next: AZ, BY, CX, ?', options: ['DW', 'DV', 'EW', 'CW'], correctIndex: 0, explanation: 'First +1, second −1.' }
    ]
  }
};

export const APS: string[] = [
  'Number System', 'Simplification', 'HCF and LCM', 'Fractions and Decimals', 'Percentage',
  'Ratio and Proportion', 'Sunday Test 1', 'Average', 'Profit and Loss', 'Discount',
  'Simple Interest', 'Compound Interest', 'Problems on Ages', 'Sunday Test 2', 'Partnership',
  'Mixtures and Alligation', 'Time and Work', 'Pipes and Cisterns', 'Time, Speed and Distance', 'Problems on Trains',
  'Sunday Test 3', 'Boats and Streams + Problems on Clocks', 'Problems on Calendars', 'Probability', 'Permutation and Combination',
  'Algebra + Geometry and Mensuration', 'Problems on Numbers', 'Sunday Test 4', 'Data Interpretation', 'Data Sufficiency + Full Revision'
];

export const AC: Record<number, string> = {
  0: 'A percentage is a number out of 100. To find x% of y, turn x% into x/100 and multiply by y.',
  1: 'Simple interest is the extra money paid on a deposit or loan, worked out only on the original amount (the principal) each year.'
};

export const AF: Record<number, string[]> = {
  0: [
    'Percentage = (Part ÷ Whole) × 100',
    'x% of y = x × y ÷ 100',
    'Increase % = (Increase ÷ Original) × 100'
  ],
  1: [
    'SI = P × R × T ÷ 100',
    'Amount = P + SI',
    'R = SI × 100 ÷ (P × T)'
  ]
};

export const AQ: Record<number, QuizQuestion[]> = {
  0: [
    { question: 'What is 20% of 150?', options: ['20', '30', '25', '35'], correctIndex: 1, explanation: '20/100 × 150 = 30.' },
    { question: 'A price rises from 200 to 250. Increase %?', options: ['20', '25', '30', '50'], correctIndex: 1, explanation: '50 ÷ 200 × 100 = 25%.' },
    { question: '40% of a number is 80. The number is?', options: ['160', '200', '320', '120'], correctIndex: 1, explanation: '80 × 100 ÷ 40 = 200.' },
    { question: 'A student scores 45 out of 60. Percentage?', options: ['65', '70', '75', '80'], correctIndex: 2, explanation: '45 ÷ 60 × 100 = 75%.' },
    { question: '10000 rises 10%, then falls 10%. Final value?', options: ['10000', '9900', '9800', '10100'], correctIndex: 1, explanation: '11000 × 0.9 = 9900.' }
  ],
  1: [
    { question: 'SI on 1000 at 5% for 2 years?', options: ['50', '100', '150', '200'], correctIndex: 1, explanation: '1000×5×2/100 = 100.' },
    { question: 'P=2000, R=10%, T=3. Amount?', options: ['2400', '2600', '2500', '2300'], correctIndex: 1, explanation: 'SI = 600, amount = 2600.' },
    { question: 'SI 300 on 1500 at 5%. Time in years?', options: ['3', '4', '5', '2'], correctIndex: 1, explanation: '300 = 75 × T, so T = 4.' },
    { question: 'P=800, T=2, SI=96. Rate %?', options: ['5', '6', '8', '12'], correctIndex: 1, explanation: '96 = 16 × R, so R = 6.' },
    { question: 'A sum doubles in 10 years at SI. Rate %?', options: ['5', '10', '15', '20'], correctIndex: 1, explanation: 'SI = P, so R × 10/100 = 1, R = 10.' }
  ]
};

export const NT: Record<string, [string, string[], string]> = {
  'Number System': [
    'A number system classifies numbers by their properties: natural (1, 2, 3), whole (0, 1, 2), integers (-2, 0, 5), even, odd, prime (exactly two factors) and composite (more than two factors).',
    ['Divisible by 3: digit sum divisible by 3', 'Divisible by 4: last two digits divisible by 4', 'Divisible by 6: divisible by both 2 and 3', 'Divisible by 8: last three digits divisible by 8', 'Divisible by 9: digit sum divisible by 9', 'Divisible by 11: alternating digit sums differ by 0 or a multiple of 11'],
    'Is 729 divisible by 9? 7 + 2 + 9 = 18, which is divisible by 9. Yes.'
  ],
  'Simplification': [
    'Solve expressions with BODMAS: Brackets, Orders, Division, Multiplication, Addition, Subtraction. Division and multiplication have equal priority, and so do addition and subtraction. Work left to right.',
    ['BODMAS order'],
    '25 + 5 × 4 − 10: multiply 5 × 4 = 20, add 25 + 20 = 45, subtract 45 − 10 = 35.'
  ],
  'HCF and LCM': [
    'HCF is the largest number that divides all the given numbers. LCM is the smallest common multiple.',
    ['HCF × LCM = product of the two numbers'],
    '12 and 18: common factors 1, 2, 3, 6 so HCF = 6. Multiples of 12: 12, 24, 36. Of 18: 18, 36. LCM = 36.'
  ],
  'Fractions and Decimals': [
    'A fraction shows a part of a whole; a decimal uses a decimal point. Fractions can be proper (2/5), improper (7/4) or mixed (1 3/4).',
    ['1/2 = 0.5 = 50%', '1/4 = 0.25 = 25%', '1/5 = 0.2 = 20%', '1/8 = 0.125 = 12.5%', '3/4 = 0.75 = 75%', 'a/b ÷ c/d = a/b × d/c'],
    '2/3 × 3/4 = 1/2. 2/3 ÷ 4/5 = 2/3 × 5/4 = 5/6.'
  ],
  'Percentage': [
    'A percentage is a number out of 100. To find x% of y, turn x% into x/100 and multiply by y.',
    ['Percentage = (Part ÷ Whole) × 100', 'x% of y = x × y ÷ 100', 'Increase % = (Increase ÷ Original) × 100', 'Decrease % = (Decrease ÷ Original) × 100'],
    'What is 20% of 150? 20/100 × 150 = 30.'
  ],
  'Ratio and Proportion': [
    'A ratio compares two quantities. A proportion says two ratios are equal.',
    ['a:b = c:d means a × d = b × c', 'Share = individual ratio ÷ total ratio × total'],
    'Divide ₹600 in the ratio 2:4. Total parts = 6. Shares: 600 × 2/6 = ₹200 and 600 × 4/6 = ₹400.'
  ],
  'Average': [
    'Average is the sum of the values divided by how many values there are.',
    ['Average = Sum ÷ Number of values', 'Sum = Average × Number'],
    'Average of 10, 20, 30, 40, 50: sum 150 ÷ 5 = 30.'
  ],
  'Profit and Loss': [
    'CP is cost price and SP is selling price. Compare them to find profit or loss.',
    ['Profit = SP − CP', 'Loss = CP − SP', 'Profit % = Profit ÷ CP × 100', 'Loss % = Loss ÷ CP × 100'],
    'CP ₹500, SP ₹600: profit ₹100, profit % = 100/500 × 100 = 20%.'
  ],
  'Discount': [
    'Discount is the reduction given on the marked price (MP).',
    ['Discount = MP − SP', 'Discount % = Discount ÷ MP × 100', 'SP = MP × (100 − D) ÷ 100'],
    'MP ₹1,000 with 20% discount: discount ₹200, SP ₹800.'
  ],
  'Simple Interest': [
    'Simple interest is the extra money paid on a deposit or loan, worked out only on the original principal each year.',
    ['SI = P × R × T ÷ 100', 'Amount = P + SI', 'R = SI × 100 ÷ (P × T)', 'T = SI × 100 ÷ (P × R)'],
    'SI on ₹1,000 at 5% for 2 years: 1000 × 5 × 2 / 100 = ₹100. Total amount = ₹1,100.'
  ],
  'Compound Interest': [
    'Compound interest is worked out on the principal plus the interest already earned.',
    ['A = P(1 + R/100)^T', 'CI = A − P', 'SI uses the original principal only; CI is usually higher'],
    'P ₹1,000, R 10%, T 2 years: year 1 interest ₹100 (₹1,100), year 2 interest ₹110 (₹1,210). CI = ₹210.'
  ],
  'Problems on Ages': [
    'Age problems compare present, past and future ages.',
    ['After n years: present age + n', 'Before n years: present age − n', 'The age difference stays constant'],
    'Father 40, son 10. After 5 years they are 45 and 15, a ratio of 3:1.'
  ],
  'Partnership': [
    'Partners share profit in proportion to capital × time.',
    ['Profit ratio = Capital × Time'],
    'A: 10,000 × 12 = 1,20,000. B: 20,000 × 6 = 1,20,000. Ratio 1:1, so a ₹10,000 profit is split ₹5,000 each.'
  ],
  'Mixtures and Alligation': [
    'Alligation finds the ratio in which two items of different price or strength are mixed.',
    ['Cheaper : Dearer = (Dearer − Mean) : (Mean − Cheaper)'],
    'Rice at ₹20/kg and ₹40/kg mixed to get ₹30/kg: (40 − 30) : (30 − 20) = 1:1.'
  ],
  'Time and Work': [
    'If a job takes n days, one day of work is 1/n of the job.',
    ['One day work = 1 ÷ Total days', 'Together time = (A × B) ÷ (A + B)'],
    'A takes 10 days, B takes 20. Together: 1/10 + 1/20 = 3/20 per day, so 20/3 = 6 2/3 days.'
  ],
  'Pipes and Cisterns': [
    'Inlet pipes fill (positive work). Outlet pipes empty (negative work).',
    ['Net work = filling rate − emptying rate'],
    'A fills in 4 hours, B empties in 12 hours: 1/4 − 1/12 = 1/6 per hour, so 6 hours.'
  ],
  'Time, Speed and Distance': [
    'Speed, distance and time are linked by three formulas.',
    ['Speed = Distance ÷ Time', 'Distance = Speed × Time', 'Time = Distance ÷ Speed', 'km/hr to m/s: × 5/18', 'm/s to km/hr: × 18/5'],
    '120 km in 2 hours: speed = 60 km/hr.'
  ],
  'Problems on Trains': [
    'Find the time a train takes to cross a pole, a platform or another train.',
    ['Crossing a pole: Time = Train length ÷ Speed', 'Crossing a platform: Time = (Train + Platform length) ÷ Speed'],
    'A 100 m train at 20 m/s crosses a pole in 100/20 = 5 seconds.'
  ],
  'Boats and Streams': [
    'Downstream means with the current. Upstream means against it.',
    ['Downstream = Boat + Stream', 'Upstream = Boat − Stream', 'Boat speed = (Downstream + Upstream) ÷ 2', 'Stream speed = (Downstream − Upstream) ÷ 2'],
    'Boat 10 km/hr, stream 2 km/hr: downstream 12 km/hr, upstream 8 km/hr.'
  ],
  'Problems on Clocks': [
    'Find the angle between the hour hand and the minute hand.',
    ['Angle = |30H − 5.5M|', 'If the result exceeds 180°, subtract it from 360°'],
    'At 3:00: |30 × 3 − 5.5 × 0| = 90°.'
  ],
  'Problems on Calendars': [
    'Calendar questions find the day of the week for a date.',
    ['Normal year: 365 days = 52 weeks + 1 day', 'Leap year: 366 days = 52 weeks + 2 days', 'Leap year: divisible by 400, or by 4 but not by 100'],
    '2024 is a leap year. 1900 is not. 2000 is.'
  ],
  'Probability': [
    'Probability measures how likely an event is.',
    ['P(E) = Favourable outcomes ÷ Total outcomes', 'Impossible event = 0, certain event = 1'],
    'One coin toss: P(Head) = 1/2.'
  ],
  'Permutation and Combination': [
    'Permutation counts arrangements (order matters). Combination counts selections (order does not matter).',
    ['nPr = n! ÷ (n − r)!', 'nCr = n! ÷ (r! (n − r)!)', '5! = 120'],
    '3P2 = 3!/1! = 6. 3C2 = 3!/(2! 1!) = 3.'
  ],
  'Algebra': [
    'Algebra uses letters to stand for unknown numbers.',
    ['(a + b)² = a² + 2ab + b²', '(a − b)² = a² − 2ab + b²', 'a² − b² = (a − b)(a + b)'],
    'x + 5 = 12 gives x = 12 − 5 = 7.'
  ],
  'Geometry and Mensuration': [
    'Geometry studies shapes. Mensuration finds their area, perimeter and volume.',
    ['Square: area a², perimeter 4a', 'Rectangle: area L × B, perimeter 2(L + B)', 'Triangle: area ½ × B × H', 'Circle: area πr², circumference 2πr', 'Cube a³, Cuboid L × B × H, Cylinder πr²h, Cone ⅓πr²h, Sphere 4/3 πr³'],
    'Rectangle 10 cm × 5 cm: area = 50 cm².'
  ],
  'Problems on Numbers': [
    'Use place values to write unknown numbers algebraically.',
    ['Two-digit number = 10x + y', 'Reverse = 10y + x', 'Three-digit number = 100x + 10y + z'],
    'Tens digit 4, units digit 5: the number is 45 and its reverse is 54.'
  ],
  'Data Interpretation': [
    'Read tables, bar charts, pie charts and line graphs to find totals, averages, differences, percentages, highest and lowest values.',
    ['Total = sum of values', 'Average = Total ÷ Count'],
    'Sales A 100, B 200, C 150: total 450, average 150.'
  ],
  'Data Sufficiency': [
    'Check whether the given statements are enough to answer the question.',
    ['Test each statement alone, then both together'],
    'What is the age of A? S1: A is 5 years older than B. S2: B is 20. Neither alone is enough. Together A = 25.'
  ],
  'Full Revision': [
    'Revise every formula before your tests, and revise your mistakes every weekend.',
    ['Percentage = Value ÷ Total × 100', 'SI = PRT ÷ 100', 'CI = P(1 + R/100)^T − P', 'Speed = Distance ÷ Time', 'Probability = Favourable ÷ Total', 'Clock angle = |30H − 5.5M|', 'nCr = n! ÷ (r! (n − r)!)'],
    'Study order: understand the concept, write the formula, solve examples without looking, practise 10 questions, then take a timed test.'
  ]
};

export const SK: string[] = [
  'Introduction to Active Listening', 'Hearing vs Active Listening', 'Importance of Eye Contact',
  'Body Language', 'Understanding Instructions', 'Asking Questions and Clarification',
  'Listening to Different Speakers', 'Listening in Group Discussions', 'Listening and Note-Taking',
  'Active Listening Assessment', 'Introduction to Problem Solving', 'Identifying Problems',
  'Root Cause Analysis', 'Critical Thinking', 'Decision Making', 'Creative Thinking',
  'Time Management and Prioritisation', 'Handling Challenges and Stress', 'Teamwork and Collaborative Problem Solving',
  'Problem Solving Assessment', 'Self-Introduction', 'Resume Explanation', 'Project Explanation',
  'Communication Skills', 'Group Discussion Skills', 'HR Interview Questions',
  'Professional Email Writing', 'Confidence and Presentation Skills', 'Workplace Etiquette and Professionalism',
  'Final Soft Skills Assessment'
];

export const PL: [string, string, string][] = [
  ['Cisco Networking Academy', 'https://www.netacad.com/', 'Networking, cybersecurity, programming'],
  ['freeCodeCamp', 'https://www.freecodecamp.org/learn/', 'Web development and programming'],
  ['IBM SkillsBuild', 'https://skillsbuild.org/', 'AI, data, cloud, career skills'],
  ['Microsoft Learn', 'https://learn.microsoft.com/training/', 'Cloud, Azure, developer skills'],
  ['AWS Skill Builder', 'https://skillbuilder.aws/', 'Cloud computing'],
  ['Google Skillshop', 'https://skillshop.withgoogle.com/', 'Digital marketing and analytics'],
  ['Google Cloud Skills Boost', 'https://www.cloudskillsboost.google/', 'Cloud computing'],
  ['Infosys Springboard', 'https://infyspringboard.onwingspan.com/', 'Programming, soft skills'],
  ['NPTEL', 'https://nptel.ac.in/', 'Engineering and CS courses'],
  ['Saylor Academy', 'https://www.saylor.org/', 'CS and business courses'],
  ['HP LIFE', 'https://www.life-global.org/', 'Business and IT skills'],
  ['Great Learning Academy', 'https://www.mygreatlearning.com/academy', 'Data, AI, programming'],
  ['Simplilearn SkillUp', 'https://www.simplilearn.com/skillup-free-online-courses', 'IT, data, marketing'],
  ['Alison', 'https://alison.com/', 'Wide range of topics'],
  ['Kaggle Learn', 'https://www.kaggle.com/learn', 'Data science and ML']
];

export const PR: string[] = [
  'Choose a free course',
  'Enroll on the official platform',
  'Complete all lessons',
  'Pass the final assessment',
  'Download your certificate',
  'Update LinkedIn and resume'
];

export const LIC: string[] = [
  'Download the certificate from the platform',
  'Check the certificate name is correct',
  'Save it as PDF or image',
  'Attach it to the LinkedIn post',
  'Add it to Licenses & Certifications',
  'Add the issuing organization and issue date',
  'Add credential ID and URL if provided',
  'Add relevant skills to the Skills section',
  'Update resume with the new certification'
];

export const PS: [string, string][] = [
  ['Identify a Real-World Problem', 'Planning'],
  ['Select a Project Idea', 'Planning'],
  ['Define Project Objectives', 'Planning'],
  ['Collect Project Requirements', 'Planning'],
  ['Create Project Architecture', 'Planning'],
  ['Design UI/UX in Figma or Canva', 'UI/UX'],
  ['Set Up VS Code and Folders', 'Development'],
  ['Build the Frontend', 'Development'],
  ['Build the Backend', 'Development'],
  ['Create and Connect the Database', 'Development'],
  ['Integrate APIs', 'Development'],
  ['Implement CRUD Operations', 'Development'],
  ['Add Authentication and Validation', 'Development'],
  ['Test All Features', 'Testing'],
  ['Debug Errors Independently', 'Testing'],
  ['Upload Code to GitHub', 'GitHub & Deploy'],
  ['Deploy the Project Online', 'GitHub & Deploy'],
  ['Prepare Documentation', 'Docs'],
  ['Create a Presentation', 'Docs'],
  ['Prepare to Explain in Interviews', 'Docs']
];

export const PG: [string, string, string, string, string, string, string?][] = [
  [
    'Learn how to identify a real-life problem that can be solved using technology.',
    'Understand what a real-world problem means|Observe problems in college, home, offices and society|List at least five problems|Identify who experiences each problem and why it occurs|Research how people solve it today|Note the disadvantages of the existing solution|Decide how software can solve it|Select one useful, achievable problem|Write a clear problem statement',
    'Problem identification, user research, observation, problem statement writing, basic feasibility analysis',
    'Identify five problems and choose one.',
    'Write a problem statement in 3-5 sentences.',
    'Problem statement document',
    'Problem: Students forget assignment submission dates.\nTarget users: College students\nExisting solution: Manual notes and reminders\nProposed solution: Student Assignment Tracker'
  ],
  [
    'Convert your selected problem into a software project idea.',
    'Understand web, mobile and desktop applications|Brainstorm at least three project ideas|Identify the main purpose and required features of each|Research similar applications|Compare ideas by usefulness, difficulty and available time|Check you have the required skills|Select a project for your level and give it a meaningful name',
    'Project selection, feasibility, scope, basic competitor research, software application types',
    'Compare three project ideas in a table.',
    'Select one project and explain why you chose it.',
    'Project title and project idea',
    'Beginner ideas: Student Management System, Online Quiz Application, Expense Tracker, Library Management System, To-Do List Application, College Event Management System, Job Application Tracker'
  ],
  [
    'Understand what your application should achieve.',
    'Understand what project objectives mean|Identify the main purpose and target users|Write one main objective|Divide it into smaller objectives|Identify the features needed for each objective|Decide expected results|Define scope and limitations|Review whether the objectives are achievable',
    'Main and specific objectives, project scope, expected outcomes, limitations, SMART objectives',
    'Write one main objective and five specific objectives.',
    'Prepare an objectives document.',
    'Project objectives',
    'Main objective: Help students manage assignments and submission deadlines.\nSpecific: add assignments, show upcoming deadlines, track completed work, edit details, organize academic tasks.'
  ],
  [
    'Understand what features and resources your project needs.',
    'Understand what software requirements mean|Identify all users and what each needs|List the actions users should perform|Identify what information must be stored|List functional and non-functional requirements|Identify security requirements|Identify hardware and software requirements|Organize everything into an SRS document',
    'Requirement gathering, user, functional and non-functional requirements, Software Requirement Specification (SRS). Functional = what the system does (user login). Non-functional = how it performs (fast loading). Security = how information is protected (password hashing).',
    'Write 10 functional and 5 non-functional requirements.',
    'Prepare an SRS document.',
    'Software Requirement Specification',
    ''
  ],
  [
    'Understand how the frontend, backend and database work together.',
    'Understand what system architecture means|Learn the client-server model|Understand the roles of frontend, backend and database|Learn how APIs connect components|Identify the modules in your project|Decide the technology for each component|Draw a system architecture diagram|Create a basic user-flow diagram',
    'Client-server and three-tier architecture, system flowcharts, Data Flow Diagrams, database architecture, API communication',
    'Draw a frontend-backend-database diagram.',
    'Prepare a system architecture diagram and user flow.',
    'Architecture document',
    'USER\n  |\n  v\nFRONTEND\n  |\n  v\nBACKEND\n  |\n  v\nAPI\n  |\n  v\nDATABASE'
  ],
  [
    'Learn how to design application screens before writing code.',
    'Understand the difference between UI and UX|Create a Figma account and a new design file|Understand frames and layers; choose desktop and mobile sizes|Learn colours and typography|Create a low-fidelity wireframe|Design login, registration, homepage and dashboard|Create forms, cards, buttons and navigation|Design the remaining pages and make them responsive|Connect screens with prototype interactions|Review and improve the design',
    'UI and UX fundamentals, wireframing, mockups, prototyping, colour theory, typography, layout and spacing, responsive design',
    'Design a login page and dashboard.',
    'Create at least five connected application screens.',
    'Figma prototype',
    ''
  ],
  [
    'Prepare the development environment.',
    'Understand what a code editor is and what VS Code does|Download and install VS Code|Install the required programming language|Learn to open folders and use the integrated terminal|Create and save files|Install useful extensions|Create the main project folder|Create frontend, backend, database and assets folders|Run a simple HTML program',
    'VS Code interface, terminal commands, file and folder management, extensions, basic project structure. Extensions: Live Server, Prettier, ESLint, Python (if using Python), GitLens.',
    'Create a project folder and run a webpage.',
    'Set up your complete project environment.',
    'Working development setup',
    'my-project/\n  frontend/\n    index.html\n    style.css\n    script.js\n  backend/\n  database/\n  assets/\n  README.md'
  ],
  [
    'Build the visible and interactive part of your application.',
    'Learn HTML structure, headings, links, images, forms and buttons|Learn CSS selectors, margins, padding and borders|Learn Flexbox, Grid and media queries|Learn JavaScript variables, functions, DOM and events|Connect JavaScript with HTML|Build the homepage, login and registration pages|Build the dashboard and other pages|Add interactivity and test every button|Compare your site with your Figma design',
    'HTML5, CSS3, JavaScript, DOM, responsive web design, form handling, browser Developer Tools',
    'Build a responsive student dashboard.',
    'Develop all frontend pages.',
    'Functional frontend',
    ''
  ],
  [
    'Learn how the application processes requests and manages business logic.',
    'Understand backend development and how it differs from frontend|Select a backend language and learn its basics|Understand servers and requests|Install the framework and create the backend project|Create the main server file and start the server|Create routes and handle incoming requests|Write business logic and send responses to the frontend|Add error handling and test the server',
    'Backend fundamentals, servers, routing, HTTP requests, request and response, business logic, middleware, error handling. Paths: Python (Flask or Django), Node.js with Express, Java (Spring Boot), PHP (Laravel).',
    'Create a backend route that displays a welcome message.',
    'Run a backend server with multiple routes.',
    'Working backend',
    ''
  ],
  [
    'Learn how to store, organize and retrieve application data.',
    'Understand databases, DBMS and RDBMS|Learn SQL basics, tables, rows and columns|Learn primary keys, foreign keys and relationships|Select, install or create a database|Create tables or collections with fields and data types|Insert sample records|Learn SELECT, INSERT, UPDATE and DELETE|Connect the database to the backend and retrieve data|Test the connection',
    'Database fundamentals, SQL, DBMS, tables and relationships, ER diagrams, connectivity. Choose one: MySQL, PostgreSQL, SQLite or MongoDB.',
    'Create a student table and insert five records.',
    'Connect your project database to the backend.',
    'Working database connection',
    ''
  ],
  [
    'Understand how application components communicate through APIs.',
    'Understand what an API is and why applications use them|Learn REST architecture, HTTP methods and endpoints|Learn JSON and HTTP status codes|Create an API endpoint in your backend|Send requests with Fetch API or an HTTP client|Test endpoints using Postman|Connect the frontend to the backend API|Handle successful responses and API errors|Test the complete API flow',
    'REST API, JSON, HTTP methods, endpoints, Fetch API, Postman, status codes',
    'Create an API that retrieves student details.',
    'Connect at least two API endpoints to your frontend.',
    'Working API integration',
    'GET - retrieve information\nPOST - create information\nPUT - replace or update information\nPATCH - partially update information\nDELETE - remove information'
  ],
  [
    'Learn how to manage application records.',
    'Understand what CRUD means|Create a form to add data and send it to the backend|Save the data in the database|Retrieve saved records and display them|Create an edit button and update records|Create a delete button and remove records|Test all four operations',
    'CRUD concepts, database queries, API methods, form submission, data handling',
    'Build a student management CRUD application.',
    'Implement all four CRUD operations in your project.',
    'Complete CRUD module',
    'Create - Add assignment\nRead - View assignments\nUpdate - Edit assignment\nDelete - Remove assignment'
  ],
  [
    'Learn how to protect user accounts and validate input data.',
    'Understand authentication and authorization and how they differ|Design registration and login forms|Learn password hashing and store user details securely|Verify credentials during login|Learn sessions or token-based authentication|Restrict access to protected pages and implement logout|Add frontend and backend validation|Validate email and password formats|Test incorrect login attempts',
    'Authentication, authorization, password hashing, sessions, JWT, form validation, input sanitization, access control. Never store plain-text passwords.',
    'Build a registration and login system.',
    'Implement secure login and protected dashboard access.',
    'Authentication and validation module',
    ''
  ],
  [
    'Ensure all application features work correctly.',
    'Understand software testing and why it matters|Identify all project features|Write test cases with expected results|Test valid inputs, invalid inputs and empty forms|Test login, registration and CRUD|Test API communication and database operations|Test mobile responsiveness|Record actual results and compare with expected results|Report any failures',
    'Unit, integration, functional, UI, performance, security and regression testing',
    'Prepare 15 test cases for your application.',
    'Test every major feature and document the results.',
    'Test report',
    ''
  ],
  [
    'Learn to identify and fix coding errors independently.',
    'Understand syntax, runtime and logical errors|Read error messages carefully|Open browser Developer Tools and use the console|Check terminal errors and use VS Code breakpoints|Identify the affected code and find the root cause|Search official documentation|Apply a solution and run the program again|Verify the fix and record the error and solution',
    'Debugging techniques, browser console, VS Code debugger, breakpoints, stack traces, error handling',
    'Introduce five errors into a sample project and fix them.',
    'Prepare a list of errors and their solutions.',
    'Debugging record',
    ''
  ],
  [
    'Learn how to manage source code using Git and GitHub.',
    'Understand version control and the difference between Git and GitHub|Create a GitHub account and install Git|Create a repository and run git init in your project|Add files and create commits|Connect the local project to GitHub and push|Learn to pull changes and understand branches|Create a README with screenshots and setup instructions|Add a .gitignore to protect passwords and API keys',
    'Git, GitHub, repository, commit, push and pull, branching, README, .gitignore',
    'Create a repository and upload a sample project.',
    'Upload your complete project to GitHub.',
    'GitHub repository link',
    'git init\ngit status\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin YOUR_REPOSITORY_URL\ngit push -u origin main\ngit pull'
  ],
  [
    'Learn how to make your project accessible online.',
    'Understand deployment, hosting and domain names|Learn the difference between localhost and a live site|Prepare your project for production|Select a hosting platform and connect your GitHub repository|Configure environment variables|Deploy the frontend and the backend if required|Set up the production database and API URLs|Test the live application and check deployment logs|Fix errors and share your live URL',
    'Hosting, deployment, domain names, environment variables, production database, deployment logs. Hosting features and free tiers can change, so check each platform.',
    'Deploy a simple HTML website.',
    'Deploy your complete project.',
    'Live project URL',
    'Frontend: Vercel, Netlify\nStatic websites: GitHub Pages\nBackend: Render\nDatabase: MongoDB Atlas, Supabase'
  ],
  [
    'Learn how to document your complete software project.',
    'Understand the purpose of documentation|Learn technical vs user documentation|Write the title page, introduction and problem statement|Add objectives, existing system and proposed system|List hardware and software requirements and technologies|Add system architecture and database design|Explain each module and add screenshots|Include testing results, conclusion, future enhancements and references|Proofread and export as PDF',
    'SRS, technical documentation, user documentation, report writing, architecture documentation, screenshot documentation',
    'Prepare an introduction and module description for your project.',
    'Create a complete project report.',
    'Project documentation PDF',
    ''
  ],
  [
    'Learn how to present your project professionally.',
    'Understand the purpose of a project presentation|Choose PowerPoint or Canva and a professional theme|Create the title, problem statement and objectives slides|Present the proposed solution and technologies used|Add the architecture diagram and UI screenshots|Explain features, database design and testing|Demonstrate the live project|Add future enhancements and conclusion|Practise and prepare for audience questions',
    'PowerPoint, Canva, slide design, public speaking, technical explanation, presentation practice',
    'Present your project to a friend in five minutes.',
    'Prepare a 10-14 slide presentation.',
    'Project PPT',
    'Slides: 1 Title, 2 Introduction, 3 Problem statement, 4 Objectives, 5 Proposed solution, 6 Technologies, 7 Architecture, 8 UI design, 9 Main features, 10 Database, 11 Testing, 12 Live demo, 13 Future enhancements, 14 Conclusion'
  ],
  [
    'Learn to explain your project and answer technical interview questions confidently.',
    'Prepare a one-minute project introduction|Explain the problem, why you chose the project and the objectives|Describe the main features and technologies|Explain the architecture and how frontend and backend communicate|Explain CRUD, API integration and authentication|Describe testing, debugging, your GitHub workflow and deployment|Discuss challenges, solutions and future improvements|Practise a live demonstration|Attend a mock technical interview',
    'Likely questions: Tell me about your project. Why this project? Main objective? Technologies and why this database? CRUD? What is an API? How does authentication work? Challenges? How did you deploy? What would you improve?',
    'Record yourself explaining your project and answer 10 technical questions.',
    'Complete one mock project interview.',
    'Interview-ready project explanation and demonstration',
    'My project is called [Project Name]. It is developed to solve [Problem]. The main objective is to [Objective]. I used [Frontend] for the frontend, [Backend] for the backend and [Database] for storing information. The main features are [Feature 1], [Feature 2] and [Feature 3]. During development, I faced [Challenge] and solved it using [Solution]. Through this project, I learned [Skills].'
  ]
];

export const makePracticeQuestions = (topicIndex: number, seed: number): [string, number][] => {
  let s = seed;
  const rand = (n: number) => {
    s = (s * 16807) % 2147483647;
    return Math.abs(s % n);
  };
  const list: [string, number][] = [];
  for (let i = 0; i < 20; i++) {
    if (topicIndex === 0) {
      if (i < 10) {
        const x = 5 * (rand(10) + 1);
        const y = 20 * (rand(15) + 1);
        list.push([`What is ${x}% of ${y}?`, (x * y) / 100]);
      } else if (i < 15) {
        const b = [20, 40, 200, 500][rand(4)];
        const p = 5 * (rand(19) + 1);
        list.push([`${(p * b) / 100} is what % of ${b}?`, p]);
      } else {
        const a = [100, 200, 400, 500][rand(4)];
        const p = 5 * (rand(10) + 1);
        list.push([`Price rises from ${a} to ${a + (a * p) / 100}. Increase %?`, p]);
      }
    } else {
      const P = 1000 * (rand(5) + 1);
      const R = [4, 5, 6, 8, 10][rand(5)];
      const T = rand(5) + 1;
      list.push([`SI on ₹${P} at ${R}% for ${T} year(s)?`, (P * R * T) / 100]);
    }
  }
  return list;
};
