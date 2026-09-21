import { BUSINESS, ORG_ID, SITE_URL } from "./business";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  item?: string;
}

export interface ServiceData {
  name: string;
  description: string;
  url?: string;
  image?: string;
  serviceType?: string;
  areaServed?: string[];
}

export interface BlogPostData {
  title: string;
  description?: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
}

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["TaxiService", "LocalBusiness"],
    "@id": ORG_ID,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    logo: BUSINESS.logo,
    image: BUSINESS.image,
    priceRange: BUSINESS.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    identifier: [
      {
        "@type": "PropertyValue",
        name: "VAT Number",
        value: BUSINESS.vatId,
      },
      {
        "@type": "PropertyValue",
        name: "Company Number",
        value: BUSINESS.companyNumber,
      },
      {
        "@type": "PropertyValue",
        name: "TfL License Number",
        value: BUSINESS.tflLicence,
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "Airport", name: "London Heathrow Airport", iataCode: "LHR" },
      { "@type": "Airport", name: "London Gatwick Airport", iataCode: "LGW" },
      { "@type": "Airport", name: "London Stansted Airport", iataCode: "STN" },
      { "@type": "Airport", name: "London City Airport", iataCode: "LCY" },
      { "@type": "Airport", name: "London Luton Airport", iataCode: "LTN" },
    ],
    sameAs: BUSINESS.sameAs,
  };
}

export function faqSchema(faqs: FAQItem[]): Record<string, unknown> | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function webSiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS.name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> | null {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const element: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
      };
      if (item.item) {
        element.item = item.item.startsWith("http")
          ? item.item
          : `${SITE_URL}${item.item.startsWith("/") ? "" : "/"}${item.item}`;
      }
      return element;
    }),
  };
}

export function serviceSchema(s: ServiceData): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: s.url
      ? s.url.startsWith("http")
        ? s.url
        : `${SITE_URL}${s.url.startsWith("/") ? "" : "/"}${s.url}`
      : SITE_URL,
    ...(s.image ? { image: s.image } : {}),
    ...(s.serviceType ? { serviceType: s.serviceType } : {}),
    provider: {
      "@type": "LocalBusiness",
      "@id": ORG_ID,
      name: BUSINESS.name,
    },
    ...(s.areaServed
      ? {
          areaServed: s.areaServed.map((area) => ({
            "@type": "AdministrativeArea",
            name: area,
          })),
        }
      : {}),
  };
}

function formatDateToISO(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return new Date().toISOString();
  }
  return d.toISOString();
}

export function blogPostingSchema(p: BlogPostData): Record<string, unknown> {
  const url = `${SITE_URL}/blog/${p.slug}`;
  const pubDate = formatDateToISO(p.datePublished);
  const modDate = p.dateModified ? formatDateToISO(p.dateModified) : pubDate;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: p.title,
    description: p.description || p.title,
    url: url,
    datePublished: pubDate,
    dateModified: modDate,
    ...(p.image ? { image: p.image } : { image: BUSINESS.image }),
    author: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: p.authorName || BUSINESS.name,
    },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: BUSINESS.name,
      logo: {
        "@type": "ImageObject",
        url: BUSINESS.logo,
      },
    },
  };
}
