import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemonName: string;
}

const ShareModal: React.FC<ModalProps> = ({ isOpen, onClose, pokemonName }: ModalProps) => {
  if (!isOpen) return null;

  const shareUrl = `http://localhost:5173/pokemon/${pokemonName}`;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        role="dialog"
        aria-label="Share Pokemon"
        className="bg-white rounded-lg p-6 relative w-full max-w-md mx-4"
      >
        <h2 className="text-xl font-semibold mb-4">
          Share this Pokémon
        </h2>
        
        <button 
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">&times;</span>
        </button>

        <div className="space-y-2">
          <label 
            htmlFor="share-url"
            className="block text-sm font-medium text-gray-700"
          >
            Share URL
          </label>
          <input
            id="share-url"
            type="url"
            value={shareUrl}
            readOnly
            aria-label="Share URL"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button 
          onClick={() => navigator.clipboard.writeText(shareUrl)}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
