import React from 'react';
import { Character } from '../types';
import { deleteCharacter } from '../services/storage';
import { Button } from './Button';
import { GalleryGrid } from './GalleryGrid';
import { Edit3, Trash2, ArrowLeft, Calendar } from 'lucide-react';

interface Props {
  character: Character;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CharacterDetail: React.FC<Props> = ({ character, onBack, onEdit, onDelete }) => {
  
  const handleDelete = () => {
    if (window.confirm(`정말로 "${character.name}" 캐릭터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      deleteCharacter(character.id);
      onDelete();
    }
  };

  // Helper to convert newlines to <br/> safely
  const formatText = (text: string) => {
    if (!text) return <span className="text-slate-400 italic">내용이 없습니다.</span>;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-300">
      {/* Header Nav */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack} className="self-start gap-2 pl-0 hover:pl-2 transition-all">
          <ArrowLeft size={20} />
          목록으로 돌아가기
        </Button>
        
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit} className="gap-2">
            <Edit3 size={16} />
            수정
          </Button>
          <Button variant="ghost" onClick={handleDelete} className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 size={16} />
            삭제
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
        
        {/* Left Column: Image & Stats */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
             {character.thumbnail ? (
               <img 
                 src={character.thumbnail} 
                 alt={character.name} 
                 className="w-full object-cover"
               />
             ) : (
               <div className="flex aspect-[3/4] w-full items-center justify-center bg-slate-100 text-slate-400">
                 이미지 없음
               </div>
             )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">기본 정보</h3>
            <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
              {formatText(character.infoText)}
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <Calendar size={12} />
              <span>등록일: {new Date(character.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{character.name}</h1>
            <div className="mt-2 h-1 w-20 bg-indigo-500 rounded-full" />
          </div>

          {/* Description */}
          <div className="prose prose-slate max-w-none rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="text-lg leading-relaxed text-slate-700">
              {formatText(character.description)}
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              갤러리
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
                {character.gallery.length}
              </span>
            </h2>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <GalleryGrid images={character.gallery} readOnly={true} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
