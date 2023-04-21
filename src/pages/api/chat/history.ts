import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { HistoryItem } from '@/types/chat';
import { connectToDatabase, Chat } from '@/service/mongo';
import {authToken} from "@/service/utils/tools";

/* 聊天内容存存储 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 凭证校验
  try {
    const { authorization } = req.headers;
    const userId = await authToken(authorization);

    await connectToDatabase();

    // 存入库
    const models = await Chat.find({userId: userId, content: {$exists: true, $ne: []}});

    const historyItems = models.map(item => {
      const historyItem: HistoryItem = {
        chatId: item._id,
        title: item.content[0].value
      };
      return historyItem;
    });

    jsonRes(res, {
      data: historyItems
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }

}
