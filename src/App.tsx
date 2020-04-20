import React, { useState } from 'react';
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import Entry from './Components/Entry';
import NewEntryForm from './Components/NewEntryForm';
import { useEntries } from './Utils/API';

export default () => {
  const { entries, createEntry, isLoading } = useEntries();
  const [submittedEntryId, setSubmittedEntryId] = useState(localStorage.getItem('guesty:submittedEntryId'));

  return (
    <Container>
      <Row>
        <Col>
          {!submittedEntryId ? (
            <NewEntryForm createEntry={createEntry} onSubmittedEntryIdChange={setSubmittedEntryId} />
          ) : (
            <Alert variant="success">
              <strong>Well done!</strong> You successfully posted a comment.
            </Alert>
          )}
          <hr />
          {isLoading && <Spinner animation="border" />}
          <div>
            {entries &&
              entries.map((entry) => (
                <Entry key={entry.id} entry={entry} isHighlighted={entry.id.toString() === submittedEntryId} />
              ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
