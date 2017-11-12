# coding=utf-8
from PIL import Image

from libs import iteration
from libs import convert_to_text


def main():
    #im = image_process('yzm.jpg')
    im = Image.open('yzm.jpg')
    im = iteration.iterate(im, 10)
    text = convert_to_text.get_string_from_image(im)

    print text


def image_process(img_path):
    image = Image.open(img_path)
    imgry = image.convert('L')

    table = get_bin_table()
    out = imgry.point(table, '1')
    return out


def get_bin_table(threshold=140):
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)

    return table


def sum_9_region(img, x, y):
    cur_pixel = img.getpixel((x, y))
    width = img.width
    height = img.height

    if cur_pixel == 1:
        return 0

    if y == 0:
        if x == 0:
            sum = cur_pixel \
                + img.getpixel((x, y + 1)) \
                + img.getpixel((x + 1, y)) \
                + img.getpixel((x + 1, y + 1))
            return 4 - sum
        elif x == width - 1:
            sum = cur_pixel \
                + img.getpixel((x, y + 1)) \
                + img.getpixel((x - 1, y)) \
                + img.getpixel((x - 1, y + 1))

            return 4 - sum
        else:
            sum = img.getpixel((x - 1, y)) \
                + img.getpixel((x - 1, y + 1)) \
                + cur_pixel \
                + img.getpixel((x, y + 1)) \
                + img.getpixel((x + 1, y)) \
                + img.getpixel((x + 1, y + 1))
            return 6 - sum
    elif y == height - 1:
        if x == 0:

            sum = cur_pixel \
                + img.getpixel((x + 1, y)) \
                + img.getpixel((x + 1, y - 1)) \
                + img.getpixel((x, y - 1))
            return 4 - sum
        elif x == width - 1:
            sum = cur_pixel \
                + img.getpixel((x, y - 1)) \
                + img.getpixel((x - 1, y)) \
                + img.getpixel((x - 1, y - 1))

            return 4 - sum
        else:
            sum = cur_pixel \
                + img.getpixel((x - 1, y)) \
                + img.getpixel((x + 1, y)) \
                + img.getpixel((x, y - 1)) \
                + img.getpixel((x - 1, y - 1)) \
                + img.getpixel((x + 1, y - 1))
            return 6 - sum
    else:
        if x == 0:
            sum = img.getpixel((x, y - 1)) \
                + cur_pixel \
                + img.getpixel((x, y + 1)) \
                + img.getpixel((x + 1, y - 1)) \
                + img.getpixel((x + 1, y)) \
                + img.getpixel((x + 1, y + 1))

            return 6 - sum
        elif x == width - 1:
            # print('%s,%s' % (x, y))
            sum = img.getpixel((x, y - 1)) \
                + cur_pixel \
                + img.getpixel((x, y + 1)) \
                + img.getpixel((x - 1, y - 1)) \
                + img.getpixel((x - 1, y)) \
                + img.getpixel((x - 1, y + 1))

            return 6 - sum
        else:
            sum = img.getpixel((x - 1, y - 1)) \
                + img.getpixel((x - 1, y)) \
                + img.getpixel((x - 1, y + 1)) \
                + img.getpixel((x, y - 1)) \
                + cur_pixel \
                + img.getpixel((x, y + 1)) \
                + img.getpixel((x + 1, y - 1)) \
                + img.getpixel((x + 1, y)) \
                + img.getpixel((x + 1, y + 1))
            return 9 - sum

if __name__ == "__main__":
    main()
