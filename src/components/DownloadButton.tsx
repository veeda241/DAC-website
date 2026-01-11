import React, { useState } from 'react';
import './DownloadButton.css';

interface DownloadButtonProps {
    onDownload: () => void;
    className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload, className = '' }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleClick = () => {
        if (isDownloading) return;
        setIsDownloading(true);
        onDownload();

        // Reset after animation completes (4 seconds)
        setTimeout(() => {
            setIsDownloading(false);
        }, 4000);
    };

    return (
        <div className={`download-container ${className}`}>
            <label className="download-label">
                <input
                    type="checkbox"
                    className="download-input"
                    checked={isDownloading}
                    onChange={handleClick}
                />
                <span className="download-circle">
                    <svg
                        className="download-icon"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 19V5m0 14-4-4m4 4 4-4"
                        />
                    </svg>
                    <div className="download-square"></div>
                </span>
                <p className="download-title">Download</p>
                <p className="download-title">Done!</p>
            </label>
        </div>
    );
};

export default DownloadButton;
