import { Link } from 'react-router-dom';

import { MarkdownEditor } from '@Components/index';
import { IconArrowLeftAlt, IconDocument, IconEdit } from '@Components/svg';
import CompanyLogo from '@Img/Microsoft_logo.png';

import QuoteFinancials from './components/QuoteFinancials';
import QuoteStatusUpdater from './components/QuoteStatusUpdater';

import styles from './QuoteReadPage.module.scss';

// TEMP DEV:  Values
const quoteTitle = 'High-tech Software Platform';
const companyLogo = CompanyLogo;
const companyTitle = 'Microsoft';
const companyCountry = 'United States';
const companyWebsite = 'http://www.microsoft.com';
const quotePreparedBy = 'Mr Adam Smith';
const quotePreparedFor = 'Mr Bob McNugget';
const subTotal = '$2,700';
const salesTax = '16%';
const grandTotal = '$4,000';

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
          <img src={companyLogo} alt={companyTitle} className={styles.quoteDocument__header__companyLogo} />
          <div className={styles.quoteDocument__header__details}>
            <span className={styles.quoteDocument__header__companyTitle}>{companyTitle}</span>
            <span>{companyCountry}</span>
            <span>{companyWebsite}</span>
          </div>
          <div className={styles.quoteDocument__header__participants}>
            <div className={styles.quoteDocument__header__prepared}>
              <span className={styles.quoteDocument__header__preparedParticipant}>Prepared By:</span>
              <span>{quotePreparedBy}</span>
            </div>
            <div className={styles.quoteDocument__header__prepared}>
              <span className={styles.quoteDocument__header__preparedParticipant}>Prepared For:</span>
              <span>{quotePreparedFor}</span>
            </div>
          </div>
        </div>
        <hr className={styles.hr} />
        <div className={styles.quoteDocument__body}>
          <div className={styles.quoteDocument__body__titleBlock}>
            <span className={styles.quoteDocument__body__titleBlock__title}>Products / Services</span>
            <div className="">{/* // TODO:  Component for waiting/saving/saved */}</div>
          </div>
          <div className={styles.quoteDocument__body__table}>
            <QuoteFinancials />
            <div className={styles.quoteDocument__body__financials}>
              <div className={styles.quoteDocument__body__financials__grid}>
                <span>Sub-Total</span>
                <span>{subTotal}</span>
                <span>Sales Tax</span>
                <span>{salesTax}</span>
                <span>Grand Total</span>
                <span>{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
        <hr className={styles.hr} />
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
