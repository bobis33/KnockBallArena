import { useState } from 'react';

const skins = [
  { id: 1, color: 'bg-red-500', texturePath: 'lotus-test.jpg' },
  { id: 2, color: 'bg-blue-500', texturePath: 'logo192.png' },
  { id: 3, color: 'bg-green-500', texturePath: 'path_to_texture_3.jpg' },
  { id: 4, color: 'bg-yellow-500', texturePath: 'path_to_texture_4.jpg' },
  { id: 5, color: 'bg-purple-500', texturePath: 'path_to_texture_5.jpg' },
  { id: 6, color: 'bg-indigo-500', texturePath: 'path_to_texture_6.jpg' },
  { id: 7, color: 'bg-red-500', texturePath: 'lotus-test.jpg' },
  { id: 8, color: 'bg-blue-500', texturePath: 'logo192.png' },
  { id: 9, color: 'bg-green-500', texturePath: 'path_to_texture_3.jpg' },
  { id: 10, color: 'bg-yellow-500', texturePath: 'path_to_texture_4.jpg' },
  { id: 11, color: 'bg-purple-500', texturePath: 'path_to_texture_5.jpg' },
  { id: 12, color: 'bg-indigo-500', texturePath: 'path_to_texture_6.jpg' },
  { id: 12, color: 'bg-indigo-500', texturePath: 'path_to_texture_6.jpg' },
];

export default function Customize({ onBack, onTextureChange }: { onBack: () => void; onTextureChange: (texturePath: string) => void }) {
  const [selectedSkin, setSelectedSkin] = useState<number | null>(null);

  const handleSkinSelect = (skinId: number, texturePath: string) => {
    setSelectedSkin(skinId);
    onTextureChange(texturePath);
  };

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-start rounded-3xl py-76 my-16 ml-6">
      <div className="max-w-3xl border-gray-300">
        <h1 className="text-3xl font-extrabold text-center text -gray-900 mb-8">
          Choose your skin
        </h1>
        <div className="grid grid-cols-3 gap-6">
          {skins.map((skin) => (
            <div
              key={skin.id}
              onClick={() => handleSkinSelect(skin.id, skin.texturePath)}
              className={`rounded-full cursor-pointer transition-transform transform border-black ${
                selectedSkin === skin.id ? 'scale-105 border-black' : 'border-transparent'
              }`}
            >
              <div className={`${skin.color} w-20 h-20 rounded-full`}></div>
              <p className="text-center mt-2">Skin {skin.id}</p>
            </div>
          ))}
        </div>
        <button
          className="w-64 py-5 ml-4 mt-10 text-xl font-semibold rounded-full bg-gray-600 text-white hover:bg-gray-700 transition duration-300"
          onClick={onBack}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
