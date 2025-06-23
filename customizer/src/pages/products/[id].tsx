import "../../styles/globals.css";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// --- СЕРВІСИ ТА ТИПИ ---
import { Attachment } from "@/app/Interfaces/Attachment";
import { Knife } from "@/app/Interfaces/Knife/Knife";
import APIService from "@/app/services/ApiService";
import AttachmentService from "@/app/services/AttachmentService";
import KnifeService from "@/app/services/KnifeService";
import ReviewService from "@/app/services/ReviewService";
import { Product } from "@/app/types/Product";
import AddReviewForm from "@/app/components/AddReviewForm/AddReviewForm";
import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";

import { ProductContext, useProduct } from "@/app/hooks/useProduct";
import { getLocaleFromCookies } from "@/app/config";
import UserService from "@/app/services/UserService";
import { User } from "@/app/Interfaces/User";

const ProductImage: React.FC = () => {
  const { product } = useProduct();
  if (!product) return null;

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 p-4">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-3xl transition-all duration-500 group"
        style={{
          minHeight: "200px",
          height: "400px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            pointerEvents: "auto",
          }}
        >
          <KnifeConfigurator productId={product.id} />
        </div>

        {/* Цей div може блокувати взаємодію - видаляємо або змінюємо */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> */}

        {/* Цей ring може також заважати - робимо його неактивним для взаємодії */}
        <div
          className="absolute inset-0 ring-1 ring-black/5 rounded-2xl"
          style={{ pointerEvents: "none" }} // Важливо!
        ></div>
      </div>
    </div>
  );
};

const ProductInfo: React.FC = () => {
  const { product, isReviewAllowed } = useProduct();
  const { t } = useTranslation();
  if (!product) return null;

  const { name, description, price, id, reviews, averageRating } = product;

  return (
    <div className="md:w-1/2 lg:w-2/5 p-4 flex flex-col justify-center">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {name}
        </h1>
        <div className="flex items-center space-x-6 pb-4">
          {reviews && reviews.length > 0 && averageRating ? (
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length}{" "}
                {t("productDetailPage.reviewsCount", { count: reviews.length })}
                )
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {t("productDetailPage.noReviews")}
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t("productDetailPage.inStock")}</span>
          </div>
        </div>

        {reviews && reviews.length > 0 && <ProductReviews />}
        {isReviewAllowed && <AddReviewForm />}

        <div className="prose prose-lg text-gray-700 leading-relaxed">
          <p className="text-lg whitespace-pre-wrap">{description}</p>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-amber-700">
            {price.toFixed(2)} {t("productDetailPage.currency")}
          </span>
        </div>
        <div className="pt-4">
          {product.category == "Ножі" && (
            <Link href={`/customizer?id=${id}`} legacyBehavior>
              <a className="group relative inline-flex items-center justify-center w-full md:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>{t("productDetailPage.customizeNow")}</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductSpecs: React.FC = () => {
  const { product } = useProduct();
  const { t } = useTranslation();
  if (!product) return null;

  const specs = [
    {
      label: t("productDetailPage.specs.bladeLength"),
      value: product.bladeLength,
      unit: "см",
      icon: "📏",
    },
    {
      label: t("productDetailPage.specs.bladeWidth"),
      value: product.bladeWidth,
      unit: "мм",
      icon: "📐",
    },
    {
      label: t("productDetailPage.specs.bladeWeight"),
      value: product.bladeWeight,
      unit: "г",
      icon: "⚖️",
    },
    {
      label: t("productDetailPage.specs.totalLength"),
      value: product.totalLength,
      unit: "см",
      icon: "📏",
    },
    {
      label: t("productDetailPage.specs.sharpnessAngle"),
      value: product.sharpnessAngle,
      unit: "°",
      icon: "🔪",
    },
    {
      label: t("productDetailPage.specs.hardnessRockwell"),
      value: product.hardnessRockwell,
      unit: "HRC",
      icon: "💎",
    },
    {
      label: t("productDetailPage.specs.sheathColor"),
      value: product.sheathColor,
      icon: "🎨",
    },
    {
      label: t("productDetailPage.specs.bladeCoatingColor"),
      value: product.bladeCoatingColor,
      icon: "✨",
    },
    {
      label: t("productDetailPage.specs.handleColor"),
      value: product.handleColor,
      icon: "🎯",
    },
    {
      label: t("productDetailPage.specs.engravingNames"),
      value: product.engravingNames?.join(", "),
      icon: "✍️",
    },
    {
      label: t("productDetailPage.specs.bladeCoatingType"),
      value: product.bladeCoatingType,
      icon: "🛡️",
    },
  ];
  const availableSpecs = specs.filter(
    (spec) =>
      spec.value !== undefined && spec.value !== null && spec.value !== ""
  );
  if (availableSpecs.length === 0) return null;

  return (
    <div className="w-full mt-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <span className="text-2xl">📋</span>
            <span>{t("productDetailPage.specs.title")}</span>
          </h2>
          <p className="text-gray-600 mt-2">
            {t("productDetailPage.specs.subtitle")}
          </p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSpecs.map((spec, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300">
                      {spec.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      {spec.label}
                    </h3>
                    <p className="text-xl font-bold text-amber-700 truncate">
                      {spec.value}
                      {spec.unit || ""}
                    </p>
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

const ProductReviews: React.FC = () => {
  const { product } = useProduct();
  if (!product?.reviews || product.reviews.length === 0) return null;

  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-thin scrollbar-thumb-amber-700/50 scrollbar-track-amber-100/50">
        {product.reviews.map((review, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm text-gray-800 truncate">
                {review.client}
              </p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapKnifeToProduct = (knife: Knife): Product => {
  const locale = getLocaleFromCookies();
  const name = knife.names?.[locale] || knife.name;
  const description = knife.descriptions?.[locale] || knife.description;
  const imageUrl = knife.imageUrl?.fileUrl || "/placeholder-image.png";
  return {
    id: knife.id,
    name,
    description,
    price: knife.price,
    image_url: imageUrl,
    category: "Ножі",
    reviews: knife.reviews || null,
    averageRating: knife.averageRating || null,
    bladeLength: knife.bladeLength,
    bladeWidth: knife.bladeWidth,
    bladeWeight: knife.bladeWeight,
    totalLength: knife.totalLength,
    sharpnessAngle: knife.sharpeningAngle,
    hardnessRockwell: knife.rockwellHardnessUnits,
    sheathColor: knife.sheathColor || undefined,
    bladeCoatingColor: knife.bladeCoatingColor,
    handleColor: knife.handleColor || undefined,
    bladeCoatingType: knife.bladeCoatingType,
    engravingNames: knife.engravingNames || undefined,
  };
};
const mapAttachmentToProduct = (attachment: Attachment): Product => {
  const locale = getLocaleFromCookies();
  const name = attachment.names?.[locale] || attachment.name;
  const description =
    attachment.descriptions?.[locale] || attachment.description;

  // Fix the image URL extraction
  const imageUrl = attachment.image?.fileUrl || "/placeholder-image.png";

  return {
    id: attachment.id,
    name,
    description,
    price: attachment.price,
    image_url: imageUrl,
    category: "Доповнення",
    reviews: attachment.reviews || null,
    averageRating: attachment.averageRating || null,
  };
};

//================================================================
// 4. ОСНОВНИЙ КОМПОНЕНТ СТОРІНКИ
//================================================================
const ProductDetailPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const userSerivce = new UserService();
  const [user, setUser] = useState<User | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isReviewAllowed, setIsReviewAllowed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = router.query;
      if (!id || typeof id !== "string") return;
      try {
        const tempUser = await userSerivce.getCurrentUser();
        console.log(tempUser);
        setUser(tempUser);
        console.log(user);
      } catch (knifeError: any) {}

      const loadProductData = async () => {
        setIsLoading(true);
        setErrorKey(null);
        setProduct(null);
        setIsReviewAllowed(false);

        const apiService = new APIService();
        const knifeService = new KnifeService(apiService);
        const attachmentService = new AttachmentService(apiService);
        try {
          const knife = await knifeService.getById(id);
          setProduct(mapKnifeToProduct(knife));
        } catch (knifeError: any) {
          console.log(knifeError.status);
          if (knifeError.status !== 404) {
            console.log("123123");
            setErrorKey("productDetailPage.error.loadFailed");
          } else {
            try {
              const attachment = await attachmentService.getById(id);
              console.log("attachment: ", attachment);
              setProduct(mapAttachmentToProduct(attachment));
              console.log(product);
            } catch (attachmentError: any) {
              setErrorKey(
                attachmentError?.response?.status === 404
                  ? "productDetailPage.notFound.message"
                  : "productDetailPage.error.loadFailed"
              );
            }
          }
        } finally {
          setIsLoading(false);
        }
      };
      loadProductData();
    };
    fetchData();
  }, [router.query]);

  useEffect(() => {
    if (product && product.category === "Ножі" && user) {
      const checkReviewPermission = async () => {
        try {
          const reviewService = new ReviewService();
          const allowed = await reviewService.isReviewAllowed(
            product.id,
            user.id
          );
          setIsReviewAllowed(allowed);
        } catch (error) {
          console.error("Failed to check review permission:", error);
          setIsReviewAllowed(false);
        }
      };
      checkReviewPermission();
    }
  }, [product, user]);

  const handleReviewSubmitted = () => {
    setIsReviewAllowed(false);
    // Опційно: можна перезавантажити дані, щоб одразу побачити новий відгук
    // router.replace(router.asPath);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-t-orange-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-xl text-gray-700 font-medium">
            {t("productDetailPage.loading.title")}
          </p>
        </div>
      </div>
    );
  }

  if (errorKey) {
    const isNotFound = errorKey === "productDetailPage.notFound.message";
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center text-center px-4">
        <Head>
          <title>
            {t(
              isNotFound
                ? "productDetailPage.notFound.pageTitle"
                : "productDetailPage.error.pageTitle"
            )}
          </title>
        </Head>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md w-full border border-red-100">
          <div className="text-6xl mb-4">{isNotFound ? "🔍" : "😞"}</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {t(errorKey as any)}
          </h2>
          <Link href="/shop" passHref legacyBehavior>
            <a className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t("productDetailPage.error.backButton")}
            </a>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }
  const productName = product.name || product.id || "Custom Knife";
  console.log("Using product name:", productName);
  const pageTitle = t("productDetailPage.meta.title", {
    productName: productName,
  });
  console.log(product.name);
  const domain =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://prostastal.com";
  const ogImageUrl = product.image_url.startsWith("http")
    ? product.image_url
    : `${domain}${product.image_url}`;

  return (
    <ProductContext.Provider
      value={{ product, isReviewAllowed, handleReviewSubmitted }}
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={product.description} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={product.description} />
          <meta property="og:image" content={ogImageUrl} />
          <meta property="og:type" content="product" />
          <meta
            property="og:url"
            content={`${domain}/products/${product.id}`}
          />
        </Head>
        <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col md:flex-row -mx-4 mb-12">
            <ProductImage />
            <ProductInfo />
          </div>
          <ProductSpecs />
        </main>
      </div>
    </ProductContext.Provider>
  );
};

export default ProductDetailPage;
