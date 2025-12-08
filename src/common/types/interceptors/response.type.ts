export type PossibleControllerReturn =
    | any
    | {
          data?: any;
          message?: string;
          statusCode?: number;
          status?: string;
          stack?: string;
      };
