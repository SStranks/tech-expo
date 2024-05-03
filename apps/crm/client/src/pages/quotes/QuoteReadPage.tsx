import { Link } from 'react-router-dom';
import { MarkdownEditor } from '#Components/index';
import QuoteStatusUpdater from './components/QuoteStatusUpdater';
import styles from './_QuoteReadPage.module.scss';

// TEMP DEV:  Values
const quoteTitle = 'High-tech Software Platform';
const companyTitle = 'Microsoft';
const companyCountry = 'United States';
const companyWebsite = 'http://www.microsoft.com';
const quotePreparedBy = 'Mr Adam Smith';
const quotePreparedFor = 'Mr Bob McNugget';

function QuoteReadPage(): JSX.Element {
  return (
    <div className={styles.quoteReadPage}>
      <div className={styles.quoteReadPage__header}>
        <Link to="..">Quotes</Link>
        <button type="button">Convert to PDF</button>
        <button type="button">Edit</button>
      </div>
      <div className={styles.quoteReadPage__summary}>
        <h2>{quoteTitle}</h2>
        <QuoteStatusUpdater />
      </div>
      <div className={styles.quote}>
        <div className={styles.quote__header}>
          <img src="" alt="" />
          <div className="">
            <span>{companyTitle}</span>
            <span>{companyCountry}</span>
            <span>{companyWebsite}</span>
          </div>
          <div className="">
            <div className="">
              <span>Prepared By:</span>
              <span>{quotePreparedBy}</span>
            </div>
            <div className="">
              <span>Prepared For:</span>
              <span>{quotePreparedFor}</span>
            </div>
            <div className=""></div>
          </div>
        </div>
        <div className={styles.quote__body}>
          <div className={styles.quote__body__titleBlock}></div>
          <div className={styles.quote__body__table}></div>
          <div className={styles.quote__body__financials}></div>
        </div>
      </div>
      <div className={styles.quoteReadPage__footer}>
        <div className={styles.markdownEditor}>
          <MarkdownEditor />
        </div>
      </div>
    </div>
  );
}

export default QuoteReadPage;
