# Mundus Languages — SEO go-live checklist

Status reviewed: 2026-11-08. The new site is deployed on Vercel, but **munduslanguages.com and www are still unverified in the connected Vercel project**. Google has indexed an older, materially different Mundus website with pricing and testimonials that do not match the current approved site.

## Release blocker: choose and verify the one public domain
1. In Vercel, open the `mundus` project → Settings → Domains. Identify the other Vercel project or account currently serving `munduslanguages.com` and confirm control of the DNS registrar.
2. Verify the apex and `www` hostnames using the **currently displayed** Vercel verification instructions, not previously copied TXT records. The ownership step requires the domain owner.
3. Point both hostnames at the approved deployment. Permanently redirect `www` to the chosen apex hostname or vice versa; choose only one preferred host.
4. Verify `https://munduslanguages.com/sk`, `/en`, `/sitemap.xml` and `/robots.txt` return successful responses on the **real domain**, not only on the Vercel alias.
5. Old indexed `/prices` must permanently redirect to `/sk/pricing`; check there is no redirect chain. Do not redirect unrelated URLs wholesale to the homepage.
6. Check all old home/pricing pages for inaccurate statements. The previously indexed site included unverifiable ratings, named reviews and outdated group sizes. Remove these unless validated and approved.
7. In Google Search Console, verify the actual domain property; submit `https://munduslanguages.com/sitemap.xml`. Inspect the home page, English course page, German course page, Business English page, and pricing page, and request indexing where appropriate. Monitor page-indexing reports weekly.
8. Verify the corresponding `www` URL either redirects or reports the intended canonical. Update Instagram, Facebook, LinkedIn, outreach signatures and any existing partner website links to the final canonical homepage.

## Search intent priorities

| Search intent (Slovak) | Target URL | Main objective |
| --- | --- | --- |
| angličtina online / individuálne hodiny angličtiny | /sk/languages/english | English inquiry or package |
| angličtina pre začiatočníkov online | /sk/learn/anglictina-pre-zaciatocnikov | Beginner package |
| konverzačná angličtina online | /sk/learn/konverzacna-anglictina | Speaking practice |
| business English online | /sk/learn/business-english | Work-focused lesson |
| angličtina na cestovanie | /sk/learn/anglictina-na-cestovanie | Travel preparation |
| nemčina online | /sk/languages/german | German lesson inquiry |
| španielčina online | /sk/languages/spanish | Spanish lesson inquiry |
| taliančina online | /sk/languages/italian | Italian lesson inquiry |
| francúzština online | /sk/languages/french | French lesson inquiry |
| slovenčina pre cudzincov online | /sk/languages/slovak-for-foreigners | Foreign-language learner |
| firemné jazykové kurzy online | /sk/companies | Qualified HR inquiry |

English counterparts are under `/en`. The prioritization is based on relevant services and search intent, **not verified search volumes or measured Google rankings**.

## Post-launch actions
- Publish at least two genuinely useful, expert-reviewed pages per month answering real student questions, for example: choosing 45 vs 60-minute lessons, how to restart forgotten German, or a practical B1 speaking checklist. Avoid many near-duplicate or automatically expanded doorway pages.
- Link language-specific guides from the matching course pages. Record real teacher credentials only with approval, and use authentic media and verified student stories. Do not create fake star ratings, quotes, review schema or local address signals.
- Get editorial links from legitimate partner organizations, universities, language communities and relevant HR publications. Never buy manipulative backlinks.
- In Search Console review impressions, clicks, queries, indexed pages and average positions for each page. Check GA4 organic landing-page lead events and purchases; avoid judging SEO on ranking alone.
- Monitor mobile Core Web Vitals via real-world performance data. Prioritize slow or unstable pages by impact on traffic and conversion.
- Maintain a single truthful price source: the application package catalog also feeds the on-page structured data.
- Revisit keywords and pages based on measured organic performance after 4–8 weeks; Google rankings and indexing cannot be guaranteed.

## External references
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
