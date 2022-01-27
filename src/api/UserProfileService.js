import { db } from '@/firestore';

export default {
  collection: db.collection('user_profile'),
  async getUserProfile(userId) {
    const profile = await this.collection.doc(userId).get();
    const {default_portfolio: defaulPortfolioRef} = profile.data();
    const default_portfolio = defaulPortfolioRef.id;
    return {
        id: profile.id,
        ref: profile.ref,
        default_portfolio,
      };
  },
};
