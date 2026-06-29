export interface CurriculumModule {
  week: number;
  title: string;
  duration: string;
  days: {
    day: number;
    title: string;
    duration: string;
    type: "Video" | "Coding" | "Reading" | "Project" | "Quiz";
  }[];
}

export function generateDynamicCurriculum(category: string, durationDays: number): CurriculumModule[] {
  const weeks = Math.ceil(durationDays / 7);
  const curriculum: CurriculumModule[] = [];

  const techStacks: Record<string, any[]> = {
    "Web Development": [
      { weekTitle: "Frontend Foundations & HTML5/CSS3 Architecture", topics: ["Semantic HTML5 & Accessibility", "CSS Grid & Flexbox Masterclass", "Responsive Design Patterns", "TailwindCSS Utility Workflows", "JavaScript DOM Manipulation", "CSS Animations & Micro-interactions", "Building a Responsive Landing Page"] },
      { weekTitle: "Advanced JavaScript & ES6+", topics: ["Closures, Hoisting & Scope", "Async/Await & Promises", "Functional Programming in JS", "Object Oriented JS & Prototypes", "Fetch API & RESTful Integrations", "Web Storage & Client-side Caching", "Vanilla JS Weather App Project"] },
      { weekTitle: "React.js Component Architecture", topics: ["React Fiber & Virtual DOM", "Hooks (useState, useEffect, custom)", "Context API & Prop Drilling", "React Router v6", "Component Lifecycle & Performance", "React Hook Form & Zod Validation", "Building a Task Management SPA"] },
      { weekTitle: "Backend Engineering with Node & Express", topics: ["Node.js Event Loop & Streams", "Express Middleware Architecture", "REST API Design Principles", "JWT Authentication & Security", "MongoDB & Mongoose ODM", "Error Handling & Logging", "Building a Secure RESTful API"] },
      { weekTitle: "Full Stack Next.js App Router", topics: ["Server Components vs Client Components", "Next.js Data Fetching (fetch, cache)", "NextAuth.js Implementation", "Supabase Integration & RLS", "Tailwind + Shadcn UI", "Vercel Deployment Workflows", "Full Stack E-Commerce Project"] }
    ],
    "Artificial Intelligence": [
      { weekTitle: "Python for AI & Data Manipulation", topics: ["Advanced Python Data Structures", "NumPy Vectorization & Broadcasting", "Pandas DataFrames & Series", "Data Cleaning & Preprocessing", "Matplotlib & Seaborn Visualization", "Statistical Analysis in Python", "Exploratory Data Analysis Project"] },
      { weekTitle: "Machine Learning Foundations", topics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Support Vector Machines (SVM)", "K-Means Clustering & PCA", "Hyperparameter Tuning & Grid Search", "Cross-Validation Techniques", "Predictive Pricing Model Project"] },
      { weekTitle: "Deep Learning & Neural Networks", topics: ["Perceptrons & Activation Functions", "Backpropagation & Gradient Descent", "TensorFlow & Keras Intro", "PyTorch Tensors & Autograd", "Optimizers (Adam, RMSprop)", "Regularization & Dropout", "Building a Deep Neural Network"] },
      { weekTitle: "Computer Vision & CNNs", topics: ["Image Filtering & Convolutions", "CNN Architectures (ResNet, VGG)", "Transfer Learning in CV", "Object Detection (YOLO)", "Image Segmentation", "OpenCV Basics", "Facial Recognition System Project"] },
      { weekTitle: "NLP & Generative AI", topics: ["Text Tokenization & Word Embeddings", "RNNs & LSTMs", "Transformer Architecture Overview", "Hugging Face Transformers", "Fine-tuning LLMs", "LangChain & RAG Implementation", "Custom AI Chatbot Project"] }
    ],
    "Data Science": [
      { weekTitle: "Data Wrangling & SQL Mastery", topics: ["Advanced SQL Queries & Joins", "Window Functions & CTEs", "Data Extraction (ETL)", "Pandas Data Cleaning", "Handling Missing Data & Outliers", "Regex for Data Science", "Data Cleaning Pipeline Project"] },
      { weekTitle: "Statistical Modeling", topics: ["Probability Distributions", "Hypothesis Testing (T-Tests, ANOVA)", "A/B Testing Methodologies", "Bayesian Statistics Basics", "Correlation vs Causation", "Time Series Forecasting (ARIMA)", "A/B Test Analysis Project"] },
      { weekTitle: "Machine Learning in Production", topics: ["Scikit-Learn Workflows", "Feature Engineering", "Ensemble Methods (XGBoost)", "Model Evaluation Metrics (ROC, AUC)", "Handling Imbalanced Datasets", "Pickle & Joblib Model Saving", "Customer Churn Prediction Model"] },
      { weekTitle: "Big Data Technologies", topics: ["Apache Spark & PySpark", "Hadoop Ecosystem Overview", "MapReduce Paradigms", "AWS S3 & Cloud Storage", "NoSQL Databases (Cassandra)", "Data Warehousing (Snowflake)", "Big Data Processing Project"] },
      { weekTitle: "Data Visualization & Storytelling", topics: ["Tableau Dashboard Design", "PowerBI Data Modeling", "Advanced Plotly & Dash", "Interactive Web Visualizations", "Communicating Insights to Stakeholders", "Data Storytelling Framework", "End-to-End Business Dashboard Project"] }
    ],
    "Cybersecurity": [
      { weekTitle: "Networking & Security Fundamentals", topics: ["OSI Model & TCP/IP Stack", "Subnetting & Routing", "Wireshark & Packet Analysis", "Firewalls & IDS/IPS", "Linux CLI for Hackers", "Cryptography Basics (RSA, AES)", "Network Traffic Analysis Project"] },
      { weekTitle: "Ethical Hacking & Reconnaissance", topics: ["Passive vs Active Recon", "Nmap & Port Scanning", "Vulnerability Assessment Tools (Nessus)", "OSINT Techniques", "Social Engineering Vectors", "Threat Modeling", "Reconnaissance Report Project"] },
      { weekTitle: "Web Application Security", topics: ["OWASP Top 10 Deep Dive", "SQL Injection (SQLi) Techniques", "Cross-Site Scripting (XSS)", "CSRF & SSRF", "Burp Suite Proxy Workflows", "Session Management Flaws", "Web App Vulnerability Audit"] },
      { weekTitle: "System Exploitation & Privilege Escalation", topics: ["Metasploit Framework", "Buffer Overflows Concepts", "Windows Privilege Escalation", "Linux Privilege Escalation", "Active Directory Attacks (Kerberoasting)", "Bypassing Antivirus", "Capture The Flag (CTF) Challenge"] },
      { weekTitle: "Incident Response & Forensics", topics: ["Digital Forensics Framework", "Memory Forensics (Volatility)", "Malware Analysis Basics", "SIEM Tools (Splunk)", "Incident Response Lifecycle", "Writing Security Reports", "Mock Incident Response Drill"] }
    ],
    "Graphic Design": [
      { weekTitle: "Design Theory & Color Psychology", topics: ["Color Theory & Harmonies", "Typography Rules & Pairing", "Gestalt Principles of Design", "Visual Hierarchy & Layout", "Grid Systems", "Understanding Design Briefs", "Brand Moodboard Creation"] },
      { weekTitle: "Vector Graphics (Adobe Illustrator)", topics: ["Pen Tool Mastery", "Shape Builder & Pathfinder", "Vector Illustration Techniques", "Logo Design Principles", "Creating Isometric Graphics", "Exporting for Print vs Web", "Corporate Logo Design Project"] },
      { weekTitle: "Raster Manipulation (Photoshop)", topics: ["Non-destructive Editing & Masks", "Advanced Retouching", "Compositing & Blending Modes", "Color Grading & Adjustment Layers", "Typography in Photoshop", "Mockup Creation", "Movie Poster Design Project"] },
      { weekTitle: "UI/UX Foundations (Figma)", topics: ["Figma Interface & Shortcuts", "Components & Variants", "Auto Layout Mastery", "Prototyping & Interactions", "Design Systems Basics", "User Persona Creation", "Mobile App UI Design Project"] },
      { weekTitle: "Motion Graphics & Portfolio", topics: ["After Effects Basics", "Keyframing & Easing", "Logo Animation", "Exporting Lottie Files", "Behance Portfolio Setup", "Presenting Design Work", "Animated Brand Identity Project"] }
    ],
    "Default": [
      { weekTitle: "Industry Fundamentals", topics: ["Industry Overview & Key Concepts", "Setting up the Environment", "Tooling & Best Practices", "Version Control (Git/GitHub)", "Agile Methodologies", "Communication in Tech", "Environment Setup Project"] },
      { weekTitle: "Core Competencies", topics: ["Deep Dive into Core Tech", "Standard Operating Procedures", "Debugging & Troubleshooting", "Writing Clean Documentation", "Performance Optimization", "Security Best Practices", "Core Implementation Project"] },
      { weekTitle: "Advanced Workflows", topics: ["Advanced Frameworks", "Automation & Scripting", "Testing (Unit/Integration)", "CI/CD Pipelines", "Scaling & Architecture", "Code Reviews & Feedback", "Advanced Workflow Project"] },
      { weekTitle: "Real-world Applications", topics: ["Client Requirements Analysis", "Project Architecture Planning", "Implementation Phase 1", "Implementation Phase 2", "QA & Bug Fixing", "Deployment to Production", "Real-world Capstone Project"] },
      { weekTitle: "Career Prep & Final Review", topics: ["Resume Building", "LinkedIn Optimization", "Mock Interview (Technical)", "Mock Interview (HR)", "Salary Negotiation", "Portfolio Review", "Final Graduation Project"] }
    ]
  };

  let selectedStack = techStacks["Default"];
  for (const key in techStacks) {
    if (category.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(category.toLowerCase())) {
      selectedStack = techStacks[key];
      break;
    }
  }

  for (let w = 1; w <= weeks; w++) {
    const weekData = selectedStack[Math.min(w - 1, selectedStack.length - 1)];
    const days = [];
    
    const types: ("Video" | "Coding" | "Reading" | "Project" | "Quiz")[] = [
      "Video", "Reading", "Coding", "Video", "Coding", "Quiz", "Project"
    ];
    const durations = ["45 mins", "30 mins", "2 hours", "45 mins", "2 hours", "1 hour", "3 hours"];

    for (let d = 1; d <= 7; d++) {
      const topicTitle = weekData.topics[Math.min(d - 1, weekData.topics.length - 1)];
      
      days.push({
        day: d,
        title: topicTitle,
        duration: durations[d - 1],
        type: types[d - 1]
      });
    }

    curriculum.push({
      week: w,
      title: `Week ${w}: ${weekData.weekTitle}`,
      duration: "1 Week",
      days
    });
  }

  return curriculum;
}
