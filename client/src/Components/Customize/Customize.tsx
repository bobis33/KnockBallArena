import { useState } from 'react';

const skins = [
  { id: 1, color: 'bg-red-500' },
  { id: 2, color: 'bg-blue-500' },
  { id: 3, color: 'bg-green-500' },
  { id: 4, color: 'bg-yellow-500' },
  { id: 5, color: 'bg-purple-500' },
  { id: 6, color: 'bg-pink-500' },
  { id: 7, color: 'bg-indigo-500' },
  { id: 8, color: 'bg-teal-500' },
  { id: 9, color: 'bg-orange-500' },
  { id: 10, color: 'bg-cyan-500' },
  { id: 11, color: 'bg-lime-500' },
  { id: 12, color: 'bg-emerald-500' },
];

export default function Customize({ onBack }: { onBack: () => void }) {
  const [selectedSkin, setSelectedSkin] = useState<number | null>(null);

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-start rounded-3xl py-80 my-16 ml-6">
      <div className="max-w-3xl border-gray-300">
        <h1 className="text-3xl font-extrabold text-center text -gray-900 mb-8">
          Choose your skin
        </h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
          {skins.map((skin) => (
            <button
              key={skin.id}
              className={`aspect-square rounded-lg border-2 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                selectedSkin === skin.id
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'hover:border-blue-300'
              }`}
              onClick={() => setSelectedSkin(skin.id)}
              aria-label={`Select skin color ${skin.id}`}
            >
              <div className="relative w-full h-full">
                <div
                  className={`absolute inset-0 rounded-full ${skin.color} transform transition-transform duration-200 ${
                    selectedSkin === skin.id ? 'scale-90' : 'scale-75'
                  }`}
                  aria-hidden="true"
                ></div>
              </div>
            </button>
          ))}
        </div>
        {selectedSkin && (
          <p className="mt-6 text-center text-lg text-gray-700">
            You selected skin {selectedSkin}
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <button
            className="w-64 py-4 text-xl font-semibold rounded-full bg-gray-600 text-white hover:bg-gray-700 transition duration-300"
            onClick={onBack}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
