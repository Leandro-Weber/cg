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
var temp;
var listOfVertices = [];
var listOfLights = [0, 1, 2];
var palette = {
  corLuz: [255, 255, 255], // RGB array
  corCubo: [255, 255, 255], // RGB array
  corSpec: [255, 255, 255], // RGB array
};
var tex;

var arrLuz = [
  new Luz([4, 0, 0], [255, 255, 255], [255, 255, 255], 300),
  new Luz([-4, 0, 0], [255, 255, 255], [255, 255, 255], 300),
  new Luz([5, 4, 8], [255, 255, 255], [255, 255, 255], 300),
];

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
        u_texture: nodeDescription.texture,
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

  tex = twgl.createTextures(gl, {
    nitro: {
      src: "http://127.0.0.1:5500/Trabalho1/trab1/texture/areia.jpg",
    },
  });
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

  // loadGUI(gl);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");

  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);
  //console.log(arrays_cube5.position.reverse());
  // var buf = [];
  // for (let index = 0; index < arrays_cube5.position.length; index = index + 3) {
  //   buf = [
  //     arrays_cube5.position[index],
  //     arrays_cube5.position[index + 1],
  //     arrays_cube5.position[index + 2],
  //     ...buf,
  //   ];
  // }
  //console.log(`${buf}`);
  arrays_pyramid = arrays_cube6;
  //arrays_pyramid.position = buf;

  arrays_pyramid.barycentric = calculateBarycentric(
    arrays_pyramid.position.length
  );

  arrays_pyramid.normal = calculateNormal(
    arrays_pyramid.position,
    arrays_pyramid.indices
  );

  locura();
  console.log("normal");
  console.log(arrays_pyramid.normal);

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

  programInfo = twgl.createProgramInfo(gl, [vs3luz, fs3luz]);
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
        texture: tex.nitro,
        //bufferInfo: cubeBufferInfo,
        //vertexArray: cubeVAO,
        children: [
          {
            name: "cuboVertice0",
            draw: true,
            translation: [0, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            texture: tex.nitro,
            children: [],
          },
        ],
      },
      {
        name: "light1",
        draw: true,
        translation: [config.luzx, config.luzy, config.luzz],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        texture: tex.nitro,
        children: [],
      },
      {
        name: "light2",
        draw: true,
        translation: [[3, 0, 0]],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        texture: tex.nitro,
        children: [],
      },
    ],
  };
  console.log(objeto);
  scene = makeNode(objeto);
  objects.forEach(function (object) {
    object.drawInfo.uniforms.u_lightWorldPosition0 = [
      arrLuz[0].position.x,
      arrLuz[0].position.y,
      arrLuz[0].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition1 = [
      arrLuz[1].position.x,
      arrLuz[1].position.y,
      arrLuz[1].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition2 = [
      arrLuz[2].position.x,
      arrLuz[2].position.y,
      arrLuz[2].position.z,
    ];

    object.drawInfo.uniforms.u_lightColor0 = [
      convertToZeroOne(arrLuz[0].color[0], 0, 255),
      convertToZeroOne(arrLuz[0].color[1], 0, 255),
      convertToZeroOne(arrLuz[0].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor1 = [
      convertToZeroOne(arrLuz[1].color[0], 0, 255),
      convertToZeroOne(arrLuz[1].color[1], 0, 255),
      convertToZeroOne(arrLuz[1].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor2 = [
      convertToZeroOne(arrLuz[2].color[0], 0, 255),
      convertToZeroOne(arrLuz[2].color[1], 0, 255),
      convertToZeroOne(arrLuz[2].color[2], 0, 255),
    ];

    object.drawInfo.uniforms.u_color = [
      convertToZeroOne(palette["corCubo"][0], 0, 255),
      convertToZeroOne(palette["corCubo"][1], 0, 255),
      convertToZeroOne(palette["corCubo"][2], 0, 255),
      1,
    ];

    object.drawInfo.uniforms.u_specularColor0 = [
      convertToZeroOne(arrLuz[0].spec[0], 0, 255),
      convertToZeroOne(arrLuz[0].spec[1], 0, 255),
      convertToZeroOne(arrLuz[0].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor1 = [
      convertToZeroOne(arrLuz[1].spec[0], 0, 255),
      convertToZeroOne(arrLuz[1].spec[1], 0, 255),
      convertToZeroOne(arrLuz[1].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor2 = [
      convertToZeroOne(arrLuz[2].spec[0], 0, 255),
      convertToZeroOne(arrLuz[2].spec[1], 0, 255),
      convertToZeroOne(arrLuz[2].spec[2], 0, 255),
    ];
  });
  //temp = mapAllVertices(arrays_pyramid.position, arrays_pyramid.indices);
  //console.log(mapAllVertices(arrays_pyramid.position, arrays_pyramid.indices));
  cameraPosition = [4, 4, 10];

  const temp = arrays_pyramid.position.slice(
    config.vertice * 3,
    config.vertice * 3 + 3
  );

  config.vx = temp[0];
  config.vy = temp[1];
  config.vz = temp[2];
  requestAnimationFrame(drawScene);
  //console.log(objects);
  // Draw the scene.
}
function drawScene(time) {
  time *= 0.001;
  locura();
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
  target = [config.targetx, config.targety, config.targetz];
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
  computeMatrixLuz(nodeInfosByName["light1"], config);
  computeMatrixLuz2(nodeInfosByName["light2"], config);
  computeMatrixCuboVertice(nodeInfosByName["cuboVertice0"], config);
  //nodeInfosByName

  //nodeInfosByName["cubo0"].trs.rotation[0] = degToRad(config.rotate);
  // Update all world matrices in the scene graph
  scene.updateWorldMatrix();
  //console.log(arrLuz[0].position);
  //console.log(cameraPosition);

  // Compute all the matrices for rendering
  objects.forEach(function (object) {
    object.drawInfo.uniforms.u_matrix = m4.multiply(
      viewProjectionMatrix,
      object.worldMatrix
    );
    object.drawInfo.uniforms.u_lightWorldPosition0 = [
      arrLuz[0].position.x,
      arrLuz[0].position.y,
      arrLuz[0].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition1 = [
      arrLuz[1].position.x,
      arrLuz[1].position.y,
      arrLuz[1].position.z,
    ];
    object.drawInfo.uniforms.u_lightWorldPosition2 = [
      arrLuz[2].position.x,
      arrLuz[2].position.y,
      arrLuz[2].position.z,
    ];

    object.drawInfo.uniforms.u_lightColor0 = [
      convertToZeroOne(arrLuz[0].color[0], 0, 255),
      convertToZeroOne(arrLuz[0].color[1], 0, 255),
      convertToZeroOne(arrLuz[0].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor1 = [
      convertToZeroOne(arrLuz[1].color[0], 0, 255),
      convertToZeroOne(arrLuz[1].color[1], 0, 255),
      convertToZeroOne(arrLuz[1].color[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_lightColor2 = [
      convertToZeroOne(arrLuz[2].color[0], 0, 255),
      convertToZeroOne(arrLuz[2].color[1], 0, 255),
      convertToZeroOne(arrLuz[2].color[2], 0, 255),
    ];

    object.drawInfo.uniforms.u_color = [
      convertToZeroOne(palette["corCubo"][0], 0, 255),
      convertToZeroOne(palette["corCubo"][1], 0, 255),
      convertToZeroOne(palette["corCubo"][2], 0, 255),
      1,
    ];
    // console.log(object.drawInfo.uniforms.u_lightColor);
    // console.log(object.drawInfo.uniforms.u_color);
    object.drawInfo.uniforms.u_specularColor0 = [
      convertToZeroOne(arrLuz[0].spec[0], 0, 255),
      convertToZeroOne(arrLuz[0].spec[1], 0, 255),
      convertToZeroOne(arrLuz[0].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor1 = [
      convertToZeroOne(arrLuz[1].spec[0], 0, 255),
      convertToZeroOne(arrLuz[1].spec[1], 0, 255),
      convertToZeroOne(arrLuz[1].spec[2], 0, 255),
    ];
    object.drawInfo.uniforms.u_specularColor2 = [
      convertToZeroOne(arrLuz[2].spec[0], 0, 255),
      convertToZeroOne(arrLuz[2].spec[1], 0, 255),
      convertToZeroOne(arrLuz[2].spec[2], 0, 255),
    ];

    object.drawInfo.uniforms.u_color = [
      convertToZeroOne(palette["corCubo"][0], 0, 255),
      convertToZeroOne(palette["corCubo"][1], 0, 255),
      convertToZeroOne(palette["corCubo"][2], 0, 255),
      1,
    ];
    object.drawInfo.uniforms.u_world = object.worldMatrix;

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
