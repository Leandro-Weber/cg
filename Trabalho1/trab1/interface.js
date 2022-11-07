var config = {
  rotate: 0,
  x: 0,
  y: 0,
  z: 0,
  spin_x: 0,
  spin_y: 0,
  camera_x: 4,
  camera_y: 4,
  camera_z: 10,

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
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_texture = tex[config.textura];
    });
  },
  addCuboMadeira: function () {
    addCubo();
  },
  triangulo: 0,

  // criarVertice: function () {
  //   // console.log(`indices antes: ${arrays_pyramid.indices}`);
  //   // console.log(`arrays_pyramid.position antes: ${arrays_pyramid.position}`);
  //   var n = config.triangulo * 3;
  //   var inicio = arrays_pyramid.position.slice(0, n * 3);
  //   var temp = arrays_pyramid.position.slice(n * 3, (n + 3) * 3);
  //   var resto = arrays_pyramid.position.slice(
  //     (n + 3) * 3,
  //     arrays_pyramid.position.length
  //   );
  //   var newind = [];
  //   //arrays_pyramid.position = [...inicio, ...resto];
  //   arrays_pyramid.position = [...inicio];

  //   var a = temp.slice(0, 3);
  //   var b = temp.slice(3, 6);
  //   var c = temp.slice(6, 9);
  //   var d = calculaMeioDoTriangulo([...a, ...b, ...c]);

  //   var nTex = config.triangulo * 2;
  //   var inicioTex = arrays_pyramid.texcoord.slice(0, nTex * 2);
  //   var tempTex = arrays_pyramid.texcoord.slice(nTex * 2, (nTex + 3) * 2);
  //   var restoTex = arrays_pyramid.texcoord.slice(
  //     (nTex + 3) * 2,
  //     arrays_pyramid.texcoord.length
  //   );
  //   var at = tempTex.slice(0, 2);
  //   var bt = tempTex.slice(2, 4);
  //   var ct = tempTex.slice(4, 6);
  //   var dt = calculaMeioDaTextura([...at, ...bt, ...ct]);
  //   //arrays_pyramid.texcoord = [...inicioTex, ...restoTex];
  //   //console.log(`dt: ${dt}`);
  //   arrays_pyramid.texcoord = [...inicioTex];

  //   // arrays_pyramid.position = new Float32Array([
  //   //   ...arrays_pyramid.position,
  //   //   ...d,
  //   // ]);
  //   // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

  //   // var novotri = [...a, ...d, ...b];
  //   var novotri = [...b, ...d, ...a];
  //   var novatexcoord = [...bt, ...dt, ...at];

  //   console.log(`novotri: ${novotri}`);
  //   arrays_pyramid.position = [...arrays_pyramid.position, ...novotri];
  //   arrays_pyramid.texcoord = [...arrays_pyramid.texcoord, ...novatexcoord];

  //   // novotri = [...b, ...d, ...c];
  //   novotri = [...c, ...d, ...b];
  //   novatexcoord = [...ct, ...dt, ...bt];

  //   console.log(`novotri: ${novotri}`);
  //   arrays_pyramid.position = [...arrays_pyramid.position, ...novotri];
  //   arrays_pyramid.texcoord = [...arrays_pyramid.texcoord, ...novatexcoord];

  //   // novotri = [...c, ...d, ...a];
  //   novotri = [...a, ...d, ...c];
  //   novatexcoord = [...ct, ...dt, ...bt];

  //   console.log(`novotri: ${novotri}`);
  //   arrays_pyramid.position = [...arrays_pyramid.position, ...novotri];
  //   arrays_pyramid.texcoord = [...arrays_pyramid.texcoord, ...novatexcoord];

  //   arrays_pyramid.position = [...arrays_pyramid.position, ...resto];
  //   arrays_pyramid.texcoord = [...arrays_pyramid.texcoord, ...restoTex];

  //   console.log(`position depois dos triangulos: ${arrays_pyramid.position}`);
  //   console.log(arrays_pyramid.position.length);

  //   for (let index = 0; index < arrays_pyramid.position.length / 3; index++) {
  //     newind = [...newind, index];
  //   }
  //   arrays_pyramid.indices = newind;

  //   console.log(`indices: ${arrays_pyramid.indices}`);

  //   // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

  //   arrays_pyramid.normal = [];
  //   for (let index = 0; index < arrays_pyramid.normal.length; index++) {
  //     arrays_pyramid.normal = [...arrays_pyramid.normal, 0];
  //   }
  //   arrays_pyramid.normal = calculateNormal(
  //     arrays_pyramid.position,
  //     arrays_pyramid.indices
  //   );
  //   //mapTexture();
  //   cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);

  //   objectsToDraw = [];
  //   objects = [];
  //   nodeInfosByName = {};
  //   scene = makeNode(objeto);
  //   objects.forEach(function (object) {
  //     object.drawInfo.uniforms.u_texture = tex[config.textura];
  //   });

  //   gui.destroy();
  //   gui = null;
  // },
  criarVertice: function () {
    // console.log(`indices antes: ${arrays_pyramid.indices}`);
    // console.log(`arrays_pyramid.position antes: ${arrays_pyramid.position}`);
    var n = config.triangulo * 3;
    var inicio = nodeInfosByName[
      `${selectedObject}`
    ].format.position.data.slice(0, n * 3);
    var temp = nodeInfosByName[`${selectedObject}`].format.position.data.slice(
      n * 3,
      (n + 3) * 3
    );
    var resto = nodeInfosByName[`${selectedObject}`].format.position.data.slice(
      (n + 3) * 3,
      nodeInfosByName[`${selectedObject}`].format.position.data.length
    );
    var newind = [];
    //arrays_pyramid.position = [...inicio, ...resto];
    nodeInfosByName[`${selectedObject}`].format.position.data = [...inicio];

    var a = temp.slice(0, 3);
    var b = temp.slice(3, 6);
    var c = temp.slice(6, 9);
    var d = calculaMeioDoTriangulo([...a, ...b, ...c]);

    var nTex = config.triangulo * 2;
    var inicioTex = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(0, nTex * 2);
    var tempTex = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(nTex * 2, (nTex + 3) * 2);
    var restoTex = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(
      (nTex + 3) * 2,
      nodeInfosByName[`${selectedObject}`].format.texcoord.data.length
    );
    var at = tempTex.slice(0, 2);
    var bt = tempTex.slice(2, 4);
    var ct = tempTex.slice(4, 6);
    var dt = calculaMeioDaTextura([...at, ...bt, ...ct]);
    //arrays_pyramid.texcoord = [...inicioTex, ...restoTex];
    //console.log(`dt: ${dt}`);
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [...inicioTex];

    // arrays_pyramid.position = new Float32Array([
    //   ...arrays_pyramid.position,
    //   ...d,
    // ]);
    // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

    // var novotri = [...a, ...d, ...b];
    var novotri = [...b, ...d, ...a];
    var novatexcoord = [...bt, ...dt, ...at];

    console.log(`novotri: ${novotri}`);
    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...novotri,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...novatexcoord,
    ];

    // novotri = [...b, ...d, ...c];
    novotri = [...c, ...d, ...b];
    novatexcoord = [...ct, ...dt, ...bt];

    console.log(`novotri: ${novotri}`);
    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...novotri,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...novatexcoord,
    ];

    // novotri = [...c, ...d, ...a];
    novotri = [...a, ...d, ...c];
    novatexcoord = [...ct, ...dt, ...bt];

    console.log(`novotri: ${novotri}`);
    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...novotri,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...novatexcoord,
    ];

    nodeInfosByName[`${selectedObject}`].format.position.data = [
      ...nodeInfosByName[`${selectedObject}`].format.position.data,
      ...resto,
    ];
    nodeInfosByName[`${selectedObject}`].format.texcoord.data = [
      ...nodeInfosByName[`${selectedObject}`].format.texcoord.data,
      ...restoTex,
    ];

    console.log(
      `position depois dos triangulos: ${
        nodeInfosByName[`${selectedObject}`].format.position.data
      }`
    );
    //console.log(arrays_pyramid.position.length);

    for (
      let index = 0;
      index <
      nodeInfosByName[`${selectedObject}`].format.position.data.length / 3;
      index++
    ) {
      newind = [...newind, index];
    }
    nodeInfosByName[`${selectedObject}`].format.indices.data = newind;

    //console.log(`indices: ${arrays_pyramid.indices}`);

    // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

    nodeInfosByName[`${selectedObject}`].format.normal.data = [];
    for (
      let index = 0;
      index < nodeInfosByName[`${selectedObject}`].format.normal.data;
      index++
    ) {
      nodeInfosByName[`${selectedObject}`].format.normal.data = [
        ...nodeInfosByName[`${selectedObject}`].format.normal.data,
        0,
      ];
    }
    nodeInfosByName[`${selectedObject}`].format.normal.data = calculateNormal(
      nodeInfosByName[`${selectedObject}`].format.position.data,
      nodeInfosByName[`${selectedObject}`].format.indices.data
    );
    //mapTexture();
    nodeInfosByName[`${selectedObject}`].node.drawInfo.bufferInfo =
      twgl.createBufferInfoFromArrays(
        gl,
        nodeInfosByName[`${selectedObject}`].format
      );

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};
    scene = makeNode(objeto);
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_texture = tex[config.textura];
    });

    listOfVertices = [];
    for (
      let index = 0;
      index <
      nodeInfosByName[`${selectedObject}`].format.position.data.length / 3;
      index++
    ) {
      listOfVertices = [...listOfVertices, index];
    }

    gui.destroy();
    gui = null;
  },
  //time: 0.0,
  targetx: 0,
  targety: 0,
  targetz: 0,
  upVectorx: 0,
  upVectory: 0,
  upVectorz: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  vertice: 0,
  teste0: 5.8,
  teste1: 4.5,
  teste2: 8.1,

  scalex: 1.0,
  scaley: 1.0,
  scalez: 1.0,
  listVertices: 1,
  luzx: 5.8,
  luzy: 4.5,
  luzz: 8.1,
  shininess: 300.0,
  camera_1: true,
  camera_2: false,
  camera_3: false,
  luzIndex: 0,
  tx: 0,
  ty: 0,
  tz: 0,
  textura: "madeira",
  vertice2: 0,
  coordv: 0,
  coordu: 0,
  obj: 0,
};

var folder_vertice;
var folder_camera;
var folder_matrix;
var folder_luz;
var folder_triangulo;
var folder_coordTex;

const loadGUI = () => {
  gui = new dat.GUI();
  folder_vertice = gui.addFolder("Manipular vertices e triangulos");
  folder_camera = gui.addFolder("Manipular cameras");
  folder_luz = gui.addFolder("Manipular luzes e texturas");
  folder_matrix = gui.addFolder("Manipular matrizes");
  folder_triangulo = folder_vertice.addFolder("Manipular triangulos");
  folder_coordTex = folder_luz.addFolder("Coordenadas textura");
  folder_luz.open();
  folder_matrix
    .add(config, "rotate", 0, 360, 0.5)
    .listen()
    .onChange(function () {
      nodeInfosByName["cubo0"].trs.rotation[0] = degToRad(config.rotate);
      // A ANIMACAO DE GIRAR SOBREPOE ESSA ALTERACAO TODA VEZ Q RENDERIZA
      // TEM Q USAR OU UM OU OUTRO
    });
  folder_matrix.add(config, "x", -10, 10, 0.5);
  folder_matrix.add(config, "y", -10, 10, 0.5);
  folder_matrix.add(config, "z", -10, 10, 0.5);

  folder_matrix.add(config, "spin_x", -1000, 1000, 2);
  folder_matrix.add(config, "spin_y", -1000, 1000, 2);

  folder_matrix.add(config, "scalex", -10, 10, 0.1);
  folder_matrix.add(config, "scaley", -10, 10, 0.1);
  folder_matrix.add(config, "scalez", -10, 10, 0.1);

  // gui.add(config, "addCaixa");
  // folder_camera.add(config, "camera_x", -20, 20, 0.1).onChange(function () {
  //   arrCameras[selectedCamera].cameraPosition = [
  //     config.camera_x,
  //     config.camera_y,
  //     config.camera_z,
  //   ];
  // });
  folder_camera.add(config, "camera_y", -20, 20, 0.1).onChange(function () {
    arrCameras[selectedCamera].cameraPosition = [
      config.camera_x,
      config.camera_y,
      config.camera_z,
    ];
  });
  folder_camera.add(config, "camera_z", -20, 20, 0.1).onChange(function () {
    arrCameras[selectedCamera].cameraPosition = [
      config.camera_x,
      config.camera_y,
      config.camera_z,
    ];
  });
  folder_camera.add(config, "upVectorx", -20, 20, 0.1).onChange(function () {
    arrCameras[selectedCamera].up = [
      config.upVectorx,
      config.upVectory,
      config.upVectorz,
    ];
  });
  folder_camera.add(config, "upVectory", -20, 20, 0.1).onChange(function () {
    arrCameras[selectedCamera].up = [
      config.upVectorx,
      config.upVectory,
      config.upVectorz,
    ];
  });

  folder_camera.add(config, "upVectorz", -20, 20, 0.1).onChange(function () {
    arrCameras[selectedCamera].up = [
      config.upVectorx,
      config.upVectory,
      config.upVectorz,
    ];
  });

  folder_triangulo.add(config, "triangulo", 0, 20, 1);
  folder_triangulo.add(config, "criarVertice");
  folder_triangulo.add(config, "tx", -5, 5, 0.1).onChange(function () {
    config.ty = 0;
    config.tz = 0;
    gui.updateDisplay();
    moveTriangulo();
  });
  folder_triangulo.add(config, "ty", -5, 5, 0.1).onChange(function () {
    config.tx = 0;
    config.tz = 0;
    gui.updateDisplay();
    moveTriangulo();
  });
  folder_triangulo.add(config, "tz", -5, 5, 0.1).onChange(function () {
    config.tx = 0;
    config.ty = 0;
    gui.updateDisplay();
    moveTriangulo();
  });
  // gui
  //   .add(config, "time", 0, teste)
  //   .listen()
  //   .onChange(function () {
  //     //config.rotate = config.time + 1;

  //     gui.updateDisplay();
  //   });
  folder_camera.add(config, "targetx", -10, 10, 0.01).onChange(function () {
    arrCameras[selectedCamera].target = [
      config.targetx,
      config.targety,
      config.targetz,
    ];
  });
  folder_camera.add(config, "targety", -10, 10, 0.01).onChange(function () {
    arrCameras[selectedCamera].target = [
      config.targetx,
      config.targety,
      config.targetz,
    ];
  });
  folder_camera.add(config, "targetz", -10, 10, 0.01).onChange(function () {
    arrCameras[selectedCamera].target = [
      config.targetx,
      config.targety,
      config.targetz,
    ];
  });

  folder_vertice.add(config, "vertice", listOfVertices).onChange(function () {
    const temp = nodeInfosByName[
      `${selectedObject}`
    ].format.position.data.slice(config.vertice * 3, config.vertice * 3 + 3);

    config.vx = temp[0];
    config.vy = temp[1];
    config.vz = temp[2];

    gui.updateDisplay();
  });
  // folder_vertice.add(config, "vertice").onChange(function () {
  //   const temp = arrays_pyramid.position.slice(
  //     config.vertice * 3,
  //     config.vertice * 3 + 3
  //   );

  //   config.vx = temp[0];
  //   config.vy = temp[1];
  //   config.vz = temp[2];

  //   gui.updateDisplay();
  // });
  folder_vertice.add(config, "vx", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  folder_vertice.add(config, "vy", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  folder_vertice.add(config, "vz", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  folder_luz.add(config, "luzIndex", listOfLights).onChange(function () {
    config.luzx = arrLuz[config.luzIndex].position.x;
    config.luzy = arrLuz[config.luzIndex].position.y;
    config.luzz = arrLuz[config.luzIndex].position.z;
    palette.corLuz = arrLuz[config.luzIndex].color;
    palette.corSpec = arrLuz[config.luzIndex].spec;

    gui.updateDisplay();
  });
  folder_luz.add(config, "luzx", -20, 20, 0.01).onChange(function () {
    arrLuz[config.luzIndex].position.x = config.luzx;
    arrLuz[config.luzIndex].position.y = config.luzy;
    arrLuz[config.luzIndex].position.z = config.luzz;
  });
  folder_luz.add(config, "luzy", -20, 20, 0.01).onChange(function () {
    arrLuz[config.luzIndex].position.x = config.luzx;
    arrLuz[config.luzIndex].position.y = config.luzy;
    arrLuz[config.luzIndex].position.z = config.luzz;
  });
  folder_luz.add(config, "luzz", -20, 200, 0.01).onChange(function () {
    arrLuz[config.luzIndex].position.x = config.luzx;
    arrLuz[config.luzIndex].position.y = config.luzy;
    arrLuz[config.luzIndex].position.z = config.luzz;
  });
  folder_luz.add(config, "shininess", 0, 3000, 0.1);
  folder_camera
    .add(config, "camera_1")
    .listen()
    .onChange(function () {
      config.camera_2 = false;
      config.camera_3 = false;
      // config.camera_x = 4;
      // config.camera_y = 4;
      // config.camera_z = 10;
      // cameraPosition = [4, 4, 10];
      selectedCamera = 0;
      cameraMatrix = m4.lookAt(
        arrCameras[selectedCamera].cameraPosition,
        arrCameras[selectedCamera].target,
        arrCameras[selectedCamera].up
      );
      config.camera_x = arrCameras[selectedCamera].cameraPosition[0];
      config.camera_y = arrCameras[selectedCamera].cameraPosition[1];
      config.camera_z = arrCameras[selectedCamera].cameraPosition[2];
      config.upVectorx = arrCameras[selectedCamera].up[0];
      config.upVectory = arrCameras[selectedCamera].up[1];
      config.upVectorz = arrCameras[selectedCamera].up[2];
      config.targetx = arrCameras[selectedCamera].target[0];
      config.targety = arrCameras[selectedCamera].target[1];
      config.targetz = arrCameras[selectedCamera].target[2];
      gui.updateDisplay();
    });

  folder_coordTex.add(config, "vertice2", listOfVertices).onChange(function () {
    const temp = nodeInfosByName[
      `${selectedObject}`
    ].format.texcoord.data.slice(config.vertice2 * 2, config.vertice2 * 2 + 2);
    config.coordu = temp[0];
    config.coordv = temp[1];
    gui.updateDisplay();
  });
  folder_coordTex.add(config, "coordu").onChange(function () {
    changeTexCoord();
  });
  folder_coordTex.add(config, "coordv").onChange(function () {
    changeTexCoord();
  });

  folder_camera
    .add(config, "camera_2")
    .listen()
    .onChange(function () {
      config.camera_1 = false;
      config.camera_3 = false;
      // config.camera_x = -20;
      // config.camera_y = 4;
      // config.camera_z = 10;
      // cameraPosition = [-20, 4, 10];
      selectedCamera = 1;
      cameraMatrix = m4.lookAt(
        arrCameras[selectedCamera].cameraPosition,
        arrCameras[selectedCamera].target,
        arrCameras[selectedCamera].up
      );
      config.camera_x = arrCameras[selectedCamera].cameraPosition[0];
      config.camera_y = arrCameras[selectedCamera].cameraPosition[1];
      config.camera_z = arrCameras[selectedCamera].cameraPosition[2];
      config.upVectorx = arrCameras[selectedCamera].up[0];
      config.upVectory = arrCameras[selectedCamera].up[1];
      config.upVectorz = arrCameras[selectedCamera].up[2];
      config.targetx = arrCameras[selectedCamera].target[0];
      config.targety = arrCameras[selectedCamera].target[1];
      config.targetz = arrCameras[selectedCamera].target[2];
      gui.updateDisplay();
    });
  folder_camera
    .add(config, "camera_3")
    .listen()
    .onChange(function () {
      config.camera_1 = false;
      config.camera_2 = false;
      // config.camera_x = 4;
      // config.camera_y = 4;
      // config.camera_z = 35;
      // cameraPosition = [4, 4, 35];
      selectedCamera = 2;
      cameraMatrix = m4.lookAt(
        arrCameras[selectedCamera].cameraPosition,
        arrCameras[selectedCamera].target,
        arrCameras[selectedCamera].up
      );
      config.camera_x = arrCameras[selectedCamera].cameraPosition[0];
      config.camera_y = arrCameras[selectedCamera].cameraPosition[1];
      config.camera_z = arrCameras[selectedCamera].cameraPosition[2];
      config.upVectorx = arrCameras[selectedCamera].up[0];
      config.upVectory = arrCameras[selectedCamera].up[1];
      config.upVectorz = arrCameras[selectedCamera].up[2];
      config.targetx = arrCameras[selectedCamera].target[0];
      config.targety = arrCameras[selectedCamera].target[1];
      config.targetz = arrCameras[selectedCamera].target[2];
      gui.updateDisplay();
    });
  folder_luz.add(config, "textura", listTex).onChange(function () {
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_texture = tex[config.textura];
    });
  });
  folder_luz.addColor(palette, "corLuz").onChange(function () {
    arrLuz[config.luzIndex].color = palette.corLuz;
  });

  folder_luz.addColor(palette, "corSpec").onChange(function () {
    arrLuz[config.luzIndex].spec = palette.corSpec;
  });
  gui.add(config, "obj", listOfObjects).onChange(function () {
    selectedObject = config.obj;
    config.scalex = nodeInfosByName[`${selectedObject}`].trs.scale[0];
    config.scaley = nodeInfosByName[`${selectedObject}`].trs.scale[1];
    config.scalez = nodeInfosByName[`${selectedObject}`].trs.scale[2];
    config.x = nodeInfosByName[`${selectedObject}`].trs.translation[0];
    config.y = nodeInfosByName[`${selectedObject}`].trs.translation[1];
    config.z = nodeInfosByName[`${selectedObject}`].trs.translation[2];
    config.spin_x = nodeInfosByName[`${selectedObject}`].trs.rotation[0];
    config.spin_y = nodeInfosByName[`${selectedObject}`].trs.rotation[1];

    gui.destroy();
    gui = null;
  });
  gui.add(config, "addCuboMadeira");
};
