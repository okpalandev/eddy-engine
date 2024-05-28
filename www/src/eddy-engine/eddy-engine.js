;let EddyEngine = (function (EddyEngine) {
    'use strict';

    
    if (EddyEngine === undefined) {
        EddyEngine = {};
    }
    EddyEngine.Vector = {};

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


    EddyEngine.Scene = function () {
        this.objects = [];
        this.lights = [];
    }

    EddyEngine.Scene.prototype.add = function (object) {
        this.objects.push(object);
    }

    EddyEngine.Scene.prototype.addLight = function (light) {
        this.lights.push(light);
    }

    EddyEngine.Plane = function (normal, distance, material) {
        this.normal = normal;
        this.distance = distance;
        this.material = material;
    }

    EddyEngine.Plane.prototype.intersect = function (ray) {
        let denominator = this.normal.dot(ray.direction);
        if (denominator > 1e-6) {
            let t = this.normal.dot(this.normal.multiply(this.distance).subtract(ray.origin)) / denominator;
            if (t >= 0) {
                return t;
            }
        }

        return null;
    }

    EddyEngine.Plane.prototype.normal = function (point) {
        return this.normal;
    }

    

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
    }

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

    EddyEngine.Renderer = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    EddyEngine.Renderer.prototype.render = function (scene, camera) {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let fov = camera.fov;
        let aspect = camera.aspect;
        let eye = camera.eye;
        let lookAt = camera.lookAt;
        let up = camera.up;

        let n = eye.subtract(lookAt).normalize();
        let u = up.cross(n).normalize();
        let v = n.cross(u);

        let halfWidth = Math.tan(fov / 2);
        let halfHeight = halfWidth / aspect;
        let pixelWidth = halfWidth * 2 / (width - 1);
        let pixelHeight = halfHeight * 2 / (height - 1);

        let image = new Array(width * height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let vx = u.multiply(halfWidth - x * pixelWidth);
                let vy = v.multiply(halfHeight - y * pixelHeight);
                let rayDirection = eye.add(vx).add(vy).subtract(eye).normalize();
                let ray = new EddyEngine.Ray(eye, rayDirection);
                image[y * width + x] = this.trace(ray, scene);
            }
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.context.fillStyle = image[y * width + x].toRGB();
                this.context.fillRect(x, y, 1, 1);
            }
        }
    }

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

    EddyEngine.Vector = {};

    /**
     * @constructor Vec2
     * @description 2D Vector
     * @param {*} x 
     * @param {*} y 
     * @returns Vec2
     */
    function Vec2(x = 0, y = 0) {
      this.x = x;
      this.y = y;
      return this;
    }
    
    /**
     * @member I - Unit Vector in the x direction
     * @static Vec2.I
     * @type {Vec2}
     * @readonly
     * @memberof Vec2
     */
    Object.defineProperty(Vec2, "I", {
      value: new Vec2(1, 0),
      writable: false,
      configurable: false,
    });
  
    /**
     * @member J - Unit Vector in the y direction
     * @static Vec2.J
     * @type {Vec2}
     * @readonly
     * @memberof Vec2
     */
    Object.defineProperty(Vec2, "J", {
      value: new Vec2(0, 1),
      writable: false,
      configurable: false,
    });
  
    /**
     * @member scale - Scale a 2D Vector
     * @memberof Vec2
     * @param {*} n 
     * @returns  Vec2
     */
    Vec2.prototype.scale = function (n) {
      this.x *= n;
      this.y *= n;
      return this;
    };
  
    /**
     * @member add - Add a 2D Vector
     * @memberof Vec2
     * @param {*} v 
     * @returns  Vec2
     */
    Vec2.prototype.add = function (v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    };
  
    /**
     * @member sub - Subtract a 2D Vector
     * @memberof Vec2
     * @param {*} v
     * @returns  Vec2
     */
    Vec2.prototype.sub = function (v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    };
  
    /**
     * @member dot - Dot Product of a 2D Vector
     * @memberof Vec2
     * @param {*} v
     * @type {number}
     * @returns  Vec2
     */ 
    Vec2.prototype.dot = function (v) {
      return this.x * v.x + this.y * v.y;
    };
    
    /**
     * @member div - Divide a 2D Vector
     * @memberof Vec2
     * @param {*} v
     * @returns  Vec2
     * @type {Vec2}
     * @returns Vec2
     */
    Vec2.prototype.div = function (v) {
      this.x /= v.x;
      this.y /= v.y;
      return this;
    };
    
    /**
     * @member magnitude - Magnitude of a 2D Vector
     * @memberof Vec2
     * @returns number
     * @type {number}
     */
    Vec2.prototype.magnitude = function () {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
  
    /**
     * @member unit - Unit Vector of a 2D Vector
     * @memberof Vec2
     * @returns Vec2
     * @type {Vec2}
     * @returns Vec2
     */ 
    Vec2.prototype.unit = function () {
      const mag = this.magnitude();
      this.x /= mag;
      this.y /= mag;
      return this;
    };
  
    /**
     * @member rot - Rotate a 2D Vector
     * @memberof Vec2
     * @param {*} theta
     * @returns Vec2
     * @type {Vec2}
     */
    Vec2.prototype.rotX = function (theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newY = this.y * cosTheta - this.x * sinTheta;
      this.x = this.y * sinTheta + this.x * cosTheta;
      this.y = newY;
      return this;
    };
    
    /**
     * @member rot - Rotate a 2D Vector
     * @memberof Vec2
     * @param {*} theta
     * @returns Vec2
     * @type {Vec2}
     */
    Vec2.prototype.rotY = function (theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newX = this.x * cosTheta - this.z * sinTheta;
      this.z = this.x * sinTheta + this.z * cosTheta;
      this.x = newX;
      return this
    };
    
    /**
     * @member rot - Rotate a 2D Vector
     * @memberof Vec2
     * @param {*} theta
     * @returns Vec2
     * @type {Vec2}
     */ 
    Vec2.prototype.toArray = function () {
      return [this.x, this.y];
    };
    
    /**
     * @member clone - Clone a 2D Vector
     * @memberof Vec2
     * @returns Vec2
     * @type {Vec2}
     */
    Vec2.prototype.clone = function () {
      return new Vec2(this.x, this.y);
    };
  
    EddyEngine.Vector["Vec2"] = Vec2;
    
    /**
     *@constructor Vec3
     * @description 3D Vector
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    function Vec3(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    // Define the unit vectors
    /**
     * @member I - Unit Vector in the x direction
     * @static Vec3.I 
     * @type {Vec3}
     * @readonly
     */
    Object.defineProperty(Vec3, "I", {
      value: new Vec3(1, 0, 0),
      configurable: false,
      writable: false,
    });
    
    /**
     * @member J - Unit Vector in the y direction
     * @static Vec3.J
     * @type {Vec3}
     * @readonly
     */
    Object.defineProperty(Vec3, "J", {
      value: new Vec3(0, 1, 0),
      configurable: false,
      writable: false,
    });
   /**
     * @member J - Unit Vector in the z direction
     * @static Vec3.K
     * @type {Vec3}
     * @readonly
     */
    Object.defineProperty(Vec3, "K", {
      value: new Vec3(0, 0, 1),
      configurable: false,
      writable: false,
    });
  
    /**
     * @member scale - Scale a 3D Vector
     * @memberof Vec3 
     * @param {*} num 
     * @returns 
     */
    Vec3.prototype.scale = function (num) {
      this.x *= num;
      this.y *= num;
      this.z *= num;
      return this;
    };
  
    /**
     * Add a 3D Vector
     * @memberof Vec3
     * @param {*} obj 
     * @returns 
     */
    Vec3.prototype.add = function (obj) {
      this.x += obj.x;
      this.y += obj.y;
      this.z += obj.z;
      return this;
    };
  
    /**
     * @memberof Vec3
     * @method sub - Subtract a 3D Vector
     * @param {object} obj 
     * @returns Vec3
     */
    Vec3.prototype.sub = function (obj) {
      this.x -= obj.x;
      this.y -= obj.y;
      this.z -= obj.z;
      return this;
    };
  
    /**
     * Cross Product of a 3D Vector
     * @memberof Vec3
     * @param {object} obj  Vec3
     * @returns Vec3
     */
    Vec3.prototype.cross = function (obj) {
      const newX = this.y * obj.z - this.z * obj.y;
      const newY = this.z * obj.x - this.x * obj.z;
      const newZ = this.x * obj.y - this.y * obj.x;
      this.x = newX;
      this.y = newY;
      this.z = newZ;
      return this;
    };
  
    /**
     * @method dot - Dot Product of a 3D Vector
     * @memberof Vec3
     * @param {*}
     */
    Vec3.prototype.dot = function (obj) {
      return this.x * obj.x + this.y * obj.y + this.z * obj.z;
    };
    
    /**
     * @method div - Divide a 3D Vector
     * @param {object} obj 
     * @returns 
     */
    Vec3.prototype.div = function (obj) {
      this.x /= obj.x;
      this.y /= obj.y;
      this.z /= obj.z;
      return this;
    };
    
    /**
     * @method magnitude - Magnitude of a 3D Vector
     * @memberof Vec3
     * @returns 
     */
    Vec3.prototype.magnitude = function () {
      return Math.sqrt(
        Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)
      );
    };
  
    /**
     * @method unit - Unit Vector of a 3D Vector
     * @memberof Vec3
     * @returns Vec3
     */
    Vec3.prototype.unit = function () {
      const mag = this.magnitude();
      this.x /= mag;
      this.y /= mag;
      this.z /= mag;
      return this;
    };
  
    /**
     * @method rotX - Rotate a 3D Vector on the X axis
     * @memberof Vec3
     * @param {*} theta 
     */
    Vec3.prototype.rotX = function (theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newY = this.y * cosTheta - this.z * sinTheta;
      this.z = this.y * sinTheta + this.z * cosTheta;
      this.y = newY;
    };
    
   /**
    * @method rotY - Rotate a 3D Vector on the Y axis
    * @param {*} theta 
    * @returns 
    */
    Vec3.prototype.rotY = function (theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newX = this.x * cosTheta - this.z * sinTheta;
      this.z = this.x * sinTheta + this.z * cosTheta;
      this.x = newX;
      return this; 
    };
    
    /**
     * @method rotZ - Rotate a 3D Vector on the Z axis
     * @param {number} theta 
     * @returns 
     */
    Vec3.prototype.rotZ = function (theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newX = this.x * cosTheta - this.y * sinTheta;
      this.y = this.x * sinTheta + this.y * cosTheta;
      this.x = newX;
      return this;
    };
  
    /**
     * @method toArray - Convert a 3D Vector to an array
     * @memberof Vec3
     * @returns 
     */
    Vec3.prototype.toArray = function () {
      return [this.x, this.y, this.z];
    };
    
    /**
     * @method clone - Clone a 3D Vector
     * @memberof Vec3
     * @returns  Vec3
     */
    Vec3.prototype.clone = function () {
      return new Vec3(this.x, this.y, this.z);
    };
    
    EddyEngine.Vector["Vec3"] = Vec3;     
    
    EddyEngine.Camera = function (eye, lookAt, up, fov, aspect) {
        this.eye = eye || new EddyEngine.Vector.Vec3(0, 0, 0);
        this.lookAt = lookAt || new EddyEngine.Vector.Vec3(0, 0, -1);
        this.up = up || new EddyEngine.Vector.Vec3(0, 1, 0);
        this.fov = fov || 0;
        this.aspect = aspect || 0;
    }


    EddyEngine.Ray = function (origin, direction) {
        this.origin = origin;
        this.direction = direction;
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

    EddyEngine.Shape= {};
    EddyEngine.Shape.Sphere = function (center, radius, material) {
        this.center = center || new EddyEngine.Vector.Vec3(0, 0, 0);
        this.radius = radius || 0;
        this.material = material || new EddyEngine.Material();
    }

    EddyEngine.Shape.Sphere.prototype.intersect = function (ray) {
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
    EddyEngine.Engine = function (scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }
    EddyEngine.Engine.prototype.start = function () {
        this.renderer.render(this.scene, this.camera);
    }


    EddyEngine.Shape.Sphere.prototype.normal = function (point) {
        return point.subtract(this.center).normalize();
    };

    if(typeof module !== 'undefined' && module.exports) {
        module.exports = EddyEngine;
    }
    else if (typeof define === 'function' && define.amd) {
        define([], !(function() {
            return EddyEngine;
        }));
    }
    else {
        window.EddyEngine = EddyEngine;
    }
    return EddyEngine;

})(this == undefined ? {} : EddyEngine || {});

