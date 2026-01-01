import { faker } from '@faker-js/faker';

interface CommentPlaceholders {
  userName: string | undefined;
  contactName?: string;
  companyName: string;
  industry: string;
}

const DATE_NOW = new Date();
const DATE_3_DAYS_AGO = new Date(new Date().setDate(new Date().getDate() - 3));

export function generateCommentDates(numberOfComments: number) {
  const recentPastDate = faker.date.recent({ days: 27, refDate: DATE_3_DAYS_AGO });
  const commentsCreatedAt = faker.date.betweens({ count: numberOfComments, from: recentPastDate, to: DATE_NOW });

  return commentsCreatedAt;
}

export function replaceCommentPlaceholders(comment: string, replacements: CommentPlaceholders): string {
  const { companyName, contactName, industry, userName } = replacements;
  if (comment.includes('{USER_NAME}')) {
    if (!userName) throw new Error('Error: Check JSON data; erroneous {USER_NAME} placeholder in first comment');
    comment = comment.replace('{USER_NAME}', userName);
  }

  if (comment.includes('{CONTACT_NAME}') && contactName) comment = comment.replace('{CONTACT_NAME}', contactName);
  if (comment.includes('{COMPANY_NAME}')) comment = comment.replace('{COMPANY_NAME}', companyName);
  if (comment.includes('{INDUSTRY}')) comment = comment.replace('{INDUSTRY}', industry);

  return comment;
}
