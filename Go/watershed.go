package main

import (
	"flag"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"io/ioutil"
	"os"
)

func init() {
	image.RegisterFormat("png", "png", png.Decode, png.DecodeConfig)
}

func findWatershed(x int32, y int32, imData []uint8) []float64 {
	var w int32 = 5900
	var h int32 = 3680
	y = h - y - 1
	matrix := make([]int8, w*h)
	matrix[x+(w*y)] = 1

	dirf := []int8{-1, 0, 1, -1, 1, -1, 0, 1}
	dirg := []int8{1, 1, 1, 0, 0, -1, -1, -1}
	e := []uint8{9, 8, 7, 6, 4, 3, 2, 1}

	process := make([]int32, 44000)
	process[0] = x
	process[1] = y
	var c int16 = 2
	var o1 int16 = 0
	var o2 int16 = 5500
	var numbr3 int16 = 0
	var lenx int16 = 0
	for c > o1 {
		numbr3 = o1
		o1 = o2
		o2 = numbr3 + o1 - o2
		lenx = c
		c = o1

		for k := o2; k < lenx; k += 2 {
			var arx int32 = process[k]
			var ary int32 = process[k+1]

			for i := 7; i > -1; i-- {
				var nx int32 = arx + int32(dirf[i])
				var ny int32 = ary + int32(dirg[i])
				var ind int32 = ny*w + nx
				if imData[ind] == e[i] {
					process[c] = nx
					process[c+1] = ny
					c += 2
					matrix[ind] = 1
				}
			}

		}

	}
	dirx := []int32{0, 0, 1, 0, -1}
	diry := []int32{0, -1, 0, 1, 0}
	dirxyr := []int32{0, -w, 1, w, -1}
	var found int32 = 1
	var curX int32 = x
	var curY int32 = y
	var dirnew int8 = 1
	border := []float64{}
	sdir1 := []int8{1, 2, 3, 4, 1}
	sdir3 := []int8{3, 4, 1, 2, 3}
	sdir4 := []int8{2, 3, 4, 1, 2}
	var offsetx int32 = 1

	dir1 := sdir1[dirnew]
	dir3 := sdir3[dirnew]
	dir4 := sdir4[dirnew]
	ofs := curX + w*curY
	if matrix[ofs+dirxyr[dir1]] != 1 {
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
	ofs = curX + w*curY
	if matrix[ofs+dirxyr[dir1]] != 1 {
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

	for found > 0 {
		dir1 = sdir1[dirnew]
		dir3 = sdir3[dirnew]
		dir4 = sdir4[dirnew]
		ofs = curX + w*curY
		if matrix[ofs+dirxyr[dir1]] != 1 {
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

		if icurX == curX && icurY == curY {
			found = 0
		} else {
			border = append(border, 11.5+float64(curX)+float64(offsetx))
			border = append(border, 88.5+float64(curY))
		}
	}

	// fmt.Println(len(border))
	return border
}

func print_(rr bool, cont interface{}) {
	if !rr {
		fmt.Println(cont)
	}
}

func loadImage(filepath string) []uint8 {
	imgfile, err := os.Open(filepath)

	if err != nil {
		fmt.Println("png file not found!")
		os.Exit(1)
	}

	defer imgfile.Close()

	img, _, err := image.Decode(imgfile)

	palette := make([]color.RGBA, len(img.(*image.Paletted).Palette))

	for i, c := range img.(*image.Paletted).Palette {
		palette[i] = c.(color.RGBA)
	}

	pixList := make([]uint8, len(img.(*image.Paletted).Pix))

	for i, p := range img.(*image.Paletted).Pix {
		pixList[i] = palette[p].R
	}

	return pixList
}

func main() {
	r := flag.Bool("r", false, "bool")
	h := flag.Bool("h", false, "bool")

	inputfile := flag.String("i", "", "string")
	outputfile := flag.String("o", "ws.out", "string")

	inputtype := flag.String("t", "bin", "string")
	outputtype := flag.String("z", "kml", "string")

	x := flag.Int("x", 0, "int")
	y := flag.Int("y", 0, "int")

	flag.Parse()

	rr := bool(*r)
	hh := bool(*h)

	inp := string(*inputfile)
	out := string(*outputfile)

	print_(rr, fmt.Sprintf("Input file: %s", inp))
	print_(rr, fmt.Sprintf("Output file: %s", out))

	inp_t := string(*inputtype)
	out_t := string(*outputtype)

	xx := int32(*x)
	yy := int32(*y)

	if hh {
		fmt.Println("Usage: ./watershed\t[-h] [-i inputfile] [-o outputfile] [-t bin|png]\n\t\t\t\t[-z file|kml] [-x xvalue] [-y yvalue] [-r]\nOptions:\n-r\t\t\t: don't print outputs\n-h\t\t\t: help\n-i inputfile\t\t: indicate input file's path\n-o outputfile\t\t: indicate output file's path, default=ws.out\n-t bin|png\t\t: type of input, either bin or png, default=bin\n-z bin|kml\t\t: type of output, either kml or bin, defaul=kml\n-x xvalue\t\t: x value of the target point, should be integer\n-y yvalue\t\t: y value of the target point, should be integer\n")
		os.Exit(0)
	}

	if inp_t != "bin" && inp_t != "png" {
		fmt.Println("Input type must be either bin or png.")
		os.Exit(0)
	}

	if out_t != "file" && out_t != "kml" {
		fmt.Println("Output type must be either file or kml.")
		os.Exit(0)
	}

	print_(rr, fmt.Sprintf("Input type: %s", inp_t))
	print_(rr, fmt.Sprintf("Output type: %s", out_t))
	print_(rr, fmt.Sprintf("X: %d", xx))
	print_(rr, fmt.Sprintf("Y: %d", yy))

	var imData []uint8

	if inp_t == "bin" {
		buf, err := ioutil.ReadFile(inp)
		if err != nil {
			panic(err.Error())
		}

		imData = []uint8(buf)
	} else if inp_t == "png" {
		imData = loadImage(inp)
	}

	border := findWatershed(xx, yy, imData)

	//hardcoded difference on coordinate values
	dx := 0.0011797277777777777
	dy := 0.0011797277777777777

	str := ""

	if out_t == "file" {
		for i := 0; i < len(border)/2; i++ {
			lng := -96.9579313 + border[2*i]*dx
			lat := 40.3024337946 + (3680-border[2*i+1])*dy
			str = fmt.Sprintf("%s%f,%f\n", str, lat, lng)
		}

	} else if out_t == "kml" {
		//write kml
		str = "<?xml version='1.0' encoding='UTF-8'?><kml xmlns='http://www.opengis.net/kml/2.2' xmlns:gx='http://www.google.com/kml/ext/2.2' xmlns:kml='http://www.opengis.net/kml/2.2' xmlns:atom='http://www.w3.org/2005/Atom'><Document><Placemark><name>Watershed boundary generated by IFIS</name><Style id='basin_boundary'><LineStyle><color>FF0000FF</color><width>1</width></LineStyle><PolyStyle><color>26000000</color><fill>1</fill></PolyStyle></Style><Polygon><outerBoundaryIs><LinearRing><coordinates> "
		for i := 0; i < len(border)/2; i++ {
			lng := -96.9579313 + border[2*i]*dx
			lat := 40.3024337946 + (3680-border[2*i+1])*dy
			str = fmt.Sprintf("%s%f,%f,0 ", str, lng, lat)
		}
		str = fmt.Sprintf("%s</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Document></kml>", str)
	}

	out_byte := []byte(str)
	err := ioutil.WriteFile(out, out_byte, 0644)

	if err != nil {
		panic(err)
	}

}
