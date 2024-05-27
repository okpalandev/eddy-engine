# Eddy Engine Makefile
# Author: Nnamdi Michael Okpala

ifeq ($(OS),Windows_NT)
    CC=cl
    SRC_DIR=src
    OBJ_DIR=obj
    CFLAGS=/I $(SRC_DIR) /W3 /WX /Zi /Od /MD /MP
    LDFLAGS=/link /LIBPATH:C:\Dev\SDL2 SDL2.lib SDL2main.lib
else
    CC=gcc
    SRC_DIR=src
    OBJ_DIR=obj
    CFLAGS=-I$(SRC_DIR) -Wall -Wextra -Wpedantic -g -O1 -MMD -MP
    LDFLAGS=-L/usr/local/lib -lSDL2 -lSDL2main
endif

SRC_FILES=$(wildcard $(SRC_DIR)/*.c)
OBJ_FILES=$(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/%.o,$(SRC_FILES))

# Define compilation rule for object files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
    $(CC) $(CFLAGS) /Fo$@ /c $<

# Define target executable
all: my_program

my_program: $(OBJ_FILES)
    $(CC) $(OBJ_FILES) $(LDFLAGS) /out:$@

# Clean up generated files
clean:
    rm -f $(OBJ_DIR)/*.o $(OBJ_DIR)/*.d 

-include $(OBJ_FILES:.o=.d)
