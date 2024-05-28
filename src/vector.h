#ifndef VECTOR_H
#define VECTOR_H

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

#include <stdio.h>
#include <stdlib.h>
#include <math.h>

typedef struct Vec2_s {
    float x;
    float y;
} Vec2;

/* Vec2 functions */
Vec2* Vec2_create(float x, float y);
Vec2* Vec2_scale(Vec2* vec, float n);
Vec2* Vec2_add(const Vec2* vec1, const Vec2* vec2);
Vec2* Vec2_sub(const Vec2* vec1, const Vec2* vec2);
float Vec2_dot(const Vec2* vec1, const Vec2* vec2);
Vec2* Vec2_div(Vec2* vec, float n);
float Vec2_magnitude(const Vec2* vec);
Vec2* Vec2_unit(Vec2* vec);
Vec2* Vec2_rot(Vec2* vec, float theta);
float* Vec2_toArray(const Vec2* vec);
Vec2* Vec2_clone(const Vec2* vec);
void Vec2_free(Vec2* vec);


typedef struct Vec3_s {
    float x;
    float y;
    float z;
} Vec3;

/* Vec3 functions */
Vec3* Vec3_create(float x, float y, float z);
Vec3* Vec3_scale( Vec3* vec, float scalar);
Vec3* Vec3_add(const Vec3* vec1, const Vec3* vec2);
Vec3* Vec3_sub(const Vec3* vec1, const Vec3* vec2);
Vec3* Vec3_cross(const Vec3* vec1, const Vec3* vec2);
float Vec3_dot(const Vec3* vec1, const Vec3* vec2);
Vec3* Vec3_div(Vec3* vec, float n);
float Vec3_magnitude(const Vec3* vec);
Vec3* Vec3_unit(Vec3* vec);
Vec3* Vec3_rotX(Vec3* vec, float theta);
Vec3* Vec3_rotY(Vec3* vec, float theta);
Vec3* Vec3_rotZ(Vec3* vec, float theta);
float* Vec3_toArray(const Vec3* vec);
Vec3* Vec3_clone(const Vec3* vec);
Vec3* Vec3_reflect(const Vec3* vec, const Vec3* normal);
Vec3* Vec3_normalize(Vec3* vec);
void Vec3_free(Vec3* vec);

#endif // VECTOR_H
