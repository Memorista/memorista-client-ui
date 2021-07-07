import { useCallback, useEffect, useState } from 'react';

const storageKey = 'memorista:submittedEntryIds';
const hasSubmissionInCurrentSessionKey = 'memorista:hasSubmission';

const getSubmittedEntryIds = () => {
  const data = localStorage.getItem(storageKey);
  if (!data) return [];

  return JSON.parse(data);
};

export const useSubmittedEntriesStorage = () => {
  const [submittedEntryIds, setSubmittedEntryIds] = useState<string[]>(getSubmittedEntryIds);
  const [hasSubmissionInCurrentSession, setHasSubmissionInCurrentSession] = useState(
    () => !!sessionStorage.getItem(hasSubmissionInCurrentSessionKey)
  );

  useEffect(() => {
    const data = JSON.stringify(submittedEntryIds);
    if (data === localStorage.getItem(storageKey)) return;

    localStorage.setItem(storageKey, data);
  }, [submittedEntryIds]);

  useEffect(() => {
    if (hasSubmissionInCurrentSession) {
      sessionStorage.setItem(hasSubmissionInCurrentSessionKey, 'YES');
    } else {
      sessionStorage.removeItem(hasSubmissionInCurrentSessionKey);
    }
  }, [hasSubmissionInCurrentSession]);

  const pushSubmittedEntryId = useCallback(
    (entryId: string) => {
      setSubmittedEntryIds([...submittedEntryIds, entryId]);
      setHasSubmissionInCurrentSession(true);
    },
    [submittedEntryIds]
  );

  return {
    submittedEntryIds,
    pushSubmittedEntryId,
    hasSubmissionInCurrentSession,
  };
};
