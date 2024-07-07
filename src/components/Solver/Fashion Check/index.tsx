import {
  Box,
  Button,
  Card,
  CircularProgress,
  Input,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Table,
  Switch,
} from '@mui/joy';
import {
  playerKeys,
  useLinkedProfiles,
  useProfileByComponent,
  useSearchPlayer,
} from '../../../state/player';
import { BungieApiImage } from '../../../lib/bungieImage';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useManifestByTable } from '../../../state/manifest';
import {
  DestinyCharacterComponent,
  DestinyComponentType,
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  DestinyItemSubType,
  DestinyProfileComponent,
  DestinyProfileTransitoryComponent,
  DestinyProfileTransitoryPartyMember,
  TierType,
} from 'bungie-api-ts/destiny2';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const TITAN_HASH = 3655393761;
const HUNTER_HASH = 671679327;
const WARLOCK_HASH = 2271682572;

const HELMET_HASH = 3448274439;
const ARM_HASH = 3551918588;
const CHEST_HASH = 14239492;
const LEG_HASH = 20886954;
const CLASS_ITEM_HASH = 1585787867;
const GHOST_HASH = 4023194814;

export function FashionWidget() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useQueryParam(
    'search',
    withDefault(StringParam, '')
  );

  const [config, setConfig] = useLocalStorage<FashionCheckConfig>(
    'fashion-check-config',
    {
      [WARLOCK_HASH]: {
        helmet: true,
        arms: false,
        chest: false,
        leg: false,
        classItem: true,
        exotic: true,
      },
      [TITAN_HASH]: {
        helmet: true,
        arms: false,
        chest: false,
        leg: false,
        classItem: true,
        exotic: true,
      },
      [HUNTER_HASH]: {
        helmet: true,
        arms: false,
        chest: false,
        leg: false,
        classItem: true,
        exotic: true,
      },
    }
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
    <>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        setConfig={setConfig}
      />
      <Card sx={{ px: 0, gap: '0.5rem' }}>
        <Box display="flex" flexDirection="column" gap="0.5rem" px="1rem">
          <Box display="flex" gap="0.25rem" alignItems="center">
            <Typography whiteSpace="nowrap">Bungie Id:</Typography>
            <BungieNameSearch search={search} setSearch={setSearch} />
          </Box>
          <Box display="flex" gap="0.25rem" alignItems="center">
            <Typography whiteSpace="nowrap">Selected Player:</Typography>
            <ProfileCard profile={profile} character={character} />
          </Box>
        </Box>
        <Box width="100%" display="flex" justifyContent="center">
          <ResultCard
            profile={profile}
            character={character}
            profileTransitoryData={profileTransitoryData}
            isLoading={isLoading}
            config={config}
          />
        </Box>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          gap="1rem"
          px="1rem"
        >
          <Button onClick={() => setSettingsOpen(true)}>Settings</Button>
          {profile && character ? (
            <Button
              onClick={handleRefresh}
              disabled={isFetching}
              endDecorator={
                isFetching ? (
                  <CircularProgress sx={{ fontSize: '1rem' }} />
                ) : null
              }
            >
              Refresh
            </Button>
          ) : null}
        </Box>
      </Card>
    </>
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
  const lastPlayed = charactersByLastPlayed[0];

  return {
    profile,
    profileTransitoryData,
    character: lastPlayed,
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
  config,
}: {
  profile: DestinyProfileComponent | undefined;
  character: DestinyCharacterComponent | undefined;
  profileTransitoryData: DestinyProfileTransitoryComponent | undefined;
  isLoading?: boolean;
  config: FashionCheckConfig;
}) {
  if (!profile || !character) {
    if (isLoading) {
      return <CircularProgress />;
    }
    return null;
  }

  return (
    <CurrentFireteam
      profileTransitoryData={profileTransitoryData}
      config={config}
    />
  );
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
  config,
}: {
  profileTransitoryData: DestinyProfileTransitoryComponent | undefined;
  config: FashionCheckConfig;
}) {
  const fireteamMembers = profileTransitoryData?.partyMembers ?? [];
  return (
    <Box maxWidth="1100px">
      <Typography sx={{ ml: '1rem' }}>Current Fireteam:</Typography>
      <Box
        display="flex"
        gap="0.25rem"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        px="0.125rem"
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
                <FireteamMember member={member} config={config} />
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

function getItemByHash({
  hash,
  lastPlayedItems,
  manifest,
}: {
  hash: number;
  lastPlayedItems: DestinyItemComponent[];
  manifest: {
    [key: number]: DestinyInventoryItemDefinition;
  };
}): DestinyInventoryItemDefinition | null {
  try {
    const foundItem = lastPlayedItems.find((item) => item.bucketHash === hash);
    const styleItem = foundItem?.overrideStyleItemHash ?? foundItem?.itemHash;
    const enrichedItem = manifest[styleItem as keyof typeof manifest];
    return enrichedItem;
  } catch (e) {
    return null;
  }
}

function isNonNullItem(
  items: (DestinyInventoryItemDefinition | null)[]
): items is DestinyInventoryItemDefinition[] {
  return items.every((item) => item !== null);
}

function FireteamMember({
  member,
  config,
}: {
  member: DestinyProfileTransitoryPartyMember;
  config: FashionCheckConfig;
}) {
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
  const lastPlayed = charactersByLastPlayed[0];
  const lastPlayedId = lastPlayed.characterId;
  const lastPlayedClass = lastPlayed.classHash;
  const lastPlayedItems = characterEquipment?.data?.[lastPlayedId].items ?? [];

  const manifest = manifestQuery.data;
  if (!manifest) return <Typography>No manifest found</Typography>;

  const items = [
    getItemByHash({ hash: HELMET_HASH, lastPlayedItems, manifest }),
    getItemByHash({ hash: ARM_HASH, lastPlayedItems, manifest }),
    getItemByHash({ hash: CHEST_HASH, lastPlayedItems, manifest }),
    getItemByHash({ hash: LEG_HASH, lastPlayedItems, manifest }),
    getItemByHash({ hash: CLASS_ITEM_HASH, lastPlayedItems, manifest }),
    getItemByHash({ hash: GHOST_HASH, lastPlayedItems, manifest }),
  ];

  if (!isNonNullItem(items)) {
    return <Typography>Issue getting inventory</Typography>;
  }

  const classConfig = config[lastPlayedClass];
  const [helmet, arms, chest, leg, classItem, ghost] = items;
  const itemRecord: Partial<
    Record<keyof FashionConfig, DestinyInventoryItemDefinition>
  > = {
    helmet,
    arms,
    chest,
    leg,
    classItem,
  };

  const isExoticVisible = classConfig.exotic;

  console.log({ itemRecord, exotic: DestinyItemSubType.Exotic });

  const visibleItems = Object.entries(itemRecord)
    .filter(
      ([key, value]) =>
        classConfig[key as keyof FashionConfig] ||
        (isExoticVisible && value.inventory?.tierType === TierType.Exotic)
    )
    .map(([_, value]) => value);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="0.25rem"
      alignItems="center"
      width="250px"
    >
      <ProfileCard profile={profile} character={lastPlayed} />
      <Box
        display="flex"
        gap="0.25rem"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
      >
        {visibleItems.map((item) => (
          <BungieApiImage
            key={item.displayProperties.icon}
            path={item.displayProperties.icon}
            height={100}
            alt={item.displayProperties.name}
          />
        ))}
        <BungieApiImage
          key={ghost.displayProperties.icon}
          path={ghost.displayProperties.icon}
          height={100}
          alt={ghost.displayProperties.name}
        />
      </Box>
    </Box>
  );
}

type FashionCheckConfig = {
  [key: number]: FashionConfig;
};

type FashionConfig = {
  helmet: boolean;
  arms: boolean;
  chest: boolean;
  leg: boolean;
  classItem: boolean;
  exotic: boolean;
};

function SettingsModal({
  open,
  onClose,
  config,
  setConfig,
}: {
  open: boolean;
  onClose: () => void;
  config: FashionCheckConfig;
  setConfig: (config: FashionCheckConfig) => void;
}) {
  const defaults: FashionConfig = {
    helmet: true,
    arms: false,
    chest: false,
    leg: false,
    classItem: true,
    exotic: true,
  };

  const manifestQuery = useManifestByTable('DestinyClassDefinition');
  const manifest = manifestQuery.data;

  const classes = [WARLOCK_HASH, TITAN_HASH, HUNTER_HASH];

  if (!manifest) return null;

  const handleChange = (classHash: number, key: string, checked: boolean) => {
    setConfig({
      ...config,
      [classHash]: { ...config[classHash], [key]: checked },
    });
  };

  const armorLang: Record<keyof FashionConfig, string> = {
    helmet: 'Helmet',
    arms: 'Arms',
    chest: 'Chest',
    leg: 'Leg',
    classItem: 'Class Item',
    exotic: 'Exotic',
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <ModalDialog maxWidth="sm" minWidth="sm">
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Fashion Settings
        </Typography>
        <Typography id="modal-desc" textColor="text.tertiary">
          Toggle which items are shown for which class
        </Typography>
        <Box>
          <Table>
            <thead>
              <tr>
                <th />
                {classes.map((classHash) => (
                  <th key={classHash}>
                    {manifest[classHash].displayProperties.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(defaults).map((key) => (
                <tr key={key}>
                  <th>{armorLang[key as keyof FashionConfig]}</th>
                  {classes.map((classHash) => (
                    <td key={classHash}>
                      <Switch
                        checked={config[classHash][key as keyof FashionConfig]}
                        onChange={(e) =>
                          handleChange(classHash, key, e.target.checked)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
