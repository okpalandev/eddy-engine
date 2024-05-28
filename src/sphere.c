#include "sphere.h"
#include "vector.h"
#include <stdlib.h>
#include <math.h>

Sphere* Sphere_create(Vec3* center, double radius, Material* material) {
    Sphere* sphere = (Sphere*)malloc(sizeof(Sphere));
    sphere->center = center;
    sphere->radius = radius;
    sphere->material = material;
    return sphere;
}

Hit* Sphere_intersect(Sphere* sphere, Ray* ray) {
    Vec3* oc = Vec3_sub(ray->origin, sphere->center);
    double a = Vec3_dot(ray->direction, ray->direction);
    double b = 2 * Vec3_dot(oc, ray->direction);
    double c = Vec3_dot(oc, oc) - sphere->radius * sphere->radius;
    double discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        Vec3_free(oc);
        return Hit_create(NULL, NULL, -1);
    }

    double t = (-b - sqrt(discriminant)) / (2 * a);
    if (t < 0) {
        t = (-b + sqrt(discriminant)) / (2 * a);
        if (t < 0) {
            Vec3_free(oc);
            return Hit_create(NULL, NULL, -1);
        }
    }

    Vec3* scaled_direction = Vec3_scale(ray->direction, t);
    Vec3* position = Vec3_add(ray->origin, scaled_direction);
    Vec3_free(scaled_direction);

    Vec3* normal = Vec3_normalize(Vec3_sub(position, sphere->center));

    Vec3_free(oc);
    return Hit_create(position, normal, t);
}

void Sphere_free(Sphere* sphere) {
    if (sphere) {
        Vec3_free(sphere->center);
        Material_free(sphere->material);
        free(sphere);
    }
}
