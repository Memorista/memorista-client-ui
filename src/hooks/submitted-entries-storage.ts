import { useCallback, useEffect, useState } from 'preact/hooks';

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

    if (submittedEntryIds.length === 0) {
      setHasSubmissionInCurrentSession(false);
      sessionStorage.removeItem(hasSubmissionInCurrentSessionKey);
    }
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

  const deleteSubmittedEntryId = useCallback(
    (entryId: string) => {
      setSubmittedEntryIds(submittedEntryIds.filter((id) => id !== entryId));
    },
    [submittedEntryIds]
  );

  return {
    submittedEntryIds,
    pushSubmittedEntryId,
    deleteSubmittedEntryId,
    hasSubmissionInCurrentSession,
  };
};
