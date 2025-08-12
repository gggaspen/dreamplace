import IEvent from "./event.interface";

export default interface DataConfig {
  data: IEvent[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
}

// export default interface DataConfig {
//   topBanner: {
//     text: string;
//   };
//   banner: {
//     title: string;
//     subtitle: string;
//   };
//   event: IEvent;
// }
