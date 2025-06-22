// app/components/AddReviewForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReviewService from "@/app/services/ReviewService";
import { useProduct } from "@/app/hooks/useProduct";

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center space-x-2">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`transition-all duration-300 transform hover:scale-110 ${
              ratingValue <= (hover || rating)
                ? "text-amber-500 drop-shadow-lg"
                : "text-stone-300 hover:text-stone-400"
            }`}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <svg
              className="w-9 h-9 filter drop-shadow-sm"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

const AddReviewForm: React.FC = () => {
  const { product, handleReviewSubmitted } = useProduct();
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(t("addReviewForm.errors.ratingRequired"));
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const reviewService = new ReviewService();
      await reviewService.createReview(product.id, { comment, rating });
      setSuccess(true);
      if (handleReviewSubmitted) {
        handleReviewSubmitted();
      }
    } catch (err) {
      setError(t("addReviewForm.errors.submitFailed"));
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 p-6 rounded-2xl text-center shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-center mb-3">
          <svg
            className="w-8 h-8 text-green-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-bold text-lg">
            {t("addReviewForm.success.title")}
          </p>
        </div>
        <p className="text-sm opacity-80">
          {t("addReviewForm.success.message")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-8 bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 rounded-3xl shadow-xl border border-stone-200 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full mr-4"></div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-stone-700 to-amber-800 bg-clip-text text-transparent">
          {t("addReviewForm.title")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-stone-700 mb-3">
            {t("addReviewForm.ratingLabel")}
          </label>
          <div className="p-4 bg-white/60 rounded-2xl border border-stone-200 shadow-inner">
            <StarRating rating={rating} setRating={setRating} />
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-stone-700"
          >
            {t("addReviewForm.commentLabel")}
          </label>
          <div className="relative">
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border-2 border-stone-200 bg-white/80 backdrop-blur-sm shadow-inner focus:border-amber-400 focus:ring-4 focus:ring-amber-200 focus:bg-white transition-all duration-300 text-stone-700 placeholder-stone-400 p-4 resize-none"
              placeholder={t("addReviewForm.commentPlaceholder")}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-amber-100/20 pointer-events-none"></div>
          </div>
        </div>

        {error && (
          <div className="flex items-center p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-8 py-4 text-white font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-2">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{t("addReviewForm.submittingButton")}</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>{t("addReviewForm.submitButton")}</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
