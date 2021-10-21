import {
  Avatar,
  Badge,
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useEditableControls,
  ButtonGroup,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react';
import md5 from 'blueimp-md5';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';
import Identicon from 'identicon.js';
import { ReactElement, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Entry as EntryModel, NewEntry } from '../models/entry';
import { LineBreakText } from './LineBreakText';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

interface EntryProps {
  entry: EntryModel;
  submittedEntryIds: Array<EntryModel['id']>;
  onUpdate: (field: keyof NewEntry, value: string) => void;
}

export const Entry: VFC<EntryProps> = ({ entry, submittedEntryIds, onUpdate }) => {
  const { t } = useTranslation();
  const date = fromUnixTime(entry.creationTimestamp);

  const avatarData = new Identicon(md5(entry.author), {
    size: 32,
    margin: 0.25,
    format: 'svg',
  }).toString();

  const isAuthor = submittedEntryIds.includes(entry.id);

  const onUpdateField = (field: keyof NewEntry) => (value: string) => onUpdate(field, value);

  return (
    <Editable
      display="flex"
      value={entry.text}
      onSubmit={onUpdateField('text')}
      isDisabled={!isAuthor}
      isPreviewFocusable={false}
      submitOnBlur={false}
    >
      <Avatar src={`data:image/svg+xml;base64,${avatarData}`} />
      <Box ml="3">
        <Text fontWeight="bold" display="flex" mb="1">
          {entry.author}
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
          {isAuthor && <EditableControls />}
        </Text>
        <Text fontSize="sm">
          {isAuthor ? (
            <>
              <EditablePreview />
              <EditableInput />
            </>
          ) : (
            <LineBreakText>{entry.text}</LineBreakText>
          )}
        </Text>
      </Box>
    </Editable>
  );
};

const EditableControls: VFC = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

  return isEditing ? (
    <ButtonGroup size="xs" display="inline-flex" ml="2">
      <IconButton icon={(<CheckIcon />) as ReactElement} {...(getSubmitButtonProps() as IconButtonProps)} />
      <IconButton icon={(<CloseIcon />) as ReactElement} {...(getCancelButtonProps() as IconButtonProps)} />
    </ButtonGroup>
  ) : (
    <Flex display="inline-flex" ml="2">
      <IconButton size="xs" icon={(<EditIcon />) as ReactElement} {...(getEditButtonProps() as IconButtonProps)} />
    </Flex>
  );
};
