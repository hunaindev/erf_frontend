import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface MobileBackButtonProps {
  fallbackPath?: string;
}

const MobileBackButton: React.FC<MobileBackButtonProps> = ({
  fallbackPath = "/",
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    if (fallbackPath !== pathname) {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-white/90 text-[hsl(var(--primary-deep))] shadow-[0_10px_24px_-18px_rgba(77,28,91,0.45)] backdrop-blur-sm transition-all duration-200 active:scale-95 md:hidden"
    >
      <ArrowLeft size={18} />
    </button>
  );
};

export default MobileBackButton;
