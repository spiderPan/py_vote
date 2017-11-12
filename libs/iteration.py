from PIL import Image, ImageEnhance, ImageFilter


def iterate(im, iteration):
    if iteration == 0:
        return im

    im = im.filter(ImageFilter.MedianFilter())
    enhancer = ImageEnhance.Contrast(im)
    im = enhancer.enhance(4)
    im = im.convert('1')
    im.save('i'+str(iteration)+'.jpg')

    return iterate(im, iteration - 1)
