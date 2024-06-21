import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import _ from 'lodash';
import {
  BungieMembershipType,
  DestinyComponentType,
  getProfile,
  searchDestinyPlayerByBungieName,
} from 'bungie-api-ts/destiny2';
import { $http } from '../lib/destinyApiHttp';

export const playerKeys = {
  all: () => ['player'],

  search: (search: string) => [playerKeys.all(), 'search', search],
  byId: (id: string, membershipType: BungieMembershipType) => [
    playerKeys.all(),
    'id',
    id,
    membershipType,
  ],
};

export function useSearchPlayer({ search }: { search: string }) {
  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce<string | undefined>(search, 500);

  const hasPreexistingRes = !_.isNil(
    queryClient.getQueryData(playerKeys.search(search ?? ''))
  );

  const getBungieId = () => {
    const [name, code] = search.split('#');
    return { name, code: parseInt(code ?? '0000') };
  };

  return useQuery({
    queryKey: playerKeys.search(
      (hasPreexistingRes ? search : debouncedSearchTerm) ?? ''
    ),
    queryFn: async () => {
      const { name: displayName, code: displayNameCode } = getBungieId();

      const res = await searchDestinyPlayerByBungieName(
        $http,
        {
          membershipType: BungieMembershipType.All,
        },
        {
          displayName,
          displayNameCode,
        }
      );

      return res;
    },
    enabled: Boolean(debouncedSearchTerm?.length),
  });
}

export function useProfile({
  destinyMembershipId,
  membershipType,
  components = [DestinyComponentType.Profiles, DestinyComponentType.Characters],
}: {
  destinyMembershipId: string;
  membershipType: BungieMembershipType;
  components?: DestinyComponentType[];
}) {
  return useQuery({
    queryKey: playerKeys.byId(destinyMembershipId, membershipType),
    queryFn: async () => {
      const res = await getProfile($http, {
        destinyMembershipId,
        membershipType,
        components,
      });

      return res;
    },
  });
}
