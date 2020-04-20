import { Formik } from 'formik';
import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { object, string } from 'yup'; // for only what you need
import { Entry, NewEntry } from '../Models/Entry';

interface Props {
  createEntry: (newEntry: NewEntry) => Promise<Entry | null>;
  onSubmittedEntryIdChange: (submittedEntryId: string) => void;
}

const schema = object({
  author: string().required(),
  text: string().required(),
});

export default ({ createEntry, onSubmittedEntryIdChange }: Props) => {
  const onSubmit = async (newEntry: NewEntry) => {
    const createdEntry = await createEntry(newEntry);

    if (!createdEntry) {
      return;
    }

    onSubmittedEntryIdChange(createdEntry.id);
    localStorage.setItem('guesty:submittedEntryId', createdEntry.id);
  };

  return (
    <Card className="my-4">
      <Card.Header>Leave a comment:</Card.Header>
      <Card.Body>
        <Formik
          validationSchema={schema}
          onSubmit={onSubmit}
          initialValues={{
            author: '',
            text: '',
            timestamp: 0,
          }}
        >
          {({ handleSubmit, handleChange, values, touched, isValid, isSubmitting, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="author">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={values.author}
                  onChange={handleChange}
                  placeholder="e.g. Jon Doe"
                  isInvalid={!!errors.author}
                />
                <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="text">
                <Form.Label>Text</Form.Label>
                <Form.Control
                  as="textarea"
                  name="text"
                  value={values.text}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Hi from Jon Doe"
                  isInvalid={!!errors.text}
                />
                <Form.Control.Feedback type="invalid">{errors.text}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};
