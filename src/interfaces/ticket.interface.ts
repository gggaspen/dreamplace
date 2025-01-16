import IEvent from "./event.interface";

export default interface ITicket {
  _id: string | number;
  active: boolean;
  eventId: IEvent["_id"];
}
