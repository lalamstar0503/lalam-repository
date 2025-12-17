import React, { useState, useEffect } from 'react';
import { ViewState, Character } from './types';
import { getCharacters, getCharacterById } from './services/storage';
import { CharacterCard } from './components/CharacterCard';
import { CharacterEditor } from './components/CharacterEditor';
import { CharacterDetail } from './components/CharacterDetail';
import { Button } from './components/Button';
import { Plus, Users, Search } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ type: 'LIST' });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCharacters = () => {
    setCharacters(getCharacters().sort((a, b) => b.updatedAt - a.updatedAt));
  };

  useEffect(() => {
    loadCharacters();
  }, [view]);

  // View Navigation Handlers
  const goToList = () => setView({ type: 'LIST' });
  const goToCreate = () => setView({ type: 'CREATE' });
  const goToView = (id: string) => setView({ type: 'VIEW', id });
  const goToEdit = (id: string) => setView({ type: 'EDIT', id });

  // Filter Logic
  const filteredCharacters = characters.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.infoText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render Views
  const renderContent = () => {
    switch (view.type) {
      case 'LIST':
        return (
          <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
            {/* Header Area */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                  <Users className="text-indigo-600" size={32} />
                  캐릭터 정리함
                </h1>
                <p className="mt-2 text-slate-500">나만의 캐릭터 정리함</p>
              </div>
              <Button onClick={goToCreate} size="lg" className="shadow-lg shadow-indigo-200 gap-2">
                <Plus size={20} />
                새 캐릭터 추가
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="이름 또는 설정으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Grid */}
            {filteredCharacters.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredCharacters.map((char) => (
                  <CharacterCard 
                    key={char.id} 
                    character={char} 
                    onClick={() => goToView(char.id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm border border-slate-100 mt-10">
                <div className="mb-4 rounded-full bg-slate-50 p-4">
                  <Users size={48} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">캐릭터가 없습니다</h3>
                <p className="mt-1 text-slate-500 max-w-sm">
                  {searchTerm ? '검색 결과가 없습니다.' : '첫 번째 캐릭터를 등록해보세요!'}
                </p>
                {!searchTerm && (
                  <Button variant="secondary" onClick={goToCreate} className="mt-6">
                    캐릭터 만들기
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      case 'CREATE':
        return (
          <CharacterEditor 
            onClose={goToList} 
            onSave={goToList} 
          />
        );

      case 'EDIT':
        return (
          <CharacterEditor 
            editId={view.id}
            onClose={() => goToView(view.id)} 
            onSave={() => goToView(view.id)} 
          />
        );

      case 'VIEW':
        const character = getCharacterById(view.id);
        if (!character) {
          // Fallback if ID invalid
          goToList(); 
          return null; 
        }
        return (
          <CharacterDetail 
            character={character} 
            onBack={goToList}
            onEdit={() => goToEdit(character.id)}
            onDelete={goToList}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation Bar - Simple */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div 
            className="flex items-center gap-2 font-bold text-indigo-600 cursor-pointer text-xl" 
            onClick={goToList}
          >
            <span>✨</span>
            <span>캐릭터 정리함</span>
          </div>
          {view.type !== 'LIST' && (
             <button 
               onClick={goToList}
               className="text-sm font-medium text-slate-500 hover:text-indigo-600"
             >
               홈으로
             </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {renderContent()}
      </main>
      
      {/* Simple Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} OC Archive. LocalStorage only.</p>
      </footer>
    </div>
  );
};

export default App;
