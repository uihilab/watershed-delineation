import watershed

img_data = watershed.get_data_from_image('direction90m.png')
border = watershed.find_watershed(4777, 897, img_data)

watershed.save_to_kml(border, "watershed.kml")