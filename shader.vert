#ifdef GL_ES
precision mediump float;
#endif

// uniforms (sent from sketch.js)

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// position & text coordinate attributes
// these values come from the geometry being drawn 
attribute vec3 aPosition;
attribute vec2 aTexCoord;


varying vec2 vTexCoord;

void main() {

  // define our vertex position
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  vTexCoord = aTexCoord;

  // send the position to this GPU
  // (this is like gl_FragColor but for vertices)
  gl_Position = uProjectionMatrix * viewModelPosition;
}