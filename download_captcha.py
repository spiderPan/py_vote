# coding=utf-8
import requests


def download_captcha():
    captchaURL = 'http://fyb.eastmoney.com/2017/api/yzm'
    picPath = 'captchas/'
    #pic_name = kwargs.get('pic_name', None)
    for i in range(400):
        res = requests.get(captchaURL, stream=True)
        picName = str(i)
        print i
        with open(picPath + picName + '.jpg', 'wb') as f:
            for chunk in res.iter_content(chunk_size=1024):
                if chunk:  # filter out keep-alive new chunks
                    f.write(chunk)
                    # f.flush()
            f.close()

download_captcha()
