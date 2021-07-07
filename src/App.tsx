import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Comment,
  Form,
  Input,
  Layout,
  List,
  PageHeader,
  Tooltip,
  Typography,
} from 'antd';
import { Store } from 'antd/lib/form/interface';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoristaConfig } from './models/config';
import { NewEntry } from './models/entry';
import { useEntries, useGuestbook } from './utils/api-hooks';
import useSpeedLimit from './utils/use-speed-limit';
import { useSubmittedEntriesStorage } from './utils/use-submitted-entries-storage';

interface Props {
  config: MemoristaConfig;
}

export const App = ({ config }: Props) => {
  const { t, i18n } = useTranslation();
  const { guestbook } = useGuestbook(config.apiKey);
  const { entries, createEntry, isLoading } = useEntries(guestbook?.id);
  const [form] = Form.useForm();
  const isMinTimeElapsed = useSpeedLimit(2);
  const { submittedEntryIds, hasSubmissionInCurrentSession, pushSubmittedEntryId } = useSubmittedEntriesStorage();
  const authorName = useMemo(() => localStorage.getItem('memorista:authorName') || '', []);

  useEffect(() => {
    if (!guestbook) {
      return;
    }

    i18n.changeLanguage(guestbook.languageTag);
  }, [guestbook]);

  const onFinish = async (values: Store) => {
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

  return (
    <Layout style={{ backgroundColor: '#FFF' }}>
      <PageHeader title={guestbook.title}>
        <Typography.Text>{guestbook.description}</Typography.Text>
      </PageHeader>
      <Layout.Content style={{ padding: '16px 24px' }}>
        {!hasSubmissionInCurrentSession ? (
          <Card title={t('Leave an entry')} bodyStyle={{ paddingBottom: 0 }}>
            <Form layout="vertical" form={form} initialValues={{ author: authorName, text: '' }} onFinish={onFinish}>
              <Form.Item
                style={{ display: 'none' }}
                name="name"
                label={t('Please leave this field blank as it is used for spam protection.')}
                rules={[{ required: false }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="author"
                label={t('Author')}
                rules={[{ required: true, message: t('Please enter your name.') }]}
              >
                <Input placeholder={t('e.g. Jon Doe')} />
              </Form.Item>
              <Form.Item
                name="text"
                label={t('Text')}
                rules={[{ required: true, message: t('Please enter your message.') }]}
              >
                <Input.TextArea rows={3} placeholder={t('Hi from Jon Doe')} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  {t('Submit')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <Alert
            message={t('Entry created')}
            description={t('Your entry has been successfully saved.')}
            type="success"
            showIcon
          />
        )}
        <List
          className="entry-list"
          header={`${entries.length} ${t('Entries')}`}
          itemLayout="horizontal"
          dataSource={entries}
          loading={isLoading}
          renderItem={(entry) => {
            const date = fromUnixTime(entry.creationTimestamp);
            let avatar = <Avatar src="http://placehold.it/64x64" />;
            if (submittedEntryIds.includes(entry.id)) {
              avatar = (
                <Badge count={t('You')} style={{ backgroundColor: '#52c41a', fontSize: 10, padding: '0 5px' }}>
                  {avatar}
                </Badge>
              );
            }

            return (
              <li>
                <Comment
                  avatar={avatar}
                  author={entry.author}
                  content={entry.text}
                  datetime={
                    <Tooltip title={format(date, 'dd.MM.yyyy - HH:mm')}>
                      <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
                    </Tooltip>
                  }
                />
              </li>
            );
          }}
        />
      </Layout.Content>
    </Layout>
  );
};
