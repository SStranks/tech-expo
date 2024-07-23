import companyImage from '#Img/Microsoft_logo.png';
import styles from './_CompanySingle.module.scss';

// TODO:  Make image dynamic; currently not part of mock data.
const COMPANY_IMAGE = companyImage;

interface IProps {
  companyName: string;
}

function CompanySingle(props: IProps): JSX.Element {
  const { companyName } = props;

  return (
    <div className={styles.companySingle}>
      <div className={styles.companySingle__img}>
        {/* // TODO:  Add another component that takes companyName initials and makes coloured circle with abbrv, if userImage not available */}
        <img src={COMPANY_IMAGE} alt={companyName} />
      </div>
      <span className={styles.companySingle__companyName}>{companyName}</span>
    </div>
  );
}

export default CompanySingle;
