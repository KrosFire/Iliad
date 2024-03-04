/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
export const compileShader = (gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader => {
  // Create the shader object
  const shader = gl.createShader(shaderType)

  if (!shader) throw Error('Could not create shader')
  // Set the shader source code.
  gl.shaderSource(shader, shaderSource)

  // Compile the shader
  gl.compileShader(shader)

  // Check if it compiled
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    // Something went wrong during compilation; get the error
    throw 'could not compile shader:' + gl.getShaderInfoLog(shader)
  }

  return shader
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext} gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram => {
  // create a program.
  const program = gl.createProgram()

  if (!program) throw Error('Could not create program')

  // attach the shaders.
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  // link the program.
  gl.linkProgram(program)

  // Check if it linked.
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
    // something went wrong with the link
    throw 'program failed to link:' + gl.getProgramInfoLog(program)
  }

  return program
}

/**
 * Resize a canvas to match the size its displayed.
 */
export const resizeCanvasToDisplaySize = (
  canvas: OffscreenCanvas,
  state: { width: number; height: number },
): boolean => {
  if (canvas.width !== state.width || canvas.height !== state.height) {
    canvas.width = state.width
    canvas.height = state.height
    return true
  }
  return false
}

/**
 * Sets data to current buffer connected to gl.ARRAY_BUFFER of vertices coords
 * needed to draw a rectangle
 *
 * @param {!WebGLRenderingContext} gl
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
export const setRectangle = (gl: WebGLRenderingContext, x: number, y: number, width: number, height: number): void => {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW)
}
