#include "hit.h"

Hit* Hit_create(Vec3* position, Vec3* normal, float t){
    Hit* hit = (Hit*)malloc(sizeof(Hit));
    hit->position = position;
    hit->normal = normal;
    hit->t = t;
    return hit;
}


void Hit_free(Hit* hit){
    if (hit){
        Vec3_free(hit->position);
        Vec3_free(hit->normal);
        free(hit);
    }
}
