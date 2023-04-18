import { GET, POST, PUT } from './request';
import { createHashPassword, Obj2Query } from '@/utils/tools';
import { ResLogin } from './response/user';
import { UserAuthTypeEnum } from '@/constants/common';
import { UserType, UserUpdateParams } from '@/types/user';
import type { PagingData, RequestPaging } from '@/types';
import { BillSchema, PaySchema } from '@/types/mongoSchema';
import { adaptBill } from '@/utils/adapt';

export const sendAuthCode = ({
  username,
  type
}: {
  username: string;
  type: `${UserAuthTypeEnum}`;
}) => GET('/user/sendAuthCode', { username, type });

export const getTokenLogin = () => GET<UserType>('/user/tokenLogin');

export const postRegister = ({
  phone,
  password,
  code,
  inviterId
}: {
  phone: string;
  code: string;
  password: string;
  inviterId: string;
}) =>
  POST<ResLogin>('/user/register', {
    phone,
    code,
    inviterId,
    password: createHashPassword(password)
  });

export const postFindPassword = ({
  username,
  code,
  password
}: {
  username: string;
  code: string;
  password: string;
}) =>
  POST<ResLogin>('/user/updatePasswordByCode', {
    username,
    code,
    password: createHashPassword(password)
  });

export const postLogin = ({ username, password }: { username: string; password: string }) =>
  POST<ResLogin>('/user/loginByPassword', {
    username,
    password: createHashPassword(password)
  });

export const putUserInfo = (data: UserUpdateParams) => PUT('/user/update', data);

export const getUserBills = (data: RequestPaging) =>
  GET<PagingData<BillSchema>>(`/user/getBill?${Obj2Query(data)}`).then((res) => ({
    ...res,
    data: res.data.map((bill) => adaptBill(bill))
  }));

export const getPayOrders = () => GET<PaySchema[]>(`/user/getPayOrders`);

export const getPayCode = (amount: number) =>
  GET<{
    codeUrl: string;
    payId: string;
  }>(`/user/getPayCode?amount=${amount}`);

export const checkPayResult = (payId: string) => GET<number>(`/user/checkPayResult?payId=${payId}`);
