const SITE_URL = "https://drpythonsolutions.com";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dr Python Solutions",
  "url": SITE_URL,
  "logo": `${SITE_URL}/images/logo.png`,
  "email": "contact@drpythonsolutions.com",
  "description": "Python development agency specializing in e-commerce development, web scraping, automation, API development and price monitoring.",
  "founder": {
    "@type": "Person",
    "name": "Somir Chandra Dash"
  },
  "sameAs": [
    "https://linkedin.com/in/samircd4",
    "https://github.com/samircd4",
    "https://fiverr.com/samircd4"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Dr Python Solutions",
  "url": SITE_URL
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does e-commerce development cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "E-commerce projects start from $599 with our ready-made system. Custom builds start from $2,500."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a web scraping project cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Web scraping projects start from $199 depending on volume and complexity."
      }
    },
    {
      "@type": "Question",
      "name": "Do you build price monitoring systems?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We build automated price monitoring systems that track competitor prices in real time. Starting from $249."
      }
    },
    {
      "@type": "Question",
      "name": "How fast can you deliver?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ready-made e-commerce systems deploy in 3-7 days. Custom projects typically take 2-4 weeks."
      }
    }
  ]
};

export const makeServiceSchema = (name, description, minPrice, maxPrice) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": name,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "Dr Python Solutions",
    "url": SITE_URL
  },
  "areaServed": "Worldwide",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": minPrice,
      "maxPrice": maxPrice,
      "priceCurrency": "USD"
    }
  }
});

export const makeBreadcrumbSchema = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": crumbs.map((crumb, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": crumb.name,
    "item": `${SITE_URL}${crumb.path}`
  }))
});