import './eddy-engine/eddy-engine.js';
console.log(EddyEngine);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core Components
    const canvas = document.getElementById('eddy-canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const renderer = new EddyEngine.Renderer(canvas);
    const scene = new EddyEngine.Scene();
    const camera = new EddyEngine.Camera(
        new EddyEngine.Vector.Vec3(0, 0, 5),  // eye
        new EddyEngine.Vector.Vec3(0, 0, 0),  // lookAt
        new EddyEngine.Vector.Vec3(0, 1, 0),  // up
        45,                             // field of view
        canvas.width / canvas.height    // aspect ratio
    );

    // Load Scene Data
    let loader = new EddyEngine.Loader();
    loader.load('/scene.json', function (data) {
        let sceneData = JSON.parse(data);
        buildScene(scene, sceneData);
         
        // Start the render loop
        function render() {
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        };
        // Start the render loop
        render();
    });
});

// Function to build the scene from loaded data
function buildScene(scene, data) {
    data.objects.forEach(obj => {
        let material = new EddyEngine.Material(
            new EddyEngine.Color(obj.material.ambient.r, obj.material.ambient.g, obj.material.ambient.b),
            new EddyEngine.Color(obj.material.diffuse.r, obj.material.diffuse.g, obj.material.diffuse.b),
            new EddyEngine.Color(obj.material.specular.r, obj.material.specular.g, obj.material.specular.b),
            obj.material.shininess
        );

        if (obj.type === 'sphere') {

            let sphere = new EddyEngine.Sphere(
                new EddyEngine.Vector.Vec3(obj.center.x, obj.center.y, obj.center.z),
                obj.radius,
                material
            );
            console.log(sphere);
            scene.add(sphere);
        }
        

        if (obj.type === 'plane') {
            let plane = new EddyEngine.Plane(
                new EddyEngine.Vector.Vec3(obj.normal.x, obj.normal.y, obj.normal.z),
                obj.distance,
                material
            );
            scene.add(plane);
        } 

  });

    // Add lights
    data.lights.forEach(lightData => {
        let light = new EddyEngine.Light(
            new EddyEngine.Vector.Vec3(lightData.position.x, lightData.position.y, lightData.position.z),
            new EddyEngine.Color(lightData.color.r, lightData.color.g, lightData.color.b)
        );
        scene.add(light);
    });
}
