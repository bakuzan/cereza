import { EventKey } from '@/constants';

type RemoveListener = () => void;

interface ReelOptions {
  onPlaybackSpeedChange(speed: number): void;
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
      // Play/Pause
      case EventKey.Space: {
        event.preventDefault();
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
        seekToPoint(player, -10);
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
        seekToPoint(player, 10);
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
