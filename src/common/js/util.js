var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
import CryptoJS from 'crypto-js'

function padding(s, len) {
    var len = len - (s + '').length
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s
}

export default {
    objKeySort: function(obj) {
        var newkey = Object.keys(obj).sort()
        var newObj = {}
        for (var i = 0; i < newkey.length; i++) {
            if (Object.prototype.toString.call(obj[newkey[i]]) === '[object Object]') {
                newObj[newkey[i]] = objKeySort(obj[newkey[i]])
            } else {
                newObj[newkey[i]] = obj[newkey[i]]
            }
        }
        var arr = Object.getOwnPropertyNames(newObj).map(key => {
            return key + '=' + newObj[key]
        }).join('&')
        return arr
    },
    // queryStr: function(obj) {
    //     var arr = Object.getOwnPropertyNames(obj).map(key => {
    //         return key + '=' + obj[key]
    //     }).join('&')
    //     return arr
    // },
    guid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    },
    getQueryStringByName: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.search.substr(1).match(reg)
        var context = ''
        if (r != null)
            context = r[2]
        reg = null
        r = null
        return context == null || context == '' || context == 'undefined' ? '' : context
    },
    publicParam: function(publicParams, _this) {
        /*设置签名参数  start  以及公共参数 */
        let obj = Object.assign({}, { secretId: publicParams.secretId }, { nonce: _this.guid() }, { timestamp: new Date() * 1 })
        if (publicParams && publicParams.token !== '') {
            obj = Object.assign(obj, { token: publicParams.token })
        }
        // console.log(obj)
        let str = _this.objKeySort(obj)
        let secretKey = publicParams.secretKey
        let sign = CryptoJS.HmacSHA256(str, secretKey) + ''

        return Object.assign(obj, { sign: sign })

        /*设置签名参数  END   以及公共参数 */
    },
    formatDate: {
        format: function(date, pattern) {
            pattern = pattern || DEFAULT_PATTERN
            return pattern.replace(SIGN_REGEXP, function($0) {
                switch ($0.charAt(0)) {
                    case 'y':
                        return padding(date.getFullYear(), $0.length)
                    case 'M':
                        return padding(date.getMonth() + 1, $0.length)
                    case 'd':
                        return padding(date.getDate(), $0.length)
                    case 'w':
                        return date.getDay() + 1
                    case 'h':
                        return padding(date.getHours(), $0.length)
                    case 'm':
                        return padding(date.getMinutes(), $0.length)
                    case 's':
                        return padding(date.getSeconds(), $0.length)
                }
            })
        },
        parse: function(dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP)
            var matchs2 = dateString.match(/(\d)+/g)
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1)
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i])
                    var sign = matchs1[i]
                    switch (sign.charAt(0)) {
                        case 'y':
                            _date.setFullYear(_int)
                            break
                        case 'M':
                            _date.setMonth(_int - 1)
                            break
                        case 'd':
                            _date.setDate(_int)
                            break
                        case 'h':
                            _date.setHours(_int)
                            break
                        case 'm':
                            _date.setMinutes(_int)
                            break
                        case 's':
                            _date.setSeconds(_int)
                            break
                    }
                }
                return _date
            }
            return null
        }

    }

}