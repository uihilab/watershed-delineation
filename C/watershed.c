#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <png.h>

// gcc -I/usr/local/Cellar/libpng/1.6.36/include/ -lpng -o out watershed.c
// ./out -r -i direction90m.png -t png -x 4777 -y 897

int w = 5900;
int h = 3680;


float * findWatershed(int x, int y, unsigned char imData[]){
  int w = 5900;
  int h = 3680;
  y = h-y-1;
  static int matrix[21712000];
  memset(matrix, 0, sizeof matrix);
  matrix[x+(w*y)] = 1;
  int dirf[8] = {-1,0,1,-1,1,-1,0,1};
  int dirg[8] = {1,1,1,0,0,-1,-1,-1};
  int e[8] = {9, 8, 7, 6, 4, 3, 2, 1};
  int process[44000] = { 0 };
  process[0] = x;
  process[1] = y;
  int c  = 2;
  int o1 = 0;
  int o2 = 5500;
  int numbr3 = 0;
  int lenx = 0;
  while (c>o1){
    int numbr3 = o1;
    o1 = o2;
    o2 = numbr3 + o1 - o2;
    lenx = c;
    c = o1;
    int k=o2;
    for (k; k < lenx; k+=2)
    {
      int arx = process[k];
      int ary = process[k+1];
      int i = 7;
      for (i; i>-1; i--)
      {
        int nx = arx + dirf[i];
        int ny = ary + dirg[i];
        int ind = ny*w+nx;
        int imDatanum = (int) imData[ind];
        if (imDatanum == e[i]){
        // if (imData[ind] == e[i]){
          process[c]=nx;
          process[c+1]=ny;
          c+=2;
          matrix[ind]=1;
        }
      }
    }


  }
  int dirx[5] = {0,0,1,0,-1};
  int diry[5] = {0,-1,0,1,0};
  int dirxyr[5] = {0,-w,1,w,-1};
  int found = 1;
    int curX = x;
  int curY = y;
  int dirnew = 1;
  static double border[44000];
  int sizeofborder = 0;
  int sdir1[5] = {1,2,3,4,1};
  int sdir3[5] = {3,4,1,2,3};
  int sdir4[5] = {2,3,4,1,2};
  int offsetx = 1;

  int dir1 = sdir1[dirnew];
  int dir3 = sdir3[dirnew];
  int dir4 = sdir4[dirnew];
  int ofs = curX+w*curY;
  if (matrix[ofs+dirxyr[dir1]] != 1){
    dirnew = dir1;
  }
  else if (matrix[ofs+dirxyr[dirnew]] != 1) {

  }
  else if (matrix[ofs+dirxyr[dir3]] != 1) {
    dirnew = dir3;
  }
  else if (matrix[ofs+dirxyr[dir4]] != 1) {
    dirnew = dir4;
  }
  else {
    dirnew = 0;
  }
  curX = curX + dirx[dirnew];
  curY = curY + diry[dirnew];
  border[sizeofborder] = 11.5+curX+offsetx;
  border[sizeofborder+1] = 88.5+curY;
  sizeofborder+=2;

  int icurX = curX;
  int icurY = curY;


  dir1 = sdir1[dirnew];
  dir3 = sdir3[dirnew];
  dir4 = sdir4[dirnew];
  ofs = curX+w*curY;
  if (matrix[ofs+dirxyr[dir1]] != 1){
    dirnew = dir1;
  }
  else if (matrix[ofs+dirxyr[dirnew]] != 1) {

  }
  else if (matrix[ofs+dirxyr[dir3]] != 1) {
    dirnew = dir3;
  }
  else if (matrix[ofs+dirxyr[dir4]] != 1) {
    dirnew = dir4;
  } 
  else {
    dirnew = 0;
  }
  curX = curX + dirx[dirnew];
  curY = curY + diry[dirnew];
  border[sizeofborder] = 11.5+curX+offsetx;
  border[sizeofborder+1] = 88.5+curY;
  sizeofborder+=2;

  while(found>0){
    dir1 = sdir1[dirnew];
    dir3 = sdir3[dirnew];
    dir4 = sdir4[dirnew];
    ofs = curX+w*curY;
    if (matrix[ofs+dirxyr[dir1]] != 1){
      dirnew = dir1;
    }
    else if (matrix[ofs+dirxyr[dirnew]] != 1) {

    }
    else if (matrix[ofs+dirxyr[dir3]] != 1) {
      dirnew = dir3;
    }
    else if (matrix[ofs+dirxyr[dir4]] != 1) {
      dirnew = dir4;
    }
    else {
      dirnew = 0;
    }
    curX = curX + dirx[dirnew];
    curY = curY + diry[dirnew];
    
    if (icurX == curX && icurY == curY) {
      found = 0;
    }
    else {
      border[sizeofborder] = 11.5+curX+offsetx;
      border[sizeofborder+1] = 88.5+curY;
      sizeofborder+=2;
    }
  }
  int countOfBorder = 0;
  int i;
   for( i = 0; i < 44000; i++ ){
      if(border[i] != 0.0){
        countOfBorder++;
      }
   }

   float buffer[countOfBorder+1];
   
   buffer[0] = (float)countOfBorder;

   int cc = 1;
   for( i = 0; i < 44000; i++ ){
      if(border[i] != 0.0){
        buffer[cc] = border[i];
        cc++;
      }
   }

   return buffer;
}


int
main (int argc, char **argv)
{
  int xx, yy;
  int rflag = 0;
  int hflag = 0;
  char *ivalue = NULL;
  char *ovalue = NULL;
  char *tvalue = NULL;
  char *zvalue = NULL;
  char *xvalue = NULL;
  char *yvalue = NULL;
  static unsigned char buffer[21712000];

  int index;
  int c;

  opterr = 0;

  while ((c = getopt (argc, argv, "rhi:o:t:z:x:y:")) != -1) {
    switch (c)
      {
      case 'r':
        rflag = 1;
        break;
      case 'h':
        hflag = 1;
        break;
      case 'i':
        ivalue = optarg;
        printf("Input File: %s\n", ivalue);
        break;
      case 'o':
        ovalue = optarg;
        break;
      case 't':
        tvalue = optarg;
        if (strcmp(tvalue, "png")!=0 && strcmp(tvalue, "bin")!=0 )
        {
          printf("Unknown input type.\n");
          abort();
        } else {
          printf("Input Type: %s\n", tvalue);
        }
        break;
      case 'z':
        zvalue = optarg;
        if (strcmp(zvalue, "kml")!=0 && strcmp(zvalue, "bin")!=0)
        {
          printf("Unknown output type.\n");
          abort();
        }
        break;
      case 'x':
        xvalue = optarg;
        xx = atoi(xvalue);
        printf("X: %s\n", xvalue);
        break;
      case 'y':
        yvalue = optarg;
        yy = atoi(yvalue);
        printf("Y: %s\n", yvalue);
        break;
      default:
        abort ();
      }
  }

  // printf ("rflag = %d, hflag = %d, ivalue = %s, ovalue= %s, tvalue=%s, zvalue=%s, xvalue=%d, yvalue=%d \n",
          // rflag, hflag, ivalue, ovalue, tvalue, zvalue, xx, yy);

  for (index = optind; index < argc; index++)
    printf ("Non-option argument %s\n", argv[index]);


  if (strcmp(tvalue, "png")==0)
  {
      /* read png */
      int width, height;
      png_byte color_type;
      png_byte bit_depth;
      png_bytep *row_pointers;

      FILE *fp = fopen(ivalue, "rb");
      
      png_structp png = png_create_read_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
      if(!png) abort();
      
      png_infop info = png_create_info_struct(png);
      if(!info) abort();

      if(setjmp(png_jmpbuf(png))) abort();

      png_init_io(png, fp);

      png_read_info(png, info);
      
      width      = png_get_image_width(png, info);
      height     = png_get_image_height(png, info);
      color_type = png_get_color_type(png, info);
      bit_depth  = png_get_bit_depth(png, info);

      // Read any color_type into 8bit depth, RGBA format.
      // See http://www.libpng.org/pub/png/libpng-manual.txt

      if(bit_depth == 16)
        png_set_strip_16(png);

      if(color_type == PNG_COLOR_TYPE_PALETTE)
        png_set_palette_to_rgb(png);

      // PNG_COLOR_TYPE_GRAY_ALPHA is always 8 or 16bit depth.
      if(color_type == PNG_COLOR_TYPE_GRAY && bit_depth < 8)
        png_set_expand_gray_1_2_4_to_8(png);

      if(png_get_valid(png, info, PNG_INFO_tRNS))
        png_set_tRNS_to_alpha(png);

      // These color_type don't have an alpha channel then fill it with 0xff.
      if(color_type == PNG_COLOR_TYPE_RGB ||
         color_type == PNG_COLOR_TYPE_GRAY ||
         color_type == PNG_COLOR_TYPE_PALETTE)
        png_set_filler(png, 0xFF, PNG_FILLER_AFTER);

      if(color_type == PNG_COLOR_TYPE_GRAY ||
         color_type == PNG_COLOR_TYPE_GRAY_ALPHA)
        png_set_gray_to_rgb(png);

      png_read_update_info(png, info);

      row_pointers = (png_bytep*)malloc(sizeof(png_bytep) * height);
      for(int y = 0; y < height; y++) {
        row_pointers[y] = (png_byte*)malloc(png_get_rowbytes(png,info));
      }

      png_read_image(png, row_pointers);

      fclose(fp);
      for(int y = 0; y < height; y++) {
        png_bytep row = row_pointers[y];
        for(int x = 0; x < width; x++) {
          png_bytep px = &(row[x * 4]);
          buffer[y*5900+x] = px[0];
        }
      }


  } else if (strcmp(tvalue, "bin")==0)
  {
    /* read bin  */
    FILE *ptr;

    ptr = fopen("90.bin","rb");

    fread(buffer, sizeof(buffer), 1, ptr);
  }

  float *pointer_arr;
  pointer_arr = findWatershed(xx, yy, buffer);

  int border_length = (int)*(pointer_arr);
  int i;
  float border_array[border_length];

  for ( i = 0; i < border_length; i++ ) {
      border_array[i] = *(pointer_arr + (i+1));
   }

   // write to kml

   // write to coordinate pair file

  return 0;
}