import { Service } from 'typedi';
import { EmailManager } from "./messaging/EmailManager";
import appConfig from "../../config/app.config";
import {NotificationDTo} from "../types/dtos/notification.dto";
import {UserDto} from "../types/dtos/user.dto";
import Logger from "../../lib/Logger";

@Service()
/**
 * Notification Service
 */
export default class NotificationService {
  private emailManager: EmailManager;

  constructor() {
    this.emailManager = new EmailManager(appConfig.config().tasksExchange, appConfig.config().tasksQueue);
  }

  send (user: UserDto, notification: NotificationDTo) {

    if (notification.channels.includes('email')) {
      /**
       * @TODO set emailDto object with required email configs
       * for now we sending only message content
       */

      this.emailManager.send(user, notification)
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
