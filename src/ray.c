#include "ray.h"

Ray* Ray_create(Vec3 *origin, Vec3 *direction) {
    Ray* ray = (Ray*)malloc(sizeof(Ray));
    if (ray) {
        ray->origin = origin;
        ray->direction = direction;
    }
    return ray;
}


void Ray_free(Ray* ray) {
    if (ray) {
        free(ray);
    }
}
