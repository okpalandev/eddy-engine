#ifndef MATERIAL_H
#define MATERIAL_H
#define core

#include "vector.h"
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

typedef struct Material_s Material;
struct Material_s {
    Vec3* color; // Diffuse color
    float reflectivity; // 0 for diffuse, 1 for mirror
    float refractivity; // 0 for opaque, 1 for transparent
    float ior; // Index of refraction
};

Material* Material_create(Vec3* color, float reflectivity, float refractivity, float ior);
void Material_free(Material* material);

#endif // MATERIAL_H
