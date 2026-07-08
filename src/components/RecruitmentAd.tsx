import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import {
  RECRUITMENT_AD_URL,
  RECRUITMENT_ACTIVE_UNTIL,
  RECRUITMENT_APPLICATION_LINK,
} from '../constants';
import { isEventUpcoming } from '../utils/eventDates';
import './RecruitmentAd.css';

interface RecruitmentAdProps {
  isVisible: boolean;
}

const RecruitmentAd: React.FC<RecruitmentAdProps> = ({ isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isRecruitmentActive = isEventUpcoming('2026-02-10', RECRUITMENT_ACTIVE_UNTIL);

  useEffect(() => {
    if (!isVisible || !isRecruitmentActive || isDismissed) {
      return;
    }

    const timer = window.setTimeout(() => setIsOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [isVisible, isRecruitmentActive, isDismissed]);

  const handleClose = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsDismissed(true);
    }, 280);
  };

  if (!isVisible || !isRecruitmentActive || isDismissed || !isOpen) {
    return null;
  }

  return createPortal(
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

        <a
          href={RECRUITMENT_APPLICATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="recruitment-ad-poster"
          aria-label="Apply to join the Data Analytics Club"
        >
          <img
            src={RECRUITMENT_AD_URL}
            alt="We're Recruiting! Join the Data Analytics Club — Apply Now"
          />
        </a>

        <p className="recruitment-ad-hint">Click the poster to apply</p>
      </div>
    </div>,
    document.body
  );
};

export default RecruitmentAd;
