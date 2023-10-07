// Define variables for the scene, camera, and renderer
// Create a loader for the OBJ model
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Set the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer to the container in your HTML
document.getElementById('mushroom-container').appendChild(renderer.domElement);

// Create a loader for the OBJ model
const loader = new THREE.OBJLoader();

// Load the OBJ model
loader.load('/static/assets/mushroomlow.obj', (object) => {
    // Add the loaded object to the scene
    scene.add(object);

    // Optionally, you can scale, position, or rotate the object as needed
    object.scale.set(0.1, 0.1, 0.1);
});

// Set the initial camera position
camera.position.z = 5;

// Create an animation function
const animate = () => {
    // Add animation logic here if needed

    // Render the scene with the camera
    renderer.render(scene, camera);

    // Request the next frame
    requestAnimationFrame(animate);
};

// Start the animation loop
animate();
