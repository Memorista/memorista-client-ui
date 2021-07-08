import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Tag,
  TagLabel,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import md5 from 'blueimp-md5';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';
import { Field, FieldProps, Form, Formik } from 'formik';
import Identicon from 'identicon.js';
import { FunctionComponent } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { LineBreakText } from './components/LineBreakText';
import { SkeletonEntry } from './components/SkeletonEntry';
import { NewEntry } from './models/entry';
import { useEntries, useGuestbook } from './utils/api-hooks';
import useSpeedLimit from './utils/use-speed-limit';
import { useSubmittedEntriesStorage } from './utils/use-submitted-entries-storage';

type Props = {
  apiKey: string;
};

type FormValues = {
  name: string;
  author: string;
  text: string;
};

export const App: FunctionComponent<Props> = ({ apiKey }) => {
  const { t, i18n } = useTranslation();
  const { guestbook } = useGuestbook(apiKey);
  const { entries, createEntry, isLoading } = useEntries(guestbook?.id);
  const isMinTimeElapsed = useSpeedLimit(2);
  const { submittedEntryIds, hasSubmissionInCurrentSession, pushSubmittedEntryId } = useSubmittedEntriesStorage();
  const authorName = useMemo(() => localStorage.getItem('memorista:authorName') || '', []);

  useEffect(() => {
    if (!guestbook) {
      return;
    }

    i18n.changeLanguage(guestbook.languageTag);
  }, [guestbook]);

  const onSubmit = async (values: FormValues) => {
    const { author, text } = values as NewEntry;

    const isSpam = !!values.name || !isMinTimeElapsed;
    if (isSpam) {
      throw new Error('Possible spam bot detected. Form was not submitted.');
    }

    const createdEntry = await createEntry({ author, text });

    if (!createdEntry) {
      return;
    }

    localStorage.setItem('memorista:authorName', createdEntry.author);
    pushSubmittedEntryId(createdEntry.id);
  };

  if (!guestbook) {
    return null;
  }

  const initialValues: FormValues = { name: '', author: authorName, text: '' };

  return (
    <VStack alignItems="flex-start" spacing="4">
      <VStack alignItems="flex-start">
        <Heading>{guestbook.title}</Heading>
        <Text>{guestbook.description}</Text>
      </VStack>

      <Divider />

      <VStack alignItems="flex-start" width="100%">
        {!hasSubmissionInCurrentSession ? (
          <Formik
            initialValues={initialValues}
            validateOnMount={true}
            validate={(values) => {
              const errors: Partial<FormValues> = {};

              if (!values.author) {
                errors.author = t('Please enter your name.');
              }
              if (!values.text) {
                errors.text = t('Please enter your message.');
              }

              return errors;
            }}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, errors, touched, isValid }) => (
              <Form style={{ width: '100%' }}>
                <Field name="name">
                  {({ field }: FieldProps) => (
                    <FormControl isInvalid={!!(errors.name && touched.name)} style={{ display: 'none' }}>
                      <FormLabel htmlFor="name">
                        {t('Please leave this field blank as it is used for spam protection.')}
                      </FormLabel>
                      <Input {...field} id="name" />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="author">
                  {({ field }: FieldProps) => (
                    <FormControl isInvalid={!!(errors.author && touched.author)}>
                      <FormLabel htmlFor="author">{t('Author')}</FormLabel>
                      <Input {...field} id="author" placeholder={t('e.g. Jon Doe')} disabled={isLoading} />
                      <FormErrorMessage>{errors.author}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="text">
                  {({ field }: FieldProps) => (
                    <FormControl isInvalid={!!(errors.text && touched.text)}>
                      <FormLabel htmlFor="text">{t('Text')}</FormLabel>
                      <Textarea {...field} id="text" placeholder={t('Hi from Jon Doe')} disabled={isLoading} />
                      <FormErrorMessage>{errors.text}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button mt={4} colorScheme="teal" isLoading={isSubmitting} disabled={!isValid} type="submit">
                  {t('Submit')}
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <Alert status="success">
            <AlertIcon />
            {t('Your entry has been successfully saved.')}
          </Alert>
        )}
      </VStack>

      <Divider />

      <VStack alignItems="flex-start" width="100%" spacing="4">
        {isLoading ? (
          <>
            <SkeletonEntry />
            <SkeletonEntry />
            <SkeletonEntry />
          </>
        ) : (
          entries.map((entry) => {
            const date = fromUnixTime(entry.creationTimestamp);

            const avatarData = new Identicon(md5(entry.author), {
              size: 32,
              margin: 0.25,
              format: 'svg',
            }).toString();

            return (
              <Flex key={entry.id}>
                <Avatar src={`data:image/svg+xml;base64,${avatarData}`} />
                <Box ml="3">
                  <Text fontWeight="bold">
                    {entry.author}
                    <Tooltip label={formatDistanceToNow(date, { addSuffix: true })}>
                      <Tag size="sm" mx="1" verticalAlign="middle">
                        <TagLabel>{format(date, 'dd.MM.yyyy - HH:mm')}</TagLabel>
                      </Tag>
                    </Tooltip>
                    {submittedEntryIds.includes(entry.id) && (
                      <Badge ml="1" colorScheme="green">
                        {t('You')}
                      </Badge>
                    )}
                  </Text>
                  <Text fontSize="sm">
                    <LineBreakText>{entry.text}</LineBreakText>
                  </Text>
                </Box>
              </Flex>
            );
          })
        )}
      </VStack>
    </VStack>
  );
};
