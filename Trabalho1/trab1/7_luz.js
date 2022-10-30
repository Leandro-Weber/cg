"use strict";

const calculateBarycentric = (length) => {
  const n = length / 9;
  const barycentric = [];
  for (let i = 0; i < n; i++) barycentric.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
  return new Float32Array(barycentric);
};

const degToRad = (d) => (d * Math.PI) / 180;

const radToDeg = (r) => (r * 180) / Math.PI;

const calculaMeioDoTriangulo = (arr) => {
  const x = (arr[0] + arr[3] + arr[6]) / 3;
  const y = (arr[1] + arr[4] + arr[7]) / 3;
  const z = (arr[2] + arr[5] + arr[8]) / 3;

  return [x, y, z];
};

const crossProduct = (a, b) => {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};

const somaNormal = (v, n) => {
  return [v[0] + n[0], v[1] + n[1], v[2] + n[2]];
};

const calculaMeioDoTrianguloIndices = (arr) => {
  // arr contem os indices dos vertices q formam o triangulo que quero adicionar um vertice no meio
  const x =
    (arrays_pyramid.position[arr[0] * 3] +
      arrays_pyramid.position[arr[1] * 3] +
      arrays_pyramid.position[arr[2] * 3]) /
    3;
  const y =
    (arrays_pyramid.position[arr[0] * 3 + 1] +
      arrays_pyramid.position[arr[1] * 3 + 1] +
      arrays_pyramid.position[arr[2] * 3 + 1]) /
    3;
  const z =
    (arrays_pyramid.position[arr[0] * 3 + 2] +
      arrays_pyramid.position[arr[1] * 3 + 2] +
      arrays_pyramid.position[arr[2] * 3 + 2]) /
    3;

  return [x, y, z];
};

var teste = 1;
var gui;
var qtd_triangulos = 0;

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
var wireframe = false;
var arrays_pyramid;
var gl;
var aspect;
var projectionMatrix;
var cameraMatrix;
var viewMatrix;
var viewProjectionMatrix = degToRad(0);
var adjust;
var speed;
var c;
var fieldOfViewRadians;
var reverseLightDirectionLocation;
var worldViewProjectionLocation;
var worldLocation;
var worldInverseTransposeLocation;
var worldViewProjectionMatrix;
var worldMatrix;

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
    node.drawInfo = {
      uniforms: {
        u_color: [0.2, 1, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: cubeBufferInfo,
      vertexArray: VAO,
    };

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
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  loadGUI(gl);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");

  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);

  arrays_pyramid = arrays_cube2;
  arrays_pyramid.barycentric = calculateBarycentric(
    arrays_pyramid.position.length
  );

  // arrays_pyramid.normal = calculateNormal(
  //   arrays_pyramid.position,
  //   arrays_pyramid.indices
  // );
  normalComIndice;
  // normalSemIndice;
  // As posicoes do arrays_cube tao erradas, sem o CULL_FACES e sem os indices ta ruim

  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);

  // console.log(calculaMeioDoTrianguloIndices([0, 3, 2]));
  // console.log(arrays_pyramid.position[0 * 3 + 1]);
  // console.log("a");
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
  //console.log(cubeBufferInfo);
  //console.log(arrays_cube.indices.length);

  // setup GLSL program

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  //console.log(programInfo);

  VAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  fieldOfViewRadians = degToRad(60);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  // Let's make all the nodes
  objeto = {
    name: "cubo0",
    translation: [0, 0, 0],
    children: [],
  };
  //console.log(programInfo);
  scene = makeNode(objeto);

  requestAnimationFrame(drawScene);
  //console.log(programInfo);
  // Draw the scene.
}
function drawScene(time) {
  time *= 0.001;
  teste = time;
  config.time = config.time;
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.disable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // Compute the projection matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

  // Compute the camera's matrix using look at.
  cameraPosition = [config.camera_x, config.camera_y, config.camera_z];
  target = [config.target, 0, 0];
  up = [0, 1, 0];
  cameraMatrix = m4.lookAt(cameraPosition, target, up);

  // Make a view matrix from the camera matrix.
  viewMatrix = m4.inverse(cameraMatrix);

  viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  var fRotationRadians = degToRad(config.spin_x);

  adjust;
  speed = 3;
  c = time * speed;

  adjust = degToRad(time * config.spin_x);
  nodeInfosByName["cubo0"].trs.rotation[0] = adjust;
  adjust = degToRad(time * config.spin_y);
  nodeInfosByName["cubo0"].trs.rotation[1] = adjust;
  nodeInfosByName["cubo0"].trs.translation = [config.x, config.y, config.z];

  //nodeInfosByName["cubo0"].trs.rotation[0] = degToRad(config.rotate);
  // Update all world matrices in the scene graph
  scene.updateWorldMatrix();

  // Compute all the matrices for rendering
  objects.forEach(function (object) {
    object.drawInfo.uniforms.u_matrix = m4.multiply(
      viewProjectionMatrix,
      object.worldMatrix
    );
    object.drawInfo.uniforms.u_lightWorldPosition = [
      config.teste0,
      config.teste1,
      config.teste2,
    ];

    object.drawInfo.uniforms.u_world = m4.multiply(
      object.worldMatrix,
      m4.yRotation(fRotationRadians)
    );

    object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(
      m4.inverse(object.worldMatrix)
    );

    object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition;

    object.drawInfo.uniforms.u_shininess = config.shininess;
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

main();
