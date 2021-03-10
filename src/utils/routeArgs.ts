import { Route } from 'vue-router';
import { capitalise } from './capitalise';

export function getLocation(route: Route) {
  const loc = route.query['loc'];
  return (loc instanceof Array ? loc.pop() : loc) ?? '';
}

export function getRecursive(route: Route) {
  const rec = route.query['recursive'];
  const recursive = (rec instanceof Array ? rec.pop() : rec) ?? false;
  return recursive === 'true';
}

function prepSortOption(
  validValues: string[],
  convert: (x: string) => string,
  val: string | undefined,
  fallback: string
) {
  return val && validValues.includes(convert(val)) ? val : fallback;
}

export function getSort(route: Route) {
  const defaultSort = { field: 'Name', order: 'ASC' };

  const sor = route.query['sort'];
  const sorted = (sor instanceof Array ? sor.pop() : sor) ?? 'Name__ASC';
  const [rField, rOrder] = sorted.split('__');
  const field = prepSortOption(
    ['Name', 'Time'],
    (x) => capitalise(x.toLowerCase()),
    rField,
    defaultSort.field
  );
  const order = prepSortOption(
    ['ASC', 'DESC'],
    (x) => x.toUpperCase(),
    rOrder,
    defaultSort.order
  );

  return {
    field,
    order
  };
}
