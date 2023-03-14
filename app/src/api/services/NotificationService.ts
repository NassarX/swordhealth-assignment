import { Service } from 'typedi';
import { EmailManager } from "./messaging/EmailManager";
import Logger from "../../lib/Logger";
import appConfig from "../../config/app.config";
import { NotificationServiceInterface } from "../types/interfaces/notification.service.interface";

export interface Notification {
  content: string,
  channels: string[],
  options?: {}
}

@Service()
/**
 * Notification Service
 */
export default class NotificationService implements NotificationServiceInterface {
  private emailManager: EmailManager;

  constructor() {
    this.emailManager = new EmailManager(appConfig.config().tasksExchange, appConfig.config().tasksQueue);
  }

  send (notification: Notification) {

    if (notification.channels.includes('email')) {
      /**
       * @TODO set emailDto object with required email configs
       * for now we sending only message content
       */
      this.emailManager.sendEmail(notification.content)
        .then(() => {
            Logger.info('Email published to queue');
            console.info('Email published to queue');
        }, (error: any) => {
            Logger.error(`Failed to publish email to queue: ${error}`);
            console.error('Failed to publish email to queue', error);
        });
    } else {
      //@TODO set default channel instead
    }
  }
}
