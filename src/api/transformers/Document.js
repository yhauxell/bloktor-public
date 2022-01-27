const transformer = (snapshot) => {
  const documents = [];

  snapshot.forEach((document) => {
    documents.push({
      id: document.id,
      ref: document.ref,
      ...document.data(),
    });
  });

  return documents;
};

export default transformer;
