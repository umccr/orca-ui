/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { createContext, FC, PropsWithChildren, ReactElement, useContext, useState } from 'react';
import {
  useSequenceRunDetailModel,
  useSequenceRunCommentListModel,
  useSequenceRunStateListModel,
} from '@/api/sequenceRun';
import { useParams } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';

const SequenceRunContext = createContext({
  refreshSequenceRuns: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRefreshSequenceRuns: (_value: boolean) => {},
  sequenceRunDetail: {} as ReturnType<typeof useSequenceRunDetailModel>['data'],
  isFetchingSequenceRunDetail: true,
  // comment
  sequenceRunCommentData: {} as ReturnType<typeof useSequenceRunCommentListModel>['data'],
  isFetchingSequenceRunComment: true,
  refetchSequenceRunComment: () => {},
  // state
  sequenceRunStateData: {} as ReturnType<typeof useSequenceRunStateListModel>['data'],
  isFetchingSequenceRunState: true,
  refetchSequenceRunState: () => {},
});

export const SequenceRunProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  const [refreshSequenceRuns, setRefreshSequenceRuns] = useState<boolean>(false);
  const { orcabusId } = useParams();

  const { data: sequenceRunDetail, isFetching: isFetchingSequenceRunDetail } =
    useSequenceRunDetailModel({
      params: { path: { id: orcabusId as string } },
      reactQuery: {
        enabled: !!orcabusId,
      },
    });
  const {
    data: sequenceRunCommentData,
    isFetching: isFetchingSequenceRunComment,
    refetch: refetchSequenceRunComment,
  } = useSequenceRunCommentListModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });
  const {
    data: sequenceRunStateData,
    isFetching: isFetchingSequenceRunState,
    refetch: refetchSequenceRunState,
  } = useSequenceRunStateListModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const isFetching =
    isFetchingSequenceRunDetail || isFetchingSequenceRunComment || isFetchingSequenceRunState;

  return (
    <>
      {isFetching ? (
        <div className='h-screen'>
          <SpinnerWithText text='Loading...' />
        </div>
      ) : (
        <SequenceRunContext.Provider
          value={{
            refreshSequenceRuns,
            setRefreshSequenceRuns,
            sequenceRunDetail,
            isFetchingSequenceRunDetail,
            sequenceRunCommentData,
            isFetchingSequenceRunComment,
            refetchSequenceRunComment,
            sequenceRunStateData,
            isFetchingSequenceRunState,
            refetchSequenceRunState,
          }}
        >
          {children}
        </SequenceRunContext.Provider>
      )}
    </>
  );
};

export const useSequenceRunContext = () => {
  return useContext(SequenceRunContext);
};
