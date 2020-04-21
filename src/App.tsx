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
import { format, formatDistanceToNow, fromUnixTime, getUnixTime } from 'date-fns';
import React, { useState } from 'react';
import { NewEntry } from './Models/Entry';
import { useEntries } from './Utils/API';

export default () => {
  const { entries, createEntry, isLoading } = useEntries();
  const [form] = Form.useForm();
  const [submittedEntryId, setSubmittedEntryId] = useState(localStorage.getItem('guesty:submittedEntryId'));

  const onFinish = async (values: Store) => {
    const { author, text } = values as NewEntry;
    const createdEntry = await createEntry({ author, text, timestamp: getUnixTime(new Date()) });

    if (!createdEntry) {
      return;
    }

    setSubmittedEntryId(createdEntry.id);
    localStorage.setItem('guesty:submittedEntryId', createdEntry.id);
  };

  return (
    <Layout style={{ backgroundColor: '#FFF' }}>
      <PageHeader title="Our guestbook">
        <Typography.Text>
          We are always trying to satisfy our guests. If you have any feedback we would love to hear from you!
        </Typography.Text>
      </PageHeader>
      <Layout.Content style={{ padding: '16px 24px' }}>
        {!submittedEntryId ? (
          <Card title="Leave an entry" bodyStyle={{ paddingBottom: 0 }}>
            <Form layout="vertical" form={form} initialValues={{ author: '', text: '' }} onFinish={onFinish}>
              <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter your name.' }]}>
                <Input placeholder="e.g. Jon Doe" />
              </Form.Item>
              <Form.Item name="text" label="Text" rules={[{ required: true, message: 'Please enter your message.' }]}>
                <Input.TextArea rows={3} placeholder="Hi from Jon Doe" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <Alert message="Well done!" description="You successfully posted an entry." type="success" showIcon />
        )}
        <List
          className="entry-list"
          header={`${entries.length} entries`}
          itemLayout="horizontal"
          dataSource={entries}
          loading={isLoading}
          renderItem={(entry) => {
            const date = fromUnixTime(entry.timestamp);
            let avatar = <Avatar src="http://placehold.it/64x64" />;
            if (entry.id.toString() === submittedEntryId?.toString()) {
              avatar = (
                <Badge count="You" style={{ backgroundColor: '#52c41a', fontSize: 10, padding: '0 5px' }}>
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
      <Layout.Footer style={{ textAlign: 'center', padding: '16px 24px' }}>
        Guesty &copy; {format(new Date(), 'yyyy')} by{' '}
        <a href="https://floriangyger.ch" target="_blank" rel="nofollow noopener noreferrer">
          Florian Gyger
        </a>
        {` & `}
        <a href="https://emin.ch" target="_blank" rel="nofollow noopener noreferrer">
          Emin Khateeb
        </a>
      </Layout.Footer>
    </Layout>
  );
};
