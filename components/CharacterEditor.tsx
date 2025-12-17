import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types';
import { fileToBase64, saveCharacter, getCharacterById } from '../services/storage';
import { Button } from './Button';
import { GalleryGrid } from './GalleryGrid';
import { Upload, X, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Since we can't use uuid package, we will use a simple generator

// Simple ID generator replacement since we can't import uuid
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

interface Props {
  editId?: string;
  onClose: () => void;
  onSave: () => void;
}

export const CharacterEditor: React.FC<Props> = ({ editId, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [infoText, setInfoText] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data if editing
  useEffect(() => {
    if (editId) {
      const char = getCharacterById(editId);
      if (char) {
        setName(char.name);
        setInfoText(char.infoText);
        setDescription(char.description);
        setThumbnail(char.thumbnail);
        setGallery(char.gallery);
      }
    }
  }, [editId]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true);
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setThumbnail(base64);
      } catch (err) {
        alert('이미지 업로드 실패');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      try {
        const promises = Array.from(e.target.files).map(file => fileToBase64(file));
        const newImages = await Promise.all(promises);
        setGallery(prev => [...prev, ...newImages]);
      } catch (err) {
        alert('일부 이미지를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (window.confirm('이 이미지를 갤러리에서 삭제하시겠습니까?')) {
      setGallery(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('이름을 입력해주세요.');

    const newChar: Character = {
      id: editId || generateId(),
      name,
      infoText,
      description,
      thumbnail,
      gallery,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    try {
        saveCharacter(newChar);
        onSave();
    } catch (error) {
        console.error(error);
        alert('저장 중 오류가 발생했습니다. (용량 초과 가능성)');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft size={18} />
          취소
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">
          {editId ? '캐릭터 수정' : '새 캐릭터 등록'}
        </h2>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Section: Image & Basic Info */}
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          
          {/* Thumbnail Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">대표 이미지</label>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100">
              {thumbnail ? (
                <>
                  <img src={thumbnail} alt="Thumbnail" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setThumbnail(null)}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-red-500"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span className="text-sm">클릭하여 업로드</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleThumbnailUpload}
              />
            </div>
          </div>

          {/* Basic Info Inputs */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                캐릭터 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                기본 정보 (나이, 종족, 특징 등)
              </label>
              <textarea
                value={infoText}
                onChange={e => setInfoText(e.target.value)}
                placeholder="간단한 프로필을 입력하세요 (예: 18세 / 학생 / 명랑함)"
                className="h-32 w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            상세 설정 (자유 서술)
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="캐릭터의 배경 스토리, 성격, 기타 설정을 자유롭게 작성하세요."
            className="min-h-[200px] w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Gallery Section */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">갤러리</h3>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
              <Upload size={16} />
              이미지 추가
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="hidden"
                onChange={handleGalleryUpload}
              />
            </label>
          </div>
          <GalleryGrid images={gallery} onRemove={handleRemoveGalleryImage} />
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-4 z-10 flex justify-end gap-3 rounded-lg bg-white/80 p-4 shadow-lg backdrop-blur border border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            <Save size={18} />
            {isLoading ? '처리 중...' : '캐릭터 저장'}
          </Button>
        </div>
      </form>
    </div>
  );
};
