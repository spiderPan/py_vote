# coding=utf-8
from PIL import Image, ImageEnhance, ImageFilter
import os
import uuid

def main():
    directory = 'captchas'
    file_count = 0
    for filename in os.listdir(directory):
        if filename.endswith(".jpg"):
            file_count += 1
            img_name = os.path.join(directory, filename)
            cut_img(img_name)

    print 'Finished: {0}'.format(file_count)


def image_process(img_path):
    image = Image.open(img_path)
    image = image.filter(ImageFilter.MedianFilter())
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1)
    image = image.convert('L')

    return image


def binarizing(img, threshold):
    img = img.convert('L')
    pixdata = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            if(pixdata[x, y] < threshold):
                pixdata[x, y] = 0
            else:
                pixdata[x, y] = 255
    return img


def depoint(img):
    pixdata = img.load()
    w, h = img.size
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            count = 0
            if pixdata[x, y - 1] < 5:
                count = count + 1
            if pixdata[x, y + 1] < 5:
                count = count + 1
            if pixdata[x - 1, y] < 5:  # 左
                count = count + 1
            if pixdata[x + 1, y] < 5:  # 右
                count = count + 1
            if pixdata[x - 1, y - 1] < 5:  # 左上
                count = count + 1
            if pixdata[x - 1, y + 1] < 5:  # 左下
                count = count + 1
            if pixdata[x + 1, y - 1] < 5:  # 右上
                count = count + 1
            if pixdata[x + 1, y + 1] < 5:  # 右下
                count = count + 1
            if count > 4:
                pixdata[x, y] = 0
    return img


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


def segment(im):
    s = 12
    w = 18
    h = 36
    t = 0
    im_new = []
    for i in range(4):
        im1 = im.crop((s + w * i, t, s + w * (i + 1), h))
        im_new.append(im1)
    return im_new


def cut_img(img):
    cut_difrectory = 'sep_capt'
    im = image_process(img)
    pics = segment(im)
    for pic in pics:
        ran_text = str(uuid.uuid4())
        new_name = os.path.join(cut_difrectory, ran_text + '.jpg')
        pic.save(new_name)

if __name__ == "__main__":
    main()
