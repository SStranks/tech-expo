import { Link } from 'react-router-dom';
import { MarkdownEditor } from '#Components/index';
import QuoteStatusUpdater from './components/QuoteStatusUpdater';
import styles from './_QuoteReadPage.module.scss';
import { IconArrowLeftAlt, IconDocument, IconEdit } from '#Components/svg';

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
      <div className={styles.header}>
        <Link to=".." className={styles.backQuotesPage}>
          <IconArrowLeftAlt />
          <span>Quotes</span>
        </Link>
        <hr className={styles.hr} />
      </div>
      <div className={styles.summary}>
        <h2 className={styles.summary__quoteTitle}>{quoteTitle}</h2>
        <div className={styles.summaryBtns}>
          <button type="button" className={styles.summaryBtns__convertPDF}>
            <IconDocument svgClass={styles.summaryBtns__convertPDF__svg} />
            <span>Convert to PDF</span>
          </button>
          <button type="button" className={styles.summaryBtns__editQuote}>
            <IconEdit svgClass={styles.summaryBtns__editQuote__svg} />
            <span>Edit</span>
          </button>
        </div>
      </div>
      <QuoteStatusUpdater />
      <div className={styles.quoteDocument}>
        <div className={styles.quoteDocument__header}>
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
        <hr className={styles.quoteDocument__hr} />
        <div className={styles.quoteDocument__body}>
          <div className={styles.quote__body__titleBlock}></div>
          <div className={styles.quote__body__table}></div>
          <div className={styles.quote__body__financials}></div>
        </div>
        <hr className={styles.quoteDocument__hr} />
        <div className={styles.quoteDocument__footer}>
          <div className={styles.markdownEditor}>
            <MarkdownEditor />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuoteReadPage;
