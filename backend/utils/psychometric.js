/**
 * Simple psychometric scoring:
 * - Input: answers array of numbers 1-5 for a small quiz
 * - Output: traits mapping like { analytical: 0.8, creative: 0.2, social: 0.1, practical: 0.5 }
 *
 * This is intentionally simple and serves as a placeholder.
 */

function score(answers = []) {
  // sample mapping of Qs to traits (for demo)
  // ensure answers length >= 6 for demo
  const a = answers;
  const analytical = (a[0]||3) * 1.2 + (a[2]||3) * 1.0;
  const creative = (a[1]||3) * 1.2 + (a[4]||3) * 0.8;
  const social = (a[3]||3) * 1.3;
  const practical = (a[5]||3) * 1.1;

  const total = analytical + creative + social + practical;
  return {
    analytical: +(analytical/total).toFixed(2),
    creative: +(creative/total).toFixed(2),
    social: +(social/total).toFixed(2),
    practical: +(practical/total).toFixed(2)
  };
}

module.exports = { score };
