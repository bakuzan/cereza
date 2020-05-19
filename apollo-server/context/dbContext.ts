import { db } from '../db';
import PinnedModel from '../db/Pinned.model';

export const Pinned = db.getRepository(PinnedModel);
