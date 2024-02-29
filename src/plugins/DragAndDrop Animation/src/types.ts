export interface Position {
  x: number
  y: number
  width: number
  height: number
}

export enum DropZone {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  TOP_CORNER = 'top-corner',
  LEFT_CORNER = 'left-corner',
  RIGHT_CORNER = 'right-corner',
  BOTTOM_CORNER = 'bottom-corner',
  CENTER = 'center',
}

export interface UpdateAnimationContext {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
}
