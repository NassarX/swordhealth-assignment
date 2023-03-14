import {Service} from 'typedi';

export interface Notification {
  content: string,
  channels: string[],
  options?: {}
}

export interface NotificationServiceInterface {
  send(notification: Notification): any;
}
