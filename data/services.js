export const mockServices = [
  {
    id: "responsive-landing-page",
    title: "I will build a responsive landing page with Next.js",
    seller: { 
      name: "Dr Python", 
      avatar: null,
      level: "Top Rated Seller",
      rating: 5.0,
      reviews: 1240
    },
    rating: 5.0,
    reviews: 31,
    price: 180,
    image: "/images/service-code.png",
    badges: ["Premium", "Pro", "Level 1"],
    isNew: false,
    delivery: "Up to 3 days",
    category: "Development",
    views: 1240,
    description: "Get a high-performance, SEO-optimized landing page built with the latest Next.js and Tailwind CSS technologies.",
    longDescription: `
# High-Velocity Next.js Landing Page Engineering

In the digital-first economy, your landing page isn't just a website—it's your primary conversion engine. We don't just "build pages"; we engineer high-performance user experiences designed to maximize your ROI.

## Why Next.js + Tailwind CSS?
We utilize the modern tech stack that industry giants like Vercel, Meta, and OpenAI trust. 
- **Speed**: Server-side rendering (SSR) and Static Site Generation (SSG) ensure sub-second load times.
- **SEO**: Optimized metadata, automatic image optimization, and semantic HTML ensure you rank higher.
- **Scalability**: Your landing page is built to handle 10 users or 10 million users without breaking a sweat.

### What's Included in My Engineering Process:

#### 1. Performance-First Architecture
Every line of code is written with performance in mind. We minimize bundle sizes, optimize font loading, and ensure zero layout shifts.
- **Core Web Vitals**: We aim for 90+ scores across the board.
- **Image Optimization**: Using Next/Image for automated lazy loading and WebP conversion.

#### 2. Conversion-Driven UX/UI
A beautiful page that doesn't convert is a failed mission. We focus on:
- **Visual Hierarchy**: Guiding the user's eye to your primary CTA.
- **Interactive States**: Micro-animations that provide tactile feedback.
- **Mobile Perfection**: 100% responsive design that feels native on every device.

#### 3. Advanced Integrations
- **API Connectivity**: Link your landing page to Stripe, Mailchimp, or any custom CRM.
- **Analytics Hub**: Full tracking setup for Google Analytics and Facebook Pixel.
- **CMS Control**: Optional integration with Sanity or Contentful so you can edit text without a developer.

---

### The Dr. Python Guarantee
When you hire me, you aren't getting a freelancer; you're getting a software architect. The code delivered will be clean, documented, and ready for future expansion.

**Ready to launch?** Choose your mission tier on the right and let's start engineering your success.
    `,
    aboutService: "This service includes a fully responsive design, custom animations, and a lightning-fast user experience.",
    features: [
      "Responsive Layout", "Custom Animations", "SEO Optimization", 
      "Fast Loading Speed", "Source Code", "Deployment Assistance", 
      "Domain Connection", "Contact Form", "Mobile First Design", "W3C Validation"
    ],
    roadmap: [
      { step: 1, title: "Discovery", desc: "Briefing session to understand your brand and goals." },
      { step: 2, title: "Wireframing", desc: "Low-fidelity layouts to map out the user journey." },
      { step: 3, title: "Development", desc: "High-performance coding with Next.js and Tailwind." },
      { step: 4, title: "Optimization", desc: "Speed and SEO audits before final delivery." }
    ],
    faqs: [
      { q: "Is the design unique?", a: "Yes, every landing page is custom-built from scratch. No templates." },
      { q: "Can I manage the content later?", a: "Yes, I can integrate a CMS like Sanity or Contentful if needed." }
    ],
    clientReviews: [
      { 
        name: "John M.", 
        text: "Exceptional quality. The animations are so smooth and the code is extremely clean.", 
        rating: 5,
        date: "2 days ago",
        budget: "$180 - $250",
        duration: "3 days",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&fit=crop"
      },
      { 
        name: "Sarah L.", 
        text: "Fast delivery and great communication. Highly recommended for startups.", 
        rating: 5,
        date: "1 week ago",
        budget: "$350 - $500",
        duration: "5 days"
      }
    ],
    tiers: {
      basic: {
        price: 180,
        title: "Basic Pack",
        desc: "Single page landing with essential features.",
        delivery: "3 Days",
        revisions: "2",
        features: ["1 Page Design", "Mobile Layout", "SEO Setup", "Contact Form", "Standard Support", "Fast Load", "Source Code", "W3C Valid", "Domain Connect", "SSL Setup"]
      },
      standard: {
        price: 350,
        title: "Standard Pack",
        desc: "Multi-page site with advanced components.",
        delivery: "5 Days",
        revisions: "5",
        features: ["3 Pages", "Custom Icons", "GA4 Analytics", "CMS Setup", "Priority Support", "Advanced UI", "Asset Opt.", "Security Header", "API Hook", "Speed Grade A"]
      },
      premium: {
        price: 750,
        title: "Premium Pack",
        desc: "Full enterprise solution with custom integrations.",
        delivery: "10 Days",
        revisions: "Unlimited",
        features: ["Unlimited Pages", "Custom Backend", "Stripe Checkout", "PWA Config", "VIP 24/7 Support", "Architecture Doc", "Infrastructure IaC", "A/B Testing", "Multilingual", "Post-launch Audit", "Training", "Security Audit", "Brand Kit", "Admin Panel", "Uptime Monitor"]
      }
    }
  },
  {
    id: "ai-chatbot-integration",
    title: "I will integrate a custom AI Chatbot for your business",
    seller: { name: "Dr Python", avatar: null, level: "AI Specialist", rating: 5.0, reviews: 120 },
    rating: 5.0,
    reviews: 120,
    price: 450,
    image: "/images/service-code.png",
    badges: ["AI Powered", "New"],
    isNew: true,
    delivery: "Up to 5 days",
    category: "Development",
    views: 4500,
    description: "Automate your customer support and sales with an intelligent AI chatbot powered by GPT-4.",
    longDescription: `
# Enterprise-Grade AI Agent Integration

Stop forcing your customers to wait for support. Our AI solutions provide human-like intelligence 24/7, turning your website into a tireless sales and support machine.

## The Power of RAG (Retrieval-Augmented Generation)
We don't just plug in a generic chatbot. We build a **Retrieval-Augmented Generation** system that is trained specifically on your company's data.
- **Accurate Answers**: The bot only answers based on your documents, manuals, and FAQs.
- **Reduced Hallucinations**: By grounding the AI in your data, we ensure high reliability.
- **Instant Learning**: Update your docs, and the bot learns instantly.

### Technical Capabilities:

#### 1. Custom Brain Construction
- **Vector Databases**: Using Pinecone or Weaviate for lightning-fast knowledge retrieval.
- **LLM Selection**: Optimized for GPT-4o, Claude 3.5 Sonnet, or Llama 3 for cost efficiency.

#### 2. Advanced Action Chains (Agents)
Our bots don't just talk; they act.
- **Lead Qualification**: Automatically identifying high-value prospects.
- **Meeting Booking**: Integrated with Calendly or custom booking APIs.
- **Database Operations**: Allowing the bot to check order statuses or inventory in real-time.

#### 3. Omnichannel Deployment
- **Web Widget**: Custom glassmorphic UI that matches your brand perfectly.
- **WhatsApp/Telegram**: Reach your customers where they spend their time.
- **Internal Tools**: Integration with Slack or Microsoft Teams for your staff.

---

### Implementation Security
Data privacy is our top priority. We ensure that all customer interactions are encrypted and compliant with your regional data regulations (GDPR/CCPA).

**The Future is Agentic.** Initialize your AI mission today.
    `,
    features: ["GPT-4 Integration", "Custom Knowledge Base", "Multilingual Support", "CRM Integration"],
    roadmap: [
      { step: 1, title: "Data Collection", desc: "Gathering your business documentation for training." },
      { step: 2, title: "Training", desc: "Fine-tuning the model for your specific needs." },
      { step: 3, title: "Deployment", desc: "Integrating with your website or messaging apps." }
    ],
    tiers: {
      basic: { price: 450, title: "Basic Bot", desc: "Simple FAQ bot with standard GPT-4.", delivery: "3 Days", revisions: "2", features: ["GPT-4o API", "50 FAQ training", "Web Widget", "Basic UI", "Analytics", "Lead Form", "History", "History", "History", "History"] },
      standard: { price: 950, title: "Knowledge Bot", desc: "Bot trained on your custom documents.", delivery: "7 Days", revisions: "5", features: ["Full RAG Setup", "Unlimited Docs", "WhatsApp API", "Voice Input", "Custom Persona", "Sales Logic", "Calendar Sync", "CRM Hook", "Memory", "Standard QA"] },
      premium: { price: 1800, title: "Agentic AI", desc: "Autonomous agent capable of taking actions.", delivery: "14 Days", revisions: "Unlimited", features: ["Action Agents", "Live API Ops", "ERP Sync", "Email Automation", "Reasoning Chains", "Conflict Res", "Multimodal", "SSO Auth", "GPU Hosting", "SLA Uptime", "Weekly Retune", "Security Filter", "Audit Logs", "Custom Pipeline", "Staff Training"] }
    }
  },
  {
    id: "security-penetration-test",
    title: "I will perform a professional security penetration test",
    seller: { name: "Dr Python", avatar: null, level: "Security Expert", rating: 4.9, reviews: 85 },
    rating: 4.9,
    reviews: 85,
    price: 600,
    image: "/images/service-data.png",
    badges: ["Certified", "Pro"],
    isNew: false,
    delivery: "Up to 10 days",
    category: "Security",
    views: 1100,
    description: "Identify vulnerabilities in your web application before hackers do. Professional manual testing and automated scanning.",
    longDescription: `
# Offensive Security & Risk Mitigation

In an era of rising cyber threats, "hoping for the best" is not a security strategy. Our Professional Penetration Testing service provides a comprehensive, adversarial audit of your digital infrastructure to identify and neutralize vulnerabilities before they can be exploited.

## Our Methodology: The Attacker's Perspective
We follow the PTES (Penetration Testing Execution Standard) to ensure no stone is left unturned.
1. **Intelligence Gathering**: Reconnaissance on your public-facing assets.
2. **Threat Modeling**: Identifying the most likely attack vectors.
3. **Vulnerability Analysis**: Both automated scanning and expert manual inspection.
4. **Exploitation**: Safely attempting to bypass security controls to prove risk.

### Core Testing Domains:

#### 1. Web Application Security (OWASP Top 10)
- **SQL Injection**: Testing for database unauthorized access.
- **XSS/CSRF**: Ensuring user session safety.
- **Broken Auth**: Auditing your login and MFA implementations.

#### 2. Infrastructure & Cloud Security
- **Cloud Misconfigurations**: Auditing AWS S3 buckets, IAM roles, and VPC rules.
- **Network Services**: Scanning for outdated protocols and open ports.
- **API Security**: Testing for BOLA (Broken Object Level Authorization) and other API-specific risks.

#### 3. Post-Engagement Support
- **Detailed Remediation Report**: A prioritized list of vulnerabilities with exact steps to fix them.
- **Developer Debrief**: A direct meeting with your team to explain the risks.
- **Verification Scan**: A follow-up audit to ensure all patches are implemented correctly.

---

### Why Dr. Python Security?
We aren't just "scanners." We are security researchers who understand the underlying logic of modern applications. We don't just tell you what's broken; we tell you how to build it stronger.

**Secure Your Perimeter.** Choose a security tier and fortify your mission today.
    `,
    features: ["Vulnerability Scan", "Manual Exploit Testing", "Remediation Guide", "Post-Fix Audit"],
    roadmap: [
      { step: 1, title: "Scope", desc: "Defining targets and testing boundaries." },
      { step: 2, title: "Exploitation", desc: "Attempting to bypass security controls." },
      { step: 3, title: "Reporting", desc: "Detailed breakdown of findings and fixes." }
    ],
    tiers: {
      basic: { price: 600, title: "Standard Scan", desc: "Automated vulnerability assessment.", delivery: "3 Days", revisions: "1", features: ["OWASP Scan", "Port Audit", "SSL Check", "XSS Check", "SQLi Scan", "Info Leak", "Dep Audit", "Summary", "Fix List", "Standard Tool"] },
      standard: { price: 1200, title: "Full PenTest", desc: "Deep manual exploitation testing.", delivery: "7 Days", revisions: "2", features: ["Manual Exploit", "Privilege Esc", "Auth Bypass", "Session Audit", "Input Bypass", "Network Pivot", "API Review", "Tech Report", "Dev Debrief", "Severity Map"] },
      premium: { price: 2500, title: "Elite Security", desc: "Continuous red-team style testing.", delivery: "30 Days", revisions: "Unlimited", features: ["Red-Team Ops", "Social Eng.", "Phishing Sim", "0-Day Audit", "Surface Mon", "Incident Plan", "PCI Mapping", "Arch Review", "Static Code", "DAST Scan", "Internal Scope", "Physical Consult", "Board Briefing", "POC Exploits", "Post-fix Verify"] }
    }
  }
];
