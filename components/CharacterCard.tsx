import React from 'react';
import { Character } from '../types';
import { Image, User } from 'lucide-react';

interface Props {
  character: Character;
  onClick: () => void;
}

export const CharacterCard: React.FC<Props> = ({ character, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-indigo-300 cursor-pointer"
    >
      {/* Thumbnail Aspect Ratio Container */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100 relative">
        {character.thumbnail ? (
          <img 
            src={character.thumbnail} 
            alt={character.name} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <User size={48} />
          </div>
        )}
        
        {/* Gallery Count Badge */}
        {character.gallery.length > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Image size={12} />
            <span>{character.gallery.length}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col p-4">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 truncate">
          {character.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2 min-h-[1.25rem]">
          {character.infoText || "설정이 없습니다."}
        </p>
      </div>
    </div>
  );
};
