import { DirectoryEntry } from '@i/DirectoryEntry';

import { padNumber } from '@s/utils';
import { monthNames } from '@s/constants';

export default {
  Query: {
    hello: (root: any, { name }: { name: string }) =>
      `Hello ${name || 'World'}!`
  },
  DirectoryEntry: {
    date(item: DirectoryEntry) {
      const d = new Date(item.date);

      return [
        d.getFullYear(),
        monthNames[d.getMonth()],
        d.getDate(),
        `${padNumber(d.getHours(), 2)}:${padNumber(d.getMinutes(), 2)}`
      ].join(' ');
    }
  }
};
