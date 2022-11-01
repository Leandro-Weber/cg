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
