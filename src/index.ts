import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Color,
  Float32BufferAttribute,
  Mesh,
  WebGLRenderer
} from "three";

// adapted from https://stackoverflow.com/a/70404932/1945088

const randomHues = [195, 234, 294, 166, 263, 291, 327, 312, 224, 34, 36, 188, 308, 122, 58, 87, 318, 135, 282, 143, 244, 187, 89, 88, 142, 208, 176, 339, 283, 159, 131, 356, 57, 0, 147, 52, 288, 270, 99, 343, 219, 165, 123, 309, 329, 77, 304, 271, 120, 359, 281, 64, 211, 60, 301, 154, 23, 336, 80, 306, 260, 276, 75, 344, 199, 302, 296, 277, 218, 214, 37, 48, 334, 74, 358, 245, 17, 238, 46, 285, 193, 71, 315, 292, 180, 126, 212, 287, 31, 261, 313, 323, 40, 93, 322, 56, 84, 240, 168, 269, 268, 94, 333, 196, 280, 185, 272, 223, 44, 112, 141, 200, 241, 202, 310, 32, 231, 146, 297, 236, 160, 217, 173, 19, 338, 248, 25, 232, 161, 148, 349, 174, 116, 113, 24, 30, 33, 70, 96, 345, 324, 307, 253, 136, 91, 97, 330, 194, 354, 357, 254, 85, 266, 13, 11, 1, 105, 197, 98, 311, 55, 284, 215, 184, 342, 62, 326, 39, 230, 355, 239, 41, 183, 9, 337, 247, 172, 109, 14, 125, 107, 10, 207, 170, 267, 104, 133, 198, 273, 192, 340, 167, 128, 86, 83, 28, 45, 12, 191, 111, 189, 26, 293, 153, 73, 252, 137, 325, 150];
const randomLightnesses = [51, 42, 39, 26, 37, 71, 73, 36, 25, 53, 57, 75, 60, 33, 74, 40, 72, 55, 54, 68, 50, 64, 30, 35, 65, 62, 32, 69, 29, 48, 31, 34, 38, 41, 49, 43, 61, 28, 27, 63, 52, 67, 59, 58, 66, 45, 44, 56, 47];

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;

init();

function init() {

  camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 4;

  scene = new Scene();


  const positions = [-1, 0, 1];
  const stickerSize = 0.85;
  const stickerThickness = 0.01;



  function createCubie(position: {x: number, y: number, z: number}) {
    const positionArray = [position.x, position.y, position.z]
    const cubie = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 'black' })
    );
    cubie.position.set(position.x, position.y, position.z);
    scene.add(cubie);

    for (let [index, dim] of (['x','y','z'] as const).entries()) {
      if (Math.abs(position[dim]) === 1) {
        console.log('creating sticker')
        let sizes = [stickerSize, stickerSize, stickerSize];
        sizes[index] = stickerThickness
        const sticker = new Mesh(
          new BoxGeometry(...sizes),
          new MeshBasicMaterial({ color: randomColor() })
        );
        const stickerPosition = [...positionArray] as [number, number, number]
        stickerPosition[index] = positionArray[index] * 1.5;
        sticker.position.set(...stickerPosition)
        scene.add(sticker)
      }
    }

    // if (position.x === 1) {
    //   const sticker = new Mesh(
    //     new BoxGeometry(stickerThickness, stickerSize, stickerSize),
    //     new MeshBasicMaterial({ color: randomColor() })
    //   );
    //   sticker.position.set(position.x + 0.5, position.y, position.z)
    //   scene.add(sticker)
    // } else {
    //   const sticker = 2;
    // }
  }


  for (let x of positions) {
    for (let y of positions) {
      for (let z of positions) {
        createCubie({x, y, z})
      }
    }
  }


  camera.position.z = 5;
  camera.position.y = 5;
  camera.position.x = 5

  camera.lookAt(0, 0, 0)





  renderer = new WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor('gray')
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);

}

function randomColor() {
  const hue = randomHues.shift() ?? 0;
  const lightness = randomLightnesses.shift() ?? 50;
  return `hsl(${hue}, 100%, ${lightness}%)`;
}
