import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { getAISummary } from '../services/geminiService';
import { fetchUserStats } from '../services/githubService';
import TechStackChart from './TechStackChart';
import { Award, Star, GitFork, Clock, FileText } from 'lucide-react';
import ContributionCalendar from './ContributionCalendar';

interface UserStats {
  mostStarred: any;
  mostForked: any;
  oldestRepo: any;
  latestActivity: string | null;
  languageStats: { language: string; percentage: number }[];
}

const UserCard = () => {
  const navigate = useNavigate();
  const { user, loading } = useUserContext();
  const [flipped, setFlipped] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (user?.login) {
        setLoadingAI(true);
        try {
          const [summary, userStats] = await Promise.all([
            getAISummary(user),
            fetchUserStats(user.login)
          ]);
          
          if (isMounted) {
            setAiSummary(summary);
            setStats(userStats);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          if (isMounted) {
            setAiSummary('Unable to generate AI summary at this time.');
          }
        } finally {
          if (isMounted) setLoadingAI(false);
        }
      }
    };
    
    fetchData();
    return () => { isMounted = false; };
  }, [user]);

  if (!user) return null;

  // Calculate goals based on real data
  const goals = {
    followersGoal: { 
      current: user.followers,
      target: Math.ceil(user.followers / 10) * 10 + 10 // Next round number + 10
    },
    starsGoal: { 
      current: stats?.mostStarred?.stargazers_count || 0,
      target: Math.ceil((stats?.mostStarred?.stargazers_count || 0) / 100) * 100 + 100 // Next hundred
    },
    hasPublicRepos: user.public_repos > 0
  };

  const handleViewResume = () => {
    navigate(`/resume/${user.login}`);
  };

  return (
    <div className="space-y-8">
      <div className="w-full max-w-md mx-auto">
        <div className="relative w-full h-80" onClick={() => setFlipped(state => !state)}>
          {/* Front Card */}
          <animated.div
            className="absolute w-full h-full cursor-pointer"
            style={{
              opacity: opacity.to(o => 1 - o),
              transform,
              rotateY: '0deg',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="w-full h-full bg-white/40 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-purple-200">
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.login}</h2>
              <p className="text-gray-600 text-center mb-4 text-sm line-clamp-2">
                {user.bio || 'No bio available'}
              </p>
              <div className="flex justify-between w-full mt-auto">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-800">{user.followers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-800">{user.following.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-800">{user.public_repos.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Repositories</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">Click to see AI insights</p>
            </div>
          </animated.div>

          {/* Back Card */}
          <animated.div
            className="absolute w-full h-full cursor-pointer"
            style={{
              opacity,
              transform: transform.to(t => `${t} rotateY(180deg)`),
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="w-full h-full bg-white/40 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col">
              <h3 className="text-xl font-bold text-purple-700 mb-3">AI Developer Profile</h3>
              {loadingAI ? (
                <div className="flex-grow flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Analyzing profile...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">{aiSummary}</p>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Top Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {stats?.languageStats.map(stat => (
                        <span key={stat.language} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {stat.language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-4 text-center">Click to flip back</p>
            </div>
          </animated.div>
        </div>

        {/* Resume Button */}
        <button
          onClick={handleViewResume}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FileText className="h-4 w-4" />
          View GitHub Resume
        </button>
      </div>

      {/* Achievements Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Most Starred</p>
              <p className="font-semibold">{stats.mostStarred?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500">{stats.mostStarred?.stargazers_count.toLocaleString() || 0} stars</p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <GitFork className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Most Forked</p>
              <p className="font-semibold">{stats.mostForked?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500">{stats.mostForked?.forks_count.toLocaleString() || 0} forks</p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <Clock className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">First Repository</p>
              <p className="font-semibold">{stats.oldestRepo?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500">
                Created {stats.oldestRepo ? new Date(stats.oldestRepo.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
            <Award className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Latest Activity</p>
              <p className="text-xs text-gray-500">
                {stats.latestActivity ? new Date(stats.latestActivity).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Goals Section */}
      <div className="max-w-4xl mx-auto bg-white/40 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">GitHub Goals</h3>
        <div className="space-y-4">
          {goals.followersGoal.current < goals.followersGoal.target && (
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    Followers Goal
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    {goals.followersGoal.current}/{goals.followersGoal.target}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                <div
                  style={{ width: `${(goals.followersGoal.current / goals.followersGoal.target) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                ></div>
              </div>
            </div>
          )}
          
          {goals.starsGoal.current < goals.starsGoal.target && (
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    Total Stars Goal
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    {goals.starsGoal.current}/{goals.starsGoal.target}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                <div
                  style={{ width: `${(goals.starsGoal.current / goals.starsGoal.target) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                ></div>
              </div>
            </div>
          )}
          
          {!goals.hasPublicRepos && (
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
              <p className="text-purple-700">🎯 Goal: Create your first public repository!</p>
            </div>
          )}
        </div>
      </div>

      {user && <ContributionCalendar username={user.login} />}

      {/* Tech Stack Chart */}
      <TechStackChart />
    </div>
  );
};

export default UserCard;