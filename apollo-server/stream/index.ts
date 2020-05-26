import { Request, Response } from 'express';
import fs from 'fs';

import { getPathExtension } from '../utils';
import { deobfuscate } from '../utils/obfuscate';

export function streamVideo(req: Request, res: Response) {
  const { key } = req.params;

  const videoPath = deobfuscate(key);
  const videoExt = getPathExtension(videoPath);

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send(`Requested range not satisfiable\n${start} >= ${fileSize}`);

      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': `video/${videoExt}`
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': `video/${videoExt}`
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
}
