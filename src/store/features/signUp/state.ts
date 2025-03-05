import { BaseUserRsp } from "@/services/responses/base/baseResponse";

export interface RegisterInfo {
    token: string;
    user: BaseUserRsp;
}

const state : RegisterInfo = {
    token: "",
    user: {
        id: "",
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        avatar: "",
        statusId: 0,
    }   
}

export default state;


