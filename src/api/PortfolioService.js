import { db, firebase } from '@/firestore';
import documentTransformer from './transformers/Document';

export default {
  collection: db.collection('portfolio'),
  async all() {
    const snapshot = await this.collection.get();
    return documentTransformer(snapshot);
  },
  async allByOwner(ownerId) {
    const snapshot = await this.collection.where('owner', '=', ownerId);
    return documentTransformer(snapshot);
  },
  async portfolio(id, onUpdate) {
    if (onUpdate) {
      this.collection.doc(id).onSnapshot((portfolio) => {
        onUpdate({ id: portfolio.id, ...portfolio.data() });
      });
      return;
    } else {
      const portfolio = await this.collection.doc(id).get();
      return { id: portfolio.id, ...portfolio.data() };
    }
  },
  add(portfolio) {
    return this.collection.add(portfolio);
  },
  addProject(portfolio, project) {
    return this.collection.doc(portfolio).update({
      [`projects.${project}`]: {transactions: []}
    });
  },
  addTransactionToProject(portfolio, project, transaction) {
    return this.collection.doc(portfolio).update({
      [`projects.${project}.transactions`]: firebase.firestore.FieldValue.arrayUnion(transaction) 
    })
  }
};
