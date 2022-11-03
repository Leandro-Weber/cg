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
var temp;
var listOfVertices = [];
var palette = {
  color1: "#FF0000", // CSS string
  corLuz: [255, 255, 255], // RGB array
  corCubo: [255, 0, 0, 1], // RGB with alpha
  color4: { h: 350, s: 0.9, v: 0.3 }, // Hue, saturation, value
};

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
  trs.rotation = nodeDescription.rotation || trs.rotation;
  if (nodeDescription.draw !== false) {
    node.drawInfo = {
      uniforms: {
        u_color: [0.4, 0.4, 0.4, 1],
      },
      programInfo: programInfo,
      bufferInfo: cubeBufferInfo,
      vertexArray: VAO,
    };

    objectsToDraw.push(node.drawInfo);
    objects.push(node);
  }
  makeNodes(nodeDescription.children).forEach(function (child) {
    child.setParent(node);
  });
  return node;
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

  // loadGUI(gl);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");

  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);
  //console.log(arrays_cube5.position.reverse());
  var buf = [];
  for (let index = 0; index < arrays_cube5.position.length; index = index + 3) {
    buf = [
      arrays_cube5.position[index],
      arrays_cube5.position[index + 1],
      arrays_cube5.position[index + 2],
      ...buf,
    ];
  }
  console.log(`${buf}`);
  arrays_pyramid = arrays_cube5;
  //arrays_pyramid.position = buf;

  arrays_pyramid.barycentric = calculateBarycentric(
    arrays_pyramid.position.length
  );

  arrays_pyramid.normal = calculateNormal(
    arrays_pyramid.position,
    arrays_pyramid.indices
  );

  // normalComIndice();
  // normalSemIndice;
  // As posicoes do arrays_cube tao erradas, sem o CULL_FACES e sem os indices ta ruim

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

  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);

  // setup GLSL program

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  //console.log(programInfo);

  VAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

  listOfVertices = arrays_pyramid.indices;

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  fieldOfViewRadians = degToRad(60);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  // Let's make all the nodes
  objeto = {
    name: "Center of the world",
    draw: false,
    children: [
      {
        name: "cubo0",
        draw: true,
        translation: [0, 0, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        //bufferInfo: cubeBufferInfo,
        //vertexArray: cubeVAO,
        children: [
          {
            name: "cuboVertice0",
            draw: true,
            translation: [0, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            children: [],
          },
        ],
      },
      {
        name: "light",
        draw: true,
        translation: [config.luzx, config.luzy, config.luzz],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        children: [],
      },
    ],
  };
  console.log(objeto);
  scene = makeNode(objeto);
  //temp = mapAllVertices(arrays_pyramid.position, arrays_pyramid.indices);
  console.log(mapAllVertices(arrays_pyramid.position, arrays_pyramid.indices));
  cameraPosition = [4, 4, 10];

  const temp = arrays_pyramid.position.slice(
    config.vertice * 3,
    config.vertice * 3 + 3
  );

  config.vx = temp[0];
  config.vy = temp[1];
  config.vz = temp[2];
  requestAnimationFrame(drawScene);
  //console.log(programInfo);
  // Draw the scene.
}
function drawScene(time) {
  time *= 0.001;
  teste = time;
  config.time = config.time;
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  listOfVertices = arrays_pyramid.indices;

  if (gui == null) loadGUI(gl);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // Compute the projection matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

  // Compute the camera's matrix using look at.
  target = [config.target, 0, 0];
  up = [0, 1, 0];
  cameraMatrix = m4.lookAt(cameraPosition, target, up);

  // Make a view matrix from the camera matrix.
  viewMatrix = m4.inverse(cameraMatrix);

  viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  var fRotationRadians = degToRad(config.spin_x);

  adjust;
  speed = 3;
  //console.log(nodeInfosByName);
  computeMatrix(nodeInfosByName["cubo0"], config);
  computeMatrixLuz(nodeInfosByName["light"], config);
  computeMatrixCuboVertice(nodeInfosByName["cuboVertice0"], config);
  //nodeInfosByName

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
      config.luzx,
      config.luzy,
      config.luzz,
    ];

    object.drawInfo.uniforms.u_lightColor = [
      convertToZeroOne(palette["corLuz"][0], 0, 255),
      convertToZeroOne(palette["corLuz"][1], 0, 255),
      convertToZeroOne(palette["corLuz"][2], 0, 255),
    ];

    object.drawInfo.uniforms.u_color = [
      convertToZeroOne(palette["corCubo"][0], 0, 255),
      convertToZeroOne(palette["corCubo"][1], 0, 255),
      convertToZeroOne(palette["corCubo"][2], 0, 255),
      palette["corCubo"][3],
    ];
    // console.log(object.drawInfo.uniforms.u_lightColor);
    // console.log(object.drawInfo.uniforms.u_color);
    object.drawInfo.uniforms.u_specularColor = [0.5, 1, 0.5];
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

  // ------ Draw the objects --------

  twgl.drawObjectList(gl, objectsToDraw);

  requestAnimationFrame(drawScene);
}

main();
