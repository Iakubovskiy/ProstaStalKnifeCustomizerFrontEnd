import Head from "next/head";
import CustomNavbar from "../CustomNavbar/CustomNavbar";
import Footer from "../Footer/Footer";
import styles from "@/pages/customizer/customizer.module.css";
import NavigationMob from "@/app/components/Nav/MobileNavBar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: object;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "ProstaStal Customizer - Кастомні ножі на замовлення",
  description = "Створіть свій унікальний ніж з ProstaStal Customizer. Виберіть матеріали, форму та деталі для персоналізації.",
  keywords,
  ogImage,
  ogType = "website",
  canonicalUrl,
  noIndex = false,
  structuredData,
  breadcrumbs,
}) => {

  // Базові налаштування SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const siteName = "Ваш магазин";
  const defaultOgImage = `${siteUrl}/images/og-default.jpg`;

  // const fullUrl = canonicalUrl || `${siteUrl}${router.asPath}`;
  const finalOgImage = ogImage || defaultOgImage;

  // const generateKeywords = (): string => {
  //   if (keywords) return keywords;
  //
  //   const baseKeywords = [
  //     "ножі",
  //     "мисливські ножі",
  //     "тактичні ножі",
  //     "купити ніж",
  //   ];
  //   const pathKeywords: { [key: string]: string[] } = {
  //     "/shop": ["магазин ножів", "купити онлайн"],
  //     "/products": ["каталог товарів", "всі ножі"],
  //     "/customizer": ["кастомний ніж", "персоналізація"],
  //   };
  //
  //   const currentPathKeywords =
  //     Object.entries(pathKeywords).find(([path]) =>
  //       router.pathname.startsWith(path)
  //     )?.[1] || [];
  //
  //   return [...baseKeywords, ...currentPathKeywords].join(", ");
  // };

  const breadcrumbStructuredData = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.url}`,
        })),
      }
    : null;

  // WebSite Structured Data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Organization Structured Data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+380-123-456-789",
      contactType: "customer service",
      availableLanguage: "Ukrainian",
    },
    sameAs: [
      "https://www.facebook.com/yourpage",
      "https://www.instagram.com/yourpage",
      "https://t.me/yourpage",
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {noIndex ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta
            name="robots"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
        )}

        {/* Canonical URL */}
        {/*<link rel="canonical" href={fullUrl} />*/}

        {/* Language and Region */}
        <meta httpEquiv="content-language" content="uk-UA" />
        <meta name="geo.region" content="UA" />
        <meta name="geo.placename" content="Ukraine" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={finalOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="uk_UA" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={finalOgImage} />
        <meta name="twitter:image:alt" content={title} />
        <meta name="twitter:site" content="@yourhandle" />
        <meta name="twitter:creator" content="@yourhandle" />

        <meta name="author" content={siteName} />
        <meta name="generator" content="Next.js" />
        <meta name="theme-color" content="#8b7258" />
        <meta name="msapplication-TileColor" content="#8b7258" />

        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />

        {breadcrumbStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbStructuredData),
            }}
          />
        )}

        {/* Custom Structured Data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}

        {/*<link rel="alternate" hrefLang="uk" href={fullUrl} />*/}
        {/*<link rel="alternate" hrefLang="x-default" href={fullUrl} />*/}

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <div className={styles.desk}>
          <CustomNavbar></CustomNavbar>
        </div>
        <div className={styles.mob}>
          <NavigationMob></NavigationMob>
        </div>
        <main className="flex-1" role="main">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <nav
              aria-label="Хлібні крошки"
              className="container mx-auto px-4 py-2"
            >
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="w-4 h-4 mx-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span
                        className="text-gray-800 font-medium"
                        aria-current="page"
                      >
                        {crumb.name}
                      </span>
                    ) : (
                      <a
                        href={crumb.url}
                        className="hover:text-amber-600 transition-colors"
                      >
                        {crumb.name}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
