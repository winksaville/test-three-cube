console.log("ww=" + window.innerWidth + " wh=" + window.innerHeight);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(20, 20, 20, 1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0xFF0000}); // red
material.wireframe = true;
material.wireframeLinewidth = 2.0;
var cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Cube is centered at the origin 0,0,0 in the middle of the screen

var axes = buildAxes( 1000 );
scene.add(axes);

camera.position.z = 50; // Camera is away from cube

// And some sort of controls to move around
// We'll use one of THREE's provided control classes for simplicity
var controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

controls.noZoom = false;
controls.noPan = false;

controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

controls.keys = [ 65, 83, 68 ];

var render = function() {
  //cube.position.x = mouse.x;
  //cube.position.y = mouse.y;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update()
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

// buildAxis and buildAxes From https://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/

function buildAxis(src, dst, colorHex, dashed) {
  var geom = new THREE.Geometry(), mat;

  if (dashed) {
    mat = new THREE.LineDashedMaterial(
        {linewidth : 3, color : colorHex, dashSize : 3, gapSize : 3});
  } else {
    mat = new THREE.LineBasicMaterial({linewidth : 3, color : colorHex});
  }

  geom.vertices.push(src.clone());
  geom.vertices.push(dst.clone());
  geom.computeLineDistances(); // This one is SUPER important, otherwise dashed
                               // lines will appear as simple plain lines

  var axis = new THREE.Line(geom, mat, THREE.LineSegments);

  return axis;
}


function buildAxes(length) {
  var axes = new THREE.Object3D();

  axes.add(buildAxis(new THREE.Vector3(0, 0, 0),
                     new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
  axes.add(buildAxis(new THREE.Vector3(0, 0, 0),
                     new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
  axes.add(buildAxis(new THREE.Vector3(0, 0, 0),
                     new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
  axes.add(buildAxis(new THREE.Vector3(0, 0, 0),
                     new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
  axes.add(buildAxis(new THREE.Vector3(0, 0, 0),
                     new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
  axes.add(buildAxis(new THREE.Vector3(0, 0, 0),
                     new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z

  return axes;
}

if (false) {
  // My little attempt to move the location of the rotating
  // cube to the current mouse position. It moves it but the
  // "scale" is wrong.
  // This is from 
  var old_mouse = new THREE.Vector2();
  var mouse = new THREE.Vector2();
  var drag = false;

  function onMouseDown(e) {
    drag = true;
    // e.preventDefault();
    console.log("e.clientX=" + e.clientX + " e.clientY=" + e.clientY);
    mouse.x = ((e.clientX / window.innerWidth) * 2) - 1;
    mouse.y = (-(e.clientY / window.innerHeight) * 2) + 1;
    console.log("mouse scene coord: x=" + mouse.x + " y=" + mouse.y);
    console.log("camera.position: x=" + camera.position.x + " y=" +
                camera.position.y);
    // mouse.sub(camera.position);
    // console.log("mouse.sub(camera.position: x=" + mouse.x + " y=" + mouse.y);
    // mouse.normalize();
    console.log("mouse.normalized: x=" + mouse.x + " y=" + mouse.y);
    // render();
    // requestAnimationFrame( render );
  }

  function onMouseUp(e) { drag = false; }

  function onMouseMove(e) {
    if (false) {
      old_mouse.x = mouse.x;
      old_mouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // e.preventDefault();

      render();
    }
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
  renderer.domElement.addEventListener('mousedown', onMouseDown);
}

render();
