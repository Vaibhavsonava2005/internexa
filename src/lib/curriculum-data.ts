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

  const coreTopics: Record<string, string[]> = {
    "Web Development": ["HTML & CSS Mastery", "JavaScript Deep Dive", "Frontend Frameworks (React)", "Backend & APIs (Node.js)", "Databases (MongoDB)", "Authentication & Security", "Deployment & CI/CD", "Final Project Build", "Advanced State Management", "Performance Optimization", "WebSockets & Real-time", "Capstone Project"],
    "Artificial Intelligence": ["Python for Data Science", "Machine Learning Basics", "Supervised Learning", "Unsupervised Learning", "Neural Networks & Deep Learning", "Natural Language Processing", "Computer Vision", "Model Deployment", "Reinforcement Learning", "Generative AI", "AI Ethics", "Capstone Project"],
    "Data Science": ["Data Wrangling with Pandas", "Exploratory Data Analysis", "Statistical Inference", "Machine Learning with Scikit-Learn", "Data Visualization", "Time Series Analysis", "Big Data (Spark)", "Capstone Project", "Advanced Stats", "Deep Learning for Data", "Data Engineering", "Final Capstone"],
    "Cybersecurity": ["Networking Fundamentals", "Ethical Hacking Basics", "Web Application Penetration Testing", "Network Security", "Cryptography", "Incident Response", "Cloud Security", "Final Security Audit", "Malware Analysis", "IoT Security", "Red Teaming", "Capstone Project"],
    "Graphic Design": ["Design Fundamentals", "Typography & Color", "Adobe Illustrator Mastery", "Photoshop Techniques", "Layout & Composition", "Branding Identity", "UI Design Basics", "Final Portfolio", "Advanced Typography", "Motion Graphics", "3D Design Basics", "Capstone Project"],
    "Digital Marketing": ["Marketing Fundamentals", "SEO Mastery", "Content Marketing", "Social Media Advertising", "Google Ads & PPC", "Email Marketing", "Analytics & Conversion", "Final Campaign", "Affiliate Marketing", "Influencer Marketing", "Marketing Automation", "Capstone Project"],
    "Default": ["Introduction & Fundamentals", "Core Concepts Phase 1", "Core Concepts Phase 2", "Advanced Techniques Phase 1", "Advanced Techniques Phase 2", "Industry Best Practices", "Real-World Application", "Final Capstone Project", "Specialized Topic 1", "Specialized Topic 2", "Interview Prep", "Final Capstone"]
  };

  let topics = coreTopics["Default"];
  for (const key in coreTopics) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      topics = coreTopics[key];
      break;
    }
  }

  for (let w = 1; w <= weeks; w++) {
    const topicTitle = topics[Math.min(w - 1, topics.length - 1)];
    const days = [];
    
    for (let d = 1; d <= 7; d++) {
      let type: "Video" | "Coding" | "Reading" | "Project" | "Quiz" = "Video";
      let dayTitle = "Concept Lecture & Demo";
      let duration = "45 mins";

      if (d === 2 || d === 4) {
        type = "Coding";
        dayTitle = "Hands-on Implementation";
        duration = "2 hours";
      } else if (d === 3 || d === 5) {
        type = "Reading";
        dayTitle = "Deep Dive Case Study";
        duration = "30 mins";
      } else if (d === 6) {
        type = "Quiz";
        dayTitle = "Weekly Assessment";
        duration = "1 hour";
      } else if (d === 7) {
        type = "Project";
        dayTitle = "Weekly Mini-Project";
        duration = "3 hours";
      }

      days.push({
        day: d,
        title: `${topicTitle}: ${dayTitle}`,
        duration,
        type
      });
    }

    curriculum.push({
      week: w,
      title: `Week ${w}: ${topicTitle}`,
      duration: "1 Week",
      days
    });
  }

  return curriculum;
}
