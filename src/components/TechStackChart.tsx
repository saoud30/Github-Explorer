import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import { useUserContext } from '../context/UserContext';
import { fetchUserStats } from '../services/githubService';

const TechStackChart = () => {
  const { user } = useUserContext();
  const [languageStats, setLanguageStats] = useState<{ language: string; percentage: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.login) {
        try {
          const stats = await fetchUserStats(user.login);
          setLanguageStats(stats.languageStats);
        } catch (error) {
          console.error('Error fetching language stats:', error);
        }
      }
    };

    fetchStats();
  }, [user]);

  const data = {
    datasets: [{
      label: 'Technologies',
      data: languageStats.map((stat, index) => ({
        x: 20 + (index * 10),
        y: 20 + (index * 10),
        r: stat.percentage,
        language: stat.language
      })),
      backgroundColor: [
        'rgba(255, 206, 86, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        display: false,
      },
      x: {
        beginAtZero: true,
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const stat = languageStats[context.dataIndex];
            return `${stat.language}: ${stat.percentage.toFixed(1)}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (!user || languageStats.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white/40 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Technology Distribution</h3>
      <div className="h-[300px]">
        <Bubble data={data} options={options} />
      </div>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {languageStats.map((stat, index) => (
          <div
            key={stat.language}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: data.datasets[0].backgroundColor[index],
              borderColor: data.datasets[0].borderColor[index],
              borderWidth: 1,
            }}
          >
            <span className="font-medium">{stat.language}</span>
            <span>({stat.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackChart