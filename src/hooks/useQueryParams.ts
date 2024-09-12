import { getQueryParams as wgetQueryParams } from '@/utils/commonUtils';
import { cleanObject } from '@/utils/commonUtils';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';

export const useQueryParams = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (queryParams: URLSearchParams, objectParams?: any) => void,
  defaultPageSize = DEFAULT_PAGE_SIZE
) => {
  const [queryParams, nav] = useSearchParams();
  useEffect(() => {
    if (onChange) {
      onChange(queryParams, wgetQueryParams(queryParams));
    }
  }, [onChange, queryParams]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setQueryParams = (params: Record<string, any>, isReplace: boolean = false) => {
    if (isReplace) {
      nav(
        cleanObject({
          ...params,
        })
      );
    } else {
      nav(
        cleanObject({
          ...wgetQueryParams(queryParams),
          ...params,
        })
      );
    }
  };

  const clearQueryParams = () => nav({});
  const getQueryParams = () => wgetQueryParams(queryParams);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPaginationParams = (values: any = {}) => {
    const page = Number(queryParams.get('page')) || 1;
    const rowsPerPage = Number(queryParams.get('rowsPerPage')) || defaultPageSize;
    return {
      page: page,
      rowsPerPage: rowsPerPage,
      ...values,
    };
  };
  return {
    queryParams,
    setQueryParams,
    clearQueryParams,
    getQueryParams,
    getPaginationParams,
  };
};
