import { fragmentShaderSource, positions, vertexShaderSource } from './helpers'
import { DropZone, Position } from './types'
import { compileShader, createProgram, resizeCanvasToDisplaySize, setRectangle } from './utils'

const transition = (initial: Position, dest: Position, progress: number): Position => ({
  x: initial.x * (1 - progress) + dest.x * progress,
  y: initial.y * (1 - progress) + dest.y * progress,
  height: initial.height * (1 - progress) + dest.height * progress,
  width: initial.width * (1 - progress) + dest.width * progress
})

const getDropZone = (x: number, y: number, inOrOut: boolean): DropZone => {
  if (x >= 0 && x <= 0.25) return inOrOut ? DropZone.LEFT_CORNER : DropZone.LEFT
  if (x >= 0.75 && x <= 1) return inOrOut ? DropZone.RIGHT_CORNER : DropZone.RIGHT

  if (y >= 0.75 && y <= 1) return inOrOut ? DropZone.BOTTOM_CORNER : DropZone.BOTTOM
  if (y >= 0 && y <= 0.25) return inOrOut ? DropZone.TOP_CORNER : DropZone.TOP
  
  if (x <= 0) return DropZone.LEFT_CORNER
  if (x >= 1) return DropZone.RIGHT_CORNER

  if (y >= 1) return DropZone.BOTTOM_CORNER
  if (y <= 0) return DropZone.TOP_CORNER

  return DropZone.CENTER
}

const draw = (gl: WebGLRenderingContext, position: Position) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT)

  setRectangle(gl, position.x, position.y, position.width, position.height)

  gl.drawArrays(
    gl.TRIANGLES,
    0,
    6
  )
}

const startAnimation = (canvas: OffscreenCanvas, width: number, height: number): AnimationHandlers => {
  const gl = canvas.getContext('webgl')

  if (!gl) throw new Error('No webgl available')

  const state = {
    width,
    height,
  };

  resizeCanvasToDisplaySize(canvas, state)

  // ------------------- Program setup -----------------------
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)

  const program = createProgram(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  // ------------------ Definition of rectangle --------------------
  // Percentages as values

  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const positionBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
  )

  // ------------------ Set color ---------------------

  const color = [69, 33, 254, 0.3]

  const colorPosition = gl.getUniformLocation(program, 'u_color')

  gl.uniform4fv(colorPosition, new Float32Array(color))

  // ------------------ Render -------------------
  let previousDropZone: DropZone | null = null
  let currentAnimationId = 0
  let stopAnimation = false

  const makeTransition = (
    initialPosition: Position,
    destinationPosition: Position,
    initialTime: number | null,
    canvas: OffscreenCanvas,
    gl: WebGLRenderingContext): void => {
  
    currentAnimationId = self.requestAnimationFrame((currentTime) => {
      if (stopAnimation) return
      if (initialTime === null) initialTime = currentTime

      const progress = Math.min(
        (currentTime - initialTime) / 2,
        100)
  
      const position = transition(initialPosition, destinationPosition, progress/100)
      
      resizeCanvasToDisplaySize(canvas, state)
      draw(gl, position)
      if (progress < 100) makeTransition(initialPosition, destinationPosition, initialTime, canvas, gl)
    })
  }

  const updateAnimation = (e: DragEvent, inOrOut = false) => {
    const x = e.offsetX / canvas.width
    const y = e.offsetY / canvas.height
    const dropZone = getDropZone(x, y, inOrOut)
  
    if (previousDropZone === null) {
      resizeCanvasToDisplaySize(canvas, state)
      draw(gl, positions[dropZone])
    } else if (previousDropZone !== dropZone) {
      const initialPosition = positions[previousDropZone]
      const destinationPosition = positions[dropZone]
  
      makeTransition(initialPosition, destinationPosition, null, canvas, gl)
    }
  
    previousDropZone = dropZone
  }

  const updateAnimationOnInOrOut = (e: DragEvent) => updateAnimation(e, true)

  return {
    'stop': () => {
      self.cancelAnimationFrame(currentAnimationId)
      stopAnimation = true
    },
    'dragover': updateAnimation,
    'dragenter': updateAnimationOnInOrOut,
    'dragleave': updateAnimationOnInOrOut,
    'resize': (width: number, height: number) => {
      state.width = width
      state.height = height
      resizeCanvasToDisplaySize(canvas, state)
    }
  }
}

type AnimationHandlers = {
  'stop': () => void,
  'dragover': (e: DragEvent) => void,
  'dragenter': (e: DragEvent) => void,
  'dragleave': (e: DragEvent) => void
  'resize': (width: number, height: number) => void
}

const animations = new Map<string, AnimationHandlers>()

self.onmessage = (e) => {
  switch (e.data.type) {
    case 'start': {
      const { canvas, id, width, height } = e.data as { canvas: OffscreenCanvas, id: string, width: number, height: number }

      if (!canvas) throw new Error('No canvas provided')
      if (!id) throw new Error('No id provided')

      animations.set(id, startAnimation(canvas, width, height))
      break;
    }
    case 'resize': {
      const { id, width, height } = e.data as { id: string, width: number, height: number }

      if (!id) throw new Error('No id provided')
      const handlers = animations.get(id)
      
      handlers?.resize(width, height)
      break;
    }
    case 'dragover': {
      const { id, event } = e.data as { id: string, event: DragEvent }

      if (!id) throw new Error('No id provided')
      const handlers = animations.get(id)
      if (handlers) handlers.dragover(event)
      else throw new Error('No animation found')
      break;
    }
    case 'dragenter': {
      const { id, event } = e.data as { id: string, event: DragEvent }

      if (!id) throw new Error('No id provided')
      const handlers = animations.get(id)
      if (handlers) handlers.dragenter(event)
      else throw new Error('No animation found')
      break;
    }
    case 'dragleave': {
      const { id, event } = e.data as { id: string, event: DragEvent }

      if (!id) throw new Error('No id provided')
      const handlers = animations.get(id)
      if (handlers) handlers.dragleave(event)
      else throw new Error('No animation found')
      break;
    }
    case 'stop': {
      const { id: stopId } = e.data as { id: string }
      const handlers = animations.get(stopId)
      if (handlers) handlers.stop()
      else throw new Error('No animation found')

      animations.delete(stopId)
      break;
    }
  }
}
