# Eddy Engine Makefile
# Author: Nnamdi Michael Okpala

ifeq ($(OS),Windows_NT)
    CC=cl
    SRC_DIR=src
    OBJ_DIR=obj
    CFLAGS=/I $(SRC_DIR) /W3 /WX /Zi /Od /MD /MP
    LDFLAGS=/link /LIBPATH:'lib/' SDL2.dll #  SDL2.lib SDL2main.lib
else
    CC=gcc
    SRC_DIR=src
    OBJ_DIR=obj
    CFLAGS=-I$(SRC_DIR) -Wall -Wextra -Wpedantic -g -O1 -MMD -MP
    LDFLAGS=-L/usr/local/lib -lSDL2 -lSDL2main
endif

SRC_FILES=$(wildcard $(SRC_DIR)/*.c)
OBJ_FILES=$(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/%.o,$(SRC_FILES))

# Define target executable
all: bin/eddyengine

bin/eddyengine: $(OBJ_FILES)
	@mkdir -p $(dir $@)
ifeq ($(OS),Windows_NT)
	$(CC) /c main.c $(OBJ_FILES) $(LDFLAGS) /out:$@
else
	$(CC) main.c $(OBJ_FILES) $(LDFLAGS) -o $@
endif

# Define compilation rule for object files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(OBJ_DIR)
	$(CC) $(CFLAGS) -o $@ -c $<

# Clean up generated files
clean:
	rm -f $(OBJ_DIR)/*.o $(OBJ_DIR)/*.d bin/eddyengine

.PHONY: all clean
-include $(OBJ_FILES:.o=.d)
