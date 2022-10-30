const calculateNormal = (position, indices) => {
  let pontos = [];
  let faces = [];
  let resultado;

  for (let i = 0; i < position.length; i += 3) {
    pontos.push([position[i], position[i + 1], position[i + 2]]);
  }

  for (let i = 0; i < indices.length; i += 3) {
    faces.push([indices[i], indices[i + 1], indices[i + 2]]);
  }

  var normalUsadas = {};

  for (let i = 0, j = 0; i < position.length; i += 3, j++) {
    normalUsadas[j] = [];
  }

  normal = faces.map((item) => {
    // AB AC
    vetorA1 = [
      pontos[item[1]][0] - pontos[item[0]][0],
      pontos[item[1]][1] - pontos[item[0]][1],
      pontos[item[1]][2] - pontos[item[0]][2],
    ];
    vetorB1 = [
      pontos[item[2]][0] - pontos[item[0]][0],
      pontos[item[2]][1] - pontos[item[0]][1],
      pontos[item[2]][2] - pontos[item[0]][2],
    ];

    // BA BC
    vetorB2 = [
      pontos[item[0]][0] - pontos[item[1]][0],
      pontos[item[0]][1] - pontos[item[1]][1],
      pontos[item[0]][2] - pontos[item[1]][2],
    ];
    vetorA2 = [
      pontos[item[2]][0] - pontos[item[1]][0],
      pontos[item[2]][1] - pontos[item[1]][1],
      pontos[item[2]][2] - pontos[item[1]][2],
    ];

    // CA CB
    vetorA3 = [
      pontos[item[0]][0] - pontos[item[2]][0],
      pontos[item[0]][1] - pontos[item[2]][1],
      pontos[item[0]][2] - pontos[item[2]][2],
    ];
    vetorB3 = [
      pontos[item[1]][0] - pontos[item[2]][0],
      pontos[item[1]][1] - pontos[item[2]][1],
      pontos[item[1]][2] - pontos[item[2]][2],
    ];

    produto = [
      vetorA1[1] * vetorB1[2] - vetorB1[1] * vetorA1[2],
      vetorB1[0] * vetorA1[2] - vetorA1[0] * vetorB1[2],
      vetorA1[0] * vetorB1[1] - vetorB1[0] * vetorA1[1],

      vetorA2[1] * vetorB2[2] - vetorB2[1] * vetorA2[2],
      vetorB2[0] * vetorA2[2] - vetorA2[0] * vetorB2[2],
      vetorA2[0] * vetorB2[1] - vetorB2[0] * vetorA2[1],

      vetorA3[1] * vetorB3[2] - vetorB3[1] * vetorA3[2],
      vetorB3[0] * vetorA3[2] - vetorA3[0] * vetorB3[2],
      vetorA3[0] * vetorB3[1] - vetorB3[0] * vetorA3[1],
    ];

    let distancia = [];

    for (let i = 0, j = 0; i < produto.length; i += 3, j++) {
      distancia.push(
        Math.abs(
          Math.sqrt(
            produto[i] * produto[i] +
              produto[i + 1] * produto[i + 1] +
              produto[i + 2] * produto[i + 2]
          )
        )
      );

      produto[i] = produto[i] / distancia[j];
      produto[i + 1] = produto[i + 1] / distancia[j];
      produto[i + 2] = produto[i + 2] / distancia[j];
    }

    for (let i = 0, j = 0; i < produto.length; i += 3, j++) {
      if (normalUsadas[item[0]].length == 0) {
        normalUsadas[item[0]] = [produto[i], produto[i + 1], produto[i + 2]];
      } else {
        if (normalUsadas[item[1]].length == 0) {
          normalUsadas[item[1]] = [produto[i], produto[i + 1], produto[i + 2]];
        } else {
          normalUsadas[item[2]] = [produto[i], produto[i + 1], produto[i + 2]];
        }
      }
    }

    return produto;
  });

  let normaisTratadas = [];

  for (const item in normalUsadas) {
    for (let i = 0; i < normalUsadas[item].length; i++) {
      normaisTratadas.push(normalUsadas[item][i]);
    }
  }

  return normaisTratadas;
};

const normalSemIndice = () => {
  for (let i = 0; i < arrays_pyramid.position.length; i = i + 9) {
    // cross(B-A, C-A)
    // var i0 = arrays_pyramid.indices[i];
    // var i1 = arrays_pyramid.indices[i + 1];
    // var i2 = arrays_pyramid.indices[i + 2];

    var a = [
      arrays_pyramid.position[i],
      arrays_pyramid.position[i + 1],
      arrays_pyramid.position[i + 2],
    ];

    var b = [
      arrays_pyramid.position[i + 3],
      arrays_pyramid.position[i + 4],
      arrays_pyramid.position[i + 5],
    ];
    var c = [
      arrays_pyramid.position[i + 6],
      arrays_pyramid.position[i + 7],
      arrays_pyramid.position[i + 8],
    ];
    // console.log("a");
    // console.log(a);
    // console.log("b");
    // console.log(b);
    // console.log("c");
    // console.log(c);
    var x = crossProduct(
      [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
      [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    );
    console.log(`cross product: ${x}`);
    arrays_pyramid.normal[i] = x[0];
    arrays_pyramid.normal[i + 1] = x[1];
    arrays_pyramid.normal[i + 2] = x[2];

    console.log(`normal: ${arrays_pyramid.normal}`);
  }
};

const normalComIndice = () => {
  for (let i = 0; i < arrays_pyramid.indices.length; i = i + 3) {
    // cross(B-A, C-A)
    var i0 = arrays_pyramid.indices[i];
    var i1 = arrays_pyramid.indices[i + 1];
    var i2 = arrays_pyramid.indices[i + 2];

    var a = [
      arrays_pyramid.position[i0],
      arrays_pyramid.position[i1],
      arrays_pyramid.position[i2],
    ];

    var b = [
      arrays_pyramid.position[i0 + 1],
      arrays_pyramid.position[i1 + 1],
      arrays_pyramid.position[i2 + 1],
    ];
    var c = [
      arrays_pyramid.position[i0 + 2],
      arrays_pyramid.position[i1 + 2],
      arrays_pyramid.position[i2 + 2],
    ];
    console.log(`a: ${a}`);
    console.log(`b: ${b}`);
    console.log(`c: ${c}`);
    var x = crossProduct(
      [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
      [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    );
    console.log(`cross product: ${x}`);
    console.log();
    var temp = somaNormal(
      [
        arrays_pyramid.normal[i0],
        arrays_pyramid.normal[i0 + 1],
        arrays_pyramid.normal[i0 + 2],
      ],
      x
    );
    arrays_pyramid.normal[i0] = temp[0];
    arrays_pyramid.normal[i0 + 1] = temp[1];
    arrays_pyramid.normal[i0 + 2] = temp[2];
    arrays_pyramid.normal[i1 * 3] = temp[0];
    arrays_pyramid.normal[i1 * 3 + 1] = temp[1];
    arrays_pyramid.normal[i1 * 3 + 2] = temp[2];
    arrays_pyramid.normal[i2 * 3] = temp[0];
    arrays_pyramid.normal[i2 * 3 + 1] = temp[1];
    arrays_pyramid.normal[i2 * 3 + 2] = temp[2];
    console.log(`normal: ${arrays_pyramid.normal}`);
  }
};
