import queryString from 'query-string';

export const getCurrentTransaction = (transactions, queryParams) => {
  const transactionId = queryString.parse(queryParams).id;

  const currentTransaction = transactions.find(
    transaction => transaction.id.uuid === transactionId
  );

  return currentTransaction;
};
