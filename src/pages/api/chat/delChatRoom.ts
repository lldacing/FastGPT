import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, Chat } from '@/service/mongo';
import { authToken } from '@/service/utils/tools';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { chatId} = req.query as { chatId: string; };
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error('无权操作');
    }
    if (!chatId) {
      throw new Error('缺少参数');
    }

    await connectToDatabase();

    // 凭证校验
    const userId = await authToken(authorization);

    const delRes = await Chat.deleteMany({userId: userId, _id: chatId});

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
