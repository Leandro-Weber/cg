class Camera {
  constructor(cameraPosition, target, up) {
    this.cameraPosition = [
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
    ];

    this.target = [target[0], target[1], target[2]];

    this.up = [...up];
  }

  computeMatrix() {
    let cameraMatrix = m4.lookAt(
      convertObjectToArray(this.cameraPosition),
      convertObjectToArray(this.target),
      this.up
    );

    let viewMatrix = m4.inverse(cameraMatrix);

    return viewMatrix;
  }
}

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
}
