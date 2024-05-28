#include "vector.h"

Vec2* Vec2_create(float x, float y) {
    Vec2* vec = (Vec2*)malloc(sizeof(Vec2));
    if (vec) {
        vec->x = x;
        vec->y = y;
    }
    return vec;
}

Vec2* Vec2_scale(Vec2* vec, float n) {
    if (vec) {
        vec->x *= n;
        vec->y *= n;
    }
    return vec;
}

Vec2* Vec2_add(const Vec2* vec1, const Vec2* vec2) {
    if (!vec1 || !vec2) return NULL;
    return Vec2_create(vec1->x + vec2->x, vec1->y + vec2->y);
}

Vec2* Vec2_sub(const Vec2* vec1, const Vec2* vec2) {
    if (!vec1 || !vec2) return NULL;
    return Vec2_create(vec1->x - vec2->x, vec1->y - vec2->y);
}

float Vec2_dot(const Vec2* vec1, const Vec2* vec2) {
    if (!vec1 || !vec2) return 0.0f;
    return vec1->x * vec2->x + vec1->y * vec2->y;
}

Vec2* Vec2_div(Vec2* vec, float n) {
    if (vec && n != 0) {
        vec->x /= n;
        vec->y /= n;
    }
    return vec;
}

float Vec2_magnitude(const Vec2* vec) {
    if (!vec) return 0.0f;
    return sqrt(vec->x * vec->x + vec->y * vec->y);
}

Vec2* Vec2_unit(Vec2* vec) {
    float mag = Vec2_magnitude(vec);
    if (vec && mag != 0) {
        vec->x /= mag;
        vec->y /= mag;
    }
    return vec;
}

Vec2* Vec2_rot(Vec2* vec, float theta) {
    if (vec) {
        float rad = theta * M_PI / 180.0f;
        float cosTheta = cos(rad);
        float sinTheta = sin(rad);
        float newX = vec->x * cosTheta - vec->y * sinTheta;
        vec->y = vec->x * sinTheta + vec->y * cosTheta;
        vec->x = newX;
    }
    return vec;
}

float* Vec2_toArray(const Vec2* vec) {
    if (!vec) return NULL;
    float* arr = (float*)malloc(2 * sizeof(float));
    if (arr) {
        arr[0] = vec->x;
        arr[1] = vec->y;
    }
    return arr;
}

Vec2* Vec2_clone(const Vec2* vec) {
    if (!vec) return NULL;
    return Vec2_create(vec->x, vec->y);
}

void Vec2_free(Vec2* vec) {
    free(vec);
}

/* Vec3 functions implementation */
Vec3* Vec3_create(float x, float y, float z) {
    Vec3* vec = (Vec3*)malloc(sizeof(Vec3));
    if (vec) {
        vec->x = x;
        vec->y = y;
        vec->z = z;
    }
    return vec;
}

Vec3* Vec3_scale(Vec3* vec, float scalar) {
    if (vec) {
        vec->x *= scalar;
        vec->y *= scalar;
        vec->z *= scalar;
    };

    return vec;
}

Vec3* Vec3_add(const Vec3* vec1, const Vec3* vec2) {
    if (!vec1 || !vec2) return NULL;
    return Vec3_create(vec1->x + vec2->x, vec1->y + vec2->y, vec1->z + vec2->z);
}

Vec3* Vec3_sub(const Vec3* vec1, const Vec3* vec2) {
    if (!vec1 || !vec2) return NULL;
    return Vec3_create(vec1->x - vec2->x, vec1->y - vec2->y, vec1->z - vec2->z);
}

Vec3* Vec3_cross(const Vec3* vec1, const Vec3* vec2) {
    if (!vec1 || !vec2) return NULL;
    return Vec3_create(
        vec1->y * vec2->z - vec1->z * vec2->y,
        vec1->z * vec2->x - vec1->x * vec2->z,
        vec1->x * vec2->y - vec1->y * vec2->x
    );
}

float Vec3_dot(const Vec3* vec1, const Vec3* vec2) {
    if (!vec1 || !vec2) return 0.0f;
    return vec1->x * vec2->x + vec1->y * vec2->y + vec1->z * vec2->z;
}

Vec3* Vec3_div(Vec3* vec, float n) {
    if (vec && n != 0) {
        vec->x /= n;
        vec->y /= n;
        vec->z /= n;
    }
    return vec;
}

float Vec3_magnitude(const Vec3* vec) {
    if (!vec) return 0.0f;
    return sqrt(vec->x * vec->x + vec->y * vec->y + vec->z * vec->z);
}

Vec3* Vec3_unit(Vec3* vec) {
    float mag = Vec3_magnitude(vec);
    if (vec && mag != 0) {
        vec->x /= mag;
        vec->y /= mag;
        vec->z /= mag;
    }
    return vec;
}

Vec3* Vec3_rotX(Vec3* vec, float theta) {
    if (vec) {
        float rad = theta * M_PI / 180.0f;
        float cosTheta = cos(rad);
        float sinTheta = sin(rad);
        float newY = vec->y * cosTheta - vec->z * sinTheta;
        vec->z = vec->y * sinTheta + vec->z * cosTheta;
        vec->y = newY;
    }
    return vec;
}

Vec3* Vec3_rotY(Vec3* vec, float theta) {
    if (vec) {
        float rad = theta * M_PI / 180.0f;
        float cosTheta = cos(rad);
        float sinTheta = sin(rad);
        float newX = vec->x * cosTheta + vec->z * sinTheta;
        vec->z = -vec->x * sinTheta + vec->z * cosTheta;
        vec->x = newX;
    }
    return vec;
}

Vec3* Vec3_rotZ(Vec3* vec, float theta) {
    if (vec) {
        float rad = theta * M_PI / 180.0f;
        float cosTheta = cos(rad);
        float sinTheta = sin(rad);
        float newX = vec->x * cosTheta - vec->y * sinTheta;
        vec->y = vec->x * sinTheta + vec->y * cosTheta;
        vec->x = newX;
    }
    return vec;
}

float* Vec3_toArray(const Vec3* vec) {
    if (!vec) return NULL;
    float* arr = (float*)malloc(3 * sizeof(float));
    if (arr) {
        arr[0] = vec->x;
        arr[1] = vec->y;
        arr[2] = vec->z;
    }
    return arr;
}

Vec3* Vec3_reflect(const Vec3* vec, const Vec3* normal){
    if (!vec || !normal) return NULL;
    Vec3* reflection = Vec3_clone(normal);
    Vec3_scale(reflection, 2 * Vec3_dot(vec, normal));
    Vec3_sub(reflection, vec);
    return reflection;

}
Vec3* Vec3_normalize(Vec3* vec){
    if (!vec) return NULL;
    float mag = Vec3_magnitude(vec);
    if (mag != 0) {
        vec->x /= mag;
        vec->y /= mag;
        vec->z /= mag;
    }
    return vec;
}
Vec3* Vec3_clone(const Vec3* vec) {
    if (!vec) return NULL;
    return Vec3_create(vec->x, vec->y, vec->z);
}

void Vec3_free(Vec3* vec) {
    free(vec);
}
