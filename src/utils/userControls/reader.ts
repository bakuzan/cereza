import { EventKey } from '@/constants';

type RemoveListener = () => void;

export default function initReaderControls<T extends Vue>(
  component: T
): RemoveListener {
  console.log('init reader', component);
  function onKeyPress(event: KeyboardEvent) {
    const currentHash = component.$route.hash;
    const currentPage = currentHash ? Number(currentHash.split('_').pop()) : 1;
    let hash = null;

    switch (event.key) {
      case EventKey.Comma: {
        const num = currentPage - 1;
        hash = num > 0 ? `#page_${num}` : null;
        break;
      }
      case EventKey.Fullstop: {
        hash = `#page_${currentPage + 1}`;
        break;
      }
      default:
        break;
    }

    if (!hash) {
      return;
    }

    component.$router.replace({
      hash,
      name: 'Reader',
      query: {
        ...component.$route.query,
        scroll: 'true'
      }
    });
  }

  window.addEventListener('keypress', onKeyPress);
  return () => window.removeEventListener('keypress', onKeyPress);
}
