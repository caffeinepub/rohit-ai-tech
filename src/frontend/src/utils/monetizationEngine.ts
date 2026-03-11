export interface EarningsResult {
  creatorEarnings: number;
  adminEarnings: number;
  isEligible: boolean;
  splitLabel: string;
}

export function getNextPayoutDate(): string {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  // If today is past the 21st, next payout is the 21st of next month
  if (now.getDate() >= 21) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  const payout = new Date(year, month, 21);
  return payout.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function calculateEarnings(
  realViews: number,
  followers: number,
): EarningsResult {
  const RATE = 0.001; // ₹0.001 per real view
  const totalRevenue = realViews * RATE;

  if (followers >= 1_000_000) {
    return {
      creatorEarnings: totalRevenue * 0.75,
      adminEarnings: totalRevenue * 0.25,
      isEligible: true,
      splitLabel: "75% Creator / 25% Admin (Big Creator)",
    };
  }

  if (followers >= 20_000 && realViews >= 10_000_000) {
    return {
      creatorEarnings: totalRevenue * 0.5,
      adminEarnings: totalRevenue * 0.5,
      isEligible: true,
      splitLabel: "50% Creator / 50% Admin",
    };
  }

  return {
    creatorEarnings: 0,
    adminEarnings: 0,
    isEligible: false,
    splitLabel: "Not eligible (need 20K followers + 10M views)",
  };
}

export function getQualityScore(
  likes: number,
  comments: number,
  shares: number,
  ageHours: number,
): number {
  return (likes + comments * 2 + shares * 3) / Math.max(ageHours, 1);
}
