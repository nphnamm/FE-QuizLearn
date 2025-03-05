export interface BaseUserRsp {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string | null;
    avatar: string | null;
    statusId: number | null;
  }