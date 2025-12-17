import { Character } from '../types';

const STORAGE_KEY = 'oc_archive_v1';

export const getCharacters = (): Character[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load characters', e);
    return [];
  }
};

export const saveCharacter = (character: Character): void => {
  const chars = getCharacters();
  const index = chars.findIndex((c) => c.id === character.id);
  
  if (index >= 0) {
    chars[index] = { ...character, updatedAt: Date.now() };
  } else {
    chars.push({ ...character, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  } catch (e) {
    alert('저장 공간이 부족합니다. 이미지를 줄여주세요.');
    console.error(e);
  }
};

export const deleteCharacter = (id: string): void => {
  const chars = getCharacters().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
};

export const getCharacterById = (id: string): Character | undefined => {
  const chars = getCharacters();
  return chars.find((c) => c.id === id);
};

// Utility to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
