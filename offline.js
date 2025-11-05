
const PLAYER_DATA_KEY = 'eduQuestOfflinePlayer';

// Default structure for a new player
const defaultPlayerData = {
  name: 'Player',
  total_points: 0,
  level: 1,
  badges: [],
  game_scores: [],
  subjects_progress: {
    mathematics: { level: 1, points: 0, chapters_completed: [] },
    science: { level: 1, points: 0, chapters_completed: [] },
    technology: { level: 1, points: 0, chapters_completed: [] },
    physics: { level: 1, points: 0, chapters_completed: [] },
    engineering: { level: 1, points: 0, chapters_completed: [] }
  }
};

/**
 * Gets the current offline player data from localStorage.
 * Initializes a new player if one doesn't exist.
 * @param {string} [name] - Optional name to initialize a new player.
 * @returns {object} The player data object.
 */
export const getPlayerData = (name) => {
  try {
    const data = localStorage.getItem(PLAYER_DATA_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      // If no data, create a new player
      const newPlayer = { ...defaultPlayerData, name: name || 'Player' };
      localStorage.setItem(PLAYER_DATA_KEY, JSON.stringify(newPlayer));
      return newPlayer;
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return { ...defaultPlayerData, name: 'Error Player' };
  }
};

/**
 * Saves the entire player data object to localStorage.
 * @param {object} data - The player data object to save.
 */
export const savePlayerData = (data) => {
  try {
    localStorage.setItem(PLAYER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

/**
 * Resets all offline data.
 */
export const resetOfflineData = () => {
  try {
    localStorage.removeItem(PLAYER_DATA_KEY);
  } catch (error) {
    console.error("Error resetting localStorage:", error);
  }
};


/**
 * Adds a game score and updates player points and level.
 * @param {object} gameData - The data for the game session.
 * e.g., { game_name, subject, chapter, score, accuracy, difficulty_level }
 */
export const addScore = (gameData) => {
  const player = getPlayerData();

  // Add the new score record
  player.game_scores.push({ ...gameData, created_date: new Date().toISOString() });

  // Update total points
  player.total_points += gameData.score || 0;
  
  // Update subject-specific points
  if (gameData.subject && player.subjects_progress[gameData.subject]) {
    player.subjects_progress[gameData.subject].points += gameData.score || 0;
  }

  // Update level based on points (e.g., new level every 1000 points)
  const newLevel = Math.floor(player.total_points / 1000) + 1;
  if (newLevel > player.level) {
    player.level = newLevel;
    // Potentially add a "Leveled Up!" badge
    addBadge('level_up_' + newLevel);
  }
  
  // Save the updated player data
  savePlayerData(player);
  return player;
};

/**
 * Adds a new badge to the player's collection if they don't have it.
 * @param {string} badgeId - The unique identifier for the badge.
 */
export const addBadge = (badgeId) => {
    const player = getPlayerData();
    if (!player.badges.find(b => b.id === badgeId)) {
        player.badges.push({ id: badgeId, date: new Date().toISOString() });
        savePlayerData(player);
    }
};

// Doubt Management Functions for Offline Mode
export const saveDoubtOffline = (doubtData) => {
  try {
    const doubts = getOfflineDoubts();
    const newDoubt = {
      id: `doubt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...doubtData,
      created_date: new Date().toISOString(),
      resolved: false,
      reviewed_count: 0,
      offline: true
    };
    
    doubts.push(newDoubt);
    localStorage.setItem('salt_doubts', JSON.stringify(doubts));
    return newDoubt;
  } catch (error) {
    console.error('Error saving doubt offline:', error);
    return null;
  }
};

export const getOfflineDoubts = () => {
  try {
    const doubtsJson = localStorage.getItem('salt_doubts');
    return doubtsJson ? JSON.parse(doubtsJson) : [];
  } catch (error) {
    console.error('Error getting offline doubts:', error);
    return [];
  }
};

export const markDoubtResolved = (doubtId) => {
  try {
    const doubts = getOfflineDoubts();
    const updatedDoubts = doubts.map(doubt => 
      doubt.id === doubtId ? { ...doubt, resolved: true } : doubt
    );
    localStorage.setItem('salt_doubts', JSON.stringify(updatedDoubts));
    return true;
  } catch (error) {
    console.error('Error marking doubt resolved:', error);
    return false;
  }
};

export const incrementDoubtReview = (doubtId) => {
  try {
    const doubts = getOfflineDoubts();
    const updatedDoubts = doubts.map(doubt => 
      doubt.id === doubtId ? { ...doubt, reviewed_count: (doubt.reviewed_count || 0) + 1 } : doubt
    );
    localStorage.setItem('salt_doubts', JSON.stringify(updatedDoubts));
    return true;
  } catch (error) {
    console.error('Error incrementing doubt review:', error);
    return false;
  }
};

export const deleteDoubt = (doubtId) => {
  try {
    const doubts = getOfflineDoubts();
    const filteredDoubts = doubts.filter(doubt => doubt.id !== doubtId);
    localStorage.setItem('salt_doubts', JSON.stringify(filteredDoubts));
    return true;
  } catch (error) {
    console.error('Error deleting doubt:', error);
    return false;
  }
};

export const getDoubtsBySubject = (subject) => {
  try {
    const doubts = getOfflineDoubts();
    return doubts.filter(doubt => doubt.subject === subject);
  } catch (error) {
    console.error('Error getting doubts by subject:', error);
    return [];
  }
};

export const getUnresolvedDoubtsCount = () => {
  try {
    const doubts = getOfflineDoubts();
    return doubts.filter(doubt => !doubt.resolved).length;
  } catch (error) {
    console.error('Error getting unresolved doubts count:', error);
    return 0;
  }
};
