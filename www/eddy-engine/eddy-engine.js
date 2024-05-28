(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser global
        root.EddyEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    var EddyEngine = {};

    EddyEngine.Loader = function () {
        this.load = function (url, callback) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr.responseText);
                }
            };
            xhr.send();
        };
    };

    
    EddyEngine.Camera = function (eye, lookAt, up, fov, aspect) {
        this.eye = eye || new EddyEngine.Vector.Vec3(0, 0, 0);
        this.lookAt = lookAt || new EddyEngine.Vector.Vec3(0, 0, -1);
        this.up = up || new EddyEngine.Vector.Vec3(0, 1, 0);
        this.fov = fov || 45 * Math.PI / 180;
        this.aspect = aspect || 1;
    }


    EddyEngine.Ray = function (origin, direction) {
        this.origin = origin;
        this.direction = direction;
    };

    EddyEngine.Ray.prototype.pointAt = function (t) {
        return this.origin.add(this.direction.multiply(t));
    }

    EddyEngine.Sphere = function (center, radius, material) {
        this.center = center;
        this.radius = radius;
        this.material = material;
    }

    EddyEngine.Sphere.prototype.intersect = function (ray) {
        let oc = ray.origin.subtract(this.center);
        let a = ray.direction.dot(ray.direction);
        let b = 2.0 * oc.dot(ray.direction);
        let c = oc.dot(oc) - this.radius * this.radius;
        let discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return null;
        } else {
            let t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
            if (t > 0) {
                return t;
            }
        }

        return null;
    }

    EddyEngine.Sphere.prototype.normal = function (point) {
        return point.subtract(this.center).normalize();
    }

    EddyEngine.Material = function (ambient, diffuse, specular, shininess) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
    }

    
    EddyEngine.Light = function (position, color) {
        this.position = position;
        this.color = color;
    }

    EddyEngine.Color = function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    EddyEngine.Color.prototype.add = function (color) {
        return new EddyEngine.Color(this.r + color.r, this.g + color.g, this.b + color.b);
    }

    EddyEngine.Color.prototype.subtract = function (color) {
        return new EddyEngine.Color(this.r - color.r, this.g - color.g, this.b - color.b);
    }

    EddyEngine.Color.prototype.multiply = function (value) {
        return new EddyEngine.Color(this.r * value, this.g * value, this.b * value);
    }

    EddyEngine.Color.prototype.multiplyColor = function (color) {
        return new EddyEngine.Color(this.r * color.r, this.g * color.g, this.b * color.b);
    }

    EddyEngine.Color.prototype.divide = function (value) {
        return new EddyEngine.Color(this.r / value, this.g / value, this.b / value);
    }

    EddyEngine.Color.prototype.clamp = function () {
        let r = Math.min(1, this.r);
        let g = Math.min(1, this.g);
        let b = Math.min(1, this.b);
        return new EddyEngine.Color(r, g, b);
    }

    EddyEngine.Color.prototype.toRGB = function () {
        let r = Math.floor(this.r * 255);
        let g = Math.floor(this.g * 255);
        let b = Math.floor(this.b * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    EddyEngine.Color.prototype.toHex = function () {
        let r = Math.floor(this.r * 255);
        let g = Math.floor(this.g * 255);
        let b = Math.floor(this.b * 255);
        return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    }
    EddyEngine.Scene = function () {
        this.width = 0;
        this.height = 0;
        this.objects = [];
        this.lights = [];
    }

    EddyEngine.Object = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.color = '#000000';
    }

    EddyEngine.Light = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.color = '#FFFFFF';
    }


    EddyEngine.Renderer = function () {
        this.render = function (scene) {
            let canvas = document.createElement('canvas');
            canvas.width = scene.width;
            canvas.height = scene.height;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, scene.width, scene.height);
            scene.objects.forEach(function (obj) {
                ctx.fillStyle = obj.color;
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            });
            return canvas;
        };
    };

    EddyEngine.Renderer.prototype.trace = function (ray, scene) {
        let color = new EddyEngine.Color(0, 0, 0);
        let tMin = Number.MAX_VALUE;
        let object = null;

        for (let i = 0; i < scene.objects.length; i++) {
            let t = scene.objects[i].intersect(ray);
            if (t !== null && t < tMin) {
                tMin = t;
                object = scene.objects[i];
            }
        }

        if (object !== null) {
            let point = ray.pointAt(tMin);
            let normal = object.normal(point);
            color = this.shade(point, normal, object.material, scene);
        }

        return color;
    }

    EddyEngine.Renderer.prototype.shade = function (point, normal, material, scene) {
        let color = new EddyEngine.Color(0, 0, 0);

        for (let i = 0; i < scene.lights.length; i++) {
            let light = scene.lights[i];
            let lightDirection = light.position.subtract(point).normalize();
            let shadowRay = new EddyEngine.Ray(point, lightDirection);
            let inShadow = false;

            for (let j = 0; j < scene.objects.length; j++) {
                if (scene.objects[j].intersect(shadowRay) !== null) {
                    inShadow = true;
                    break;
                }
            }

            if (!inShadow) {
                let ambient = material.ambient.multiplyColor(light.color);
                let diffuse = material.diffuse.multiplyColor(light.color).multiply(Math.max(0, normal.dot(lightDirection)));
                let reflection = lightDirection.reflect(normal);
                let specular = material.specular.multiplyColor(light.color).multiply(Math.pow(Math.max(0, reflection.dot(lightDirection)), material.shininess));
                color = color.add(ambient.add(diffuse).add(specular));
            }
        }

        return color.clamp();
    }
    function Engine (scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }

    Engine.prototype.start = function () {
        let canvas = document.createElement('canvas');
        canvas.width = this.scene.width;
        canvas.height = this.scene.height;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        let index = 0;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let u = (2 * x - canvas.width) / canvas.width;
                let v = (2 * y - canvas.height) / canvas.height;
                let ray = this.camera.getRay(u, v);
                let color = this.renderer.trace(ray, this.scene);
                data[index++] = color.r * 255;
                data[index++] = color.g * 255;
                data[index++] = color.b * 255;
                data[index++] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        document.body.appendChild(canvas);
    }

    EddyEngine.Engine = function (scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }
  

    return EddyEngine;
}));
