import { Pinned } from '#/db/Pinned.model';

import { PinnedArgs } from '@i/PinnedArgs';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import createResolver from '#/utils/createResolver';

export default createResolver({
  Query: {
    allPinned: async () => await Pinned.findAll()
  },
  Mutation: {
    async togglePinned(_, args: PinnedArgs): Promise<ConfirmationResponse> {
      const item = await Pinned.findOne({ where: { path: args.path } });

      if (item) {
        return await Pinned.destroy({ where: { id: item.id } }).then(() => ({
          success: true,
          errorMessages: [],
          messages: [`Unpinned directory '${args.path}'.`]
        }));
      } else {
        return await Pinned.create({ path: args.path.trim() }).then(() => ({
          success: true,
          errorMessages: [],
          messages: [`Pinned directory '${args.path}'.`]
        }));
      }
    }
  }
});
