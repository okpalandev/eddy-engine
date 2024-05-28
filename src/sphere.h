#pragma once
#ifndef SPHERE_H
#define SPHERE_H

#define core

#include "material.h"
#include "vector.h"
#include "ray.h"
#include "hit.h"

#include <stdlib.h>
#include <stdio.h>
#include <math.h>

typedef struct {
  Vec3* center;
  double radius;
  Material* material;
} Sphere;


Sphere* Sphere_create(Vec3* center, double radius, Material* material);
void Sphere_free(Sphere* sphere);
Hit* Sphere_intersect(Sphere* sphere, Ray* ray);

#endif // SPHERE_H
