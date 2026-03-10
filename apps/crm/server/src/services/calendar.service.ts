import type { PersistedCalendar } from '#Models/domain/calendar/calendar.js';
import type { CalendarRepository } from '#Models/domain/calendar/calendar.repository.js';
import type {
  AddCalendarCategoryCommand,
  AddCalendarEventCommand,
  AddCalendarEventReturn,
  CalendarId,
  FindCalendarCategoriesCommand,
  FindCalendarEventsCommand,
  InitialCalendarCommand,
  InitialCalendarReturn,
  RemoveCalendarCategoryCommand,
  RemoveCalendarEventCommand,
  UpdateCalendarEventCommand,
  UpdateCalendarEventReturn,
} from '#Models/domain/calendar/calendar.types.js';
import type { PersistedCalendarCategory } from '#Models/domain/calendar/categories/categories.js';
import type { CalendarCategoryId } from '#Models/domain/calendar/categories/categories.types.js';
import type { CalendarEventId } from '#Models/domain/calendar/events/event.types.js';
import type { PersistedUserProfile } from '#Models/domain/user/profile/profile.js';
import type { CalendarReadModel } from '#Models/query/calendar/calendar.read-model.js';
import type {
  CalendarCategoryReadRow,
  CalendarEventReadRow,
  CalendarEventReturn,
  GetCalendarEventCommand,
} from '#Models/query/calendar/calendar.read-model.types.js';
import type { UserReadModel } from '#Models/query/user/users.read-model.js';
import type { RequestContext } from '#Types/request-context.js';

import ForbiddenError from '#Utils/errors/ForbiddenError.js';
import { NotFoundError } from '#Utils/errors/NotFoundError.js';

interface CalendarServiceDependencies {
  calendarReadModel: CalendarReadModel;
  calendarRepository: CalendarRepository;
  userReadModel: UserReadModel;
}

interface ICalendarService {
  getCalendarById(id: CalendarId): Promise<PersistedCalendar>;
  getCalendarInitialData(cmd: InitialCalendarCommand, ctx: RequestContext): Promise<InitialCalendarReturn>;
  getCalendarEventById(cmd: GetCalendarEventCommand, ctx: RequestContext): Promise<CalendarEventReturn>;
  addCalendarEvent(cmd: AddCalendarEventCommand, ctx: RequestContext): Promise<AddCalendarEventReturn>;
  updateCalendarEvent(cmd: UpdateCalendarEventCommand, ctx: RequestContext): Promise<UpdateCalendarEventReturn>;
  removeCalendarEvent(cmd: RemoveCalendarEventCommand, ctx: RequestContext): Promise<CalendarEventId>;
  addCalendarCategory(cmd: AddCalendarCategoryCommand, ctx: RequestContext): Promise<PersistedCalendarCategory>;
  removeCalendarCategory(cmd: RemoveCalendarCategoryCommand, ctx: RequestContext): Promise<CalendarCategoryId>;
  findCalendarEventsByDate(cmd: FindCalendarEventsCommand, ctx: RequestContext): Promise<CalendarEventReadRow[]>;
  findCalendarCategoriesByCompanyId(
    cmd: FindCalendarCategoriesCommand,
    ctx: RequestContext
  ): Promise<CalendarCategoryReadRow[]>;
}

export class CalendarService implements ICalendarService {
  private readonly calendarRepository: CalendarRepository;
  private readonly calendarReadModel: CalendarReadModel;
  private readonly userReadModel: UserReadModel;

  constructor({ calendarReadModel, calendarRepository, userReadModel }: CalendarServiceDependencies) {
    this.calendarReadModel = calendarReadModel;
    this.calendarRepository = calendarRepository;
    this.userReadModel = userReadModel;
  }

  private async authorizeCalendarAccess(
    calendarId: CalendarId,
    ctx: RequestContext
  ): Promise<{ calendar: PersistedCalendar; userProfile: PersistedUserProfile }> {
    const userProfile = await this.userReadModel.findUserProfileByUserId(ctx.user);
    if (!userProfile) throw new NotFoundError({ context: { userId: ctx.user }, resource: 'Userprofile by UserId' });

    const calendar = await this.getCalendarById(calendarId);
    if (calendar.companyId !== userProfile.companyId) throw new ForbiddenError({ context: { userId: ctx.user } });

    return { calendar, userProfile };
  }

  // ------- COMMANDs ------ //
  async getCalendarById(id: CalendarId): Promise<PersistedCalendar> {
    const calendar = await this.calendarRepository.findCalendarById(id);
    if (!calendar) throw new NotFoundError({ context: { calendarId: id }, resource: 'Calendar' });

    return calendar;
  }

  async getCalendarInitialData(cmd: InitialCalendarCommand, ctx: RequestContext): Promise<InitialCalendarReturn> {
    const { calendar } = await this.authorizeCalendarAccess(cmd.calendarId, ctx);

    const [categories, events] = await Promise.all([
      this.calendarReadModel.findCalendarCategoriesByCalendarId(calendar.id),
      this.calendarReadModel.findCalendarEventsByDate(calendar.id, cmd.month, cmd.year),
    ]);

    return { categories, events };
  }

  async addCalendarEvent(cmd: AddCalendarEventCommand, ctx: RequestContext): Promise<AddCalendarEventReturn> {
    const { calendar } = await this.authorizeCalendarAccess(cmd.calendarId, ctx);

    const { symbol } = calendar.addCalendarEvent({ ...cmd });

    await this.calendarRepository.save(calendar);
    const calendarEvent = calendar.getCalendarEventBySymbol(symbol);
    const participants = await this.userReadModel.findUserProfilesByUserProfileIds(calendarEvent.participants);

    return { calendarEvent, participants };
  }

  async updateCalendarEvent(cmd: UpdateCalendarEventCommand, ctx: RequestContext): Promise<UpdateCalendarEventReturn> {
    const { calendar } = await this.authorizeCalendarAccess(cmd.calendarId, ctx);

    const { symbol } = calendar.updateCalendarEvent({ ...cmd });

    await this.calendarRepository.save(calendar);
    const calendarEvent = calendar.getCalendarEventBySymbol(symbol);
    const participants = await this.userReadModel.findUserProfilesByUserProfileIds(calendarEvent.participants);

    return { calendarEvent, participants };
  }

  async removeCalendarEvent(cmd: RemoveCalendarEventCommand, ctx: RequestContext): Promise<CalendarEventId> {
    const { calendar } = await this.authorizeCalendarAccess(cmd.calendarId, ctx);

    calendar.removeCalendarEvent(cmd.calendarEventId);
    await this.calendarRepository.save(calendar);
    return cmd.calendarEventId;
  }

  async addCalendarCategory(cmd: AddCalendarCategoryCommand, ctx: RequestContext): Promise<PersistedCalendarCategory> {
    const { calendar } = await this.authorizeCalendarAccess(cmd.calendarId, ctx);

    const { symbol } = calendar.addCalendarCategory({
      calendarId: cmd.calendarId,
      title: cmd.title,
    });

    await this.calendarRepository.save(calendar);
    const calendarCategory = calendar.getCalendarCategoryBySymbol(symbol);

    return calendarCategory;
  }

  async removeCalendarCategory(cmd: RemoveCalendarCategoryCommand, ctx: RequestContext): Promise<CalendarCategoryId> {
    const { calendar } = await this.authorizeCalendarAccess(cmd.calendarId, ctx);

    const calendarCatergory = await this.calendarReadModel.findCalendarCategoryByCalendarCategoryId(
      cmd.calendarCategoryId
    );
    if (!calendarCatergory)
      throw new NotFoundError({
        context: { calendarCatergoryId: cmd.calendarCategoryId },
        resource: 'Calendar-category',
      });

    calendar.removeCalendarCategory(cmd.calendarCategoryId);
    await this.calendarRepository.save(calendar);
    return cmd.calendarCategoryId;
  }

  // ------- QUERIES ------- //
  async getCalendarEventById(cmd: GetCalendarEventCommand, ctx: RequestContext): Promise<CalendarEventReturn> {
    await this.authorizeCalendarAccess(cmd.calendarId, ctx);
    const { calendarEvent, participants } = await this.calendarReadModel.getCalendarEventByCalendarEventId(
      cmd.calendarEventId
    );

    return {
      calendarEvent,
      participants,
    };
  }

  async findCalendarEventsByDate(cmd: FindCalendarEventsCommand, ctx: RequestContext): Promise<CalendarEventReadRow[]> {
    await this.authorizeCalendarAccess(cmd.calendarId, ctx);
    return this.calendarReadModel.findCalendarEventsByDate(cmd.calendarId, cmd.month, cmd.year);
  }

  async findCalendarCategoriesByCompanyId(
    cmd: FindCalendarCategoriesCommand,
    ctx: RequestContext
  ): Promise<CalendarCategoryReadRow[]> {
    const { calendar } = await this.authorizeCalendarAccess(cmd.calendarId, ctx);
    return this.calendarReadModel.findCalendarCategoriesByCalendarId(calendar.id);
  }
}
