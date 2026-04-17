/**
 * JK Executive Chauffeurs — Dynamic Sitemap Generator
 * ─────────────────────────────────────────────────────
 * Fetches all slugs from the backend APIs and writes
 * a complete sitemap.xml to the public/ directory.
 *
 * Usage:
 *   node scripts/generate-sitemap.js                  (uses PRODUCTION API)
 *   node scripts/generate-sitemap.js --local           (uses localhost:5000)
 *
 * Or via npm: npm run generate:sitemap
 * ─────────────────────────────────────────────────────
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ───────────────────────────────────────────
const SITE_URL = 'https://jkexecutivechauffeurs.com';
const isLocal = process.argv.includes('--local');
const API_BASE = isLocal ? 'http://localhost:5000' : SITE_URL;
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const TODAY = new Date().toISOString().split('T')[0];

console.log(`\n🗺️  JK Executive Chauffeurs - Sitemap Generator`);
console.log(`   API Base: ${API_BASE}`);
console.log(`   Output:   ${OUTPUT_PATH}\n`);

// ─── STATIC ROUTES ────────────────────────────────────
// These never change — always included with high priority
const STATIC_ROUTES = [
    { url: '/',        priority: '1.0', changefreq: 'weekly'  },
    { url: '/services', priority: '0.9', changefreq: 'weekly'  },
    { url: '/fleet',    priority: '0.9', changefreq: 'weekly'  },
    { url: '/blog',     priority: '0.8', changefreq: 'daily'   },
    { url: '/about',    priority: '0.7', changefreq: 'monthly' },
    { url: '/contact',  priority: '0.7', changefreq: 'monthly' },
    { url: '/booking',  priority: '0.8', changefreq: 'monthly' },
];

// ─── HTTP FETCH HELPER ─────────────────────────────────
function fetchJSON(urlStr) {
    return new Promise((resolve, reject) => {
        const lib = urlStr.startsWith('https') ? https : http;
        lib.get(urlStr, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Failed to parse JSON from ${urlStr}: ${e.message}`));
                }
            });
        }).on('error', reject);
    });
}

// ─── FETCH ALL PAGES (handles pagination) ─────────────
async function fetchAllSlugs(endpoint, slugField, labelField = 'title', pageSize = 200) {
    const url = `${API_BASE}${endpoint}?page=1&limit=${pageSize}`;
    let items = [];

    try {
        const data = await fetchJSON(url);

        // Handle different response shapes: { services: [] }, { fleet: [] }, { blogs: [] }, { events: [] }
        const possibleKeys = ['services', 'fleet', 'blogs', 'events', 'data', 'items', 'results'];
        let found = null;

        for (const key of possibleKeys) {
            if (data[key] && Array.isArray(data[key])) {
                found = data[key];
                break;
            }
        }

        // Fallback: if response IS the array
        if (!found && Array.isArray(data)) found = data;

        if (!found) {
            console.warn(`  ⚠️  Unexpected response shape from ${endpoint}:`, Object.keys(data));
            return [];
        }

        items = found;

        // If there are more pages, fetch them too
        const total = data.total || data.totalCount || data.count;
        if (total && total > pageSize) {
            const totalPages = Math.ceil(total / pageSize);
            for (let page = 2; page <= totalPages; page++) {
                const pageUrl = `${API_BASE}${endpoint}?page=${page}&limit=${pageSize}`;
                const pageData = await fetchJSON(pageUrl);
                for (const key of possibleKeys) {
                    if (pageData[key] && Array.isArray(pageData[key])) {
                        items = [...items, ...pageData[key]];
                        break;
                    }
                }
            }
        }

        const slugs = items
            .filter((item) => item[slugField])
            .map((item) => item[slugField]);

        console.log(`  ✅ ${endpoint.split('/api/')[1].split('?')[0].padEnd(12)} → ${slugs.length} slugs found`);
        return slugs;

    } catch (err) {
        console.warn(`  ⚠️  Failed to fetch ${endpoint}: ${err.message}`);
        return [];
    }
}

// ─── BUILD XML ─────────────────────────────────────────
function buildSitemapXML(staticRoutes, dynamicEntries) {
    const xmlUrls = [];

    // Static routes
    for (const route of staticRoutes) {
        xmlUrls.push(`
    <url>
        <loc>${SITE_URL}${route.url}</loc>
        <lastmod>${TODAY}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`);
    }

    // Dynamic routes
    for (const entry of dynamicEntries) {
        xmlUrls.push(`
    <url>
        <loc>${SITE_URL}${entry.path}</loc>
        <lastmod>${entry.lastmod || TODAY}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority}</priority>
    </url>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlUrls.join('')}
</urlset>
`;
}

// ─── MAIN ──────────────────────────────────────────────
async function main() {
    console.log('⏳ Fetching slugs from APIs...\n');

    // Fetch all dynamic slugs in parallel
    const [serviceSlugs, fleetSlugs, blogSlugs, eventSlugs] = await Promise.all([
        fetchAllSlugs('/api/services', 'slug'),
        fetchAllSlugs('/api/fleet', 'slug'),
        fetchAllSlugs('/api/blogs', 'slug'),
        fetchAllSlugs('/api/events', 'slug'),
    ]);

    // Build dynamic entries array
    const dynamicEntries = [
        ...serviceSlugs.map((slug) => ({
            path: `/services/${slug}`,
            changefreq: 'weekly',
            priority: '0.8',
        })),
        ...fleetSlugs.map((slug) => ({
            path: `/fleet/${slug}`,
            changefreq: 'weekly',
            priority: '0.8',
        })),
        ...blogSlugs.map((slug) => ({
            path: `/blog/${slug}`,
            changefreq: 'monthly',
            priority: '0.7',
        })),
        ...eventSlugs.map((slug) => ({
            path: `/events/${slug}`,
            changefreq: 'weekly',
            priority: '0.7',
        })),
    ];

    const totalURLs = STATIC_ROUTES.length + dynamicEntries.length;

    console.log(`\n📊 Summary:`);
    console.log(`   Static routes  : ${STATIC_ROUTES.length}`);
    console.log(`   Services       : ${serviceSlugs.length}`);
    console.log(`   Fleet          : ${fleetSlugs.length}`);
    console.log(`   Blog posts     : ${blogSlugs.length}`);
    console.log(`   Events         : ${eventSlugs.length}`);
    console.log(`   ─────────────────────`);
    console.log(`   Total URLs     : ${totalURLs}`);

    // Generate and write the XML
    const xml = buildSitemapXML(STATIC_ROUTES, dynamicEntries);

    // Ensure public/ directory exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, xml, 'utf-8');

    console.log(`\n✅ sitemap.xml written → ${OUTPUT_PATH}`);
    console.log(`   ${totalURLs} URLs × ${Buffer.byteLength(xml, 'utf8')} bytes\n`);
}

main().catch((err) => {
    console.error('\n❌ Sitemap generation failed:', err.message);
    process.exit(1);
});
