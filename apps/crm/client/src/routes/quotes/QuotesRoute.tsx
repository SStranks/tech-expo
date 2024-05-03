// import TableQuotes from '#Components/tanstack-table/tables/quotes/TableQuotes';
// import { tableDataQuotes } from '#Data/MockData';
// import styles from './_QuotesRoute.module.scss';
import ViewportLayout from '#Layouts/ViewportLayout';
import { PropsWithChildren } from 'react';

function QuotesRoute({ children }: PropsWithChildren): JSX.Element {
  return <ViewportLayout>{children}</ViewportLayout>;
}

// function QuotesRoute(): JSX.Element {
//   return (
//     <ViewportLayout>
//       <div className={styles.quotesRouteLayout}>
//         <div className={styles.table}>
//           <TableQuotes tableData={tableDataQuotes} />
//         </div>
//       </div>
//     </ViewportLayout>
//   );
// }

export default QuotesRoute;
