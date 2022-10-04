"use strict";

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

// make a canvas with text in the center
const makeTextCanvas = (text, width, height, color) => {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.font = `bold ${((height * 5) / 6) | 0}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, width / 2, height / 2);
  return ctx.canvas;
};

const vsGLSL = `
attribute vec4 position;
attribute vec3 normal;
attribute vec2 texcoord;

uniform mat4 projection;
uniform mat4 modelView;

varying vec3 v_normal;
varying vec2 v_texcoord;

void main() {
    gl_Position = projection * modelView * position;
    v_normal = mat3(modelView) * normal;
    v_texcoord = texcoord;
}
`;

const fsGLSL = `
precision highp float;

varying vec3 v_normal;
varying vec2 v_texcoord;

uniform sampler2D diffuse;
uniform sampler2D decal;
uniform vec4 diffuseMult;
uniform vec3 lightDir;

void main() {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, lightDir) * 0.5 + 0.5;
    vec4 color = texture2D(diffuse, v_texcoord) * diffuseMult;
    vec4 decalColor = texture2D(decal, v_texcoord);
    decalColor.rgb *= decalColor.a;
    color = color * (1.0 - decalColor.a) + decalColor; 
    gl_FragColor = vec4(color.rgb * light, color.a);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader));
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsGLSL);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader));
}

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);
if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(prg));
}

// NOTE! These are only here to unclutter the diagram.
// It is safe to detach and delete shaders once
// a program is linked though it is arguably not common.
// and I usually don't do it.
gl.detachShader(prg, vertexShader);
gl.deleteShader(vertexShader);
gl.detachShader(prg, fragmentShader);
gl.deleteShader(fragmentShader);

const positionLoc = gl.getAttribLocation(prg, "position");
const normalLoc = gl.getAttribLocation(prg, "normal");
const texcoordLoc = gl.getAttribLocation(prg, "texcoord");

const projectionLoc = gl.getUniformLocation(prg, "projection");
const modelViewLoc = gl.getUniformLocation(prg, "modelView");
const diffuseLoc = gl.getUniformLocation(prg, "diffuse");
const decalLoc = gl.getUniformLocation(prg, "decal");
const diffuseMultLoc = gl.getUniformLocation(prg, "diffuseMult");
const lightDirLoc = gl.getUniformLocation(prg, "lightDir");

// vertex positions for a cube
const cubeVertexPositions = new Float32Array([
  1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,
  -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1,
  1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1,
  -1, -1, -1, -1, -1,
]);
// vertex normals for a cube
const cubeVertexNormals = new Float32Array([
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
]);
// vertex texture coordinates for a cube
const cubeVertexTexcoords = new Float32Array([
  1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0,
  0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
]);
// vertex indices for the triangles of a cube
// the data above defines 24 vertices. We need to draw 12
// triangles, 2 for each size, each triangle needs
// 3 vertices so 12 * 3 = 36
const cubeVertexIndices = new Uint16Array([
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
  15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeVertexPositions, gl.STATIC_DRAW);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeVertexNormals, gl.STATIC_DRAW);

const texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeVertexTexcoords, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, gl.STATIC_DRAW);

const checkerTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, checkerTexture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0, // mip level
  gl.LUMINANCE, // internal format
  4, // width
  4, // height
  0, // border
  gl.LUMINANCE, // format
  gl.UNSIGNED_BYTE, // type
  new Uint8Array([
    // data
    192, 128, 192, 128, 128, 192, 128, 192, 192, 128, 192, 128, 128, 192, 128,
    192,
  ])
);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

const decalTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, decalTexture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0, // mip level
  gl.RGBA, // internal format
  gl.RGBA, // format
  gl.UNSIGNED_BYTE, // type
  makeTextCanvas("F", 32, 32, "red")
);
gl.generateMipmap(gl.TEXTURE_2D);

// above this line is initialization code
// --------------------------------------
// below is rendering code.

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0.5, 0.7, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(
  positionLoc, // location
  3, // size (components per iteration)
  gl.FLOAT, // type of to get from buffer
  false, // normalize
  0, // stride (bytes to advance each iteration)
  0 // offset (bytes from start of buffer)
);

gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.enableVertexAttribArray(normalLoc);
gl.vertexAttribPointer(
  normalLoc, // location
  3, // size (components per iteration)
  gl.FLOAT, // type of to get from buffer
  false, // normalize
  0, // stride (bytes to advance each iteration)
  0 // offset (bytes from start of buffer)
);

gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.enableVertexAttribArray(texcoordLoc);
gl.vertexAttribPointer(
  texcoordLoc, // location
  2, // size (components per iteration)
  gl.FLOAT, // type of to get from buffer
  false, // normalize
  0, // stride (bytes to advance each iteration)
  0 // offset (bytes from start of buffer)
);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

gl.useProgram(prg);

// Picking unit 6 just to be different. The default of 0
// would render but would show less state changing.
let texUnit = 6;
gl.activeTexture(gl.TEXTURE0 + texUnit);
gl.bindTexture(gl.TEXTURE_2D, checkerTexture);
gl.uniform1i(diffuseLoc, texUnit);

texUnit = 3;
gl.activeTexture(gl.TEXTURE0 + texUnit);
gl.bindTexture(gl.TEXTURE_2D, decalTexture);
gl.uniform1i(decalLoc, texUnit);

gl.uniform3fv(lightDirLoc, m4.normalize([1, 5, 8]));

const projection = m4.perspective(
  (60 * Math.PI) / 180, // fov
  gl.canvas.clientWidth / gl.canvas.clientHeight, // aspect
  0.1, // near
  10 // far
);
gl.uniformMatrix4fv(projectionLoc, false, projection);

// draw center cube

let modelView = m4.identity();
modelView = m4.translate(modelView, 0, 0, -4);
modelView = m4.xRotate(modelView, 0.5);
modelView = m4.yRotate(modelView, 0.5);

gl.uniformMatrix4fv(modelViewLoc, false, modelView);

gl.uniform4fv(diffuseMultLoc, [0.7, 1, 0.7, 1]);

gl.drawElements(
  gl.TRIANGLES,
  36, // num vertices to process
  gl.UNSIGNED_SHORT, // type of indices
  0 // offset on bytes to indices
);

// draw left cube

modelView = m4.identity();
modelView = m4.translate(modelView, -3, 0, -4);
modelView = m4.xRotate(modelView, 0.5);
modelView = m4.yRotate(modelView, 0.8);

gl.uniformMatrix4fv(modelViewLoc, false, modelView);

gl.uniform4fv(diffuseMultLoc, [1, 0.7, 0.7, 1]);

gl.drawElements(
  gl.TRIANGLES,
  36, // num vertices to process
  gl.UNSIGNED_SHORT, // type of indices
  0 // offset on bytes to indices
);

// draw right cube

modelView = m4.identity();
modelView = m4.translate(modelView, 3, 0, -4);
modelView = m4.xRotate(modelView, 0.6);
modelView = m4.yRotate(modelView, -0.6);

gl.uniformMatrix4fv(modelViewLoc, false, modelView);

gl.uniform4fv(diffuseMultLoc, [0.7, 0.7, 1, 1]);

gl.drawElements(
  gl.TRIANGLES,
  36, // num vertices to process
  gl.UNSIGNED_SHORT, // type of indices
  0 // offset on bytes to indices
);
