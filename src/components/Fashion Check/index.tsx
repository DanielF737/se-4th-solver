import { Box, Card, Input, Typography } from '@mui/joy';
import { useProfile, useSearchPlayer } from '../../state/player';
import { BungieApiImage } from '../../lib/bungieImage';
import { BungieMembershipType } from 'bungie-api-ts/common';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useManifestByTable } from '../../state/manifest';

export function FashionCheck() {
  const [search, setSearch] = useQueryParam(
    'search',
    withDefault(StringParam, '')
  );

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="0.25rem"
    >
      <Typography level="h1">{'Fashion Check'}</Typography>
      <BungieNameSearch search={search} setSearch={setSearch} />
      <ResultCard search={search} />
      {/* <ManifestCard /> */}
    </Box>
  );
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
      <Input value={search} onChange={(e) => setSearch(e.target.value)} />
    </Box>
  );
}

function ResultCard({ search }: { search: string }) {
  const res = useSearchPlayer({ search }).data;

  const user = res?.Response?.[0];

  if (!user) return <Card>{'user not found'}</Card>;

  const { membershipId, membershipType } = user;

  return (
    <Card>
      <ProfileCard id={membershipId} membershipType={membershipType} />
    </Card>
  );
}

function ProfileCard({
  id,
  membershipType,
}: {
  id: string;
  membershipType: BungieMembershipType;
}) {
  const profileQuery = useProfile({ destinyMembershipId: id, membershipType });
  const manifestQuery = useManifestByTable('DestinyClassDefinition');

  const manifest = manifestQuery.data;
  const data = profileQuery.data?.Response;

  if (!data || !manifest) return null;

  const { profile, characters } = data;

  const profileData = profile?.data;
  const characterData = characters?.data;

  if (!profileData || !characterData) return null;

  const {
    userInfo: { bungieGlobalDisplayName, bungieGlobalDisplayNameCode },
  } = profileData;

  const characterList = Object.values(characterData ?? {});

  const charactersByLastPlayed = characterList.sort(
    (a, b) =>
      new Date(b.dateLastPlayed).getTime() -
      new Date(a.dateLastPlayed).getTime()
  );

  const lastPlaid = charactersByLastPlayed[0];

  const { emblemBackgroundPath, classHash } = lastPlaid;

  const val = manifest[classHash]?.displayProperties?.name;

  return (
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
          {`${bungieGlobalDisplayName}#${bungieGlobalDisplayNameCode}`}
        </Typography>
        <Typography
          level="body-md"
          sx={{
            textShadow: '1px 1px #000000',
          }}
        >
          {JSON.stringify(val)}
        </Typography>
      </Box>
    </Box>
  );
}
