import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { RECRUITMENT_AD_URL, RECRUITMENT_APPLICATION_LINK } from '../constants';
import './RecruitmentAd.css';

const STORAGE_KEY = 'dac-recruitment-ad-dismissed';

interface RecruitmentAdProps {
  isVisible: boolean;
}

const RecruitmentAd: React.FC<RecruitmentAdProps> = ({ isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  };

  const handlePosterClick = () => {
    window.open(RECRUITMENT_APPLICATION_LINK, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      className={`recruitment-ad-overlay ${isClosing ? 'recruitment-ad-overlay--closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="DAC recruitment poster"
    >
      <div
        className={`recruitment-ad-card ${isClosing ? 'recruitment-ad-card--closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="recruitment-ad-close"
          onClick={handleClose}
          aria-label="Close recruitment poster"
        >
          <X size={20} />
        </button>

        <button
          type="button"
          className="recruitment-ad-poster"
          onClick={handlePosterClick}
          aria-label="Apply to join the Data Analytics Club"
        >
          <img
            src={RECRUITMENT_AD_URL}
            alt="We're Recruiting! Join the Data Analytics Club — Apply Now"
          />
        </button>

        <p className="recruitment-ad-hint">Click the poster to apply</p>
      </div>
    </div>
  );
};

export default RecruitmentAd;
