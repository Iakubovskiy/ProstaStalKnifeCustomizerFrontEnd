import "../../styles/globals.css";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Product } from "@/app/types/Product";

const ProductImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
    <div className="w-full md:w-1/2 lg:w-2/5 p-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-3xl transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Image
            src={src || "/placeholder-image.png"}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            style={{ objectFit: "contain" }}
            priority
            className="p-8 transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl"></div>
      </div>
    </div>
);

interface ProductInfoProps {
  name: string;
  description: string;
  price: number;
  productId: string | number;
  reviews?: { comment: string; rating: number; client: string }[] | null;
  averageRating?: number | null;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ name, description, price, productId, reviews, averageRating }) => {
  const { t } = useTranslation();

  return (
      <div className="md:w-1/2 lg:w-3/5 p-4 flex flex-col justify-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {name}
          </h1>

          <div className="flex items-center space-x-6 pb-4">
            {reviews && reviews.length > 0 && averageRating ? (
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({reviews.length}{" "}
                    {t('productDetailPage.reviewsCount', { count: reviews.length })})
                  </span>
                </div>
            ) : (
                <div className="text-sm text-gray-500">{t('productDetailPage.noReviews')}</div>
            )}

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{t('productDetailPage.inStock')}</span>
            </div>
          </div>
          {reviews && reviews.length > 0 && <ProductReviews reviews={reviews} />}

          <div className="prose prose-lg text-gray-700 leading-relaxed">
            <p className="text-lg whitespace-pre-wrap">{description}</p>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-amber-700">{price.toFixed(2)} {t("productDetailPage.currency")}</span>
          </div>

          <div className="pt-4">
            <Link href={`/customizer?productId=${productId}`} passHref legacyBehavior>
              <a className="group relative inline-flex items-center justify-center w-full md:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>{t('productDetailPage.customizeNow')}</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>
  );
};

const ProductSpecs: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useTranslation();

  const specs = [
    { label: t("productDetailPage.specs.bladeLength"), value: product.bladeLength, unit: "см", icon: "📏" },
    { label: t("productDetailPage.specs.bladeWidth"), value: product.bladeWidth, unit: "мм", icon: "📐" },
    { label: t("productDetailPage.specs.bladeWeight"), value: product.bladeWeight, unit: "г", icon: "⚖️" },
    { label: t("productDetailPage.specs.totalLength"), value: product.totalLength, unit: "см", icon: "📏" },
    { label: t("productDetailPage.specs.sharpnessAngle"), value: product.sharpnessAngle, unit: "°", icon: "🔪" },
    { label: t("productDetailPage.specs.hardnessRockwell"), value: product.hardnessRockwell, unit: "HRC", icon: "💎" },
    { label: t("productDetailPage.specs.sheathColor"), value: product.sheathColor, icon: "🎨" },
    { label: t("productDetailPage.specs.bladeCoatingColor"), value: product.bladeCoatingColor, icon: "✨" },
    { label: t("productDetailPage.specs.handleColor"), value: product.handleColor, icon: "🎯" },
    { label: t("productDetailPage.specs.engravingNames"), value: product.engravingNames?.join(", "), icon: "✍️" },
    { label: t("productDetailPage.specs.bladeCoatingType"), value: product.bladeCoatingType, icon: "🛡️" },
  ];

  const availableSpecs = specs.filter((spec) => spec.value !== undefined && spec.value !== null && spec.value !== "");

  if (availableSpecs.length === 0) return null;

  return (
      <div className="w-full mt-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <span className="text-2xl">📋</span>
              <span>{t('productDetailPage.specs.title')}</span>
            </h2>
            <p className="text-gray-600 mt-2">{t('productDetailPage.specs.subtitle')}</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSpecs.map((spec, index) => (
                  <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0"><span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300">{spec.icon}</span></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">{spec.label}</h3>
                        <p className="text-xl font-bold text-amber-700 truncate">{spec.value}{spec.unit || ""}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-orange-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

const ProductReviews: React.FC<{ reviews: { client: string; rating: number; comment: string }[] }> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  return (
      <div className="pt-4 border-t border-gray-200">
        <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-thin scrollbar-thumb-amber-700/50 scrollbar-track-amber-100/50">
          {reviews.map((review, index) => (
              <div key={index} className="flex-shrink-0 w-72 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm text-gray-800 truncate">{review.client}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{review.comment}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

interface ProductDetailPageProps {
  product: Product | null;
  error?: string;
}

async function getProductData(productId: string): Promise<Product | null> {
  const products: { [key: string]: Product } = {
    "knife-alpha": { id: "knife-alpha", name: "Ніж Мисливський 'Альфа'", description: "Ніж Танто з ахегао-гравіюванням — це не просто інструмент, а виклик звичному. Він поєднує в собі провокаційний стиль, бойову функціональність та повну кастомізацію під власника.\n" +
          "\n" +
          "😈 Епатажний дизайн: клинок з повним гравіюванням у стилі ахегао та пікантне зображення на піхвах — для тих, хто не боїться бути помітним.\n" +
          "🛠 Високоякісна сталь Х12МФ: інструментальна, напівнержавіюча, аналог D2. Має чудові показники міцності, тримає ріжучу кромку та витримує великі навантаження.\n" +
          "✍️ Індивідуальне гравіювання: можемо створити унікальний макет за вашим задумом — логотип, символ, напис чи ілюстрація. Макет погоджується перед виготовленням.\n" +
          "🎯 Кастомізація для задач: доступні різні типи кріплень — MOLLE, поясне, стегнове. Можна обрати потрібний кут та сторону носіння.\n" +
          "🎨 Варіанти:\n" +
          "🔘 Руків’я: десятки кольорів мікарти на вибір\n" +
          "🧪 Клинок: травлення, Stone Wash, полімерне покриття\n" +
          "🟫 Піхви: понад 10 кольорів, включно з індивідуальними принтами\n" +
          "💎 Додаткові аксесуари: рубіновий мусат для правки, кресало для вогню, темляки з латунними бусинами ручної роботи\n" +
          "📦 Повна комплектація: ніж + піхви з гравіюванням + індивідуальне кріплення (за вибором) + можливість доповнити аксесуарами\n" +
          "📸 На фото зображена комплектація:\n" +
          "\n" +
          "🔪 Ніж Танто з покриттям клинка травлення\n" +
          "☕ Руків’я кольору капучіно\n" +
          "🟤 Піхви кольору TAN\n" +
          "🖋 Гравіювання на обох сторонах клинка\n" +
          "💋 Пікантне гравіювання на піхвах\n" +
          "⚫ Кріплення Molle-Lok чорного кольору\n" +
          "🔥 Обери свій стиль, ми втілимо його у сталі. Кожен ніж проходить ручне виготовлення, перевірку ріжучих властивостей та тестування на надійність", price: 129.99, image_url: "/knives/8.jpg", bladeLength: 15, bladeWidth: 30, bladeWeight: 180, totalLength: 28, sharpnessAngle: 20, hardnessRockwell: 58, sheathColor: "Чорний", bladeCoatingColor: "Матовий сірий", handleColor: "Дерево (горіх)", engravingNames: ["Логотип виробника", "Індивідуальний напис"], bladeCoatingType: "Тефлонове", category: "Ножі", reviews: [{ comment: "test", rating: 1, client: "user@example.com" }], averageRating: 1 },
    "knife-beta": { id: "knife-beta", name: "Тактичний Ніж 'Бета'", description: "...", price: 89.5, image_url: "/knives/8.jpg", bladeLength: 10, bladeWidth: 25, bladeWeight: 120, totalLength: 22, sharpnessAngle: 22, hardnessRockwell: 60, sheathColor: "Олива", bladeCoatingColor: "Чорний антивідблиск", handleColor: "G10 Чорний", bladeCoatingType: "Порошкове", category: "Ножі" },
    "accessory-sharpener": { id: "accessory-sharpener", name: "Точилка для ножів 'Профі'", description: "...", price: 25.0, image_url: "/knives/8.jpg", category: "Аксесуари" },
  };
  return new Promise((resolve) => setTimeout(() => resolve(products[productId] || null), 500));
}

export const getServerSideProps: GetServerSideProps<ProductDetailPageProps> = async (context) => {
  const { productId } = context.params as { productId: string };
  if (!productId) return { notFound: true };
  try {
    const product = await getProductData(productId);
    if (!product) return { notFound: true };
    return { props: { product } };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { props: { product: null, error: "productDetailPage.error.loadFailed" } };
  }
};

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product, error }) => {
  const router = useRouter();
  const { t } = useTranslation();

  if (router.isFallback || (!product && !error)) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 mx-auto border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-t-orange-400 rounded-full animate-spin animate-reverse"></div>
            </div>
            <p className="text-xl text-gray-700 font-medium">{t('productDetailPage.loading.title')}</p>
            <p className="text-sm text-gray-500">{t('productDetailPage.loading.subtitle')}</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center text-center px-4">
          <Head><title>{t('productDetailPage.error.pageTitle')}</title></Head>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md w-full border border-red-100">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{t('productDetailPage.error.title')}</h2>
            {/*<p className="mb-6 text-lg text-gray-600">{t(error)}</p>*/}
            <Link href="/products" passHref legacyBehavior>
              <a className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                {t('productDetailPage.error.backButton')}
              </a>
            </Link>
          </div>
        </div>
    );
  }

  if (!product) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
          <Head><title>{t('productDetailPage.notFound.pageTitle')}</title></Head>
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-700">{t('productDetailPage.notFound.message')}</p>
          </div>
        </div>
    );
  }

  const pageTitle = t('productDetailPage.meta.title', { productName: product.name });
  const pageDescription = product.description.substring(0, 160);
  const keywords = [product.category || "товар", product.name, t('productDetailPage.meta.keywords.buy'), t('productDetailPage.meta.keywords.details')].concat(product.name.split(" ")).join(", ");
  const domain = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  const ogImageUrl = product.image_url.startsWith("http") ? product.image_url : `${domain}${product.image_url}`;

  return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
        </div>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
          <meta property="og:title" content={product.name} />
          <meta property="og:description" content={product.description.substring(0, 100)} />
          <meta property="og:type" content="product" />
          <meta property="og:image" content={ogImageUrl} />
          <meta property="og:image:width" content="800" />
          <meta property="og:image:height" content="600" />
          <meta property="og:url" content={`${domain}${router.asPath}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={product.name} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={ogImageUrl} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org/", "@type": "Product", name: product.name, image: ogImageUrl, description: product.description, sku: product.id, offers: { "@type": "Offer", url: `${domain}${router.asPath}`, priceCurrency: "UAH", price: product.price.toFixed(2), availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" } }) }} />
        </Head>
        <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col md:flex-row -mx-4 mb-12">
            <ProductImage src={product.image_url} alt={product.name} />
            <ProductInfo name={product.name} description={product.description} price={product.price} productId={product.id} reviews={product.reviews} averageRating={product.averageRating} />
          </div>
          <ProductSpecs product={product} />
        </main>
      </div>
  );
};

export default ProductDetailPage;