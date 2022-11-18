import queryString from 'query-string';

export const getCurrentTransaction = (transactions, queryParams) => {
  const transactionId = queryString.parse(queryParams).id;

  let currentTransaction = null;

  transactions.forEach(transaction => {
    if (transaction.id.uuid === transactionId) {
      currentTransaction = transaction;
    }
  });

  return currentTransaction;
};
