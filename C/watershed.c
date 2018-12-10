#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int findWatershed(int x, int y, unsigned char imData[]){
	int w = 5900;
	int h = 3680;
	y = h-y-1;
	int matrix[21712000] = { 0 };
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

   return countOfBorder;
}


void main( int argc, char *argv[] )
{
	char *p;
	char *p2;

	long arg1 = strtol(argv[1], &p, 10);
	long arg2 = strtol(argv[2], &p2, 10);

    int xx = arg1;
    int yy = arg2;
    static unsigned char buffer[21712000];
	FILE *ptr;

	ptr = fopen("90.bin","rb");

	fread(buffer, sizeof(buffer), 1, ptr);

    int n = findWatershed(xx, yy, buffer);

    printf("%d\n", n);

}



