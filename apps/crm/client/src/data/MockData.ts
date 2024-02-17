export const CompanyTitle = 'TechExpoInc';

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
