import { UseQueryResult, useQuery } from '@tanstack/react-query';
import {
  AllDestinyManifestComponents,
  getDestinyManifest,
  getDestinyManifestSlice,
} from 'bungie-api-ts/destiny2';
import { $http, $manifestHttp } from '../lib/destinyApiHttp';

const manifestKeys = {
  all: () => ['manifest'],

  version: () => [manifestKeys.all(), 'version'],
  byTable: (tableName: keyof AllDestinyManifestComponents) => [
    manifestKeys.all(),
    'table',
    tableName,
  ],
};

function useManifestVersion() {
  return useQuery({
    queryKey: manifestKeys.version(),
    queryFn: async () => {
      const res = await getDestinyManifest($http);
      return res;
    },
  });
}

export function useManifestByTable<
  T extends keyof AllDestinyManifestComponents,
>(tableName: T): UseQueryResult<AllDestinyManifestComponents[T]> {
  const destinyManifest = useManifestVersion().data?.Response;

  return useQuery({
    queryKey: manifestKeys.byTable(tableName),
    queryFn: async () => {
      if (!destinyManifest) {
        // This should be unreachable as this funciton wont run if we dont have the manifest
        throw new Error('Destiny Manifest not available');
      }

      const res = await getDestinyManifestSlice($manifestHttp, {
        destinyManifest,
        tableNames: [tableName],
        language: 'en',
      });
      const data: AllDestinyManifestComponents[typeof tableName] =
        res[tableName];

      return data;
    },
    enabled: !!destinyManifest,
  });
}
