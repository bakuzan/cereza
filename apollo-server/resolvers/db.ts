import { PinnedArgs } from '@i/PinnedArgs';
import { ConfirmationResponse } from '@i/ConfirmationResponse';

import createResolver from '../utils/createResolver';

export default createResolver({
  Query: {
    allPinned: async (_, __, context) => await context.Pinned.findAll(),
    async isDirectoryPinned(_, args: PinnedArgs, context): Promise<boolean> {
      const item = await context.Pinned.findOne({ where: { path: args.path } });
      return item !== null;
    }
  },
  Mutation: {
    async togglePinned(
      _,
      args: PinnedArgs,
      context
    ): Promise<ConfirmationResponse> {
      const item = await context.Pinned.findOne({ where: { path: args.path } });

      if (item) {
        return await context.Pinned.destroy({ where: { id: item.id } }).then(
          () => ({
            success: true,
            errorMessages: [],
            messages: [`Unpinned directory '${args.path}'.`]
          })
        );
      } else {
        return await context.Pinned.create({ path: args.path.trim() }).then(
          () => ({
            success: true,
            errorMessages: [],
            messages: [`Pinned directory '${args.path}'.`]
          })
        );
      }
    }
  }
});
