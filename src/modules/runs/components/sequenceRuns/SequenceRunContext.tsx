/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { createContext, FC, PropsWithChildren, ReactElement, useContext } from 'react';
import {
  useSequenceRunByInstrumentRunIdModel,
  useSequenceRunCommentsByInstrumentRunIdModel,
  useSequenceRunStatesByInstrumentRunIdModel,
  useSequenceRunStateValidMapModel,
} from '@/api/sequenceRun';
import { useParams } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';

const SequenceRunContext = createContext({
  // refreshSequenceRuns: false,
  // //eslint-disable-next-line @typescript-eslint/no-unused-vars
  // setRefreshSequenceRuns: (_value: boolean) => {},
  sequenceRunDetail: undefined as ReturnType<typeof useSequenceRunByInstrumentRunIdModel>['data'],
  isFetchingSequenceRunDetail: true,
  // comment
  sequenceRunCommentData: undefined as ReturnType<
    typeof useSequenceRunCommentsByInstrumentRunIdModel
  >['data'],
  isFetchingSequenceRunComment: true,
  refetchSequenceRunComment: () => {},
  // state
  sequenceRunStateData: undefined as ReturnType<
    typeof useSequenceRunStatesByInstrumentRunIdModel
  >['data'],
  isFetchingSequenceRunState: true,
  refetchSequenceRunState: () => {},

  // state valid map
  sequenceRunStateValidMapData: undefined as ReturnType<
    typeof useSequenceRunStateValidMapModel
  >['data'],
  isFetchingSequenceRunStateValidMap: true,
});

export const SequenceRunProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  // const [refreshSequenceRuns, setRefreshSequenceRuns] = useState<boolean>(false);
  const { instrumentRunId } = useParams();

  const { data: sequenceRunDetail, isFetching: isFetchingSequenceRunDetail } =
    useSequenceRunByInstrumentRunIdModel({
      params: { path: { instrumentRunId: instrumentRunId as string } },
      reactQuery: {
        enabled: !!instrumentRunId,
      },
    });

  const {
    data: sequenceRunCommentData,
    isFetching: isFetchingSequenceRunComment,
    refetch: refetchSequenceRunComment,
  } = useSequenceRunCommentsByInstrumentRunIdModel({
    params: { path: { instrumentRunId: instrumentRunId as string } },
    reactQuery: {
      enabled: !!instrumentRunId,
    },
  });

  const {
    data: sequenceRunStateData,
    isFetching: isFetchingSequenceRunState,
    refetch: refetchSequenceRunState,
  } = useSequenceRunStatesByInstrumentRunIdModel({
    params: { path: { instrumentRunId: instrumentRunId as string } },
    reactQuery: {
      enabled: !!instrumentRunId,
    },
  });

  const { data: sequenceRunStateValidMapData, isFetching: isFetchingSequenceRunStateValidMap } =
    useSequenceRunStateValidMapModel({
      params: { path: { instrumentRunId: instrumentRunId as string } },
      reactQuery: {
        enabled: !!instrumentRunId,
      },
    });

  const isFetching =
    isFetchingSequenceRunDetail ||
    isFetchingSequenceRunComment ||
    isFetchingSequenceRunState ||
    isFetchingSequenceRunStateValidMap;

  return (
    <>
      {isFetching ? (
        <div className='h-screen'>
          <SpinnerWithText text='Loading ...' />
        </div>
      ) : (
        <SequenceRunContext.Provider
          value={{
            // refreshSequenceRuns,
            // setRefreshSequenceRuns,
            sequenceRunDetail,
            isFetchingSequenceRunDetail,
            sequenceRunCommentData,
            isFetchingSequenceRunComment,
            refetchSequenceRunComment,
            sequenceRunStateData,
            isFetchingSequenceRunState,
            refetchSequenceRunState,
            sequenceRunStateValidMapData,
            isFetchingSequenceRunStateValidMap,
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
