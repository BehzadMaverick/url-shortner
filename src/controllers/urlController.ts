import { addEntryToJsonFile, readFile } from '../helpers/jsonFileHelper';
import { generateShortUrl } from '../helpers/urlShortner';
import { NextFunction, Request, Response } from 'express';
import { sendUrlResponse } from '../sockets/rooms/broadcastingRoom';

export default class UrlController {
  async generateShortUrl(req: Request, res: Response, next: NextFunction) {
    const originalUrl: string = req.body?.url;

    if (!originalUrl) {
      res.locals.status = 400;
      next(new Error('Url is mising'));
      return;
    }
    const file = process.env.PERSISTED_FILE ?? '';
    const fileUrl = `private/${file}`;

    if (!file) throw new Error('Persisted File not found in env');

    let shortenedUrl: string = '';
    const data = await readFile(fileUrl);

    while (true) {
      shortenedUrl = generateShortUrl(
        originalUrl,
        process.env.HOST || req.get('host')
      );
      if (!data.hasOwnProperty(shortenedUrl)) {
        break;
      }
    }

    const auth = req.headers.authorization;
    if (auth) {
      addEntryToJsonFile(fileUrl, shortenedUrl, originalUrl);
      sendUrlResponse(shortenedUrl, auth);
    }

    res.end();
  }

  async getOriginalUrl(req: Request, res: Response, next: NextFunction) {
    const file = process.env.PERSISTED_FILE ?? '';
    const fileUrl = `private/${file}`;

    if (!file) throw new Error('Persisted File not found in env');

    const data = await readFile(fileUrl);
    const key = `${process.env.HOST || req.get('host')}${req.url}`;
    
    if (data[key]) {
      res.status(200).json({"url": data[key]}).end()
      return;
    } else {
      res.locals.status = 404;
      next(new Error('Short url not found'))
    }
  }
}
