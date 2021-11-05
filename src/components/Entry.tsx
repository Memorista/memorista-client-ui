import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Badge,
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  Tag,
  TagLabel,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import md5 from 'blueimp-md5';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';
import Identicon from 'identicon.js';
import { ReactElement, useMemo, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Entry as EntryModel, NewEntry } from '../models/entry';
import { LineBreakText } from './LineBreakText';

interface Props {
  entry: EntryModel;
  submittedEntryIds: Array<EntryModel['id']>;
  onUpdate: (updates: Partial<NewEntry>) => void;
}

export const Entry: VFC<Props> = ({ entry, submittedEntryIds, onUpdate }) => {
  const { t } = useTranslation();
  const date = useMemo(() => fromUnixTime(entry.creationTimestamp), [entry.creationTimestamp]);
  const [updatedAuthor, setUpdatedAuthor] = useState(entry.author);
  const [updatedText, setUpdatedText] = useState(entry.text);
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = useMemo(() => submittedEntryIds.includes(entry.id), [submittedEntryIds]);

  const avatarData = useMemo(
    () =>
      new Identicon(md5(entry.author), {
        size: 32,
        margin: 0.25,
        format: 'svg',
      }).toString(),
    [entry.author]
  );

  const handleUpdate = () => {
    const updates: Partial<NewEntry> = {};
    if (entry.author !== updatedAuthor) updates.author = updatedAuthor;
    if (entry.text !== updatedText) updates.text = updatedText;
    if (Object.keys(updates).length === 0) return handleCancelEdit();
    onUpdate(updates);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setUpdatedAuthor(entry.author);
    setUpdatedText(entry.text);
    setIsEditing(false);
  };

  return (
    <Flex width="100%">
      <Avatar src={`data:image/svg+xml;base64,${avatarData}`} />
      <Box ml="3" flex="1">
        <Text fontWeight="bold" display="flex" mb="1" alignItems="center">
          {isEditing ? (
            <Input
              maxWidth="200px"
              value={updatedAuthor}
              onChange={(e) => setUpdatedAuthor(e.target.value)}
              isInvalid={!updatedAuthor}
            />
          ) : (
            entry.author
          )}
          <Tooltip label={formatDistanceToNow(date, { addSuffix: true })}>
            <Tag size="sm" mx="1" verticalAlign="middle">
              <TagLabel>{format(date, 'dd.MM.yyyy - HH:mm')}</TagLabel>
            </Tag>
          </Tooltip>
          {isAuthor && (
            <Badge ml="1" colorScheme="green">
              {t('You')}
            </Badge>
          )}
          {isAuthor &&
            (isEditing ? (
              <ButtonGroup size="xs" display="inline-flex" ml="2">
                <IconButton
                  icon={(<CheckIcon />) as ReactElement}
                  aria-label={t('Save')}
                  onClick={handleUpdate}
                  disabled={!updatedAuthor || !updatedText}
                />
                <IconButton
                  icon={(<CloseIcon />) as ReactElement}
                  aria-label={t('Cancel')}
                  onClick={handleCancelEdit}
                />
              </ButtonGroup>
            ) : (
              <Flex display="inline-flex" ml="2">
                <IconButton
                  size="xs"
                  icon={(<EditIcon />) as ReactElement}
                  aria-label={t('Edit')}
                  onClick={() => setIsEditing(true)}
                />
              </Flex>
            ))}
        </Text>
        <Text fontSize="sm">
          {isEditing ? (
            <Textarea
              maxWidth="300px"
              value={updatedText}
              onChange={(e) => setUpdatedText(e.target.value)}
              isInvalid={!updatedText}
            />
          ) : (
            <LineBreakText>{entry.text}</LineBreakText>
          )}
        </Text>
      </Box>
    </Flex>
  );
};
