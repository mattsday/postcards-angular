import express, { json, Request, Response } from 'express';
import { postcardFlow } from './genkit/genkit';
import { PostcardRequest } from '../schema/postcard-request';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post(
  '/process',
  async (req: Request<object, object, PostcardRequest>, res: Response) => {
    try {
      const r = await postcardFlow(req.body);
      res.status(StatusCodes.OK).json(r);
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    } finally {
      res.end();
    }
  }
);

export default router;
