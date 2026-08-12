import React from 'react';

interface ToggleSwitchProps {
  isInfluencer: boolean;
  setIsInfluencer: (value: boolean) => void;
  showLabels?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isInfluencer,
  setIsInfluencer,
  showLabels = true
}) => {
  const handleToggle = () => {
    setIsInfluencer(!isInfluencer);
  };

  return (
    <div className="mt-2 mb-3 flex justify-center md:my-8">
      <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 shadow-[0_20px_45px_-32px_rgba(0,0,0,0.45)] backdrop-blur-sm md:gap-4 md:bg-white/10 md:px-5 md:py-3">
      {showLabels && (
          <button
            type="button"
            onClick={() => setIsInfluencer(false)}
            className={`rounded-full px-1 text-[13px] font-semibold leading-none whitespace-nowrap transition-colors md:text-lg ${
              !isInfluencer ? 'text-white' : 'text-white/65 hover:text-white/85'
            }`}
          >
          Markalar İçin

          </button>
      )}

        <button
          type="button"
          onClick={handleToggle}
          className="relative inline-flex h-9 w-[4.35rem] items-center rounded-full border border-white/20 bg-white/10 p-1 transition-colors hover:bg-white/15"
          aria-label="Toggle audience"
        >
        <input
          type="checkbox"
          checked={isInfluencer}
          onChange={handleToggle}
            className="sr-only"
        />
          <span
            className={`block h-7 w-7 rounded-full bg-white shadow-[0_10px_18px_-10px_rgba(255,255,255,0.35)] transition-transform duration-300 ${
              isInfluencer ? 'translate-x-[2.15rem]' : 'translate-x-0'
            }`}
          />
        </button>

      {showLabels && (
          <button
            type="button"
            onClick={() => setIsInfluencer(true)}
            className={`rounded-full px-1 text-[13px] font-semibold leading-none whitespace-nowrap transition-colors md:text-lg ${
              isInfluencer ? 'text-white' : 'text-white/65 hover:text-white/85'
            }`}
          >
           İçerik Üreticileri İçin
          </button>
      )}
      </div>
    </div>
  );
};

export default ToggleSwitch;
