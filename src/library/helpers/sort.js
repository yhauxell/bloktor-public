export default function sort(data, field, order) {
  let sortable = Array.isArray(data) ? data : Object.values(data);

  return sortable.sort((a, b) => {
    if (order == 'desc') {
      return a[field] > b[field] ? -1 : 1;
    }

    return a[field] > b[field] ? 1 : -1;
  });
}
