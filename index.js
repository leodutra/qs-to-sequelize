module.exports = (opts = {}) => (qs) => {
  const query = {};

  if (qs.per_page) query.limit = qs.per_page;
  if (!query.limit) query.limit = opts.default_per_page;
  if (query.limit > opts.max_per_page) query.limit = opts.max_per_page;

  if (qs.page) {
    if (!query.limit) throw 'Cannot calculate page without per_page';
    query.offset = query.limit * (qs.page - 1);
  }

  if (qs.sort) {
    if (qs.sort.indexOf(',') > -1) throw 'Cannot sort by multiple properties';
    if (qs.sort.charAt(0) === '-') {
      query.order = [[qs.sort.slice(1), 'DESC']];
    } else {
      query.order = [[qs.sort, 'ASC']];
    }
  }

  query.where = Object.assign({}, qs.filter);

  if (qs.created_since || qs.created_before) {
    query.where.created_at = {};

    if (qs.created_since) {
      query.where.created_at.$gt = qs.created_since;
    }

    if (qs.created_before) {
      query.where.created_at.$lt = qs.created_before;
    }
  }

  if (qs.updated_since || qs.updated_before) {
    query.where.updated_at = {};

    if (qs.updated_since) {
      query.where.updated_at.$gt = qs.updated_since;
    }

    if (qs.updated_before) {
      query.where.updated_at.$lt = qs.updated_before;
    }
  }

  if (query.where === {}) delete query.where;

  return query;
};
