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
    // bugfix: if set array object to state, it will be refresh the page continuously as the object is always new
    const paginationKeys = ['page', 'rowsPerPage'];
    const isPaginationParams = Object.keys(params).some((key) => paginationKeys.includes(key));
    if (!isPaginationParams) {
      params.page = undefined;
      params.rowsPerPage = undefined;
    }

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

  const clearQueryParams = (except?: string[]) => {
    // remove all other query params except the except ones
    const exceptParams = except ? except.map((key) => key) : [];
    const currentQueryParams = getQueryParams();
    const filteredQueryParams = Object.keys(currentQueryParams).reduce<Record<string, string>>(
      (acc, key) => {
        if (exceptParams.includes(key)) {
          acc[key] = currentQueryParams[key];
        }
        return acc;
      },
      {}
    );
    nav(cleanObject({ ...filteredQueryParams }));
  };

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
