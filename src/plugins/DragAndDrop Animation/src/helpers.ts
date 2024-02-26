import { DropZone, Position } from './types'

export const positions: { [key in DropZone]: Position } = {
  [DropZone.CENTER]: {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  [DropZone.LEFT]: {
    x: 0,
    y: 0,
    width: 25,
    height: 100
  },
  [DropZone.RIGHT]: {
    x: 75,
    y: 0,
    width: 25,
    height: 100
  },
  [DropZone.TOP]: {
    x: 0,
    y: 75,
    width: 100,
    height: 25
  },
  [DropZone.BOTTOM]: {
    x: 0,
    y: 0,
    width: 100,
    height: 25
  },
  [DropZone.LEFT_CORNER]: {
    x: 0,
    y: 0,
    width: 0,
    height: 100
  },
  [DropZone.RIGHT_CORNER]: {
    x: 100,
    y: 0,
    width: 25,
    height: 100
  },
  [DropZone.TOP_CORNER]: {
    x: 0,
    y: 100,
    width: 100,
    height: 25
  },
  [DropZone.BOTTOM_CORNER]: {
    x: 0,
    y: 0,
    width: 100,
    height: 0
  }
}

export const vertexShaderSource = `
  attribute vec2 a_position;

  void main() {
    float division = 50.0;
    vec2 position = a_position / division - 1.0;
    gl_Position = vec4(position, 0, 1);
  }
`

export const fragmentShaderSource = `
  precision highp float;
  
  uniform vec4 u_color;

  void main() {
    gl_FragColor = vec4(u_color.xyz / 255.0, u_color.w);
  }
`

