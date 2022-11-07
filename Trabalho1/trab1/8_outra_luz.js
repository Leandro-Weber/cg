"use strict";

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
var listTex = ["nitro", "isopor", "madeira", "areia", "tri", "d4"];
var selectedCamera = 0;
var deltaTime = 0;
var then;
var selectedObject = 0;
var listOfObjects = [0];
var index = 1;

var arrLuz = [
  new Luz([4, 0, 0], [255, 255, 255], [255, 255, 255], 300),
  new Luz([-4, 0, 0], [255, 255, 255], [255, 255, 255], 300),
  new Luz([5, 4, 8], [255, 255, 255], [255, 255, 255], 300),
];
let arrCameras = [
  new Camera([10, 4, 0], [0, 0, 0], [0, 1, 0]),
  new Camera([-5, 4, 0], [3.5, -23.5, 50.5], [0, 1, 0]),
  new Camera([5, 4, 8], [0, 35, 0], [0, 1, 0]),
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
    format: nodeDescription.format,
  };
  trs.translation = nodeDescription.translation || trs.translation;
  trs.rotation = nodeDescription.rotation || trs.rotation;
  if (nodeDescription.draw !== false) {
    const bufferInfo = twgl.createBufferInfoFromArrays(
      gl,
      nodeDescription.format
    );

    const vertexArray = twgl.createVAOFromBufferInfo(
      gl,
      programInfo,
      bufferInfo
    );
    node.drawInfo = {
      uniforms: {
        u_color: [0.4, 0.4, 0.4, 1],
        u_texture: nodeDescription.texture,
      },
      format: nodeDescription.format,
      programInfo: programInfo,
      bufferInfo: bufferInfo,
      vertexArray: vertexArray,
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
      src: "http://127.0.0.1:5500/Trabalho1/trab1/texture/nitro.png",
    },
    areia: {
      src: "http://127.0.0.1:5500/Trabalho1/trab1/texture/areia.jpg",
    },
    isopor: {
      src: "http://127.0.0.1:5500/Trabalho1/trab1/texture/isopor.jpg  ",
    },
    madeira: {
      src: "http://127.0.0.1:5500/Trabalho1/trab1/texture/madeira.jpg",
    },
    tri: {
      src: "http://127.0.0.1:5500/Trabalho1/trab1/texture/tri.jpg",
    },
    d4: {
      src: "http://127.0.0.1:5500/Trabalho1/trab1/texture/d4.jpg",
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
  // arrays_pyramid = pyramidFormat;

  //arrays_pyramid.position = buf;

  arrays_pyramid.barycentric = calculateBarycentric(
    arrays_pyramid.position.length
  );

  arrays_pyramid.normal = calculateNormal(
    arrays_pyramid.position,
    arrays_pyramid.indices
  );

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
  const arrayCube = createArray("cube");
  console.log(arrayCube);
  // Let's make all the nodes
  objeto = {
    name: "Center of the world",
    draw: false,
    children: [
      {
        name: "0",
        draw: true,
        type: "cube",
        translation: [0, 0, 0],
        rotation: [degToRad(0), degToRad(0), degToRad(0)],
        texture: tex.madeira,
        format: arrayCube,
        //bufferInfo: cubeBufferInfo,
        //vertexArray: cubeVAO,
        children: [
          {
            name: "cuboVertice0",
            draw: true,
            translation: [0, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            texture: tex.nitro,
            format: arrayCube,
            children: [],
          },
        ],
      },
    ],
  };
  console.log(objeto);
  scene = makeNode(objeto);
  console.log(objectsToDraw);

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
  //cameraPosition = [4, 4, 10];
  cameraPosition = arrCameras[0].cameraPosition;

  const temp = arrays_pyramid.position.slice(
    config.vertice * 3,
    config.vertice * 3 + 3
  );

  config.vx = temp[0];
  config.vy = temp[1];
  config.vz = temp[2];
  //mapTexture();
  requestAnimationFrame(drawScene);
  //console.log(objects);
  // Draw the scene.
}
function drawScene(now) {
  now *= 0.001;
  deltaTime = now - then;
  then = now;
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
  //target = [config.targetx, config.targety, config.targetz];
  //up = [0, 1, 0];
  cameraMatrix = m4.lookAt(
    arrCameras[selectedCamera].cameraPosition,
    arrCameras[selectedCamera].target,
    arrCameras[selectedCamera].up
  );

  // Make a view matrix from the camera matrix.
  viewMatrix = m4.inverse(cameraMatrix);

  viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  var fRotationRadians = degToRad(config.spin_x);

  adjust;
  speed = 3;

  //console.log(nodeInfosByName);
  computeMatrix(nodeInfosByName[`${selectedObject}`], config);
  // computeMatrixLuz(nodeInfosByName["light1"], config);
  // computeMatrixLuz2(nodeInfosByName["light2"], config);
  //computeMatrixCuboVertice(nodeInfosByName["cuboVertice0"], config);
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

    object.drawInfo.uniforms.u_texture = tex[config.textura];
  });

  // ------ Draw the objects --------

  twgl.drawObjectList(gl, objectsToDraw);

  requestAnimationFrame(drawScene);
}

main();
