const compareArray = (array1, array2) =>
  array1[0] == array2[0] && array1[1] == array2[1] && array1[2] == array2[2];

const alreadyExist = (array, index) =>
  (exist = array.find((item) => item == index));

const mapAllVertices = (position, indices) => {
  let mapVertices = {};

  let pontos = [],
    faces = [];

  for (let i = 0; i < position.length; i += 3) {
    pontos.push([position[i], position[i + 1], position[i + 2]]);
  }

  for (let i = 0; i < indices.length; i += 3) {
    faces.push([indices[i], indices[i + 1], indices[i + 2]]);
  }

  let batata = {};

  for (let i = 0, j = 0; i < position.length; i += 3, j++) {
    mapVertices[j] = [j];
    batata[j] = [];
  }

  for (let index in mapVertices) {
    faces.map((item) => {
      item.map((vertice) => {
        if (compareArray(pontos[mapVertices[index]], pontos[vertice]))
          if (!alreadyExist(batata[index], vertice))
            batata[index].push(vertice);

        return batata;
      });
    });
  }

  return batata;
};

const computeMatrix = (matrix, config) => {
  matrix.trs.translation = [config.x, config.y, config.z];
  matrix.trs.rotation = [
    degToRad(config.spin_x),
    degToRad(config.spin_y),
    degToRad(0),
  ];
  matrix.trs.scale = [config.scalex, config.scaley, config.scalez];
};
const computeMatrixLuz = (matrix, config) => {
  matrix.trs.translation = [config.luzx, config.luzy, config.luzz];
  matrix.trs.rotation = [degToRad(0), degToRad(0), degToRad(0)];
  matrix.trs.scale = [0.05, 0.05, 0.05];
};

const convertToZeroOne = (old_value, old_min, old_max) => {
  return (old_value - old_min) / (old_max - old_min);
};
