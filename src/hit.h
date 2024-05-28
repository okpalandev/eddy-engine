#ifndef HIT_H
#define HIT_H
#define core

#include "vector.h"
#include "ray.h"
#include "material.h"
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

typedef struct Hit_s Hit;

struct Hit_s {
    Vec3* position;
    Vec3* normal;
    float t; // interoplate point t from p
};


Hit* Hit_create(Vec3* position, Vec3* normal, float t);
void Hit_free(Hit* hit);

#endif // HIT_H
