import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { FileText, Star, GitFork, Clock, Users, Download, Link as LinkIcon, Brain } from 'lucide-react';
import { fetchGitHubUser, fetchUserStats } from '../services/githubService';
import { getAISummary } from '../services/geminiService';
import { useTheme } from '../context/ThemeContext';

interface ResumeData {
  user: any;
  stats: any;
  summary: string;
}

const Resume = () => {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      
      try {
        const [user, stats] = await Promise.all([
          fetchGitHubUser(username),
          fetchUserStats(username)
        ]);
        
        const summary = await getAISummary(user);
        
        setData({ user, stats, summary });
      } catch (error) {
        console.error('Error fetching resume data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handlePrint = () => {
    window.print();
  };

  const analyzePortfolio = async () => {
    if (!url) return;
    
    setAnalyzing(true);
    try {
      const prompt = `
You are a technical recruiter AI reviewing a portfolio or resume link: ${url}.
Evaluate it and provide:

1. 🔑 Missing technical keywords
2. 🧠 Suggested roles based on tech stack & tone
3. 🎨 Visual/UX feedback (e.g., layout, accessibility, mobile issues)

Keep it concise and professional with clear bullet points under each heading.
      `;

      const response = await getAISummary({ prompt });
      setAnalysis(response);
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      setAnalysis('Failed to analyze portfolio. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { user, stats, summary } = data;

  const languageData = {
    labels: stats.languageStats.map((stat: any) => stat.language),
    datasets: [{
      data: stats.languageStats.map((stat: any) => stat.percentage),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const
      }
    }
  };

  const cardStyle = 'bg-white/40 backdrop-blur-sm rounded-lg p-6 shadow-sm';

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 print:bg-white">
      {/* Header */}
      <div className={cardStyle}>
        <div className="flex items-center gap-4">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user.name || user.login}
            </h1>
            <p className="text-gray-600">{user.bio}</p>
            <div className="flex items-center gap-2 mt-2">
              <LinkIcon className="h-4 w-4 text-gray-500" />
              <a
                href={`https://github.com/${user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700"
              >
                github.com/{user.login}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className={cardStyle}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>

      {/* Top Repositories */}
      <div className={cardStyle}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notable Projects</h2>
        <div className="space-y-4">
          {[stats.mostStarred, stats.mostForked].filter(Boolean).map((repo: any) => (
            <div key={repo.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
              <h3 className="font-medium text-purple-600">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h3>
              <p className="text-gray-600 text-sm mt-1">{repo.description}</p>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 mr-1" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <GitFork className="h-4 w-4 mr-1" />
                  {repo.forks_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className={`${cardStyle} grid md:grid-cols-2 gap-6`}>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {stats.languageStats.map((stat: any) => (
              <span
                key={stat.language}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {stat.language} ({stat.percentage.toFixed(1)}%)
              </span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-xs mx-auto">
          <Doughnut data={languageData} options={chartOptions} />
        </div>
      </div>

      {/* GitHub Stats */}
      <div className={cardStyle}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">GitHub Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-gray-800">{user.followers}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <Star className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {stats.mostStarred?.stargazers_count || 0}
            </div>
            <div className="text-sm text-gray-600">Most Stars</div>
          </div>
          <div className="text-center">
            <GitFork className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {stats.mostForked?.forks_count || 0}
            </div>
            <div className="text-sm text-gray-600">Most Forks</div>
          </div>
          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto text-green-500 mb-2" />
            <div className="text-sm font-medium text-gray-800">
              {new Date(stats.oldestRepo?.created_at).getFullYear()}
            </div>
            <div className="text-sm text-gray-600">First Repository</div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Resume
        </button>
      </div>

      {/* AI Portfolio Analyzer */}
      <div className={`${cardStyle} print:hidden`}>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">AI Portfolio Analyzer</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Paste your portfolio or resume link below to get instant AI-powered feedback on your profile's content, tech focus, and UX!
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="url"
            placeholder="https://your-portfolio.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={analyzePortfolio}
            disabled={analyzing || !url}
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded transition-colors ${
              analyzing || !url
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <Brain className="h-4 w-4" />
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {analysis && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">🔍 AI Feedback:</h3>
            <div className="whitespace-pre-wrap text-sm text-gray-800">{analysis}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;