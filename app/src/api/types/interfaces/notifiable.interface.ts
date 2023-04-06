import {UserDto} from "../dtos/user.dto";
import {NotificationDTo} from "../dtos/notification.dto";



export interface NotifiableInterface {
  send(user: UserDto, notification: NotificationDTo): any;
}
