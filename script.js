let scene;
let camera;
let renderer;
let goat;

let rotationSpeed = 0.008;
let targetRotationSpeed = 0.008;

let targetCameraZ = 5;
let currentCameraZ = 5;

let isDragging = false;
let previousPointerX = 0;

let lastResult = null;


// ================================
// INITIALIZE
// ================================

function init() {

    const container = document.getElementById("container");

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x050505);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(0, 0.15, 5);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);


    // ================================
    // LIGHTING
    // ================================

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        2.2
    );

    scene.add(ambientLight);


    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        2
    );

    keyLight.position.set(
        3,
        4,
        5
    );

    scene.add(keyLight);


    const rimLight = new THREE.PointLight(
        0xffffff,
        1.5,
        20
    );

    rimLight.position.set(
        -4,
        1,
        -3
    );

    scene.add(rimLight);


    // ================================
    // LOAD GOAT
    // ================================

    const loader = new THREE.GLTFLoader();

    loader.load(

        "goat_head.glb",

        function(gltf) {

            goat = gltf.scene;

            goat.scale.set(
                1.25,
                1.25,
                1.25
            );

            goat.position.set(
                0,
                -0.35,
                0
            );

            scene.add(goat);

            // Center model automatically
            const box = new THREE.Box3().setFromObject(goat);

            const center = box.getCenter(
                new THREE.Vector3()
            );

            goat.position.x -= center.x;
            goat.position.y -= center.y - 0.15;
            goat.position.z -= center.z;

        },

        function(xhr) {

            console.log(
                "Goat loading:",
                ((xhr.loaded / xhr.total) * 100).toFixed(0) + "%"
            );

        },

        function(error) {

            console.error(
                "Error loading goat_head.glb:",
                error
            );

            showGoatError();

        }

    );


    // ================================
    // EVENTS
    // ================================

    window.addEventListener(
        "resize",
        onWindowResize
    );

    renderer.domElement.addEventListener(
        "pointerdown",
        onPointerDown
    );

    renderer.domElement.addEventListener(
        "pointermove",
        onPointerMove
    );

    renderer.domElement.addEventListener(
        "pointerup",
        onPointerUp
    );

    renderer.domElement.addEventListener(
        "pointercancel",
        onPointerUp
    );


    animate();
}


// ================================
// ANIMATION
// ================================

function animate() {

    requestAnimationFrame(animate);


    // Smooth rotation speed
    rotationSpeed +=
        (targetRotationSpeed - rotationSpeed) * 0.04;


    if (goat && !isDragging) {

        goat.rotation.y += rotationSpeed;

    }


    // Smooth camera movement
    currentCameraZ +=
        (targetCameraZ - currentCameraZ) * 0.04;

    camera.position.z = currentCameraZ;


    renderer.render(
        scene,
        camera
    );
}


// ================================
// POINTER CONTROLS
// ================================

function onPointerDown(event) {

    isDragging = true;

    previousPointerX = event.clientX;

}

function onPointerMove(event) {

    if (!isDragging || !goat) {
        return;
    }

    const difference =
        event.clientX - previousPointerX;

    goat.rotation.y += difference * 0.01;

    previousPointerX = event.clientX;

}

function onPointerUp() {

    isDragging = false;

}


// ================================
// WINDOW RESIZE
// ================================

function onWindowResize() {

    if (!camera || !renderer) {
        return;
    }

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


// ================================
// CALCULATE P&L
// ================================

function calculate() {

    const initialInvestment =
        parseFloat(
            document.getElementById("initial").value
        );

    const currentValue =
        parseFloat(
            document.getElementById("current").value
        );


    if (
        !Number.isFinite(initialInvestment) ||
        !Number.isFinite(currentValue) ||
        initialInvestment <= 0 ||
        currentValue < 0
    ) {

        alert(
            "Enter a valid investment and current value."
        );

        return;

    }


    const profitOrLoss =
        currentValue - initialInvestment;


    const percentageChange =
        (profitOrLoss / initialInvestment) * 100;


    const multiplier =
        currentValue / initialInvestment;


    const status =
        getGoatStatus(percentageChange);


    lastResult = {

        initial: initialInvestment,

        current: currentValue,

        profit: profitOrLoss,

        percentage: percentageChange,

        multiplier: multiplier,

        status: status

    };


    // ================================
    // UPDATE UI
    // ================================

    document.getElementById("resultCard")
        .style.display = "block";


    document.getElementById("statusText")
        .innerText = status;


    document.getElementById("percentage")
        .innerText =
            formatPercentage(percentageChange);


    document.getElementById("profitLoss")
        .innerText =
            formatMoney(profitOrLoss);


    document.getElementById("multiplier")
        .innerText =
            multiplier.toFixed(2) + "X";


    document.getElementById("investedValue")
        .innerText =
            formatMoney(initialInvestment);


    // ================================
    // CHANGE GOAT
    // ================================

    updateGoat(percentageChange);

}


// ================================
// GOAT STATUS
// ================================

function getGoatStatus(percent) {

    if (percent >= 1000) {
        return "ABSOLUTE LEGEND";
    }

    if (percent >= 500) {
        return "CERTIFIED GOAT";
    }

    if (percent >= 200) {
        return "WHALE ENERGY";
    }

    if (percent >= 100) {
        return "COOKING";
    }

    if (percent >= 25) {
        return "WE MOVE";
    }

    if (percent > 0) {
        return "SMALL W";

    }

    if (percent === 0) {
        return "NPC MODE";
    }

    if (percent > -20) {
        return "SLIGHTLY COOKED";
    }

    if (percent > -50) {
        return "COOKED";
    }

    if (percent > -90) {
        return "DEEP FRIED";
    }

    return "ABSOLUTELY FINISHED";
}


// ================================
// UPDATE GOAT
// ================================

function updateGoat(percent) {

    if (!goat) {
        return;
    }


    let targetScale = 1.25;


    // Huge profits
    if (percent >= 500) {

        targetScale = 1.7;

        targetRotationSpeed = 0.035;

        targetCameraZ = 6.5;

    }

    // Good profits
    else if (percent >= 100) {

        targetScale = 1.5;

        targetRotationSpeed = 0.022;

        targetCameraZ = 5.7;

    }

    // Small profits
    else if (percent > 0) {

        targetScale = 1.35;

        targetRotationSpeed = 0.012;

        targetCameraZ = 5.2;

    }

    // Break even
    else if (percent === 0) {

        targetScale = 1.25;

        targetRotationSpeed = 0.008;

        targetCameraZ = 5;

    }

    // Small loss
    else if (percent > -50) {

        targetScale = 1.05;

        targetRotationSpeed = 0.018;

        targetCameraZ = 4.4;

    }

    // Big loss
    else {

        targetScale = 0.8;

        targetRotationSpeed = 0.035;

        targetCameraZ = 3.7;

    }


    animateGoatScale(targetScale);

}


// ================================
// SMOOTH GOAT SCALE
// ================================

function animateGoatScale(targetScale) {

    if (!goat) {
        return;
    }


    const startScale =
        goat.scale.x;

    const difference =
        targetScale - startScale;


    function scaleStep() {

        if (!goat) {
            return;
        }


        const current =
            goat.scale.x;


        const next =
            current + difference * 0.08;


        goat.scale.set(
            next,
            next,
            next
        );


        if (
            Math.abs(
                targetScale - next
            ) > 0.005
        ) {

            requestAnimationFrame(
                scaleStep
            );

        } else {

            goat.scale.set(
                targetScale,
                targetScale,
                targetScale
            );

        }

    }


    scaleStep();

}


// ================================
// PRESETS
// ================================

function setPreset(
    initial,
    current
) {

    document.getElementById("initial")
        .value = initial;

    document.getElementById("current")
        .value = current;

    calculate();

}


// ================================
// RESET
// ================================

function resetApp() {

    document.getElementById("initial")
        .value = "";

    document.getElementById("current")
        .value = "";

    document.getElementById("resultCard")
        .style.display = "none";


    targetRotationSpeed = 0.008;

    targetCameraZ = 5;


    if (goat) {

        animateGoatScale(1.25);

    }

}


// ================================
// FORMAT MONEY
// ================================

function formatMoney(value) {

    const sign =
        value >= 0 ? "+" : "-";


    return (
        sign +
        "$" +
        Math.abs(value)
            .toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
    );

}


// ================================
// FORMAT PERCENTAGE
// ================================

function formatPercentage(value) {

    const sign =
        value >= 0 ? "+" : "";


    return (
        sign +
        value.toFixed(2) +
        "%"
    );

}


// ================================
// SHARE RESULT
// ================================

async function shareResult() {

    if (!lastResult) {
        return;
    }


    const shareText =
        `🐐 CRYPTO GOAT\n\n` +
        `Invested: $${lastResult.initial.toLocaleString()}\n` +
        `Now: $${lastResult.current.toLocaleString()}\n` +
        `P&L: ${formatMoney(lastResult.profit)}\n` +
        `ROI: ${formatPercentage(lastResult.percentage)}\n` +
        `Multiplier: ${lastResult.multiplier.toFixed(2)}X\n\n` +
        `${lastResult.status}`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title: "Crypto Goat",

                text: shareText

            });

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

    } else {

        try {

            await navigator.clipboard.writeText(
                shareText
            );

            alert(
                "Result copied to clipboard."
            );

        } catch (error) {

            alert(
                shareText
            );

        }

    }

}


// ================================
// GOAT ERROR
// ================================

function showGoatError() {

    const hint =
        document.getElementById("hint");

    hint.innerText =
        "Could not load goat_head.glb";

}


// ================================
// START
// ================================

init();