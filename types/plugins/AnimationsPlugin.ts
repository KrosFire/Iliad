export type StopAnimationAction = () => void

export type StartAnimationAction = (canvas: HTMLCanvasElement) => StopAnimationAction

export interface AnimationPluginExportedFunctions {
  /**
   * This function get's triggered when file get's dragged over a window
   *
   * As an argument it get a canvas on which animation should be displayed
   *
   * It should return a function that will stop this animation
   */
  startAnimation: StartAnimationAction
}
