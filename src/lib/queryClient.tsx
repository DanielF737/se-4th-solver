import { QueryCache, QueryClient } from '@tanstack/react-query';
// import { queryErrorHandler } from '../state/queryErrorHandler';

// Create a react query client

export const queryClient = new QueryClient({
  // queryCache: new QueryCache({ onError: queryErrorHandler }),
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      // dont automatically refetch data when you focus on the window
      // this coudl be renabled in the future, does make debugging
      // a pain because when you switch from the console to the website
      // you end up firing all the refetch requests
      refetchOnWindowFocus: false,
      // set the default stale time to infinity
      staleTime: Infinity,
    },
    mutations: {
      // Can still be overwritten in individual mutations.
      // retry: queryRetryHandler,
      // Handle all mutation errors, can still be overwritten in individual
      // mutations
      // onError: queryErrorHandler,
    },
  },
});
