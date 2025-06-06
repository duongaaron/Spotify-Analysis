// Personality analyses based on different music genres and styles

const analyses = {
  // For tracks with SZA, Drake, R&B artists
  rnb: "Your music taste reveals a deep emotional intelligence and appreciation for authentic expression. You likely value meaningful connections and aren't afraid to explore the full spectrum of your feelings.",
  
  // For tracks with NewJeans, ROSÉ, K-pop artists
  kpop: "Your playlist suggests you're a trendsetter with a global perspective. You appreciate innovation and aren't afraid to embrace new cultural experiences that others might discover later.",
  
  // For classical or piano pieces
  classical: "The classical pieces in your library reveal a thoughtful soul who appreciates timeless beauty. You likely have a contemplative nature and find value in traditions while bringing your own modern perspective.",
  
  // For indie or alternative artists
  indie: "Your indie music choices suggest you're an independent thinker who values authenticity. You're likely curious about the world and appreciate art that offers unique perspectives.",
  
  // For pop music
  pop: "Your pop selections show you have your finger on the cultural pulse while maintaining your own distinct taste. You're likely sociable and bring positive energy to those around you.",
  
  // Default analysis for mixed tastes
  eclectic: "Your wonderfully diverse music taste reveals a multifaceted personality that defies simple categorization. You're likely curious, open-minded, and bring a unique perspective to everything you do."
};

export const generateAnalysisFromTracks = (tracks) => {
  // Count genres/styles to determine the predominant type
  let hasRnB = false;
  let hasKpop = false;
  let hasClassical = false;
  let hasIndie = false;
  let hasPop = false;
  
  // Simple keyword matching for demo purposes
  const allText = JSON.stringify(tracks).toLowerCase();
  
  if (allText.includes('sza') || allText.includes('drake') || allText.includes('partynextdoor')) {
    hasRnB = true;
  }
  
  if (allText.includes('newjeans') || allText.includes('rosé') || allText.includes('korean')) {
    hasKpop = true;
  }
  
  if (allText.includes('piano') || allText.includes('classical') || allText.includes('mariage')) {
    hasClassical = true;
  }
  
  if (allText.includes('chappell') || allText.includes('mina okabe') || allText.includes('indie')) {
    hasIndie = true;
  }
  
  if (allText.includes('selena gomez') || allText.includes('pop')) {
    hasPop = true;
  }
  
  // Determine which analysis to use based on the predominant style
  if (hasRnB) return analyses.rnb;
  if (hasKpop) return analyses.kpop;
  if (hasClassical) return analyses.classical;
  if (hasIndie) return analyses.indie;
  if (hasPop) return analyses.pop;
  
  // Default to eclectic if no clear pattern or multiple styles
  return analyses.eclectic;
};

export default generateAnalysisFromTracks;