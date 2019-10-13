<template>
    <div class="box">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
            <h3 class="title">三亚放心游管理平台</h3>
            <el-form-item prop="account">
                <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="vcode" >
                <el-input type="text" v-model="ruleForm2.vcode" auto-complete="off" placeholder="验证码" style="width:50%;"></el-input>
                <img v-bind:src="imgurlForm.imgurl" alt="验证码图片" @click="imgCaptcha" class="imgcode">
            </el-form-item>
            <el-checkbox v-model="checked"  class="remember">一周内自动登录</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
                <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { requestLogin ,loginCode,getSecret} from '../api/api';
    import util from '../common/js/util';
    import axios from 'axios';
    import CryptoJS from 'crypto-js';
    //import NProgress from 'nprogress'
    export default {
        data() {
            return {
                publicParams: {
                    secretKey :'',
                    secretId:'',
                    token:'',
                    sign:''
                },
                logining: false,
                ruleForm2: {
                    account: '',
                    checkPass: '',
                    vcode:'',
                },
                // 图形验证码
                imgurlForm: {
                    imgurl:'',
                    captchaId:''
                },
                rules2: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        //{ validator: validaePass2 }
                    ],
                    vcode: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleReset2() {
                    this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/base');
                        this.logining = true;
                        //NProgress.start();

                        var loginParams = {
                            userName: _this.ruleForm2.account,
                            password: _this.ruleForm2.checkPass,
                            captcha:_this.ruleForm2.vcode,
                            captchaId:_this.imgurlForm.captchaId
                        };

                        /*设置签名参数  start  以及公共参数 */
                        let obj = this.publicParams;
                        var publicParams =  util.publicParam(obj,util);
                        /*设置签名参数  END   以及公共参数 */


                        //判断复选框是否被勾选 勾选则调用配置cookie方法
                        var name = _this.ruleForm2.account;
                        var pass = _this.ruleForm2.checkPass;
                        if(_this.checked == true){
                            //传入账号名，密码，和保存天数3个参数
                            _this.setCookie(name,pass,7);
                        }else {
                            console.log("清空Cookie");
                            //清空Cookie
                            _this.clearCookie();
                        }
                        requestLogin(loginParams,publicParams).then(data => {
                            this.logining = false;                          
                            let { msg, code , result} = data;

                            if (code !== 1000) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                                if(code === 2108 || code === 2121  ) {
                                    _this.ruleForm2.account='';
                                    _this.ruleForm2.checkPass='';
                                }
                                _this.ruleForm2.vcode='';
                                this.imgCaptcha();
                                return
                            } else {
                                // 将签名秘钥存储到缓存当中
                                sessionStorage.setItem('user', JSON.stringify(result));
                                _this.$router.push('/main');
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //设置cookie
            setCookie(c_name,c_pwd,exdays) {
                var exdate=new Date();//获取时间
                exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays);//保存的天数
                //字符串拼接cookie
                window.document.cookie="userName"+ "=" +c_name+";path=/;expires="+exdate.toGMTString();
                window.document.cookie="userPwd"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
            },
            //读取cookie
            getCookie:function () {
                if (document.cookie.length>0) {
                    var arr=document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
                    for(var i=0;i<arr.length;i++){
                        var arr2=arr[i].split('=');//再次切割
                        //判断查找相对应的值
                        if(arr2[0]=='userName'){
                            this.ruleForm2.account = arr2[1];//保存到保存数据的地方
                        }else if(arr2[0]=='userPwd'){
                            this.ruleForm2.checkPass = arr2[1];
                        }
                    }
                }
            },
            //清除cookie
            clearCookie:function () {
                this.setCookie("","",-1);//修改2值都为空，天数为负1天就好了
            },
            imgCaptcha: function () {
                var _this = this;
                var nonce = util.guid();
                var timestamp = new Date()*1;
                var captchaId = timestamp;

                // let base = 'http://192.168.0.198:8080/manager'
                let base = ''
                axios({
                    method: 'post',
                    url: `${base}/ajax/auth/nt/captcha`,
                    headers: {
                        'nonce': nonce, 
                        "timestamp":timestamp
                    },
                    data: {
                        captchaId:captchaId
                    }
                }).then(function (res) {
                    //console.log(res)
                    if(res.data.code == 1000){
                        _this.imgurlForm.imgurl = "data:image/jpeg;base64," + res.data.result.imgBase64Str;
                        _this.imgurlForm.captchaId = captchaId;
                    }else {
                        _this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                });
            },
            getLoginSecret(){
                var params = {};
                getSecret(params).then((res) => {
					if(res.code == 1000){
                        // console.log(res.result)
                        this.publicParams.secretId = res.result.secretId;
                        this.publicParams.secretKey  = res.result.secretKey ;
                        //console.log(this.publicParams.secretId);
                        sessionStorage.setItem('secret', JSON.stringify(res.result));
					}else {
						this.$message({
                            message: '数据获取失败:'+res.msg,
                            type: 'error'
                        });
					}
                    // NProgress.done();
				}).catch((error) => {
					console.log(error);
				});
            }
        },
         mounted() {
            this.getLoginSecret();
            this.getCookie();
            // 获取图形验证码 
            this.imgCaptcha();
        }
    }

</script>

<style lang="scss" scoped>
    .box {
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #20395e 0%, #4c3265 100%);
    }
    .imgcode {
        vertical-align: middle;
        border: none;
    }
    .demo-ruleForm {
        margin: 0 !important;
        position: absolute;
        left: 50%;
        top: 30%;
        -webkit-transform: translate(-50%);
    }

    @media screen and (max-height: 600px) {
		.demo-ruleForm {
            top: 15%;
        }
	}

    /************************************************************/
    #stars {
        width: 1px;
        height: 1px;
        background: transparent;
        box-shadow: 1809px 1589px #FFF, 1322px 631px #FFF, 726px 1625px #FFF, 1368px 48px #FFF, 151px 1871px #FFF, 614px 635px #FFF, 1278px 128px #FFF, 326px 1832px #FFF, 1518px 1725px #FFF, 1855px 1512px #FFF, 1762px 1926px #FFF, 1578px 1490px #FFF, 1805px 1179px #FFF, 1559px 599px #FFF, 1809px 1132px #FFF, 357px 6px #FFF, 891px 114px #FFF, 132px 1602px #FFF, 1558px 1316px #FFF, 1797px 1903px #FFF, 239px 1616px #FFF, 1387px 1063px #FFF, 1003px 1185px #FFF, 284px 1422px #FFF, 476px 1139px #FFF, 1099px 495px #FFF, 639px 386px #FFF, 1120px 1356px #FFF, 1879px 392px #FFF, 1311px 582px #FFF, 72px 1121px #FFF, 1360px 483px #FFF, 222px 1496px #FFF, 1812px 1517px #FFF, 291px 1261px #FFF, 1411px 1494px #FFF, 775px 553px #FFF, 1027px 1525px #FFF, 953px 198px #FFF, 1430px 1430px #FFF, 678px 1305px #FFF, 401px 1735px #FFF, 945px 1148px #FFF, 1504px 1613px #FFF, 463px 820px #FFF, 969px 1912px #FFF, 1025px 1375px #FFF, 720px 1314px #FFF, 809px 272px #FFF, 1543px 1420px #FFF, 1315px 1105px #FFF, 1860px 1087px #FFF, 385px 344px #FFF, 751px 84px #FFF, 1871px 1292px #FFF, 1182px 853px #FFF, 1197px 1052px #FFF, 1685px 178px #FFF, 1737px 1181px #FFF, 1540px 1179px #FFF, 1624px 1269px #FFF, 251px 18px #FFF, 1363px 67px #FFF, 647px 1302px #FFF, 919px 650px #FFF, 480px 213px #FFF, 1615px 189px #FFF, 1904px 210px #FFF, 4px 704px #FFF, 1815px 1201px #FFF, 1857px 1764px #FFF, 1554px 503px #FFF, 287px 1202px #FFF, 674px 724px #FFF, 1166px 1021px #FFF, 1343px 231px #FFF, 1152px 1397px #FFF, 1255px 913px #FFF, 1905px 658px #FFF, 1684px 1616px #FFF, 1420px 1496px #FFF, 625px 1971px #FFF, 1773px 1488px #FFF, 1970px 372px #FFF, 1602px 1916px #FFF, 1789px 1454px #FFF, 624px 592px #FFF, 477px 1260px #FFF, 212px 350px #FFF, 354px 291px #FFF, 80px 394px #FFF, 73px 1083px #FFF, 1991px 537px #FFF, 755px 207px #FFF, 559px 302px #FFF, 151px 964px #FFF, 1504px 642px #FFF, 1275px 1309px #FFF, 852px 1202px #FFF, 1798px 1667px #FFF, 614px 1279px #FFF, 297px 489px #FFF, 1930px 487px #FFF, 1159px 1816px #FFF, 287px 413px #FFF, 587px 1348px #FFF, 665px 992px #FFF, 1316px 432px #FFF, 1378px 1759px #FFF, 475px 1505px #FFF, 1189px 118px #FFF, 1412px 1743px #FFF, 1447px 1694px #FFF, 857px 537px #FFF, 684px 634px #FFF, 1471px 764px #FFF, 570px 493px #FFF, 781px 903px #FFF, 1237px 486px #FFF, 268px 1081px #FFF, 805px 88px #FFF, 566px 498px #FFF, 4px 1484px #FFF, 1955px 1442px #FFF, 1614px 174px #FFF, 136px 1471px #FFF, 321px 21px #FFF, 596px 1643px #FFF, 1526px 280px #FFF, 327px 782px #FFF, 129px 1564px #FFF, 1655px 1849px #FFF, 260px 60px #FFF, 668px 361px #FFF, 126px 288px #FFF, 766px 949px #FFF, 205px 482px #FFF, 22px 59px #FFF, 1450px 1415px #FFF, 590px 777px #FFF, 686px 722px #FFF, 1655px 843px #FFF, 263px 1399px #FFF, 1665px 1268px #FFF, 1917px 1930px #FFF, 1534px 1976px #FFF, 1358px 1900px #FFF, 683px 1706px #FFF, 530px 874px #FFF, 992px 52px #FFF, 865px 1913px #FFF, 1826px 657px #FFF, 1164px 459px #FFF, 469px 1066px #FFF, 1383px 1270px #FFF, 1652px 1613px #FFF, 1188px 72px #FFF, 1900px 1160px #FFF, 1353px 1560px #FFF, 834px 1197px #FFF, 1008px 209px #FFF, 1728px 891px #FFF, 552px 379px #FFF, 1933px 1698px #FFF, 561px 369px #FFF, 788px 679px #FFF, 1978px 1976px #FFF, 1337px 1923px #FFF, 773px 286px #FFF, 1728px 1364px #FFF, 1310px 1020px #FFF, 1252px 1301px #FFF, 1054px 1643px #FFF, 1731px 803px #FFF, 900px 1586px #FFF, 832px 98px #FFF, 254px 1964px #FFF, 1701px 657px #FFF, 981px 915px #FFF, 452px 1451px #FFF, 23px 1182px #FFF, 1859px 1413px #FFF, 370px 894px #FFF, 1641px 697px #FFF, 939px 471px #FFF, 1194px 1839px #FFF, 1433px 732px #FFF, 1921px 1811px #FFF, 1139px 1115px #FFF, 276px 395px #FFF, 1717px 359px #FFF, 495px 12px #FFF, 831px 798px #FFF, 643px 1177px #FFF, 1655px 73px #FFF, 1028px 1810px #FFF, 753px 300px #FFF, 1905px 16px #FFF, 731px 1694px #FFF, 126px 1379px #FFF, 910px 636px #FFF, 458px 1791px #FFF, 1892px 1101px #FFF, 1005px 910px #FFF, 912px 1178px #FFF, 374px 1563px #FFF, 119px 1695px #FFF, 1227px 497px #FFF, 1321px 1559px #FFF, 889px 896px #FFF, 1661px 593px #FFF, 1505px 1809px #FFF, 107px 1697px #FFF, 1874px 1021px #FFF, 1005px 1562px #FFF, 1501px 73px #FFF, 1547px 1057px #FFF, 1550px 1549px #FFF, 765px 106px #FFF, 190px 586px #FFF, 523px 274px #FFF, 1040px 484px #FFF, 1701px 646px #FFF, 1492px 61px #FFF, 1487px 1533px #FFF, 1001px 1134px #FFF, 1913px 545px #FFF, 233px 1420px #FFF, 1221px 113px #FFF, 1292px 461px #FFF, 1226px 901px #FFF, 1261px 1378px #FFF, 1722px 1978px #FFF, 1945px 1706px #FFF, 1266px 175px #FFF, 967px 1088px #FFF, 708px 1448px #FFF, 1564px 1669px #FFF, 1286px 1654px #FFF, 38px 563px #FFF, 666px 355px #FFF, 219px 410px #FFF, 1771px 616px #FFF, 909px 788px #FFF, 170px 413px #FFF, 89px 1762px #FFF, 1959px 206px #FFF, 1092px 740px #FFF, 301px 398px #FFF, 260px 1040px #FFF, 49px 563px #FFF, 1107px 251px #FFF, 1775px 1876px #FFF, 1764px 1983px #FFF, 810px 1895px #FFF, 1340px 1413px #FFF, 739px 1177px #FFF, 285px 1045px #FFF, 61px 837px #FFF, 1772px 1563px #FFF, 1099px 1433px #FFF, 1789px 985px #FFF, 1702px 1041px #FFF, 1201px 881px #FFF, 572px 1942px #FFF, 1924px 202px #FFF, 424px 1018px #FFF, 1385px 1678px #FFF, 767px 908px #FFF, 1010px 901px #FFF, 301px 1088px #FFF, 1715px 1916px #FFF, 1170px 809px #FFF, 875px 1657px #FFF, 681px 647px #FFF, 1366px 199px #FFF, 1192px 6px #FFF, 843px 568px #FFF, 688px 1261px #FFF, 1663px 368px #FFF, 350px 904px #FFF, 85px 972px #FFF, 760px 970px #FFF, 1801px 16px #FFF, 764px 1682px #FFF, 890px 813px #FFF, 69px 1160px #FFF, 161px 1898px #FFF, 69px 1944px #FFF, 1903px 920px #FFF, 1152px 125px #FFF, 197px 1642px #FFF, 1528px 175px #FFF, 1736px 1606px #FFF, 187px 1244px #FFF, 1097px 339px #FFF, 160px 419px #FFF, 1910px 383px #FFF, 1128px 790px #FFF, 1225px 1841px #FFF, 609px 1195px #FFF, 1185px 1187px #FFF, 1279px 251px #FFF, 400px 1602px #FFF, 758px 658px #FFF, 1594px 1862px #FFF, 1097px 1597px #FFF, 1495px 1971px #FFF, 1920px 304px #FFF, 1878px 1472px #FFF, 276px 1516px #FFF, 388px 802px #FFF, 1958px 1212px #FFF, 1893px 1048px #FFF, 1643px 1915px #FFF, 784px 1907px #FFF, 322px 1925px #FFF, 1717px 1678px #FFF, 541px 664px #FFF, 1242px 626px #FFF, 342px 1816px #FFF, 71px 1930px #FFF, 1625px 229px #FFF, 995px 218px #FFF, 364px 275px #FFF, 993px 755px #FFF, 698px 1317px #FFF, 588px 628px #FFF, 63px 1316px #FFF, 209px 504px #FFF, 1971px 250px #FFF, 1927px 1967px #FFF, 1040px 1869px #FFF, 861px 559px #FFF, 1901px 1374px #FFF, 1407px 414px #FFF, 1770px 778px #FFF, 656px 41px #FFF, 1134px 586px #FFF, 1003px 883px #FFF, 1711px 48px #FFF, 1385px 310px #FFF, 1409px 1948px #FFF, 28px 1956px #FFF, 439px 1295px #FFF, 918px 1040px #FFF, 1857px 392px #FFF, 1767px 1312px #FFF, 1766px 1626px #FFF, 974px 1615px #FFF, 1059px 927px #FFF, 340px 1654px #FFF, 953px 376px #FFF, 421px 733px #FFF, 1386px 610px #FFF, 431px 1198px #FFF, 1554px 842px #FFF, 1315px 1522px #FFF, 1469px 1914px #FFF, 773px 931px #FFF, 1084px 1536px #FFF, 1216px 189px #FFF, 22px 543px #FFF, 747px 680px #FFF, 1687px 1498px #FFF, 639px 880px #FFF, 955px 510px #FFF, 1030px 1470px #FFF, 1245px 406px #FFF, 86px 70px #FFF, 1956px 995px #FFF, 143px 963px #FFF, 1346px 46px #FFF, 310px 521px #FFF, 364px 1910px #FFF, 978px 1890px #FFF, 1638px 1140px #FFF, 360px 1025px #FFF, 1655px 1664px #FFF, 1167px 1307px #FFF, 692px 180px #FFF, 985px 1191px #FFF, 1430px 1897px #FFF, 1410px 620px #FFF, 357px 1769px #FFF, 1558px 1649px #FFF, 830px 1045px #FFF, 924px 156px #FFF, 1732px 1293px #FFF, 1497px 1060px #FFF, 673px 1333px #FFF, 1460px 821px #FFF, 1773px 236px #FFF, 687px 1612px #FFF, 64px 1907px #FFF, 215px 164px #FFF, 1041px 1343px #FFF, 678px 729px #FFF, 1910px 1831px #FFF, 148px 1322px #FFF, 518px 1077px #FFF, 1443px 1438px #FFF, 1663px 1615px #FFF, 820px 629px #FFF, 1928px 1332px #FFF, 1430px 1580px #FFF, 1235px 727px #FFF, 271px 1540px #FFF, 170px 231px #FFF, 1203px 1162px #FFF, 586px 1779px #FFF, 1466px 1630px #FFF, 1718px 657px #FFF, 1302px 1622px #FFF, 65px 1344px #FFF, 1276px 1362px #FFF, 155px 1095px #FFF, 890px 1370px #FFF, 472px 27px #FFF, 1746px 778px #FFF, 95px 616px #FFF, 1734px 37px #FFF, 491px 594px #FFF, 330px 689px #FFF, 1555px 476px #FFF, 1209px 1789px #FFF, 235px 1650px #FFF, 1216px 1437px #FFF, 1784px 1767px #FFF, 625px 820px #FFF, 1258px 1741px #FFF, 1105px 434px #FFF, 1004px 160px #FFF, 1074px 371px #FFF, 153px 1402px #FFF, 1536px 1543px #FFF, 1483px 1313px #FFF, 497px 1749px #FFF, 1159px 1664px #FFF, 129px 846px #FFF, 499px 150px #FFF, 836px 1578px #FFF, 348px 1882px #FFF, 1496px 1812px #FFF, 1434px 176px #FFF, 393px 241px #FFF, 165px 545px #FFF, 752px 1776px #FFF, 1921px 1586px #FFF, 1817px 598px #FFF, 975px 925px #FFF, 497px 1206px #FFF, 820px 417px #FFF, 1637px 714px #FFF, 318px 1200px #FFF, 1249px 522px #FFF, 1871px 75px #FFF, 1070px 1074px #FFF, 659px 1380px #FFF, 1884px 495px #FFF, 1140px 1685px #FFF, 1411px 720px #FFF, 338px 803px #FFF, 1345px 793px #FFF, 319px 1141px #FFF, 697px 595px #FFF, 740px 1946px #FFF, 1387px 602px #FFF, 1457px 1995px #FFF, 1517px 1840px #FFF, 673px 1039px #FFF, 541px 1958px #FFF, 2000px 701px #FFF, 407px 1033px #FFF, 865px 1572px #FFF, 1540px 1999px #FFF, 1361px 1872px #FFF, 1155px 1700px #FFF, 386px 341px #FFF, 221px 1567px #FFF, 730px 1429px #FFF, 916px 336px #FFF, 226px 1693px #FFF, 1680px 1148px #FFF, 1561px 1289px #FFF, 1289px 1399px #FFF, 1383px 849px #FFF, 1100px 945px #FFF, 724px 8px #FFF, 1763px 1734px #FFF, 1915px 1194px #FFF, 718px 923px #FFF, 806px 1456px #FFF, 364px 1640px #FFF, 651px 1756px #FFF, 1628px 132px #FFF, 86px 839px #FFF, 1982px 1830px #FFF, 778px 364px #FFF, 1665px 473px #FFF, 1605px 303px #FFF, 1043px 206px #FFF, 757px 160px #FFF, 1849px 1911px #FFF, 636px 1242px #FFF, 937px 1684px #FFF, 1700px 1992px #FFF, 1898px 481px #FFF, 1109px 1413px #FFF, 555px 339px #FFF, 466px 887px #FFF, 209px 217px #FFF, 1673px 1137px #FFF, 162px 543px #FFF, 715px 1331px #FFF, 1384px 355px #FFF, 69px 723px #FFF, 1845px 1510px #FFF, 1241px 1059px #FFF, 1893px 371px #FFF, 1995px 1547px #FFF, 563px 815px #FFF, 1079px 1715px #FFF, 385px 1341px #FFF, 1793px 1524px #FFF, 1050px 1196px #FFF, 1196px 582px #FFF, 286px 1050px #FFF, 744px 145px #FFF, 1559px 686px #FFF, 818px 368px #FFF, 889px 1723px #FFF, 1337px 1274px #FFF, 1210px 1777px #FFF, 970px 529px #FFF, 1102px 563px #FFF, 1389px 1176px #FFF, 930px 1340px #FFF, 265px 1469px #FFF, 157px 298px #FFF, 987px 1384px #FFF, 1679px 1909px #FFF, 1268px 343px #FFF, 1695px 1081px #FFF, 755px 250px #FFF, 22px 1084px #FFF, 1298px 1706px #FFF, 1367px 578px #FFF, 43px 1515px #FFF, 1718px 1249px #FFF, 1586px 1909px #FFF, 531px 226px #FFF, 586px 768px #FFF, 1843px 1892px #FFF, 1681px 1801px #FFF, 1839px 26px #FFF, 231px 1392px #FFF, 1275px 879px #FFF, 1195px 551px #FFF, 741px 780px #FFF, 302px 948px #FFF, 442px 1805px #FFF, 586px 998px #FFF, 525px 210px #FFF, 1174px 1822px #FFF, 986px 1421px #FFF, 599px 1431px #FFF, 1423px 41px #FFF, 175px 532px #FFF, 1353px 851px #FFF, 1861px 992px #FFF, 1084px 655px #FFF, 1788px 904px #FFF, 769px 368px #FFF, 844px 1488px #FFF, 1654px 33px #FFF, 1114px 1677px #FFF, 1121px 384px #FFF, 1909px 1827px #FFF, 154px 1155px #FFF, 85px 44px #FFF, 1053px 1032px #FFF, 1662px 1640px #FFF, 367px 1047px #FFF, 429px 347px #FFF, 308px 1731px #FFF, 1329px 1718px #FFF, 759px 1792px #FFF, 1628px 1845px #FFF, 639px 1205px #FFF, 353px 1892px #FFF, 1141px 209px #FFF, 938px 1478px #FFF, 1118px 967px #FFF, 994px 1068px #FFF, 336px 1038px #FFF, 1864px 1211px #FFF, 371px 1898px #FFF, 1097px 543px #FFF, 338px 1812px #FFF, 366px 300px #FFF, 1125px 562px #FFF, 364px 565px #FFF, 37px 1202px #FFF, 1253px 620px #FFF, 1158px 1854px #FFF, 1912px 1988px #FFF, 1165px 2000px #FFF, 1848px 1446px #FFF, 514px 1496px #FFF, 1663px 1461px #FFF, 845px 481px #FFF, 1621px 1757px #FFF, 225px 397px #FFF, 1672px 804px #FFF, 939px 529px #FFF, 1814px 1163px #FFF, 898px 1511px #FFF, 1381px 760px #FFF, 1689px 355px #FFF, 361px 855px #FFF, 1777px 1016px #FFF, 177px 558px #FFF, 1109px 1851px #FFF, 1034px 1204px #FFF, 856px 1602px #FFF, 1850px 558px #FFF, 131px 763px #FFF, 1984px 941px #FFF, 1603px 717px #FFF, 1975px 1710px #FFF, 1960px 669px #FFF, 945px 1859px #FFF, 1301px 315px #FFF, 254px 1522px #FFF, 1472px 1122px #FFF, 1215px 1731px #FFF, 965px 332px #FFF, 215px 1964px #FFF, 965px 536px #FFF, 711px 1119px #FFF, 1337px 1664px #FFF, 1814px 954px #FFF, 376px 1168px #FFF, 926px 1535px #FFF, 1123px 735px #FFF, 1615px 1359px #FFF, 1573px 363px #FFF, 1599px 1555px #FFF, 1811px 642px #FFF, 1397px 477px #FFF, 1648px 1965px #FFF, 314px 736px #FFF, 764px 703px #FFF, 1510px 1281px #FFF, 789px 1639px #FFF, 573px 1356px #FFF, 1346px 974px #FFF, 634px 1860px #FFF, 954px 1824px #FFF, 1677px 1273px #FFF, 1247px 1238px #FFF, 316px 1133px #FFF, 1232px 682px #FFF, 597px 1050px #FFF, 1738px 891px #FFF, 1339px 1528px #FFF, 246px 1728px #FFF, 1098px 921px #FFF, 1916px 1533px #FFF, 1599px 161px #FFF, 591px 394px #FFF, 513px 1912px #FFF, 339px 1923px #FFF, 591px 552px #FFF, 956px 1686px #FFF, 722px 1448px #FFF, 1718px 886px #FFF, 130px 105px #FFF, 784px 934px #FFF, 1637px 1903px #FFF, 204px 870px #FFF, 1470px 1964px #FFF, 415px 616px #FFF, 339px 1097px #FFF, 714px 1894px #FFF, 1381px 561px #FFF, 1284px 546px #FFF, 1443px 1208px #FFF, 923px 880px #FFF, 1627px 1681px #FFF, 1832px 684px #FFF, 1564px 1257px #FFF, 88px 1261px #FFF, 725px 410px #FFF, 1162px 1004px #FFF, 255px 1749px #FFF, 786px 16px #FFF, 895px 9px #FFF, 1489px 1366px #FFF;
        animation: animStar 50s linear infinite;
    }

    #stars:after {
        content: " ";
        position: absolute;
        top: 2000px;
        width: 1px;
        height: 1px;
        background: transparent;
        box-shadow: 1809px 1589px #FFF, 1322px 631px #FFF, 726px 1625px #FFF, 1368px 48px #FFF, 151px 1871px #FFF, 614px 635px #FFF, 1278px 128px #FFF, 326px 1832px #FFF, 1518px 1725px #FFF, 1855px 1512px #FFF, 1762px 1926px #FFF, 1578px 1490px #FFF, 1805px 1179px #FFF, 1559px 599px #FFF, 1809px 1132px #FFF, 357px 6px #FFF, 891px 114px #FFF, 132px 1602px #FFF, 1558px 1316px #FFF, 1797px 1903px #FFF, 239px 1616px #FFF, 1387px 1063px #FFF, 1003px 1185px #FFF, 284px 1422px #FFF, 476px 1139px #FFF, 1099px 495px #FFF, 639px 386px #FFF, 1120px 1356px #FFF, 1879px 392px #FFF, 1311px 582px #FFF, 72px 1121px #FFF, 1360px 483px #FFF, 222px 1496px #FFF, 1812px 1517px #FFF, 291px 1261px #FFF, 1411px 1494px #FFF, 775px 553px #FFF, 1027px 1525px #FFF, 953px 198px #FFF, 1430px 1430px #FFF, 678px 1305px #FFF, 401px 1735px #FFF, 945px 1148px #FFF, 1504px 1613px #FFF, 463px 820px #FFF, 969px 1912px #FFF, 1025px 1375px #FFF, 720px 1314px #FFF, 809px 272px #FFF, 1543px 1420px #FFF, 1315px 1105px #FFF, 1860px 1087px #FFF, 385px 344px #FFF, 751px 84px #FFF, 1871px 1292px #FFF, 1182px 853px #FFF, 1197px 1052px #FFF, 1685px 178px #FFF, 1737px 1181px #FFF, 1540px 1179px #FFF, 1624px 1269px #FFF, 251px 18px #FFF, 1363px 67px #FFF, 647px 1302px #FFF, 919px 650px #FFF, 480px 213px #FFF, 1615px 189px #FFF, 1904px 210px #FFF, 4px 704px #FFF, 1815px 1201px #FFF, 1857px 1764px #FFF, 1554px 503px #FFF, 287px 1202px #FFF, 674px 724px #FFF, 1166px 1021px #FFF, 1343px 231px #FFF, 1152px 1397px #FFF, 1255px 913px #FFF, 1905px 658px #FFF, 1684px 1616px #FFF, 1420px 1496px #FFF, 625px 1971px #FFF, 1773px 1488px #FFF, 1970px 372px #FFF, 1602px 1916px #FFF, 1789px 1454px #FFF, 624px 592px #FFF, 477px 1260px #FFF, 212px 350px #FFF, 354px 291px #FFF, 80px 394px #FFF, 73px 1083px #FFF, 1991px 537px #FFF, 755px 207px #FFF, 559px 302px #FFF, 151px 964px #FFF, 1504px 642px #FFF, 1275px 1309px #FFF, 852px 1202px #FFF, 1798px 1667px #FFF, 614px 1279px #FFF, 297px 489px #FFF, 1930px 487px #FFF, 1159px 1816px #FFF, 287px 413px #FFF, 587px 1348px #FFF, 665px 992px #FFF, 1316px 432px #FFF, 1378px 1759px #FFF, 475px 1505px #FFF, 1189px 118px #FFF, 1412px 1743px #FFF, 1447px 1694px #FFF, 857px 537px #FFF, 684px 634px #FFF, 1471px 764px #FFF, 570px 493px #FFF, 781px 903px #FFF, 1237px 486px #FFF, 268px 1081px #FFF, 805px 88px #FFF, 566px 498px #FFF, 4px 1484px #FFF, 1955px 1442px #FFF, 1614px 174px #FFF, 136px 1471px #FFF, 321px 21px #FFF, 596px 1643px #FFF, 1526px 280px #FFF, 327px 782px #FFF, 129px 1564px #FFF, 1655px 1849px #FFF, 260px 60px #FFF, 668px 361px #FFF, 126px 288px #FFF, 766px 949px #FFF, 205px 482px #FFF, 22px 59px #FFF, 1450px 1415px #FFF, 590px 777px #FFF, 686px 722px #FFF, 1655px 843px #FFF, 263px 1399px #FFF, 1665px 1268px #FFF, 1917px 1930px #FFF, 1534px 1976px #FFF, 1358px 1900px #FFF, 683px 1706px #FFF, 530px 874px #FFF, 992px 52px #FFF, 865px 1913px #FFF, 1826px 657px #FFF, 1164px 459px #FFF, 469px 1066px #FFF, 1383px 1270px #FFF, 1652px 1613px #FFF, 1188px 72px #FFF, 1900px 1160px #FFF, 1353px 1560px #FFF, 834px 1197px #FFF, 1008px 209px #FFF, 1728px 891px #FFF, 552px 379px #FFF, 1933px 1698px #FFF, 561px 369px #FFF, 788px 679px #FFF, 1978px 1976px #FFF, 1337px 1923px #FFF, 773px 286px #FFF, 1728px 1364px #FFF, 1310px 1020px #FFF, 1252px 1301px #FFF, 1054px 1643px #FFF, 1731px 803px #FFF, 900px 1586px #FFF, 832px 98px #FFF, 254px 1964px #FFF, 1701px 657px #FFF, 981px 915px #FFF, 452px 1451px #FFF, 23px 1182px #FFF, 1859px 1413px #FFF, 370px 894px #FFF, 1641px 697px #FFF, 939px 471px #FFF, 1194px 1839px #FFF, 1433px 732px #FFF, 1921px 1811px #FFF, 1139px 1115px #FFF, 276px 395px #FFF, 1717px 359px #FFF, 495px 12px #FFF, 831px 798px #FFF, 643px 1177px #FFF, 1655px 73px #FFF, 1028px 1810px #FFF, 753px 300px #FFF, 1905px 16px #FFF, 731px 1694px #FFF, 126px 1379px #FFF, 910px 636px #FFF, 458px 1791px #FFF, 1892px 1101px #FFF, 1005px 910px #FFF, 912px 1178px #FFF, 374px 1563px #FFF, 119px 1695px #FFF, 1227px 497px #FFF, 1321px 1559px #FFF, 889px 896px #FFF, 1661px 593px #FFF, 1505px 1809px #FFF, 107px 1697px #FFF, 1874px 1021px #FFF, 1005px 1562px #FFF, 1501px 73px #FFF, 1547px 1057px #FFF, 1550px 1549px #FFF, 765px 106px #FFF, 190px 586px #FFF, 523px 274px #FFF, 1040px 484px #FFF, 1701px 646px #FFF, 1492px 61px #FFF, 1487px 1533px #FFF, 1001px 1134px #FFF, 1913px 545px #FFF, 233px 1420px #FFF, 1221px 113px #FFF, 1292px 461px #FFF, 1226px 901px #FFF, 1261px 1378px #FFF, 1722px 1978px #FFF, 1945px 1706px #FFF, 1266px 175px #FFF, 967px 1088px #FFF, 708px 1448px #FFF, 1564px 1669px #FFF, 1286px 1654px #FFF, 38px 563px #FFF, 666px 355px #FFF, 219px 410px #FFF, 1771px 616px #FFF, 909px 788px #FFF, 170px 413px #FFF, 89px 1762px #FFF, 1959px 206px #FFF, 1092px 740px #FFF, 301px 398px #FFF, 260px 1040px #FFF, 49px 563px #FFF, 1107px 251px #FFF, 1775px 1876px #FFF, 1764px 1983px #FFF, 810px 1895px #FFF, 1340px 1413px #FFF, 739px 1177px #FFF, 285px 1045px #FFF, 61px 837px #FFF, 1772px 1563px #FFF, 1099px 1433px #FFF, 1789px 985px #FFF, 1702px 1041px #FFF, 1201px 881px #FFF, 572px 1942px #FFF, 1924px 202px #FFF, 424px 1018px #FFF, 1385px 1678px #FFF, 767px 908px #FFF, 1010px 901px #FFF, 301px 1088px #FFF, 1715px 1916px #FFF, 1170px 809px #FFF, 875px 1657px #FFF, 681px 647px #FFF, 1366px 199px #FFF, 1192px 6px #FFF, 843px 568px #FFF, 688px 1261px #FFF, 1663px 368px #FFF, 350px 904px #FFF, 85px 972px #FFF, 760px 970px #FFF, 1801px 16px #FFF, 764px 1682px #FFF, 890px 813px #FFF, 69px 1160px #FFF, 161px 1898px #FFF, 69px 1944px #FFF, 1903px 920px #FFF, 1152px 125px #FFF, 197px 1642px #FFF, 1528px 175px #FFF, 1736px 1606px #FFF, 187px 1244px #FFF, 1097px 339px #FFF, 160px 419px #FFF, 1910px 383px #FFF, 1128px 790px #FFF, 1225px 1841px #FFF, 609px 1195px #FFF, 1185px 1187px #FFF, 1279px 251px #FFF, 400px 1602px #FFF, 758px 658px #FFF, 1594px 1862px #FFF, 1097px 1597px #FFF, 1495px 1971px #FFF, 1920px 304px #FFF, 1878px 1472px #FFF, 276px 1516px #FFF, 388px 802px #FFF, 1958px 1212px #FFF, 1893px 1048px #FFF, 1643px 1915px #FFF, 784px 1907px #FFF, 322px 1925px #FFF, 1717px 1678px #FFF, 541px 664px #FFF, 1242px 626px #FFF, 342px 1816px #FFF, 71px 1930px #FFF, 1625px 229px #FFF, 995px 218px #FFF, 364px 275px #FFF, 993px 755px #FFF, 698px 1317px #FFF, 588px 628px #FFF, 63px 1316px #FFF, 209px 504px #FFF, 1971px 250px #FFF, 1927px 1967px #FFF, 1040px 1869px #FFF, 861px 559px #FFF, 1901px 1374px #FFF, 1407px 414px #FFF, 1770px 778px #FFF, 656px 41px #FFF, 1134px 586px #FFF, 1003px 883px #FFF, 1711px 48px #FFF, 1385px 310px #FFF, 1409px 1948px #FFF, 28px 1956px #FFF, 439px 1295px #FFF, 918px 1040px #FFF, 1857px 392px #FFF, 1767px 1312px #FFF, 1766px 1626px #FFF, 974px 1615px #FFF, 1059px 927px #FFF, 340px 1654px #FFF, 953px 376px #FFF, 421px 733px #FFF, 1386px 610px #FFF, 431px 1198px #FFF, 1554px 842px #FFF, 1315px 1522px #FFF, 1469px 1914px #FFF, 773px 931px #FFF, 1084px 1536px #FFF, 1216px 189px #FFF, 22px 543px #FFF, 747px 680px #FFF, 1687px 1498px #FFF, 639px 880px #FFF, 955px 510px #FFF, 1030px 1470px #FFF, 1245px 406px #FFF, 86px 70px #FFF, 1956px 995px #FFF, 143px 963px #FFF, 1346px 46px #FFF, 310px 521px #FFF, 364px 1910px #FFF, 978px 1890px #FFF, 1638px 1140px #FFF, 360px 1025px #FFF, 1655px 1664px #FFF, 1167px 1307px #FFF, 692px 180px #FFF, 985px 1191px #FFF, 1430px 1897px #FFF, 1410px 620px #FFF, 357px 1769px #FFF, 1558px 1649px #FFF, 830px 1045px #FFF, 924px 156px #FFF, 1732px 1293px #FFF, 1497px 1060px #FFF, 673px 1333px #FFF, 1460px 821px #FFF, 1773px 236px #FFF, 687px 1612px #FFF, 64px 1907px #FFF, 215px 164px #FFF, 1041px 1343px #FFF, 678px 729px #FFF, 1910px 1831px #FFF, 148px 1322px #FFF, 518px 1077px #FFF, 1443px 1438px #FFF, 1663px 1615px #FFF, 820px 629px #FFF, 1928px 1332px #FFF, 1430px 1580px #FFF, 1235px 727px #FFF, 271px 1540px #FFF, 170px 231px #FFF, 1203px 1162px #FFF, 586px 1779px #FFF, 1466px 1630px #FFF, 1718px 657px #FFF, 1302px 1622px #FFF, 65px 1344px #FFF, 1276px 1362px #FFF, 155px 1095px #FFF, 890px 1370px #FFF, 472px 27px #FFF, 1746px 778px #FFF, 95px 616px #FFF, 1734px 37px #FFF, 491px 594px #FFF, 330px 689px #FFF, 1555px 476px #FFF, 1209px 1789px #FFF, 235px 1650px #FFF, 1216px 1437px #FFF, 1784px 1767px #FFF, 625px 820px #FFF, 1258px 1741px #FFF, 1105px 434px #FFF, 1004px 160px #FFF, 1074px 371px #FFF, 153px 1402px #FFF, 1536px 1543px #FFF, 1483px 1313px #FFF, 497px 1749px #FFF, 1159px 1664px #FFF, 129px 846px #FFF, 499px 150px #FFF, 836px 1578px #FFF, 348px 1882px #FFF, 1496px 1812px #FFF, 1434px 176px #FFF, 393px 241px #FFF, 165px 545px #FFF, 752px 1776px #FFF, 1921px 1586px #FFF, 1817px 598px #FFF, 975px 925px #FFF, 497px 1206px #FFF, 820px 417px #FFF, 1637px 714px #FFF, 318px 1200px #FFF, 1249px 522px #FFF, 1871px 75px #FFF, 1070px 1074px #FFF, 659px 1380px #FFF, 1884px 495px #FFF, 1140px 1685px #FFF, 1411px 720px #FFF, 338px 803px #FFF, 1345px 793px #FFF, 319px 1141px #FFF, 697px 595px #FFF, 740px 1946px #FFF, 1387px 602px #FFF, 1457px 1995px #FFF, 1517px 1840px #FFF, 673px 1039px #FFF, 541px 1958px #FFF, 2000px 701px #FFF, 407px 1033px #FFF, 865px 1572px #FFF, 1540px 1999px #FFF, 1361px 1872px #FFF, 1155px 1700px #FFF, 386px 341px #FFF, 221px 1567px #FFF, 730px 1429px #FFF, 916px 336px #FFF, 226px 1693px #FFF, 1680px 1148px #FFF, 1561px 1289px #FFF, 1289px 1399px #FFF, 1383px 849px #FFF, 1100px 945px #FFF, 724px 8px #FFF, 1763px 1734px #FFF, 1915px 1194px #FFF, 718px 923px #FFF, 806px 1456px #FFF, 364px 1640px #FFF, 651px 1756px #FFF, 1628px 132px #FFF, 86px 839px #FFF, 1982px 1830px #FFF, 778px 364px #FFF, 1665px 473px #FFF, 1605px 303px #FFF, 1043px 206px #FFF, 757px 160px #FFF, 1849px 1911px #FFF, 636px 1242px #FFF, 937px 1684px #FFF, 1700px 1992px #FFF, 1898px 481px #FFF, 1109px 1413px #FFF, 555px 339px #FFF, 466px 887px #FFF, 209px 217px #FFF, 1673px 1137px #FFF, 162px 543px #FFF, 715px 1331px #FFF, 1384px 355px #FFF, 69px 723px #FFF, 1845px 1510px #FFF, 1241px 1059px #FFF, 1893px 371px #FFF, 1995px 1547px #FFF, 563px 815px #FFF, 1079px 1715px #FFF, 385px 1341px #FFF, 1793px 1524px #FFF, 1050px 1196px #FFF, 1196px 582px #FFF, 286px 1050px #FFF, 744px 145px #FFF, 1559px 686px #FFF, 818px 368px #FFF, 889px 1723px #FFF, 1337px 1274px #FFF, 1210px 1777px #FFF, 970px 529px #FFF, 1102px 563px #FFF, 1389px 1176px #FFF, 930px 1340px #FFF, 265px 1469px #FFF, 157px 298px #FFF, 987px 1384px #FFF, 1679px 1909px #FFF, 1268px 343px #FFF, 1695px 1081px #FFF, 755px 250px #FFF, 22px 1084px #FFF, 1298px 1706px #FFF, 1367px 578px #FFF, 43px 1515px #FFF, 1718px 1249px #FFF, 1586px 1909px #FFF, 531px 226px #FFF, 586px 768px #FFF, 1843px 1892px #FFF, 1681px 1801px #FFF, 1839px 26px #FFF, 231px 1392px #FFF, 1275px 879px #FFF, 1195px 551px #FFF, 741px 780px #FFF, 302px 948px #FFF, 442px 1805px #FFF, 586px 998px #FFF, 525px 210px #FFF, 1174px 1822px #FFF, 986px 1421px #FFF, 599px 1431px #FFF, 1423px 41px #FFF, 175px 532px #FFF, 1353px 851px #FFF, 1861px 992px #FFF, 1084px 655px #FFF, 1788px 904px #FFF, 769px 368px #FFF, 844px 1488px #FFF, 1654px 33px #FFF, 1114px 1677px #FFF, 1121px 384px #FFF, 1909px 1827px #FFF, 154px 1155px #FFF, 85px 44px #FFF, 1053px 1032px #FFF, 1662px 1640px #FFF, 367px 1047px #FFF, 429px 347px #FFF, 308px 1731px #FFF, 1329px 1718px #FFF, 759px 1792px #FFF, 1628px 1845px #FFF, 639px 1205px #FFF, 353px 1892px #FFF, 1141px 209px #FFF, 938px 1478px #FFF, 1118px 967px #FFF, 994px 1068px #FFF, 336px 1038px #FFF, 1864px 1211px #FFF, 371px 1898px #FFF, 1097px 543px #FFF, 338px 1812px #FFF, 366px 300px #FFF, 1125px 562px #FFF, 364px 565px #FFF, 37px 1202px #FFF, 1253px 620px #FFF, 1158px 1854px #FFF, 1912px 1988px #FFF, 1165px 2000px #FFF, 1848px 1446px #FFF, 514px 1496px #FFF, 1663px 1461px #FFF, 845px 481px #FFF, 1621px 1757px #FFF, 225px 397px #FFF, 1672px 804px #FFF, 939px 529px #FFF, 1814px 1163px #FFF, 898px 1511px #FFF, 1381px 760px #FFF, 1689px 355px #FFF, 361px 855px #FFF, 1777px 1016px #FFF, 177px 558px #FFF, 1109px 1851px #FFF, 1034px 1204px #FFF, 856px 1602px #FFF, 1850px 558px #FFF, 131px 763px #FFF, 1984px 941px #FFF, 1603px 717px #FFF, 1975px 1710px #FFF, 1960px 669px #FFF, 945px 1859px #FFF, 1301px 315px #FFF, 254px 1522px #FFF, 1472px 1122px #FFF, 1215px 1731px #FFF, 965px 332px #FFF, 215px 1964px #FFF, 965px 536px #FFF, 711px 1119px #FFF, 1337px 1664px #FFF, 1814px 954px #FFF, 376px 1168px #FFF, 926px 1535px #FFF, 1123px 735px #FFF, 1615px 1359px #FFF, 1573px 363px #FFF, 1599px 1555px #FFF, 1811px 642px #FFF, 1397px 477px #FFF, 1648px 1965px #FFF, 314px 736px #FFF, 764px 703px #FFF, 1510px 1281px #FFF, 789px 1639px #FFF, 573px 1356px #FFF, 1346px 974px #FFF, 634px 1860px #FFF, 954px 1824px #FFF, 1677px 1273px #FFF, 1247px 1238px #FFF, 316px 1133px #FFF, 1232px 682px #FFF, 597px 1050px #FFF, 1738px 891px #FFF, 1339px 1528px #FFF, 246px 1728px #FFF, 1098px 921px #FFF, 1916px 1533px #FFF, 1599px 161px #FFF, 591px 394px #FFF, 513px 1912px #FFF, 339px 1923px #FFF, 591px 552px #FFF, 956px 1686px #FFF, 722px 1448px #FFF, 1718px 886px #FFF, 130px 105px #FFF, 784px 934px #FFF, 1637px 1903px #FFF, 204px 870px #FFF, 1470px 1964px #FFF, 415px 616px #FFF, 339px 1097px #FFF, 714px 1894px #FFF, 1381px 561px #FFF, 1284px 546px #FFF, 1443px 1208px #FFF, 923px 880px #FFF, 1627px 1681px #FFF, 1832px 684px #FFF, 1564px 1257px #FFF, 88px 1261px #FFF, 725px 410px #FFF, 1162px 1004px #FFF, 255px 1749px #FFF, 786px 16px #FFF, 895px 9px #FFF, 1489px 1366px #FFF;
    }

    #stars2 {
        width: 2px;
        height: 2px;
        background: transparent;
        box-shadow: 1092px 1566px #FFF, 1643px 296px #FFF, 1046px 225px #FFF, 460px 272px #FFF, 70px 1224px #FFF, 16px 128px #FFF, 841px 616px #FFF, 1806px 286px #FFF, 1267px 69px #FFF, 409px 1571px #FFF, 616px 942px #FFF, 352px 558px #FFF, 141px 818px #FFF, 196px 1285px #FFF, 683px 645px #FFF, 1102px 836px #FFF, 1775px 1485px #FFF, 436px 1208px #FFF, 450px 847px #FFF, 538px 1092px #FFF, 348px 1859px #FFF, 926px 1508px #FFF, 1968px 905px #FFF, 4px 1405px #FFF, 229px 1342px #FFF, 1677px 1376px #FFF, 714px 352px #FFF, 216px 31px #FFF, 1182px 742px #FFF, 1785px 848px #FFF, 382px 57px #FFF, 845px 1771px #FFF, 1598px 398px #FFF, 1868px 1384px #FFF, 497px 1661px #FFF, 177px 1532px #FFF, 1059px 682px #FFF, 734px 85px #FFF, 843px 942px #FFF, 914px 1253px #FFF, 1447px 811px #FFF, 531px 963px #FFF, 1086px 1177px #FFF, 1226px 1145px #FFF, 1874px 1133px #FFF, 1280px 531px #FFF, 695px 937px #FFF, 260px 1507px #FFF, 1320px 133px #FFF, 436px 346px #FFF, 763px 1981px #FFF, 359px 254px #FFF, 1809px 1109px #FFF, 473px 1646px #FFF, 1911px 1791px #FFF, 1649px 1846px #FFF, 956px 307px #FFF, 417px 465px #FFF, 326px 517px #FFF, 599px 1903px #FFF, 1934px 1253px #FFF, 390px 1600px #FFF, 1462px 1373px #FFF, 638px 377px #FFF, 484px 327px #FFF, 780px 1850px #FFF, 1046px 831px #FFF, 986px 156px #FFF, 157px 1901px #FFF, 1165px 593px #FFF, 1716px 628px #FFF, 711px 19px #FFF, 115px 1985px #FFF, 632px 1704px #FFF, 467px 1290px #FFF, 1699px 1015px #FFF, 1607px 238px #FFF, 251px 1515px #FFF, 568px 1381px #FFF, 1118px 79px #FFF, 1648px 1690px #FFF, 258px 100px #FFF, 138px 1812px #FFF, 1721px 920px #FFF, 997px 1590px #FFF, 1542px 1842px #FFF, 23px 1940px #FFF, 503px 1117px #FFF, 620px 1274px #FFF, 445px 1277px #FFF, 1707px 1898px #FFF, 1415px 1514px #FFF, 103px 1588px #FFF, 383px 959px #FFF, 1090px 1171px #FFF, 1187px 1449px #FFF, 805px 768px #FFF, 1296px 263px #FFF, 1094px 122px #FFF, 1819px 1654px #FFF, 1151px 839px #FFF, 1611px 176px #FFF, 971px 1097px #FFF, 1897px 1915px #FFF, 729px 1207px #FFF, 1938px 1644px #FFF, 881px 1419px #FFF, 429px 1039px #FFF, 856px 816px #FFF, 1441px 1415px #FFF, 153px 1004px #FFF, 1841px 1330px #FFF, 1717px 84px #FFF, 361px 365px #FFF, 463px 526px #FFF, 1795px 142px #FFF, 213px 526px #FFF, 46px 1200px #FFF, 1067px 1285px #FFF, 523px 1033px #FFF, 1074px 1714px #FFF, 1764px 1849px #FFF, 1540px 1339px #FFF, 294px 1102px #FFF, 1594px 1351px #FFF, 227px 998px #FFF, 533px 1972px #FFF, 1072px 1956px #FFF, 1972px 313px #FFF, 1226px 1314px #FFF, 564px 426px #FFF, 1587px 600px #FFF, 1847px 1747px #FFF, 539px 1421px #FFF, 1732px 668px #FFF, 398px 1390px #FFF, 102px 907px #FFF, 204px 737px #FFF, 1915px 345px #FFF, 1562px 1031px #FFF, 1452px 1559px #FFF, 1020px 1020px #FFF, 95px 1963px #FFF, 1465px 212px #FFF, 954px 474px #FFF, 821px 107px #FFF, 821px 1363px #FFF, 1140px 702px #FFF, 1170px 868px #FFF, 1100px 872px #FFF, 1959px 546px #FFF, 210px 238px #FFF, 1462px 1434px #FFF, 65px 665px #FFF, 648px 1317px #FFF, 230px 473px #FFF, 650px 1042px #FFF, 845px 1123px #FFF, 393px 1793px #FFF, 423px 59px #FFF, 562px 1753px #FFF, 409px 1064px #FFF, 1599px 408px #FFF, 1075px 747px #FFF, 986px 1990px #FFF, 1741px 1387px #FFF, 436px 1418px #FFF, 1175px 1324px #FFF, 1129px 1205px #FFF, 1937px 339px #FFF, 193px 1610px #FFF, 1841px 1862px #FFF, 384px 1841px #FFF, 1810px 4px #FFF, 1204px 653px #FFF, 1504px 1710px #FFF, 1038px 1586px #FFF, 1837px 276px #FFF, 1704px 690px #FFF, 1173px 506px #FFF, 196px 127px #FFF, 794px 1790px #FFF, 1056px 1219px #FFF, 1487px 512px #FFF, 206px 228px #FFF, 1989px 1954px #FFF, 1493px 1660px #FFF, 685px 61px #FFF, 1043px 1422px #FFF, 1458px 568px #FFF, 433px 70px #FFF, 1920px 1642px #FFF, 569px 722px #FFF, 1287px 1723px #FFF, 1585px 1836px #FFF, 1057px 1444px #FFF, 754px 1687px #FFF, 562px 1430px #FFF, 546px 810px #FFF, 949px 873px #FFF;
        animation: animStar 100s linear infinite;
    }

    #stars2:after {
        content: " ";
        position: absolute;
        top:2000px;
        width: 2px;
        height: 2px;
        background: transparent;
        box-shadow: 1092px 1566px #FFF, 1643px 296px #FFF, 1046px 225px #FFF, 460px 272px #FFF, 70px 1224px #FFF, 16px 128px #FFF, 841px 616px #FFF, 1806px 286px #FFF, 1267px 69px #FFF, 409px 1571px #FFF, 616px 942px #FFF, 352px 558px #FFF, 141px 818px #FFF, 196px 1285px #FFF, 683px 645px #FFF, 1102px 836px #FFF, 1775px 1485px #FFF, 436px 1208px #FFF, 450px 847px #FFF, 538px 1092px #FFF, 348px 1859px #FFF, 926px 1508px #FFF, 1968px 905px #FFF, 4px 1405px #FFF, 229px 1342px #FFF, 1677px 1376px #FFF, 714px 352px #FFF, 216px 31px #FFF, 1182px 742px #FFF, 1785px 848px #FFF, 382px 57px #FFF, 845px 1771px #FFF, 1598px 398px #FFF, 1868px 1384px #FFF, 497px 1661px #FFF, 177px 1532px #FFF, 1059px 682px #FFF, 734px 85px #FFF, 843px 942px #FFF, 914px 1253px #FFF, 1447px 811px #FFF, 531px 963px #FFF, 1086px 1177px #FFF, 1226px 1145px #FFF, 1874px 1133px #FFF, 1280px 531px #FFF, 695px 937px #FFF, 260px 1507px #FFF, 1320px 133px #FFF, 436px 346px #FFF, 763px 1981px #FFF, 359px 254px #FFF, 1809px 1109px #FFF, 473px 1646px #FFF, 1911px 1791px #FFF, 1649px 1846px #FFF, 956px 307px #FFF, 417px 465px #FFF, 326px 517px #FFF, 599px 1903px #FFF, 1934px 1253px #FFF, 390px 1600px #FFF, 1462px 1373px #FFF, 638px 377px #FFF, 484px 327px #FFF, 780px 1850px #FFF, 1046px 831px #FFF, 986px 156px #FFF, 157px 1901px #FFF, 1165px 593px #FFF, 1716px 628px #FFF, 711px 19px #FFF, 115px 1985px #FFF, 632px 1704px #FFF, 467px 1290px #FFF, 1699px 1015px #FFF, 1607px 238px #FFF, 251px 1515px #FFF, 568px 1381px #FFF, 1118px 79px #FFF, 1648px 1690px #FFF, 258px 100px #FFF, 138px 1812px #FFF, 1721px 920px #FFF, 997px 1590px #FFF, 1542px 1842px #FFF, 23px 1940px #FFF, 503px 1117px #FFF, 620px 1274px #FFF, 445px 1277px #FFF, 1707px 1898px #FFF, 1415px 1514px #FFF, 103px 1588px #FFF, 383px 959px #FFF, 1090px 1171px #FFF, 1187px 1449px #FFF, 805px 768px #FFF, 1296px 263px #FFF, 1094px 122px #FFF, 1819px 1654px #FFF, 1151px 839px #FFF, 1611px 176px #FFF, 971px 1097px #FFF, 1897px 1915px #FFF, 729px 1207px #FFF, 1938px 1644px #FFF, 881px 1419px #FFF, 429px 1039px #FFF, 856px 816px #FFF, 1441px 1415px #FFF, 153px 1004px #FFF, 1841px 1330px #FFF, 1717px 84px #FFF, 361px 365px #FFF, 463px 526px #FFF, 1795px 142px #FFF, 213px 526px #FFF, 46px 1200px #FFF, 1067px 1285px #FFF, 523px 1033px #FFF, 1074px 1714px #FFF, 1764px 1849px #FFF, 1540px 1339px #FFF, 294px 1102px #FFF, 1594px 1351px #FFF, 227px 998px #FFF, 533px 1972px #FFF, 1072px 1956px #FFF, 1972px 313px #FFF, 1226px 1314px #FFF, 564px 426px #FFF, 1587px 600px #FFF, 1847px 1747px #FFF, 539px 1421px #FFF, 1732px 668px #FFF, 398px 1390px #FFF, 102px 907px #FFF, 204px 737px #FFF, 1915px 345px #FFF, 1562px 1031px #FFF, 1452px 1559px #FFF, 1020px 1020px #FFF, 95px 1963px #FFF, 1465px 212px #FFF, 954px 474px #FFF, 821px 107px #FFF, 821px 1363px #FFF, 1140px 702px #FFF, 1170px 868px #FFF, 1100px 872px #FFF, 1959px 546px #FFF, 210px 238px #FFF, 1462px 1434px #FFF, 65px 665px #FFF, 648px 1317px #FFF, 230px 473px #FFF, 650px 1042px #FFF, 845px 1123px #FFF, 393px 1793px #FFF, 423px 59px #FFF, 562px 1753px #FFF, 409px 1064px #FFF, 1599px 408px #FFF, 1075px 747px #FFF, 986px 1990px #FFF, 1741px 1387px #FFF, 436px 1418px #FFF, 1175px 1324px #FFF, 1129px 1205px #FFF, 1937px 339px #FFF, 193px 1610px #FFF, 1841px 1862px #FFF, 384px 1841px #FFF, 1810px 4px #FFF, 1204px 653px #FFF, 1504px 1710px #FFF, 1038px 1586px #FFF, 1837px 276px #FFF, 1704px 690px #FFF, 1173px 506px #FFF, 196px 127px #FFF, 794px 1790px #FFF, 1056px 1219px #FFF, 1487px 512px #FFF, 206px 228px #FFF, 1989px 1954px #FFF, 1493px 1660px #FFF, 685px 61px #FFF, 1043px 1422px #FFF, 1458px 568px #FFF, 433px 70px #FFF, 1920px 1642px #FFF, 569px 722px #FFF, 1287px 1723px #FFF, 1585px 1836px #FFF, 1057px 1444px #FFF, 754px 1687px #FFF, 562px 1430px #FFF, 546px 810px #FFF, 949px 873px #FFF;
    }

    #stars3 {
        width: 3px;
        height: 3px;
        background: transparent;
        box-shadow: 1180px 1334px red, 907px 975px #FFF, 1958px 606px #FFF, 1355px 1235px #FFF, 870px 1742px #FFF, 1821px 1309px #FFF, 250px 123px #FFF, 660px 280px #FFF, 1741px 1070px #FFF, 447px 1308px #FFF, 983px 1507px #FFF, 351px 1240px #FFF, 877px 1646px #FFF, 1083px 1087px #FFF, 560px 663px #FFF, 598px 1281px #FFF, 240px 1455px #FFF, 1701px 1933px #FFF, 1759px 1940px #FFF, 858px 279px #FFF, 856px 1296px #FFF, 1192px 1586px #FFF, 915px 1883px #FFF, 1109px 353px #FFF, 1595px 37px #FFF, 1115px 110px #FFF, 1768px 1798px #FFF, 1726px 386px #FFF, 1479px 610px #FFF, 907px 1703px #FFF, 222px 23px #FFF, 191px 759px #FFF, 850px 1295px #FFF, 1828px 364px #FFF, 333px 1423px #FFF, 27px 137px #FFF, 371px 1444px #FFF, 429px 1328px #FFF, 1894px 1820px #FFF, 1095px 1099px #FFF, 471px 1991px #FFF, 1149px 10px #FFF, 264px 1257px #FFF, 1171px 1798px #FFF, 1477px 1686px #FFF, 1338px 932px #FFF, 1909px 1264px #FFF, 349px 1782px #FFF, 1930px 271px #FFF, 696px 442px #FFF, 906px 474px #FFF, 1660px 1526px #FFF, 652px 1292px #FFF, 561px 542px #FFF, 1132px 773px #FFF, 577px 1084px #FFF, 1911px 641px #FFF, 1494px 1541px #FFF, 1414px 437px #FFF, 1726px 1975px #FFF, 1890px 1054px #FFF, 781px 1293px #FFF, 761px 1336px #FFF, 1408px 1453px #FFF, 604px 1112px #FFF, 1511px 348px #FFF, 279px 48px #FFF, 307px 1808px #FFF, 1460px 919px #FFF, 623px 1355px #FFF, 903px 1961px #FFF, 1123px 862px #FFF, 139px 963px #FFF, 393px 1116px #FFF, 932px 1756px #FFF, 260px 218px #FFF, 650px 1646px #FFF, 1078px 1809px #FFF, 243px 163px #FFF, 1676px 1534px #FFF, 1619px 929px #FFF, 1886px 921px #FFF, 1518px 1509px #FFF, 1577px 549px #FFF, 1125px 1663px #FFF, 507px 1063px #FFF, 1751px 1233px #FFF, 1471px 190px #FFF, 1574px 563px #FFF, 1204px 1904px #FFF, 773px 831px #FFF, 1868px 19px #FFF, 206px 1606px #FFF, 412px 447px #FFF, 1607px 1736px #FFF, 1768px 898px #FFF, 907px 1111px #FFF, 1302px 282px #FFF, 38px 1765px #FFF, 1224px 172px #FFF;
        animation: animStar 150s linear infinite;
    }

    #stars3:after {
        content: " ";
        position: absolute;
        top: 2000px;
        width: 3px;
        height: 3px;
        background: transparent;
        box-shadow: 1180px 1334px #FFF, 907px 975px #FFF, 1958px 606px #FFF, 1355px 1235px #FFF, 870px 1742px #FFF, 1821px 1309px #FFF, 250px 123px #FFF, 660px 280px #FFF, 1741px 1070px #FFF, 447px 1308px #FFF, 983px 1507px #FFF, 351px 1240px #FFF, 877px 1646px #FFF, 1083px 1087px #FFF, 560px 663px #FFF, 598px 1281px #FFF, 240px 1455px #FFF, 1701px 1933px #FFF, 1759px 1940px #FFF, 858px 279px #FFF, 856px 1296px #FFF, 1192px 1586px #FFF, 915px 1883px #FFF, 1109px 353px #FFF, 1595px 37px #FFF, 1115px 110px #FFF, 1768px 1798px #FFF, 1726px 386px #FFF, 1479px 610px #FFF, 907px 1703px #FFF, 222px 23px #FFF, 191px 759px #FFF, 850px 1295px #FFF, 1828px 364px #FFF, 333px 1423px #FFF, 27px 137px #FFF, 371px 1444px #FFF, 429px 1328px #FFF, 1894px 1820px #FFF, 1095px 1099px #FFF, 471px 1991px #FFF, 1149px 10px #FFF, 264px 1257px #FFF, 1171px 1798px #FFF, 1477px 1686px #FFF, 1338px 932px #FFF, 1909px 1264px #FFF, 349px 1782px #FFF, 1930px 271px #FFF, 696px 442px #FFF, 906px 474px #FFF, 1660px 1526px #FFF, 652px 1292px #FFF, 561px 542px #FFF, 1132px 773px #FFF, 577px 1084px #FFF, 1911px 641px #FFF, 1494px 1541px #FFF, 1414px 437px #FFF, 1726px 1975px #FFF, 1890px 1054px #FFF, 781px 1293px #FFF, 761px 1336px #FFF, 1408px 1453px #FFF, 604px 1112px #FFF, 1511px 348px #FFF, 279px 48px #FFF, 307px 1808px #FFF, 1460px 919px #FFF, 623px 1355px #FFF, 903px 1961px #FFF, 1123px 862px #FFF, 139px 963px #FFF, 393px 1116px #FFF, 932px 1756px #FFF, 260px 218px #FFF, 650px 1646px #FFF, 1078px 1809px #FFF, 243px 163px #FFF, 1676px 1534px #FFF, 1619px 929px #FFF, 1886px 921px #FFF, 1518px 1509px #FFF, 1577px 549px #FFF, 1125px 1663px #FFF, 507px 1063px #FFF, 1751px 1233px #FFF, 1471px 190px #FFF, 1574px 563px #FFF, 1204px 1904px #FFF, 773px 831px #FFF, 1868px 19px #FFF, 206px 1606px #FFF, 412px 447px #FFF, 1607px 1736px #FFF, 1768px 898px #FFF, 907px 1111px #FFF, 1302px 282px #FFF, 38px 1765px #FFF, 1224px 172px #FFF;
    }
    @keyframes animStar {
        from {
            transform: translateY(0px);
        }
        to {
            transform: translateY(-2000px);
        }
    }
    /*************************************************************/
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px rgba(0,0,0,.1);
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }

</style>