let scene, camera, renderer, goat, rotationSpeed = 0.02;

// Initialize Scene
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0000ff); // Set background to blue

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add Light
    const light = new THREE.AmbientLight(0xffffff, 2);
    scene.add(light);

    // Load GLTF Loader
    const loader = new THREE.GLTFLoader();
    loader.load('goat_head.glb', function (gltf) {
        goat = gltf.scene;
        goat.scale.set(1, 1, 1);
        goat.position.y = 0;
        scene.add(goat);
    }, undefined, function (error) {
        console.error("Error loading GLB model:", error);
    });

    camera.position.z = 5; // Default Zoom
    animate();
}

// Animate Goat Rotation
function animate() {
    requestAnimationFrame(animate);
    if (goat) {
        goat.rotation.y += rotationSpeed; // Constant rotation
    }
    renderer.render(scene, camera);
}

// Calculate Profit/Loss and Adjust Goat's Size
function calculate() {
    let initialInvestment = parseFloat(document.getElementById("initial").value);
    let currentValue = parseFloat(document.getElementById("current").value);

    if (isNaN(initialInvestment) || isNaN(currentValue) || initialInvestment <= 0) {
        document.getElementById("result").innerText = "Please enter valid numbers.";
        return;
    }

    let profitOrLoss = currentValue - initialInvestment;
    let percentageChange = (profitOrLoss / initialInvestment) * 100;

    if (goat) {
        // Adjust Goat Head Size
        let headSize = 1 - percentageChange * 0.01;
        goat.scale.set(Math.max(0.5, headSize), Math.max(0.5, headSize), Math.max(0.5, headSize)); // Prevents shrinking too much

        // Adjust Rotation Speed (Faster rotation on loss)
        rotationSpeed = profitOrLoss < 0 ? 0.05 : 0.02;
    }

    // Auto-Zoom Effect
    let targetZoom = profitOrLoss < 0 ? 3 : 5; // Zoom in on loss, out on profit
    let zoomSpeed = 0.1;

    function smoothZoom() {
        if (Math.abs(camera.position.z - targetZoom) > 0.01) {
            camera.position.z += (targetZoom - camera.position.z) * zoomSpeed;
            requestAnimationFrame(smoothZoom);
        }
    }
    smoothZoom();

    let message = profitOrLoss > 0 
        ? `Profit: $${profitOrLoss.toFixed(2)} (${percentageChange.toFixed(2)}%) - Goat is happy! 🐐🎉`
        : profitOrLoss < 0 
        ? `Loss: $${Math.abs(profitOrLoss).toFixed(2)} (${percentageChange.toFixed(2)}%) - Goat zooms in! 🔍🐐`
        : "No profit, no loss.";

    document.getElementById("result").innerText = message;
}

// Initialize Scene
window.onload = init;
