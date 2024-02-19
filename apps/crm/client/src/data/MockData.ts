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
  { logoURL: 'Logo URL', identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: 'Logo URL', identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: 'Logo URL', identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: 'Logo URL', identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
  { logoURL: 'Logo URL', identity: 'Company A', description: 'Signed Deal', timeframe: 'an hour ago' },
];
