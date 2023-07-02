import React from 'react';

interface DownloadButtonProps {
  url: string;
  filename: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ url, filename }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="download-button" onClick={handleDownload}>
      ↓
    </button>
  );
};

export default DownloadButton;

