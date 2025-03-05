import { PayloadAction } from "@reduxjs/toolkit";

export type TAction = PayloadAction<{
  data: any;
  callback?: Function;
  callBackError?: Function;
}>;
