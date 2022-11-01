var config = {
  rotate: 0,
  x: 0,
  y: 0,
  z: 0,
  spin_x: 0,
  spin_y: 0,
  camera_x: 4,
  camera_y: 3.5,
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
  },
  triangulo: 0,

  criarVertice: function () {
    // console.log(`indices antes: ${arrays_pyramid.indices}`);
    // console.log(`arrays_pyramid.position antes: ${arrays_pyramid.position}`);
    var n = config.triangulo * 3;
    var inicio = arrays_pyramid.position.slice(0, n * 3);
    var temp = arrays_pyramid.position.slice(n * 3, (n + 3) * 3);
    var resto = arrays_pyramid.position.slice(
      (n + 3) * 3,
      arrays_pyramid.position.length
    );
    var newind = [];
    arrays_pyramid.position = [...inicio, ...resto];

    var a = temp.slice(0, 3);
    var b = temp.slice(3, 6);
    var c = temp.slice(6, 9);
    var d = calculaMeioDoTriangulo([...a, ...b, ...c]);

    // arrays_pyramid.position = new Float32Array([
    //   ...arrays_pyramid.position,
    //   ...d,
    // ]);
    // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

    var novotri = [...a, ...b, ...d];
    console.log(`novotri: ${novotri}`);
    arrays_pyramid.position = [...arrays_pyramid.position, ...novotri];

    novotri = [...c, ...d, ...b];
    console.log(`novotri: ${novotri}`);
    arrays_pyramid.position = [...arrays_pyramid.position, ...novotri];

    novotri = [...c, ...a, ...d];
    console.log(`novotri: ${novotri}`);
    arrays_pyramid.position = [...arrays_pyramid.position, ...novotri];

    console.log(`position depois dos triangulos: ${arrays_pyramid.position}`);
    console.log(arrays_pyramid.position.length);

    for (let index = 0; index < arrays_pyramid.position.length / 3; index++) {
      newind = [...newind, index];
    }
    arrays_pyramid.indices = newind;

    console.log(`indices: ${arrays_pyramid.indices}`);

    // console.log(`arrays_pyramid.position: ${arrays_pyramid.position}`);

    arrays_pyramid.normal = [];
    for (let index = 0; index < arrays_pyramid.normal.length; index++) {
      arrays_pyramid.normal = [...arrays_pyramid.normal, 0];
    }
    arrays_pyramid.normal = calculateNormal(
      arrays_pyramid.position,
      arrays_pyramid.indices
    );
    cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};
    scene = makeNode(objeto);

    gui.updateDisplay();
    //drawScene();
  },
  //time: 0.0,
  target: 3.5,
  vx: 0,
  vy: 0,
  vz: 0,
  vertice: 0,
  teste0: 5.8,
  teste1: 2.5,
  teste2: 2.1,
  shininess: 2.5,
  scalex: 1.0,
  scaley: 1.0,
  scalez: 1.0,
};

const moveVertice = function () {
  var n = config.vertice * 3;
  var mapVertices = mapAllVertices(
    arrays_pyramid.position,
    arrays_pyramid.indices
  );
  var temp = mapVertices[n];
  console.log(temp);

  for (let index = 0; index < temp.length; index++) {
    arrays_pyramid.position[temp[index] * 3] = config.vx;
    arrays_pyramid.position[temp[index] * 3 + 1] = config.vy;
    arrays_pyramid.position[temp[index] * 3 + 2] = config.vz;
  }

  // arrays_pyramid.position[n] = config.vx;
  // arrays_pyramid.position[n + 1] = config.vy;
  // arrays_pyramid.position[n + 2] = config.vz;
  arrays_pyramid.normal = calculateNormal(
    arrays_pyramid.position,
    arrays_pyramid.indices
  );
  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
  scene = makeNode(objeto);
};

var folder_vertice;
var folder_camera;
var folder_matrix;

const loadGUI = () => {
  gui = new dat.GUI();
  folder_vertice = gui.addFolder("Manipular vertices");
  folder_camera = gui.addFolder("Manipular cameras");
  folder_matrix = gui.addFolder("Manipular matrizes");
  folder_vertice.open();
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

  gui.add(config, "addCaixa");
  folder_camera.add(config, "camera_x", -200, 200, 1);
  folder_camera.add(config, "camera_y", -200, 200, 1);
  folder_camera.add(config, "camera_z", -200, 200, 1);

  folder_vertice.add(config, "triangulo", 0, 20, 1);
  folder_vertice.add(config, "criarVertice");
  // gui
  //   .add(config, "time", 0, teste)
  //   .listen()
  //   .onChange(function () {
  //     //config.rotate = config.time + 1;

  //     gui.updateDisplay();
  //   });
  folder_camera.add(config, "target", -5, 5, 0.01);
  folder_vertice.add(config, "vertice").onChange(function () {
    const temp = arrays_pyramid.position.slice(
      config.vertice * 3,
      config.vertice * 3 + 3
    );

    config.vx = temp[0];
    config.vy = temp[1];
    config.vz = temp[2];

    gui.updateDisplay();
  });
  folder_vertice.add(config, "vx", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  folder_vertice.add(config, "vy", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  folder_vertice.add(config, "vz", -10, 10, 0.1).onChange(function () {
    moveVertice();
  });
  gui.add(config, "teste0", -10, 10, 0.1);
  gui.add(config, "teste1", -10, 10, 0.1);
  gui.add(config, "teste2", -10, 10, 0.1);
  gui.add(config, "shininess", -10, 10, 0.1);
};
