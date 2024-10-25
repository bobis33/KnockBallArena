import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure correct path

interface LeaderboardEntry {
  name: string;
  score: number;
}

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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
            .from('profile') // Replace 'users' with your actual table name
            .select('username, high_score')
            .order('high_score', { ascending: false })
            .limit(3); // Limit results to top 3

        if (error) throw error;

        // Map data from Supabase to match the LeaderboardEntry interface
        const formattedData = data.map((entry: any) => ({
          name: entry.username,
          score: entry.high_score,
        }));

        setLeaderboardData(formattedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const truncateName = (name: string) => {
    return name.length > 12 ? `${name.slice(0, 12)}...` : name;
  };

  return (
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-50 text-white rounded-lg shadow-lg p-4 w-64">
        <h2 className="text-xl font-bold text-center mb-2">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboardData.map((entry, index) => (
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
