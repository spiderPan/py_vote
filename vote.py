import requests

voteURL = 'http://fyb.eastmoney.com/2017/api/Vote'
landingURL = 'http://fyb.eastmoney.com/2017/web/selection.html'
data = {
    'callback': 'jQuery18308740109365786122_1510373686006',
    'type': '0101',
    'uid': '13907051234',
    'email': 'info@request.com',
    'codes': '010109,010103',
    'yzm': '2559',
    '_': '1510373733701'
}

# landingResponse = requests.get(landingURL);
# print landingResponse.cookies

r = requests.get(voteURL, json=data, cookies={
                 'imgtext': '69d76d65-c0ed-4928-9632-927eac09372b'})

print r.status_code
print r.headers['content-type']
print r.text


# callback:jQuery18308747204427418085_1510370230584
# type:0101
# uid:phone
# email:email
# codes:010109,010103
# yzm:2559
# _:1510371019172
#
#
# callback:jQuery18308740109365786122_1510373686006
# type:0101
# uid:13907056457
# email:info2@requests.com
# codes:010105,010108
# yzm:7354
# _:1510373733701
#
#
#
# Accept:*/*
# Accept-Encoding:gzip, deflate
# Accept-Language:en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,en-CA;q=0.6
# Connection:keep-alive
# Cookie:uuid=a2b86ea2-4abc-4dfb-8b55-3330ef397fc9; st_pvi=84799558294267; st_si=46621828841792; imgtext=cea1b15f-def1-4cde-ba58-30541abc6303
# Host:fyb.eastmoney.com
# Referer:http://fyb.eastmoney.com/2017/web/selection.html
# User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36
#
#
# rnd:1510371024665   6790
#
# imgtext 69d76d65-c0ed-4928-9632-927eac09372b	2559
