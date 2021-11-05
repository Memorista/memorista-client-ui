import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import md5 from 'blueimp-md5';
import { Field, FieldProps, Form, Formik } from 'formik';
import { FunctionComponent } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Entry } from './components/Entry';
import { SkeletonEntry } from './components/SkeletonEntry';
import { useEntries, useGuestbook } from './hooks/api';
import { useSpeedLimit } from './hooks/speed-limit';
import { useSubmittedEntriesStorage } from './hooks/submitted-entries-storage';
import { Entry as EntryModel, NewEntry } from './models/entry';

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
  const [authorName, setAuthorName] = useState(() => localStorage.getItem('memorista:authorName') || '');
  const authorToken = useMemo(() => {
    const token = localStorage.getItem('memorista:authorToken');
    if (token) return token;

    const newAuthorToken = uuid();
    localStorage.setItem('memorista:authorToken', newAuthorToken);

    return newAuthorToken;
  }, []);
  const { guestbook } = useGuestbook(apiKey);
  const { entries, createEntry, updateEntry, deleteEntry, isLoading } = useEntries(guestbook?.id, authorToken);
  const isMinTimeElapsed = useSpeedLimit(2);
  const { submittedEntryIds, hasSubmissionInCurrentSession, pushSubmittedEntryId, deleteSubmittedEntryId } =
    useSubmittedEntriesStorage();

  useEffect(() => {
    if (!guestbook) {
      return;
    }

    i18n.changeLanguage(guestbook.languageTag);
  }, [guestbook]);

  const handleSubmit = async (values: FormValues) => {
    const { author, text } = values as NewEntry;

    const isSpam = !!values.name || !isMinTimeElapsed;
    if (isSpam) {
      throw new Error('Memorista: Possible spam bot detected. Form was not submitted.');
    }

    const createdEntry = await createEntry({ author, text });
    if (!createdEntry) {
      return;
    }

    localStorage.setItem('memorista:authorName', createdEntry.author);
    pushSubmittedEntryId(createdEntry.id);
  };

  const handleUpdate = (entryId: EntryModel['id']) => (updates: Partial<NewEntry>) => {
    if (updates.author) {
      localStorage.setItem('memorista:authorName', updates.author);
      setAuthorName(updates.author);
    }

    updateEntry(entryId, updates);
  };

  const handleDelete = (entryId: EntryModel['id']) => async () => {
    await deleteEntry(entryId);
    deleteSubmittedEntryId(entryId);
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

      {!hasSubmissionInCurrentSession ? (
        <Formik
          key={authorName}
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
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, isValid }) => (
            <Form style={{ width: '100%' }}>
              <VStack alignItems="flex-start" width="100%" spacing="4">
                <Field name="author">
                  {({ field }: FieldProps) => (
                    <FormControl isInvalid={!!(errors.author && touched.author)}>
                      <FormLabel htmlFor="author">{t('Author')}</FormLabel>
                      <Input {...field} id="author" placeholder={t('e.g. Jon Doe')} disabled={isLoading} />
                      <FormErrorMessage>{errors.author}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="name">
                  {({ field }: FieldProps) => (
                    <FormControl isInvalid={!!(errors.name && touched.name)} display="none">
                      <FormLabel htmlFor="name">
                        {t('Please leave this field blank as it is used for spam protection.')}
                      </FormLabel>
                      <Input {...field} id="name" />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
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
              </VStack>
            </Form>
          )}
        </Formik>
      ) : (
        <Alert status="success">
          <AlertIcon />
          {t('Your entry has been successfully saved.')}
        </Alert>
      )}

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
            const entryHash = md5(`${entry.author}${entry.text}`);

            return (
              <Entry
                key={entryHash}
                entry={entry}
                submittedEntryIds={submittedEntryIds}
                onUpdate={handleUpdate(entry.id)}
                onDelete={handleDelete(entry.id)}
              />
            );
          })
        )}
      </VStack>
    </VStack>
  );
};
