import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/ Notification';

export default class NotificationsRepository
  implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const data = this.ormRepository.create({ content, recipient_id });
    const notification = await this.ormRepository.save(data);
    return notification;
  }
}
