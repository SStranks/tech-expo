import CompanyLogo from '#Img/CompanyLogo.png';

export const CompanyTitle = 'TechExpoInc';

export const UserData = {
  name: 'Agent Smith',
  role: 'Administrator',
  phone: '0208-460-2323',
  mobile: '07332-889-627',
  email: 'inevitability@theone.org',
  timezone: 'GMT',
};

export interface INotification {
  logoURL: string;
  identity: string;
  description: string;
  timeframe: string;
}
// Logo, Entity, Description, Time
export const notificationsArr: INotification[] = [
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: CompanyLogo, identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
];

export const searchResults = [
  {
    title: 'Develop your website with TechExpo',
    category: 'Guides',
    description: 'Learn how to develop yoru app for the web so you can build a universal app',
  },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
  { title: 'Search Title', category: 'Search Category', description: 'Search Description' },
];
