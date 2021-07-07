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
import md5 from 'blueimp-md5';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';
import Identicon from 'identicon.js';
import { FunctionComponent } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { NewEntry } from './models/entry';
import { useEntries, useGuestbook } from './utils/api-hooks';
import useSpeedLimit from './utils/use-speed-limit';
import { useSubmittedEntriesStorage } from './utils/use-submitted-entries-storage';

type Props = {
  apiKey: string;
};

export const App: FunctionComponent<Props> = ({ apiKey }) => {
  const { t, i18n } = useTranslation();
  const { guestbook } = useGuestbook(apiKey);
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

            const avatarData = new Identicon(md5(entry.author), {
              size: 32,
              margin: 0.25,
              format: 'svg',
            }).toString();

            let avatar = <Avatar src={`data:image/svg+xml;base64,${avatarData}`} />;
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
