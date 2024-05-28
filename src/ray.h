#ifndef RAy_H
#define RAy_H

#include "vector.h"

#include <stdlib.h>
#include <stdio.h>

typedef struct Ray_s Ray;
struct Ray_s {
    Vec3 *origin;
    Vec3 *direction;
};

// Function to initialize a ray
Ray* Ray_create(Vec3 *origin, Vec3 *direction);
void Ray_cast(Ray* r);
// Function to free the ray memory
void Ray_free(Ray* ray);

#endif // RAy_H
