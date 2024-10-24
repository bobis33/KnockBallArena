import React from 'react';

interface LeaderboardEntry {
  name: string;
  score: number;
}

const leaderboardData: LeaderboardEntry[] = [
  { name: 'PlayerOneWithALongName', score: 15000 },
  { name: 'ShortName', score: 1350 },
  { name: 'AnotherLongPlayerName', score: 1200000 },
  { name: 'Player123456789', score: 11000 },
  { name: 'PlayerX', score: 950 },
  { name: 'PlayerY', score: 100000 },
  { name: 'PlayerZ', score: 2000000 },
  { name: 'PlayerA', score: 500 },
  { name: 'PlayerB', score: 10000 },
  { name: 'PlayerC', score: 300000 },
  { name: 'PlayerD', score: 1000 },
  { name: 'PlayerE', score: 1000000 },
  { name: 'PlayerF', score: 2000 },
  { name: 'PlayerG', score: 500000 },
];

const formatScore = (score: number) => {
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + 'M';
  } else if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'k';
  } else {
    return score.toString();
  }
};

export default function Leaderboard() {
  const truncateName = (name: string) => {
    return name.length > 12 ? `${name.slice(0, 12)}...` : name;
  };

  const sortedLeaderboard = [...leaderboardData]
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);

  return (
    <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-50 text-white rounded-lg shadow-lg p-4 w-64">
      <h2 className="text-xl font-bold text-center mb-2">Leaderboard</h2>
      <div className="space-y-2">
        {sortedLeaderboard.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-lg"
          >
            <span className="text-lg font-semibold">{truncateName(entry.name)}</span>
            <span className="text-lg">{formatScore(entry.score)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
