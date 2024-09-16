// import { FC, useEffect, useStatus } from 'react';
// import { Badge } from '@/components/common/badges';
// import { useQueryParams } from '@/hooks/useQueryParams';

// const FilterBadges = () => {
//   const [filterStatus, setFilterStatus] = useStatus<string[]>([]);

//   const onChangeParams = () => {
//     setFilterStatus(getQueryParams().status as string[]);
//   };

//   const { setQueryParams, getPaginationParams, clearQueryParams, getQueryParams, queryParams } =
//     useQueryParams(onChangeParams);

//   return (
//     <div>
//       <div>
//         {filterStatus.map((status, index) => (
//           <Badge key={index} label={status} onRemove={setQueryParams({})} />
//         ))}
//       </div>
//       {filterStatus.length > 0 && (
//         <button
//           onClick={() => {
//             clearQueryParams();
//             setFilterStatus([]);
//           }}
//           className='text-magpie-dark-500 hover:text-magpie-dark-700'
//         >
//           Clear all
//         </button>
//       )}
//     </div>
//   );
// };

// export default FilterBadges;
