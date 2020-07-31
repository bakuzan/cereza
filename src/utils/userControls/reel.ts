import { EventKey } from '@/constants';

type RemoveListener = () => void;

interface ReelOptions {
  onChange(direction: number): void;
  onPlaybackSpeedChange(speed: number): void;
  onRandom(): void;
  onToggleAutoCycle(): void;
  onToggleRandomisedCycle(): void;
  selector: string;
}

const getVideo = (sel: string) => document.querySelector<HTMLVideoElement>(sel);
const playbackChangeKeys: string[] = [
  EventKey.Minus,
  EventKey.Equals,
  EventKey.Key0
];

function seekToPoint(player: HTMLVideoElement, seconds: number) {
  let seekToTime = player.currentTime + seconds;

  if (seekToTime < 0) {
    seekToTime = player.duration;
  } else if (seekToTime > player.duration) {
    seekToTime = 0;
  }

  player.currentTime = seekToTime;
}

export default function initReelControls(options: ReelOptions): RemoveListener {
  function onKeyPress(event: KeyboardEvent) {
    const player = getVideo(options.selector);
    if (!player) {
      return;
    }

    switch (event.key) {
      case EventKey.KeyA:
        options.onToggleAutoCycle();
        break;

      case EventKey.KeyZ:
        options.onToggleRandomisedCycle();
        break;

      case EventKey.KeyP:
        options.onChange(-1);
        break;

      case EventKey.KeyN:
        options.onChange(1);
        break;

      case EventKey.KeyR:
        options.onRandom();
        break;

      case EventKey.KeyL:
        player.loop = !player.loop;
        break;

      case EventKey.KeyS:
        if ((event.target as HTMLElement).id !== 'filter') {
          event.preventDefault();
          document.querySelector<HTMLInputElement>('#filter')?.focus();
        }
        break;

      // Play/Pause
      case EventKey.Space: {
        event.preventDefault();

        if (event.target === player) {
          return;
        }

        return player.paused ? player.play() : player.pause();
      }

      // Fullscreen
      case EventKey.KeyF: {
        return document.fullscreenElement === null
          ? player.requestFullscreen()
          : document.exitFullscreen();
      }

      // Speed adjustments
      case EventKey.Minus: {
        player.playbackRate = Math.max(0, player.playbackRate - 0.25);
        break;
      }
      case EventKey.Equals: {
        player.playbackRate += 0.25;
        break;
      }
      case EventKey.Key0: {
        player.playbackRate = 1;
        break;
      }

      // Skip backward
      case EventKey.Comma: {
        seekToPoint(player, -5);
        break;
      }
      case EventKey.AngleLeft: {
        seekToPoint(player, -30);
        break;
      }
      case EventKey.SlashBackward: {
        seekToPoint(player, -60);
        break;
      }

      // Skip forward
      case EventKey.Fullstop: {
        seekToPoint(player, 5);
        break;
      }
      case EventKey.AngleRight: {
        seekToPoint(player, 30);
        break;
      }
      case EventKey.SlashForward: {
        seekToPoint(player, 60);
        break;
      }

      default:
        break;
    }

    // is playback speed change
    if (playbackChangeKeys.includes(event.key)) {
      options.onPlaybackSpeedChange(player.playbackRate);
    }
  }

  window.addEventListener('keypress', onKeyPress);
  return () => window.removeEventListener('keypress', onKeyPress);
}
