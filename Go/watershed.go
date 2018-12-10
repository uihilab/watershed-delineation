package main

import (
	"fmt"
	"time"
	"flag"
	"io/ioutil"
)



func findWatershed(x int32, y int32, imData []uint8) {
	var w int32 = 5900
	var h int32 = 3680
	y = h-y-1
	matrix := make([]int8, w*h)
	matrix[x+(w*y)] = 1
	
	dirf := []int8{-1,0,1,-1,1,-1,0,1}
	dirg := []int8{1,1,1,0,0,-1,-1,-1}
	e := []uint8{9, 8, 7, 6, 4, 3, 2, 1}

	process := make([]int32, 44000)
	process[0] = x
	process[1] = y
	var c int16 = 2
	var o1 int16 = 0
	var o2 int16 = 5500
	var numbr3 int16 = 0
	var lenx int16 = 0
	for c>o1 {
		numbr3 = o1
		o1 = o2
		o2 = numbr3 + o1 - o2
		lenx = c
		c = o1

		for k:=o2; k<lenx; k+=2 {
			var arx int32 = process[k]
			var ary int32 = process[k+1]
			
			for i:=7; i>-1; i-- {
				var nx int32 = arx + int32(dirf[i])
				var ny int32 = ary + int32(dirg[i])
				var ind int32 = ny*w+nx
				if imData[ind] == e[i]{
					process[c]=nx
					process[c+1]=ny
					c+=2
					matrix[ind]=1
				}
			}

				
		}
		
	}
    dirx := []int32{0,0,1,0,-1}
    diry := []int32{0,-1,0,1,0}
    dirxyr := []int32{0,-w,1,w,-1}
    var found int32 = 1
    var curX int32 = x
	var curY int32 = y
	var dirnew int8 = 1
	border := []float64{}
	sdir1 := []int8{1,2,3,4,1}
	sdir3 := []int8{3,4,1,2,3}
	sdir4 := []int8{2,3,4,1,2}
	var offsetx int32 = 1 

	dir1 := sdir1[dirnew]
	dir3 := sdir3[dirnew]
	dir4 := sdir4[dirnew]
	ofs := curX+w*curY
	if matrix[ofs+dirxyr[dir1]] != 1{
		dirnew = dir1
	} else if matrix[ofs+dirxyr[dirnew]] != 1 {

	} else if matrix[ofs+dirxyr[dir3]] != 1 {
		dirnew = dir3
	} else if matrix[ofs+dirxyr[dir4]] != 1 {
		dirnew = dir4
	} else {
		dirnew = 0
	}
	curX = curX + dirx[dirnew]
	curY = curY + diry[dirnew]
	border = append(border, 11.5+float64(curX)+float64(offsetx))
	border = append(border, 88.5+float64(curY))


	icurX := curX
	icurY := curY


	dir1 = sdir1[dirnew]
	dir3 = sdir3[dirnew]
	dir4 = sdir4[dirnew]
	ofs = curX+w*curY
	if matrix[ofs+dirxyr[dir1]] != 1{
		dirnew = dir1
	} else if matrix[ofs+dirxyr[dirnew]] != 1 {

	} else if matrix[ofs+dirxyr[dir3]] != 1 {
		dirnew = dir3
	} else if matrix[ofs+dirxyr[dir4]] != 1 {
		dirnew = dir4
	} else {
		dirnew = 0
	}
	curX = curX + dirx[dirnew]
	curY = curY + diry[dirnew]
	border = append(border, 11.5+float64(curX)+float64(offsetx))
	border = append(border, 88.5+float64(curY))


	for found>0{
		dir1 = sdir1[dirnew]
		dir3 = sdir3[dirnew]
		dir4 = sdir4[dirnew]
		ofs = curX+w*curY
		if matrix[ofs+dirxyr[dir1]] != 1{
			dirnew = dir1
		} else if matrix[ofs+dirxyr[dirnew]] != 1{

		} else if matrix[ofs+dirxyr[dir3]] != 1{
			dirnew = dir3
		} else if matrix[ofs+dirxyr[dir4]] != 1 {
			dirnew = dir4
		} else {
			dirnew = 0
		}
		curX = curX + dirx[dirnew]
		curY = curY + diry[dirnew]

		if icurX == curX && icurY == curY {
			found = 0
		} else {
			border = append(border, 11.5+float64(curX)+float64(offsetx))
			border = append(border, 88.5+float64(curY))
		}
	}

	fmt.Println(len(border))
}




func main() {
	start := time.Now()
	
	buf, err := ioutil.ReadFile("90.bin")
    if err != nil { panic(err.Error()) }
    
    imData := []uint8(buf)

    x := flag.Int("x", 0, "int")
    y := flag.Int("y", 0, "int")
    flag.Parse()
    xx := int32(*x)
    yy := int32(*y)

	findWatershed(xx,yy,imData)

	elapsed := time.Since(start)
	fmt.Println("took: ", elapsed)


}



