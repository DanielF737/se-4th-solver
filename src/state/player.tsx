import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { isNil } from 'lodash';
import {
  BungieMembershipType,
  DestinyComponentType,
  getLinkedProfiles,
  getProfile,
  searchDestinyPlayerByBungieName,
} from 'bungie-api-ts/destiny2';
import { $http } from '../lib/destinyApiHttp';

export const playerKeys = {
  all: () => ['player'],

  byIdbyPlatformbyComponent: (
    id: string,
    membershipType: BungieMembershipType,
    components: DestinyComponentType[]
  ) => [
    ...playerKeys.all(),
    'id',
    id,
    membershipType,
    'components',
    components,
  ],

  // These never go stale
  infinite: () => ['infinite'],
  search: (search: string) => [...playerKeys.infinite(), 'search', search],
  linkedProfiles: (id: string) => [
    ...playerKeys.infinite(),
    'linkedProfiles',
    id,
  ],
};

export function useSearchPlayer({ search }: { search: string }) {
  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce<string | undefined>(search, 500);

  const hasPreexistingRes = !isNil(
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
      console.log(`fetching player search ${debouncedSearchTerm}`);
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

      return res.Response;
    },
    enabled: Boolean(debouncedSearchTerm?.length),
  });
}

export function useProfileByComponent({
  destinyMembershipId,
  membershipType,
  components,
}: {
  destinyMembershipId: string | null;
  membershipType: BungieMembershipType | null;
  components: DestinyComponentType[];
}) {
  return useQuery({
    queryKey: playerKeys.byIdbyPlatformbyComponent(
      destinyMembershipId ?? '',
      membershipType ?? BungieMembershipType.All,
      components
    ),
    queryFn: async () => {
      if (!destinyMembershipId || !membershipType) {
        throw new Error('Invalid destinyMembershipId or membershipType');
      }

      const res = await getProfile($http, {
        destinyMembershipId,
        membershipType,
        components,
      });

      return res.Response;
    },
    enabled: Boolean(destinyMembershipId && membershipType),
  });
}

export function useLinkedProfiles({
  destinyMembershipId,
}: {
  destinyMembershipId: string | null;
}) {
  return useQuery({
    queryKey: playerKeys.linkedProfiles(destinyMembershipId ?? ''),
    queryFn: async () => {
      const res = await getLinkedProfiles($http, {
        getAllMemberships: true,
        membershipId: destinyMembershipId ?? '',
        membershipType: BungieMembershipType.All,
      });

      return res.Response;
    },
    enabled: Boolean(destinyMembershipId),
  });
}
