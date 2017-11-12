# coding=utf-8
import requests


def vote():
    voteURL = 'http://fyb.eastmoney.com/2017/api/Vote'
    landingURL = 'http://fyb.eastmoney.com/2017/web/selection.html'
    data = {
        # 'callback': 'jQuery18308740109365786122_1510373686006',
        'type': '0303',
        'uid': '13917353234',
        'email': 'info12345@request.com',
        'codes': '030315',
        'yzm': '9594',
        # '_': '1510373733701'
    }
    # r = requests.get(voteURL, json=data, cookies={
    #     # 'uuid': 'f985cf1f-46a0-4a92-9531-7ea029154e4b',
    #     'uuid': 'f985cf1f-46a0-4a92-9531-7ea029154e2s',
    #                  'imgtext': 'cb662aba-2808-4d68-b710-f95dde342a7d'})
    # # r.encoding = 'utf-8'
    #
    # print r.status_code
    # print r.headers['content-type']
    # print r.json()
    # print r.text.encode('utf-8')
    # print r.text.decode('utf-8').encode('gb2312')


def download_captcha():
