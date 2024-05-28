# Eddy Engine Makefile
# Author: Nnamdi Michael Okpala

ifeq ($(OS),Windows_NT)
    CC=cl
    SRC_DIR=src
    OBJ_DIR=obj
    CFLAGS=/I $(SRC_DIR) /W3 /WX /Zi /Od /MD /MP
    LDFLAGS=/link /LIBPATH:'./lib/' SDL2.dll  SDL2.lib SDL2main.lib
else
    CC=gcc
    SRC_DIR=src
    OBJ_DIR=obj
    CFLAGS=-I$(SRC_DIR) -Wall -Wextra -Wpedantic -g -O1 -MMD -MP
    LDFLAGS=-L/usr/local/lib -lSDL2 -lSDL2main
endif

SRC_FILES=$(wildcard $(SRC_DIR)/*.c)
OBJ_FILES := $(SRC_FILES:$(SRC_DIR)/%.h=$(OBJ_DIR)/%.o)

# Define target executable
all: bin/eddyengine

bin/eddyengine: $(OBJ_FILES)
ifeq ($(OS),Windows_NT)
	$(CC) /c main.c $(OBJ_FILES) $(LDFLAGS) /out:$@
else
	$(CC) main.c $(OBJ_FILES) $(LDFLAGS) -o $@
	@mkdir -p $(dir $@)
endif

# Define compilation rule for object files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
ifeq ($(OS),Windows_NT)
#	@mkdir $(dir $@)
	$(CC) /c $(CFLAGS) /Fo$@ $<
else
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -o $@ -c $<
endif
# Clean up generated files
clean:
	rm -f $(OBJ_DIR)/*.o $(OBJ_DIR)/*.d bin/eddyengine

.PHONY: all clean
-include $(OBJ_FILES:.o=.d)
