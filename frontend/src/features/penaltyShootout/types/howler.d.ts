declare module "howler" {
  export class Howl {
    constructor(options: {
      src: string[];
      volume?: number;
      loop?: boolean;
      preload?: boolean;
      html5?: boolean;
      onloaderror?: () => void;
      onplayerror?: () => void;
    });
    play(): number;
    stop(id?: number): this;
    volume(volume?: number, id?: number): number | this;
    fade(from: number, to: number, duration: number, id?: number): this;
    state(): "unloaded" | "loading" | "loaded";
    playing(id?: number): boolean;
    unload(): null;
  }
}
