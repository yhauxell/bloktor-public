import { db, fn, firebase } from '@/firestore';
import documentTransformer from './transformers/Document';

export default {
  collection: db.collection('project'),
  api: {
    hello: fn.httpsCallable('hello'),
    search_project: fn.httpsCallable('search_project'),
  },
  async count() {
    const documents = await this.collection.get();
    return documents.size;
  },
  async search(term) {
    const response = await this.api.search_project({ term });
    return response.data;
  },
  async projects(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    const replica = [...ids];
    const size = 10;
    const chunks = new Array(Math.ceil(replica.length / size))
      .fill()
      .map(() => replica.splice(0, size));

    let projects = [];
    for (let index = 0; index < chunks.length; index++) {
      const documents = await this.collection
        .where(firebase.firestore.FieldPath.documentId(), 'in', chunks[index])
        .get();

      projects = [...projects, ...(documentTransformer(documents))];
    }

    return projects;
  },
};
