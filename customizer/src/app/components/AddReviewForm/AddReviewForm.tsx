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
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`transition-colors duration-200 ${
              ratingValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
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
      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center">
        <p className="font-semibold">{t("addReviewForm.success.title")}</p>
        <p className="text-sm">{t("addReviewForm.success.message")}</p>
      </div>
    );
  }

  return (
    <div className="pt-4 mt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {t("addReviewForm.title")}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("addReviewForm.ratingLabel")}
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            {t("addReviewForm.commentLabel")}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            placeholder={t("addReviewForm.commentPlaceholder")}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? t("addReviewForm.submittingButton")
            : t("addReviewForm.submitButton")}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
