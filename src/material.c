#include "material.h"

Material* Material_create(Vec3* color, float reflectivity, float refractivity, float ior) {
    Material* material = (Material*)malloc(sizeof(Material));
    material->color = color;
    material->reflectivity = reflectivity;
    material->refractivity = refractivity;
    material->ior = ior;
    return material;
}

void Material_free(Material* material) {
    if (material) {
        Vec3_free(material->color);
        free(material);
    }
}
