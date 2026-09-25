/* ==========================================================================
   EDUPULSE CURRICULUM & STUDY DATABASE
   Real, comprehensive educational content across all major subjects
   ========================================================================== */

const STUDY_DATABASE = {
  topics: [
    {
      id: "math-calculus-derivatives",
      title: "Calculus: Essence of Derivatives & Rates of Change",
      subject: "math",
      subjectName: "Mathematics",
      duration: "18 mins",
      level: "Class 11-12 / College",
      rating: "4.9/5",
      videoId: "WUvTyaaNkzM", // 3Blue1Brown Calculus
      chapters: [
        { title: "Geometric Intuition", time: "0:00" },
        { title: "Slope of Secant to Tangent", time: "3:45" },
        { title: "The Power Rule Formula", time: "8:20" },
        { title: "Real-world Applications", time: "14:10" }
      ],
      notes: `
        <h3>1. Fundamental Meaning of the Derivative</h3>
        <p>The derivative measures the instantaneous rate of change of a function with respect to one of its variables. Geometrically, it is the exact slope of the tangent line to the function at any given point.</p>
        
        <div class="callout-box">
          <strong>Key Mathematical Definition:</strong>
          f'(x) = lim (h &rarr; 0) [ f(x + h) - f(x) ] / h
        </div>

        <h3>2. Essential Rules Every Student Must Master</h3>
        <ul>
          <li><strong>Power Rule:</strong> d/dx [x^n] = n &middot; x^(n-1)</li>
          <li><strong>Product Rule:</strong> d/dx [u &middot; v] = u'v + uv'</li>
          <li><strong>Quotient Rule:</strong> d/dx [u / v] = (u'v - uv') / v^2</li>
          <li><strong>Chain Rule:</strong> d/dx [f(g(x))] = f'(g(x)) &middot; g'(x)</li>
        </ul>

        <h3>3. Physical Interpretation</h3>
        <p>If position is given by s(t), then velocity is v(t) = s'(t) (first derivative), and acceleration is a(t) = v'(t) = s''(t) (second derivative).</p>
      `,
      formulas: [
        {
          title: "Definition of Derivative",
          math: "f'(x) = lim[h→0] (f(x+h) - f(x)) / h",
          desc: "The limit definition representing instantaneous rate of change."
        },
        {
          title: "Power Rule",
          math: "d/dx(x^n) = n · x^(n - 1)",
          desc: "Fundamental rule used for all polynomial differentiation."
        },
        {
          title: "Chain Rule",
          math: "dy/dx = (dy/du) · (du/dx)",
          desc: "Differentiates composite functions f(g(x))."
        },
        {
          title: "Product Rule",
          math: "(f · g)' = f' · g + f · g'",
          desc: "Derivative of the product of two functions."
        }
      ],
      quiz: [
        {
          question: "What is the derivative of f(x) = 3x^4 - 5x + 7?",
          options: [
            "12x^3 - 5",
            "12x^4 - 5x",
            "7x^3 - 5",
            "12x^3 + 7"
          ],
          answer: 0,
          explanation: "Applying the power rule: d/dx(3x^4) = 12x^3, d/dx(-5x) = -5, d/dx(7) = 0. Therefore, f'(x) = 12x^3 - 5."
        },
        {
          question: "If position s(t) = t^2, what is the acceleration at t = 3?",
          options: [
            "6",
            "2",
            "0",
            "9"
          ],
          answer: 1,
          explanation: "Velocity v(t) = s'(t) = 2t. Acceleration a(t) = v'(t) = 2 (constant for all t). So at t = 3, acceleration is 2."
        },
        {
          question: "Which rule is required to differentiate sin(x^2)?",
          options: [
            "Product Rule",
            "Quotient Rule",
            "Chain Rule",
            "Integration by Parts"
          ],
          answer: 2,
          explanation: "Because sin(x^2) is a composite function f(g(x)) where f(u) = sin(u) and g(x) = x^2, the Chain Rule gives cos(x^2) · 2x."
        }
      ]
    },

    {
      id: "physics-quantum-basics",
      title: "Quantum Physics: Wave-Particle Duality & Schrödinger",
      subject: "physics",
      subjectName: "Physics",
      duration: "21 mins",
      level: "Senior Secondary / University",
      rating: "5.0/5",
      videoId: "bHIhgxav9LY", // Quantum mechanics
      chapters: [
        { title: "Double-Slit Experiment", time: "0:00" },
        { title: "Wave-Particle Duality", time: "5:15" },
        { title: "Heisenberg Uncertainty Principle", time: "11:30" },
        { title: "Schrödinger Wave Equation", time: "16:45" }
      ],
      notes: `
        <h3>1. Wave-Particle Duality</h3>
        <p>Light and matter exhibit behaviors of both waves and discrete particles. The Photoelectric effect (Einstein 1905) proved light travels in packets called photons with energy E = h&nu;. De Broglie showed particles with momentum p also possess a wavelength &lambda; = h / p.</p>

        <div class="callout-box">
          <strong>De Broglie Wavelength Equation:</strong>
          &lambda; = h / p = h / (m &middot; v)
        </div>

        <h3>2. Heisenberg Uncertainty Principle</h3>
        <p>It is fundamentally impossible to simultaneously measure the exact position and exact momentum of a quantum entity with infinite precision.</p>
        <p>&Delta;x &middot; &Delta;p &ge; &#8463; / 2 (where &#8463; = h / (2&pi;))</p>

        <h3>3. Schrödinger's Equation</h3>
        <p>Describes how the quantum state (wave function &Psi;) of a physical system changes over time. |&Psi;|^2 gives the probability density of finding the particle at a specific location.</p>
      `,
      formulas: [
        {
          title: "Planck Energy Relation",
          math: "E = h · ν = (h · c) / λ",
          desc: "Relates the energy of a photon to its frequency and wavelength."
        },
        {
          title: "De Broglie Wavelength",
          math: "λ = h / p = h / (m · v)",
          desc: "Wavelength of any matter particle with mass m and velocity v."
        },
        {
          title: "Heisenberg Uncertainty",
          math: "Δx · Δp ≥ ℏ / 2",
          desc: "Fundamental limit to the precision of complementary variables."
        },
        {
          title: "Time-Independent Schrödinger",
          math: "Ĥψ = Eψ",
          desc: "Eigenvalue equation determining the stationary states of a quantum system."
        }
      ],
      quiz: [
        {
          question: "What did the Photoelectric Effect experiment prove about light?",
          options: [
            "Light is purely a continuous wave",
            "Light consists of quantized packets of energy (photons)",
            "Light cannot travel through vacuum",
            "Light speed depends on observer velocity"
          ],
          answer: 1,
          explanation: "Albert Einstein won the Nobel Prize for explaining that light transfers energy in discrete packets called photons, where E = hν."
        },
        {
          question: "If an electron's speed increases, what happens to its De Broglie wavelength?",
          options: [
            "It decreases",
            "It increases",
            "It remains exactly the same",
            "It becomes zero immediately"
          ],
          answer: 0,
          explanation: "Since λ = h / (m · v), wavelength λ is inversely proportional to velocity v. Higher velocity means smaller wavelength."
        }
      ]
    },

    {
      id: "cs-python-dsa",
      title: "Computer Science: Python Core & Data Structures",
      subject: "cs",
      subjectName: "Computer Science",
      duration: "25 mins",
      level: "All Levels",
      rating: "4.9/5",
      videoId: "_uQrJ0TkZlc", // Python tutorial
      chapters: [
        { title: "Python Syntax & Memory Model", time: "0:00" },
        { title: "Lists, Tuples, Dictionaries", time: "6:10" },
        { title: "Time Complexity & Big-O", time: "14:20" },
        { title: "Binary Search & Sorting", time: "19:40" }
      ],
      notes: `
        <h3>1. Python Memory & Core Data Types</h3>
        <p>Python is dynamically typed and garbage collected. Everything in Python is an object. Mutable types (Lists, Dicts, Sets) can be modified in-place, while immutable types (Integers, Floats, Strings, Tuples) create a new object when changed.</p>

        <div class="callout-box">
          <strong>Big-O Complexity Cheat Sheet:</strong>
          <ul>
            <li>List append / pop: <strong>O(1)</strong></li>
            <li>List insert / delete at index: <strong>O(N)</strong></li>
            <li>Dict lookup / insert: <strong>O(1) average</strong></li>
            <li>Binary Search: <strong>O(log N)</strong></li>
            <li>QuickSort / MergeSort: <strong>O(N log N)</strong></li>
          </ul>
        </div>

        <h3>2. Idiomatic Python (Clean Code)</h3>
        <p>Use List Comprehensions: <code>[x**2 for x in nums if x % 2 == 0]</code></p>
        <p>Use Context Managers: <code>with open("file.txt") as f: ...</code> to guarantee file handles close properly.</p>
      `,
      formulas: [
        {
          title: "Binary Search Complexity",
          math: "T(N) = O(log₂ N)",
          desc: "Halves search space at each iteration on a sorted array."
        },
        {
          title: "Hash Map Average Lookup",
          math: "O(1) Constant Time",
          desc: "Key hashed to bucket index for instantaneous retrieval."
        },
        {
          title: "Merge Sort Space & Time",
          math: "Time: O(N log N), Space: O(N)",
          desc: "Stable divide-and-conquer sorting algorithm."
        }
      ],
      quiz: [
        {
          question: "What is the average time complexity of searching a key in a Python dictionary?",
          options: [
            "O(N)",
            "O(1)",
            "O(log N)",
            "O(N^2)"
          ],
          answer: 1,
          explanation: "Python dictionaries use hash tables under the hood, giving O(1) average time lookup."
        },
        {
          question: "Which of the following data types in Python is IMMUTABLE?",
          options: [
            "List",
            "Dictionary",
            "Set",
            "Tuple"
          ],
          answer: 3,
          explanation: "Tuples, Strings, and Integers are immutable in Python; their contents cannot be changed after creation."
        }
      ]
    },

    {
      id: "chem-organic-reactions",
      title: "Chemistry: Organic Chemistry Reaction Mechanisms",
      subject: "chemistry",
      subjectName: "Chemistry",
      duration: "20 mins",
      level: "Class 11-12 / NEET / JEE",
      rating: "4.8/5",
      videoId: "d2K3p0WpUa0", // Organic chemistry
      chapters: [
        { title: "Electrophiles vs Nucleophiles", time: "0:00" },
        { title: "SN1 vs SN2 Mechanisms", time: "5:30" },
        { title: "Markovnikov's Rule", time: "12:15" },
        { title: "Acidity & Resonance Effects", time: "16:40" }
      ],
      notes: `
        <h3>1. SN1 vs SN2 Nucleophilic Substitution</h3>
        <p><strong>SN1 (Substitution Nucleophilic Unimolecular):</strong> 2-step process involving a carbocation intermediate. Rate depends only on substrate [R-X]. Leads to racemization. Favored by tertiary (3&deg;) halides and polar protic solvents.</p>
        <p><strong>SN2 (Substitution Nucleophilic Bimolecular):</strong> 1-step concerted mechanism with simultaneous bond breaking and forming. Inversion of configuration (Walden inversion). Favored by primary (1&deg;) halides and polar aprotic solvents.</p>

        <div class="callout-box">
          <strong>Markovnikov's Rule:</strong>
          In electrophilic addition of HX to an unsymmetrical alkene, the hydrogen atom attaches to the carbon with the greater number of hydrogen atoms already attached ("The rich get richer").
        </div>
      `,
      formulas: [
        {
          title: "SN1 Rate Law",
          math: "Rate = k · [Substrate]",
          desc: "First order kinetics, formation of carbocation is rate-determining."
        },
        {
          title: "SN2 Rate Law",
          math: "Rate = k · [Substrate] · [Nucleophile]",
          desc: "Second order kinetics, concerted single-step backside attack."
        },
        {
          title: "Carbocation Stability Order",
          math: "3° > 2° > 1° > Methyl",
          desc: "Stabilized by hyperconjugation and inductive effect (+I)."
        }
      ],
      quiz: [
        {
          question: "Which alkyl halide will react fastest via the SN2 mechanism?",
          options: [
            "CH3-Br (Methyl bromide)",
            "(CH3)3C-Br (tert-butyl bromide)",
            "(CH3)2CH-Br (isopropyl bromide)",
            "Phenyl bromide"
          ],
          answer: 0,
          explanation: "SN2 involves backside attack and is hindered by steric hindrance. Methyl halides have the least steric bulk and react fastest."
        }
      ]
    },

    {
      id: "bio-genetics-dna",
      title: "Biology: DNA Replication, Transcription & Translation",
      subject: "biology",
      subjectName: "Biology",
      duration: "19 mins",
      level: "Class 11-12 / Medical",
      rating: "4.9/5",
      videoId: "gG7uCskUOrA", // DNA replication
      chapters: [
        { title: "DNA Double Helix Structure", time: "0:00" },
        { title: "Enzymes in DNA Replication", time: "5:20" },
        { title: "RNA Transcription (DNA to mRNA)", time: "11:10" },
        { title: "Ribosomal Translation & Codons", time: "15:00" }
      ],
      notes: `
        <h3>1. The Central Dogma of Molecular Biology</h3>
        <p>DNA &rarr; (Transcription) &rarr; mRNA &rarr; (Translation) &rarr; Functional Protein.</p>

        <h3>2. Key Enzymes in DNA Replication</h3>
        <ul>
          <li><strong>Helicase:</strong> Unzips the double helix by breaking hydrogen bonds.</li>
          <li><strong>DNA Polymerase III:</strong> Synthesizes the complementary daughter strand in the 5' &rarr; 3' direction.</li>
          <li><strong>Primase:</strong> Lays down an RNA primer for polymerase to start.</li>
          <li><strong>DNA Ligase:</strong> Glues Okazaki fragments together on the lagging strand.</li>
        </ul>

        <div class="callout-box">
          <strong>Base Pairing Rule (Chargaff's Rule):</strong>
          Adenine (A) pairs with Thymine (T) via 2 Hydrogen bonds.<br>
          Guanine (G) pairs with Cytosine (C) via 3 Hydrogen bonds.
        </div>
      `,
      formulas: [
        {
          title: "Chargaff's Rule",
          math: "A = T and G ≡ C  =>  (A + G) = (T + C)",
          desc: "Purines always equal pyrimidines in double-stranded DNA."
        },
        {
          title: "Start Codon",
          math: "AUG (Methionine)",
          desc: "The universal signal codon initiating ribosomal protein synthesis."
        }
      ],
      quiz: [
        {
          question: "Which enzyme joins Okazaki fragments on the lagging strand during DNA replication?",
          options: [
            "DNA Ligase",
            "Helicase",
            "RNA Primase",
            "Topoisomerase"
          ],
          answer: 0,
          explanation: "DNA Ligase forms phosphodiester bonds between discontinuous Okazaki fragments on the lagging strand."
        }
      ]
    },

    {
      id: "history-industrial-revolution",
      title: "History & GK: The Industrial Revolution & Modern World",
      subject: "history",
      subjectName: "History & GK",
      duration: "16 mins",
      level: "General Study / UPSC / Boards",
      rating: "4.7/5",
      videoId: "zhL5DCizj5c", // CrashCourse History
      chapters: [
        { title: "Origins in Great Britain", time: "0:00" },
        { title: "Steam Power & Watt Engine", time: "4:30" },
        { title: "Factory System & Urbanization", time: "9:15" },
        { title: "Global Economic Shift", time: "13:00" }
      ],
      notes: `
        <h3>1. Why Great Britain First?</h3>
        <p>Britain had vast coal deposits, iron ore, surplus agricultural capital, naval dominance protecting trade routes, and a stable legal patent system protecting innovators.</p>

        <h3>2. Key Inventions that Changed Humanity</h3>
        <ul>
          <li><strong>Spinning Jenny (1764) - James Hargreaves:</strong> Revolutionized yarn production.</li>
          <li><strong>Steam Engine (1769) - James Watt:</strong> Enabled mechanical power anywhere, ending reliance on water wheels.</li>
          <li><strong>Locomotive Steam Train - George Stephenson:</strong> Shrinking distance and freight transport times.</li>
        </ul>
      `,
      formulas: [
        {
          title: "Timeline of First Industrial Rev",
          math: "Circa 1760 – 1840",
          desc: "Transition from manual handcraft to machinery and steam power."
        }
      ],
      quiz: [
        {
          question: "Who significantly improved the efficiency of the Steam Engine in 1769?",
          options: [
            "James Watt",
            "Thomas Edison",
            "Eli Whitney",
            "Isaac Newton"
          ],
          answer: 0,
          explanation: "James Watt added a separate condenser to Newcomen's engine, vastly improving fuel efficiency and powering the revolution."
        }
      ]
    }
  ],

  // Default Flashcard Decks
  flashcards: {
    math: [
      {
        category: "Mathematics",
        question: "What is Euler's Identity?",
        answer: "e^(i·π) + 1 = 0",
        tip: "Connects 5 fundamental constants: e, i, π, 1, and 0 in a single equation."
      },
      {
        category: "Mathematics",
        question: "What is the Quadratic Formula?",
        answer: "x = (-b ± √(b² - 4ac)) / (2a)",
        tip: "Solves ax² + bx + c = 0. The discriminant b² - 4ac tells the nature of roots."
      },
      {
        category: "Mathematics",
        question: "What is the derivative of ln(x)?",
        answer: "1 / x",
        tip: "Valid for all x > 0."
      },
      {
        category: "Mathematics",
        question: "What is Pythagoras Theorem?",
        answer: "a² + b² = c²",
        tip: "In any right-angled triangle, hypotenuse squared equals sum of squares of other two sides."
      }
    ],

    physics: [
      {
        category: "Physics",
        question: "Newton's Second Law of Motion?",
        answer: "F = m · a (or F = dp/dt)",
        tip: "Force equals the rate of change of linear momentum."
      },
      {
        category: "Physics",
        question: "What is Einstein's Mass-Energy Equivalence?",
        answer: "E = m · c²",
        tip: "c is the speed of light in vacuum (~3 × 10⁸ m/s)."
      },
      {
        category: "Physics",
        question: "What is Coulomb's Law formula for electrostatics?",
        answer: "F = (1 / 4πε₀) · (|q₁q₂| / r²)",
        tip: "Electrostatic force between two point charges."
      }
    ],

    cs: [
      {
        category: "Computer Science",
        question: "Time complexity of Binary Search?",
        answer: "O(log N)",
        tip: "Array must be sorted prior to searching."
      },
      {
        category: "Computer Science",
        question: "What does HTTP status code 404 signify?",
        answer: "Not Found",
        tip: "The server cannot find the requested resource URL."
      },
      {
        category: "Computer Science",
        question: "What is a FIFO Data Structure?",
        answer: "Queue (First In First Out)",
        tip: "Elements added at rear and removed from front."
      }
    ],

    chemistry: [
      {
        category: "Chemistry",
        question: "What is Avogadro's Number?",
        answer: "6.022 × 10²³ entities / mole",
        tip: "Number of atoms/molecules in one mole of any pure substance."
      },
      {
        category: "Chemistry",
        question: "What is the Ideal Gas Equation?",
        answer: "P · V = n · R · T",
        tip: "P=Pressure, V=Volume, n=Moles, R=Gas constant, T=Kelvin Temp."
      }
    ],

    biology: [
      {
        category: "Biology",
        question: "What is known as the powerhouse of the cell?",
        answer: "Mitochondria",
        tip: "Site of cellular respiration and ATP generation."
      },
      {
        category: "Biology",
        question: "Which base replaces Thymine in RNA?",
        answer: "Uracil (U)",
        tip: "Adenine pairs with Uracil in RNA strands."
      }
    ],

    custom: [
      {
        category: "My Custom Study",
        question: "What is active recall?",
        answer: "Testing yourself on information rather than passively re-reading it.",
        tip: "Produces significantly stronger neural pathways and exam retention."
      }
    ]
  },

  // Sample CSV Exam Data for Table to PDF converter
  sampleCsv: `Subject,Topic,Target Date,Priority,Status
Mathematics,Calculus & Integration,2026-10-05,High,In Progress
Physics,Quantum Dual Nature,2026-10-08,High,Not Started
Computer Science,Data Structures (Trees & Graphs),2026-10-12,Urgent,Completed
Chemistry,Organic Reaction Mechanisms,2026-10-15,Medium,In Progress
Biology,Molecular Genetics & DNA,2026-10-18,Medium,Not Started
English / GK,Industrial Revolution & Vocabulary,2026-10-22,Low,Completed`
};

if (typeof window !== 'undefined') {
  window.STUDY_DATABASE = STUDY_DATABASE;
}
