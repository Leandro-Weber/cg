"use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult + u_colorOffset;
}
`;

var vsw = `
attribute vec4 a_position;
attribute vec3 a_barycentric;
uniform mat4 u_matrix;
varying vec3 vbc;

void main() {
  vbc = a_barycentric;
  gl_Position = u_matrix * a_position;
}`;

var fsw = `
precision mediump float;
varying vec3 vbc;

void main() {
  if(vbc.x < 0.03 || vbc.y < 0.03 || vbc.z < 0.03) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } 
  else {
    gl_FragColor = vec4(0.5, 0.5, 0.8, 0.0);
  }
}`;
const calculateBarycentric = (length) => {
  const n = length / 9;
  const barycentric = [];
  for (let i = 0; i < n; i++) barycentric.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
  return new Float32Array(barycentric);
};

const degToRad = (d) => (d * Math.PI) / 180;

const radToDeg = (r) => (r * 180) / Math.PI;

var config = {
  rotate: 0,
  x: 0,
  y: 0,
  rotation: 0,
  camera_x: 4,
  addCaixa: function () {
    countC++;

    objeto.children.push({
      name: `cubo${countC}`,
      translation: [0, countC, 0],
    });

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};
    scene = makeNode(objeto);
  },
  triangulo: 0,
  criarVertice: function () {},
  time: 0.0,
  n_cubos: 1,
};

const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(config, "rotate", 0, 360, 0.5);
  gui.add(config, "x", -150, 150, 5);
  gui.add(config, "y", -100, 100, 5);
  gui.add(config, "rotation", -1000, 1000, 10);
  gui.add(config, "addCaixa");
  gui.add(config, "camera_x", -20, 20, 0.5);
  gui.add(config, "triangulo", 0, 20, 0.5);
  gui.add(config, "criarVertice");
  gui
    .add(config, "time", 0, 100)
    .listen()
    .onChange(function () {
      config.rotate = config.time + 1;

      //config.updateDisplay();
    });
  var n_cubos = gui.add(config, "n_cubos", 1, countC).listen();
  n_cubos.onChange(function () {
    n_cubos = countC;
    gui.updateDisplay();
  });
};

var TRS = function () {
  this.translation = [0, 0, 0];
  this.rotation = [0, 0, 0];
  this.scale = [1, 1, 1];
};

TRS.prototype.getMatrix = function (dst) {
  dst = dst || new Float32Array(16);
  var t = this.translation;
  var r = this.rotation;
  var s = this.scale;

  // compute a matrix from translation, rotation, and scale
  m4.translation(t[0], t[1], t[2], dst);
  m4.xRotate(dst, r[0], dst);
  m4.yRotate(dst, r[1], dst);
  m4.zRotate(dst, r[2], dst);
  m4.scale(dst, s[0], s[1], s[2], dst);
  return dst;
};

var Node = function (source) {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
  this.source = source;
};

Node.prototype.setParent = function (parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

Node.prototype.updateWorldMatrix = function (matrix) {
  var source = this.source;
  if (source) {
    source.getMatrix(this.localMatrix);
  }

  if (matrix) {
    // a matrix was passed in so do the math
    m4.multiply(matrix, this.localMatrix, this.worldMatrix);
  } else {
    // no matrix was passed in so just copy.
    m4.copy(this.localMatrix, this.worldMatrix);
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix);
  });
};

var VAO;
var cubeBufferInfo;
var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};
var scene;
var objeto = {};
var countF = 0;
var countC = 0;
var programInfo;
var wireframe = true;

//CAMERA VARIABLES
var cameraPosition;
var target;
var up;

function makeNode(nodeDescription) {
  var trs = new TRS();
  var node = new Node(trs);
  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    node: node,
  };
  trs.translation = nodeDescription.translation || trs.translation;
  if (nodeDescription.draw !== false) {
    if (wireframe) {
      node.drawInfo = {
        uniforms: {
          u_matrix: [0, 0, 0, 1],
        },
        programInfo: programInfo,
        bufferInfo: cubeBufferInfo,
        vertexArray: VAO,
      };
    } else {
      node.drawInfo = {
        uniforms: {
          u_colorOffset: [0.2, 0.2, 0.7, 0],
          u_colorMult: [0.4, 0.1, 0.4, 1],
        },
        programInfo: programInfo,
        bufferInfo: cubeBufferInfo,
        vertexArray: VAO,
      };
    }
    objectsToDraw.push(node.drawInfo);
    objects.push(node);

    makeNodes(nodeDescription.children).forEach(function (child) {
      child.setParent(node);
    });
    return node;
  }
}

function makeNodes(nodeDescriptions) {
  return nodeDescriptions ? nodeDescriptions.map(makeNode) : [];
}
function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  loadGUI(gl);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");
  var indices = new Uint16Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
  ]);
  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);
  var arrays_pyramid = {
    position: new Float32Array([
      0, 1, 0,

      -1, -1, 1,

      1, -1, 1,

      0, 1, 0,

      1, -1, 1,

      1, -1, -1,

      0, 1, 0,

      1, -1, -1,

      -1, -1, -1,

      0, 1, 0,

      -1, -1, -1,

      -1, -1, 1,

      -1, -1, -1,

      1, -1, 1,

      -1, -1, 1,

      -1, -1, -1,

      1, -1, -1,

      1, -1, 1,
    ]),

    // texcoord: new Float32Array([
    //   1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
    //   1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1,
    //   0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0, 1, 1,
    //   1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0,
    //   0, 1, 1,
    // ]),

    // vetor de indices nao eh usado com o wireframe pq o wireframe precisa que cada triangulo
    // que seja declarado no vetor precisa ser unico
    // indices: new Uint16Array([
    //   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 8, 4, 1, 8, 5, 2,
    // ]),
    normal: new Float32Array([
      1, -1, 1,

      1, -1, 1,

      1, 1, 1,

      -1, 1, 1,

      -1, -1, -1,

      -1, 1, -1,
    ]),
    barycentric: [],
  };
  arrays_pyramid.barycentric = calculateBarycentric(
    arrays_pyramid.position.length
  );
  console.log("aaa");
  console.log(calculateBarycentric(arrays_pyramid.position.length));
  // As posicoes do arrays_cube tao erradas, sem o CULL_FACES e sem os indices ta ruim
  var arrays_cube = {
    // vertex positions for a cube
    position: [
      1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1,
      -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1,
      1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1,
      1, -1, 1, -1, -1, -1, -1, -1,
    ],
    // vertex normals for a cube
    normal: [
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      0, 0, -1,
    ],
    indices: [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ],
    // barycentric: [
    //   0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
    //   14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    // ],
  };
  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);
  // Dado um array como:
  //   var arrays = {
  //     position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
  //     texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
  //     normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  //     indices:  [0, 1, 2, 1, 2, 3],
  //  };

  // Cria um buffer como esse
  // bufferInfo = {
  //   numElements: 4,        // or whatever the number of elements is
  //   indices: WebGLBuffer,  // this property will not exist if there are no indices
  //   attribs: {
  //     position: { buffer: WebGLBuffer, numComponents: 3, },
  //     normal:   { buffer: WebGLBuffer, numComponents: 3, },
  //     texcoord: { buffer: WebGLBuffer, numComponents: 2, },
  //   },
  // };
  console.log(cubeBufferInfo);
  console.log(arrays_cube.indices.length);

  // setup GLSL program

  programInfo = twgl.createProgramInfo(gl, [vsw, fsw]);

  VAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  // Let's make all the nodes
  objeto = {
    name: "cubo0",
    translation: [0, 0, 0],
    children: [],
  };
  console.log(programInfo);
  scene = makeNode(objeto);

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

    // Compute the camera's matrix using look at.
    cameraPosition = [config.camera_x, 3.5, 10];
    target = [0, 3.5, 0];
    up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var adjust;
    var speed = 3;
    var c = time * speed;

    adjust = degToRad(time * config.rotation);
    nodeInfosByName["cubo0"].trs.rotation[0] = adjust;
    //nodeInfosByName["cubo0"].trs.rotation[0] = degToRad(config.rotate);
    // Update all world matrices in the scene graph
    scene.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(
        viewProjectionMatrix,
        object.worldMatrix
      );
    });

    // wireframe = false;
    // programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    // VAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

    // objectsToDraw = [];
    // objects = [];
    // nodeInfosByName = {};
    // scene = makeNode(objeto);
    // scene.updateWorldMatrix();
    // objects.forEach(function (object) {
    //   object.drawInfo.uniforms.u_matrix = m4.multiply(
    //     viewProjectionMatrix,
    //     object.worldMatrix
    //   );
    // });
    // //twgl.drawObjectList(gl, objectsToDraw);

    // wireframe = true;
    // programInfo = twgl.createProgramInfo(gl, [vsw, fsw]);

    // VAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

    // //objectsToDraw = [];
    // //objects = [];
    // //nodeInfosByName = {};
    // scene = makeNode(objeto);
    // nodeInfosByName["cubo0"].trs.rotation[0] = adjust;
    // scene.updateWorldMatrix();

    // objects.forEach(function (object) {
    //   object.drawInfo.uniforms.u_matrix = m4.multiply(
    //     viewProjectionMatrix,
    //     object.worldMatrix
    //   );
    // });

    // ------ Draw the objects --------

    twgl.drawObjectList(gl, objectsToDraw);

    requestAnimationFrame(drawScene);
  }
}

main();
