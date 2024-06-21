import {
  Box,
  Button,
  Card,
  CircularProgress,
  Input,
  Typography,
} from '@mui/joy';
import {
  playerKeys,
  useLinkedProfiles,
  useProfileByComponent,
  useSearchPlayer,
} from '../../state/player';
import { BungieApiImage } from '../../lib/bungieImage';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useManifestByTable } from '../../state/manifest';
import {
  DestinyCharacterComponent,
  DestinyComponentType,
  DestinyProfileComponent,
  DestinyProfileTransitoryComponent,
  DestinyProfileTransitoryPartyMember,
} from 'bungie-api-ts/destiny2';
import { useQueryClient } from '@tanstack/react-query';

export function FashionWidget() {
  const [search, setSearch] = useQueryParam(
    'search',
    withDefault(StringParam, '')
  );
  const queryClient = useQueryClient();
  const { profile, character, isLoading, isFetching, profileTransitoryData } =
    useSearchPlayerAndGetFireteam({
      search,
    });

  const handleRefresh = () => {
    console.log('invalidate queries');
    return queryClient.invalidateQueries({
      queryKey: playerKeys.all(),
    });
  };

  return (
    <Card>
      <Box display="flex" gap="0.25rem" alignItems="center">
        <Typography whiteSpace="nowrap">Bungie Id:</Typography>
        <BungieNameSearch search={search} setSearch={setSearch} />
      </Box>
      <Box display="flex" gap="0.25rem" alignItems="center">
        <Typography whiteSpace="nowrap">Selected Player:</Typography>
        <ProfileCard profile={profile} character={character} />
      </Box>
      <Box width="100%" display="flex" justifyContent="center">
        <ResultCard
          profile={profile}
          character={character}
          profileTransitoryData={profileTransitoryData}
          isLoading={isLoading}
        />
      </Box>
      {profile && character ? (
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            onClick={handleRefresh}
            disabled={isFetching}
            sx={{ maxWidth: '100px' }}
            endDecorator={
              isFetching ? <CircularProgress sx={{ fontSize: '1rem' }} /> : null
            }
          >
            Refresh
          </Button>
        </Box>
      ) : null}
    </Card>
  );
}

function useSearchPlayerAndGetFireteam({ search }: { search: string }) {
  const searchQuery = useSearchPlayer({ search });

  const { membershipId, membershipType } = searchQuery.data?.[0] ?? {};

  const profileQuery = useProfileByComponent({
    destinyMembershipId: membershipId || null,
    membershipType: membershipType || null,
    components: [
      DestinyComponentType.Profiles,
      DestinyComponentType.Characters,
      DestinyComponentType.Transitory,
      DestinyComponentType.CharacterEquipment,
    ],
  });

  const isLoading = profileQuery.isLoading || searchQuery.isLoading;
  const isFetching = profileQuery.isFetching || searchQuery.isFetching;

  const data = profileQuery.data;

  if (!data) return { profile: undefined, character: undefined, isLoading };

  const {
    profile: profileResponse,
    characters,
    profileTransitoryData: profileTransitoryDataResponse,
  } = data;

  const profile = profileResponse?.data;
  const profileTransitoryData = profileTransitoryDataResponse?.data;

  const characterData = characters?.data;
  const characterList = Object.values(characterData ?? {});
  const charactersByLastPlayed = characterList.sort(
    (a, b) =>
      new Date(b.dateLastPlayed).getTime() -
      new Date(a.dateLastPlayed).getTime()
  );
  const lastPlaid = charactersByLastPlayed[0];

  return {
    profile,
    profileTransitoryData,
    character: lastPlaid,
    isLoading,
    isFetching,
  };
}

function BungieNameSearch({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  return (
    <Box width="100%">
      <Input
        value={search}
        placeholder="JohnBungie#0000"
        onChange={(e) => setSearch(e.target.value)}
      />
    </Box>
  );
}

function ResultCard({
  profile,
  character,
  profileTransitoryData,
  isLoading = false,
}: {
  profile: DestinyProfileComponent | undefined;
  character: DestinyCharacterComponent | undefined;
  profileTransitoryData: DestinyProfileTransitoryComponent | undefined;
  isLoading?: boolean;
}) {
  if (!profile || !character) {
    if (isLoading) {
      return <CircularProgress />;
    }
    return null;
  }

  return <CurrentFireteam profileTransitoryData={profileTransitoryData} />;
}

function ProfileCard({
  profile,
  character,
}: {
  profile: DestinyProfileComponent | undefined;
  character: DestinyCharacterComponent | undefined;
}) {
  const manifestQuery = useManifestByTable('DestinyClassDefinition');

  if (!profile || !character) return null;

  const {
    userInfo: { bungieGlobalDisplayName },
  } = profile;
  const { emblemBackgroundPath, classHash } = character;

  const className = manifestQuery.data?.[classHash]?.displayProperties?.name;

  return (
    <>
      <Box position="relative" display="inline-block">
        <BungieApiImage path={emblemBackgroundPath} height={50} />
        <Box
          display="flex"
          height="100%"
          flexDirection="column"
          position="absolute"
          left="45px"
          top={0}
        >
          <Typography
            level="body-lg"
            sx={{
              textShadow: '1px 1px #000000',
            }}
          >
            {bungieGlobalDisplayName}
          </Typography>
          <Typography
            level="body-md"
            sx={{
              textShadow: '1px 1px #000000',
            }}
          >
            {className}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

function CurrentFireteam({
  profileTransitoryData,
}: {
  profileTransitoryData: DestinyProfileTransitoryComponent | undefined;
}) {
  const fireteamMembers = profileTransitoryData?.partyMembers ?? [];
  return (
    <Box width="100%">
      <Typography>Current Fireteam:</Typography>
      <Box
        display="flex"
        gap="1rem"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
      >
        {fireteamMembers.length ? (
          fireteamMembers.map((member) => (
            <Card key={member.membershipId}>
              <Box
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                minWidth="200px"
                minHeight="200px"
              >
                <FireteamMember member={member} />
              </Box>
            </Card>
          ))
        ) : (
          <Typography>No fireteam found</Typography>
        )}
      </Box>
    </Box>
  );
}

function FireteamMember({
  member,
}: {
  member: DestinyProfileTransitoryPartyMember;
}) {
  const HELMET_HASH = 3448274439;
  const CLASS_ITEM_HASH = 1585787867;
  const GHOST_HASH = 4023194814;

  const linkedProfilesQuery = useLinkedProfiles({
    destinyMembershipId: member.membershipId,
  });
  const manifestQuery = useManifestByTable('DestinyInventoryItemDefinition');

  const { membershipId } = member;
  const membershipType = linkedProfilesQuery.data?.profiles[0].membershipType;

  const profileQuery = useProfileByComponent({
    destinyMembershipId: membershipId || null,
    membershipType: membershipType || null,
    components: [
      DestinyComponentType.Profiles,
      DestinyComponentType.Characters,
      DestinyComponentType.Transitory,
      DestinyComponentType.CharacterEquipment,
    ],
  });

  const profileData = profileQuery.data;

  const isLoading =
    manifestQuery.isLoading ||
    profileQuery.isLoading ||
    linkedProfilesQuery.isLoading;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!profileData) {
    return <Typography>No profile found</Typography>;
  }

  const {
    profile: profileResponse,
    characters,
    characterEquipment,
  } = profileData;

  const profile = profileResponse.data;

  if (!profile) {
    return <Typography>No profile data found</Typography>;
  }

  const characterData = characters?.data;
  const characterList = Object.values(characterData ?? {});
  const charactersByLastPlayed = characterList.sort(
    (a, b) =>
      new Date(b.dateLastPlayed).getTime() -
      new Date(a.dateLastPlayed).getTime()
  );
  const lastPlaid = charactersByLastPlayed[0];
  const lastPlaidId = lastPlaid.characterId;

  const lastPlaidItems = characterEquipment?.data?.[lastPlaidId].items ?? [];
  const lastPlaidHelmetItem = lastPlaidItems.find(
    (item) => item.bucketHash === HELMET_HASH
  );
  const lastPlaidClassItem = lastPlaidItems.find(
    (item) => item.bucketHash === CLASS_ITEM_HASH
  );
  const lastPlaidGhostItem = lastPlaidItems.find(
    (item) => item.bucketHash === GHOST_HASH
  );

  const lastPlaidHelmetHash =
    lastPlaidHelmetItem?.overrideStyleItemHash ?? lastPlaidHelmetItem?.itemHash;
  const lastPlaidClassHash =
    lastPlaidClassItem?.overrideStyleItemHash ?? lastPlaidClassItem?.itemHash;
  const lastPlaidGhostHash =
    lastPlaidGhostItem?.overrideStyleItemHash ?? lastPlaidGhostItem?.itemHash;

  const manifest = manifestQuery.data;

  if (!manifest) return <Typography>No manifest</Typography>;

  if (!lastPlaidHelmetHash || !lastPlaidGhostHash || !lastPlaidClassHash)
    return <Typography>Issue getting inventory</Typography>;

  const lastPlaidHelmet = manifest[lastPlaidHelmetHash];
  const lastPlaidGhost = manifest[lastPlaidGhostHash];
  const lastPlaidClass = manifest[lastPlaidClassHash];

  if (!lastPlaidHelmet || !lastPlaidGhost || !lastPlaidClass)
    return <Typography>Issue getting inventory</Typography>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="0.25rem"
      alignItems="center"
    >
      <ProfileCard profile={profile} character={lastPlaid} />
      <Box display="flex" gap="0.25rem">
        <BungieApiImage
          path={lastPlaidHelmet.displayProperties.icon}
          height={100}
        />
        <BungieApiImage
          path={lastPlaidClass.displayProperties.icon}
          height={100}
        />
      </Box>
      <BungieApiImage
        path={lastPlaidGhost.displayProperties.icon}
        height={100}
      />
    </Box>
  );
}
