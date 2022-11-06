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
const computeMatrixLuz2 = (matrix, config) => {
  matrix.trs.translation = [4, 0, 0];
  matrix.trs.rotation = [degToRad(0), degToRad(0), degToRad(0)];
  matrix.trs.scale = [0.05, 0.05, 0.05];
};

const computeMatrixCuboVertice = (matrix, config) => {
  matrix.trs.translation = [config.vx, config.vy, config.vz];
  matrix.trs.rotation = [degToRad(0), degToRad(0), degToRad(0)];
  matrix.trs.scale = [0.1, 0.1, 0.1];
};
const convertToZeroOne = (old_value, old_min, old_max) => {
  return (old_value - old_min) / (old_max - old_min);
};

class Luz {
  constructor(position, color, spec, shine) {
    this.position = {
      x: position[0],
      y: position[1],
      z: position[2],
    };

    this.color = color;
    this.spec = spec;

    this.shine = shine;
  }

  // computeMatrix() {
  //     let cameraMatrix = m4.lookAt(convertObjectToArray(this.cameraPosition), convertObjectToArray(this.target), this.up)

  //     let viewMatrix = m4.inverse(cameraMatrix);

  //     return viewMatrix
  // }
}

const locura = () => {
  //console.log(arrays_pyramid.texcoord);
  var count = 0;
  for (let i = 0; i < arrays_pyramid.position.length; i = i + 3) {
    if (arrays_pyramid.normal[i] != 0) {
      // se x diff de zero
      arrays_pyramid.texcoord[count] = arrays_pyramid.position[i + 2];
      arrays_pyramid.texcoord[count + 1] = arrays_pyramid.position[i + 1];
    } else {
      if (arrays_pyramid.normal[i + 1] != 0) {
        // se y diff
        arrays_pyramid.texcoord[count] = arrays_pyramid.position[i + 2];
        arrays_pyramid.texcoord[count + 1] = arrays_pyramid.position[i];
      } else {
        arrays_pyramid.texcoord[count] = arrays_pyramid.position[i + 1];
        arrays_pyramid.texcoord[count + 1] = arrays_pyramid.position[i];
      }
    }
    count += 2;
  }
  //console.log(arrays_pyramid.texcoord);
};
