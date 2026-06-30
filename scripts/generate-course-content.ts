import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchWikipediaContent(query: string): Promise<string> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${encodeURIComponent(query)}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return "";
    
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return "";
    
    // Simple HTML to Markdown-ish conversion
    let html = pages[pageId].extract || "";
    html = html.replace(/<[^>]+>/g, '');
    return html;
  } catch (err) {
    return "";
  }
}

async function generateMarkdownForLesson(title: string, duration: string, domain: string): Promise<string> {
  // Strip special characters for search
  const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");
  const extract = await fetchWikipediaContent(cleanTitle.split(" ").slice(0, 3).join(" "));
  
  const intro = extract ? extract : `In this lesson, we will explore the fundamental concepts of ${title}. You will learn how to apply these concepts in real-world scenarios within the field of ${domain}.`;

  return `
# ${title}
**Duration:** ${duration} | **Domain:** ${domain}

## 1. Introduction
${intro}

Understanding **${title}** is crucial for mastering ${domain}. This lesson is designed to take you from basic concepts to advanced implementations.

## 2. Key Concepts & Terminology
- **Core Principle:** The foundational idea behind ${title}.
- **Implementation Strategy:** How industry professionals approach this topic.
- **Common Pitfalls:** What to avoid when working with these tools.

## 3. Deep Dive
When working with ${title}, it is important to understand the underlying mechanics. Most modern systems handle this seamlessly, but as a professional in ${domain}, you need to know what happens under the hood.

> **Pro Tip:** Always double-check your syntax and logic flows when applying these patterns in production environments.

### 3.1 Code Example / Implementation
Here is a standard implementation pattern:

\`\`\`javascript
// Example implementation for ${title}
function initializeModule(config) {
  console.log("Starting module with config:", config);
  
  try {
    // Core logic
    const result = performOperation(config.data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Operation failed:", error);
    return { success: false, error: error.message };
  }
}

function performOperation(data) {
  // Processing data
  return data.map(item => item * 2);
}
\`\`\`

## 4. Real-World Application
In enterprise environments, ${title} is used to scale applications, improve security, and enhance user experience. Companies like Google, Meta, and Netflix rely heavily on these principles to maintain their infrastructure.

## 5. Summary & Next Steps
You have now completed the core concepts of **${title}**. 
- Review the code examples above.
- Try implementing the concepts in your own local environment.
- Prepare for the next lesson where we will build upon this foundation.

---
*End of Document. Mark as complete below.*
`;
}

async function main() {
  console.log("Starting content generation for all lessons...");
  
  const { data: internships, error } = await supabase.from("internships").select("*");
  if (error || !internships) {
    console.error("Failed to fetch internships:", error);
    return;
  }

  let totalUpdated = 0;

  for (const internship of internships) {
    console.log(`Processing internship: ${internship.title}`);
    if (!internship.modules) continue;
    
    let isUpdated = false;
    const modules = [...internship.modules];

    for (let mIndex = 0; mIndex < modules.length; mIndex++) {
      const mod = modules[mIndex];
      if (!mod || !mod.days) continue;

      for (let dIndex = 0; dIndex < mod.days.length; dIndex++) {
        const day = mod.days[dIndex];
        if (!day) continue;

        // Change type to Reading to enforce Markdown render in UI
        day.type = "Reading";
        
        // Generate Markdown content
        const markdown = await generateMarkdownForLesson(day.title, day.duration || "1 hour", internship.category);
        
        // Save content to a new field 'content_markdown' to avoid interfering with old 'content_url'
        day.content_markdown = markdown;
        isUpdated = true;
        totalUpdated++;
      }
    }

    if (isUpdated) {
      const { error: updateError } = await supabase
        .from("internships")
        .update({ modules })
        .eq("id", internship.id);
        
      if (updateError) {
        console.error(`Failed to update ${internship.title}:`, updateError);
      } else {
        console.log(`✅ Successfully updated ${internship.title}`);
      }
    }
  }
  
  console.log(`\n🎉 Generation Complete! Generated Markdown for ${totalUpdated} lessons.`);
}

main().catch(console.error);
