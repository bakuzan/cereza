import { db } from '@s/db';
import PinnedModel from '@s/db/Pinned.model';

export const Pinned = db.getRepository(PinnedModel);
