import axios from 'axios';

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  name: string | null;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  language: string;
  updated_at: string;
}

interface LanguageStats {
  [key: string]: number;
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await axios.get<GitHubUser>(
      `https://api.github.com/users/${username}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`User '${username}' not found`);
    }
    throw new Error('Failed to fetch GitHub user data');
  }
};

export const fetchUserRepositories = async (username: string): Promise<Repository[]> => {
  try {
    const response = await axios.get<Repository[]>(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw new Error('Failed to fetch repositories');
  }
};

export const fetchRepoLanguages = async (username: string, repoName: string): Promise<LanguageStats> => {
  try {
    const response = await axios.get<LanguageStats>(
      `https://api.github.com/repos/${username}/${repoName}/languages`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw new Error('Failed to fetch languages');
  }
};

export const fetchUserStats = async (username: string) => {
  try {
    const repos = await fetchUserRepositories(username);
    
    // Sort repos by stars and forks
    const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
    const sortedByForks = [...repos].sort((a, b) => b.forks_count - a.forks_count);
    const sortedByDate = [...repos].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    // Get language statistics
    const languageStats: { [key: string]: number } = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    });

    // Convert language stats to percentage
    const totalRepos = Object.values(languageStats).reduce((a, b) => a + b, 0);
    const languagePercentages = Object.entries(languageStats).map(([language, count]) => ({
      language,
      percentage: (count / totalRepos) * 100
    }));

    return {
      mostStarred: sortedByStars[0] || null,
      mostForked: sortedByForks[0] || null,
      oldestRepo: sortedByDate[0] || null,
      latestActivity: repos.length > 0 ? 
        new Date(Math.max(...repos.map(repo => new Date(repo.updated_at).getTime()))).toISOString() :
        null,
      languageStats: languagePercentages.sort((a, b) => b.percentage - a.percentage).slice(0, 5)
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw new Error('Failed to fetch user statistics');
  }
};