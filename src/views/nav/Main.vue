<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="6" v-for="o in 4" :key="o" class="chart-row">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>卡片名称</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="circleChart" :style="{width: '300px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="gaugeChart" :style="{width: '300px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="ringPieChart" :style="{width: '400px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="roseChart" :style="{width: '400px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="24" class="chart-row">
                <el-card class="box-card">
                    <div id="lineChart" :style="{width: '900px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="smoothLineChart" :style="{width: '400px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="areaLineChart" :style="{width: '400px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="24" class="chart-row">
                <el-card class="box-card">
                    <div id="seriesRingPieChart" :style="{width: '900px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="multiBarChart" :style="{width: '400px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="barChart" :style="{width: '400px', height: '300px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="noBarChart" :style="{width: '400px', height: '400px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="chart-row">
                <el-card class="box-card">
                    <div id="tBarChart" :style="{width: '400px', height: '400px', align: 'center'}"></div>
                </el-card>
            </el-col>
            <el-col :span="12" v-for="o in 2" :key="o" class="chart-row">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>卡片名称</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echartsUtil from '../../common/js/echartsUtil'
    export default {
        data() {
            return {
                secretId:'',
                secretKey:''
            }
        },

        mounted: function () {
            var secret = sessionStorage.getItem('secret');
            if (secret!==null) {
                secret = JSON.parse(secret);
                console.log(secret)
                this.secretId = secret.secretId;
                this.secretKey = secret.secretKey;
                this.drawCircle(80,200, '停车场使用量');
                this.drawGauge(0.87);
                this.initRose();
                this.drawRingPie();
                this.drawSeriesRingPie();
                this.drawLine();
                this.drawMultiBar();
                this.drawBar();
                this.drawNoBar();
                this.drawTBar();
                this.drawSmoothLine();
                this.drawAreaLine();
            }
        },

        methods: {
            drawRingPie(){
                var data = [
                    {value:335, name:'天涯区'},
                    {value:310, name:'吉阳区'},
                    {value:234, name:'海棠区'}
                ];
                let ringPieChart = this.$echarts.init(document.getElementById('ringPieChart'));
                echartsUtil.drawRingPie(ringPieChart, data, '各区旅游饭店数量');
            },
            drawSeriesRingPie(){
                var datas =
                    {
                        '天涯区':[
                            {value:335, name:'豪华'},
                            {value:310, name:'高档'},
                            {value:134, name:'其他'}
                        ],'吉阳区':[
                            {value:335, name:'豪华'},
                            {value:310, name:'高档'},
                            {value:334, name:'其他'}
                        ],'海棠区':[
                            {value:335, name:'豪华'},
                            {value:310, name:'高档'},
                            {value:634, name:'其他'}
                        ],'崖州区':[
                            {value:335, name:'豪华'},
                            {value:310, name:'高档'},
                            {value:934, name:'其他'}
                        ]
                    };
                let seriesRingPieChart = this.$echarts.init(document.getElementById('seriesRingPieChart'));
                echartsUtil.drawSeriesRingPie(seriesRingPieChart, datas, '各区旅游饭店数量（单位：家）');
            },
            initRose(){
                var data = [
                    {value:24, name:'五星'},
                    {value:37, name:'四星'},
                    {value:61, name:'三星'},
                    {value:197, name:'其他旅店'}
                ];
                this.drawRose(data);
            },
            drawRose(data){
                // 基于准备好的dom，初始化echarts实例
                let roseChart = this.$echarts.init(document.getElementById('roseChart'));
                // 绘制图表
                echartsUtil.drawRose(roseChart, data, '全市旅游饭店数量：');
            },
            drawGauge(rate){
                // 基于准备好的dom，初始化echarts实例
                let gaugeChart = this.$echarts.init(document.getElementById('gaugeChart'));
                // 绘制图表
                echartsUtil.drawGauge(gaugeChart, rate, '游客拥挤度指数');
            },
            drawCircle(used,total,title){
                var rate = used/total;
                var rateStr = rate*100+'%';
                var rates = [];
                rates.push(rate);
                // 基于准备好的dom，初始化echarts实例
                let circleChart = this.$echarts.init(document.getElementById('circleChart'));
                // 绘制图表
                echartsUtil.drawCircle(circleChart,rates,title,rateStr,used + '/' + total, '停车场及交通指数');
            },
            drawLine(){
                var data = [
                    {
                        name:'2017',
                        value: {
                            '1月': 663,
                            '2月': 433,
                            '3月': 500,
                            '4月': 1243,
                            '5月': 933,
                            '6月': 590,
                            '7月': 1203,
                            '8月': 433,
                            '9月': 550,
                            '10月': 403,
                            '11月': 833,
                            '12月': 750,
                        }
                    },{
                        name:'2018',
                        value: {
                            '1月': 963,
                            '2月': 1033,
                            '3月': 1100,
                            '4月': 743,
                            '5月': 933,
                            '6月': 890,
                            '7月': 1293,
                            '8月': 733,
                            '9月': 880,
                            '10月': 1003,
                            '11月': 1233,
                            '12月': 1450,
                        }
                    }
                ];
                let lineChart = this.$echarts.init(document.getElementById('lineChart'));
                // 绘制图表
                echartsUtil.drawLine(lineChart, data, '2017/2018年每月酒店国内游客入住人数');
            },
            drawSmoothLine(){
                var data = [
                    {value:24, name:'0:00'},
                    {value:37, name:'2:00'},
                    {value:61, name:'4:00'},
                    {value:197, name:'6:00'},
                    {value:24, name:'8:00'},
                    {value:37, name:'10:00'},
                    {value:61, name:'12:00'},
                    {value:197, name:'14:00'},
                    {value:24, name:'16:00'},
                    {value:37, name:'18:00'},
                    {value:61, name:'20:00'},
                    {value:197, name:'22:00'}
                ];
                let smoothLineChart = this.$echarts.init(document.getElementById('smoothLineChart'));
                // 绘制图表
                echartsUtil.drawSmoothLine(smoothLineChart, data, '海水水位高低值（单位：米）', false);
            },
            drawAreaLine(){
                var data = [
                    {value:24, name:'0:00'},
                    {value:37, name:'2:00'},
                    {value:61, name:'4:00'},
                    {value:197, name:'6:00'},
                    {value:24, name:'8:00'},
                    {value:37, name:'10:00'},
                    {value:61, name:'12:00'},
                    {value:197, name:'14:00'},
                    {value:24, name:'16:00'},
                    {value:37, name:'18:00'},
                    {value:61, name:'20:00'},
                    {value:197, name:'22:00'}
                ];
                let areaLineChart = this.$echarts.init(document.getElementById('areaLineChart'));
                // 绘制图表
                echartsUtil.drawSmoothLine(areaLineChart, data, '海水水位高低值（单位：米）', true);
            },
            drawMultiBar(){
                var data = [
                    {
                        name:'人均天消费',
                        // value:[320, 532, 901]
                        value: {
                            '2016': 2403,
                            '2017': 4233,
                            '2018': 5500
                        }
                    },{
                        name:'人均停留天数',
                        value: {
                            '2016': 40,
                            '2017': 53,
                            '2018': 66
                        }
                    }
                ];
                let multiBarChart = this.$echarts.init(document.getElementById('multiBarChart'));
                // 绘制图表
                echartsUtil.drawMultiBar(multiBarChart, data, '最近三年春节黄金周人均停留及消费情况', false);
            },
            drawBar(){
                var data = {
                    '吉阳区': 403,
                    '天涯区': 533,
                    '海棠区': 312,
                    '崖州区': 450
                };
                let barChart = this.$echarts.init(document.getElementById('barChart'));
                // 绘制图表
                echartsUtil.drawBar(barChart, data, '昨日各行政海鲜排档销售金额（单位：万元）');
            },
            drawNoBar(){
                var data = {
                    '三亚市火车头海鲜广场': 150,
                    '三亚聚贤阁渔村': 250,
                    '三亚东海龙宫美食城': 350,
                    '三亚妙清海鲜酒楼': 450,
                    '三亚资金盛宴大酒店': 550,
                    '南中国海鲜广场': 650,
                    '亚龙湾中心广场': 750,
                    '海棠湾68海鲜广场': 850,
                    '水稻公园海鲜广场': 950,
                    '亚龙湾奥特莱斯海鲜广场': 1000
                };
                let noBarChart = this.$echarts.init(document.getElementById('noBarChart'));
                // 绘制图表
                echartsUtil.drawNoBar(noBarChart, data, '本月海鲜排档消费TOP10（单位：万元）');
            },
            drawTBar(){
                var data = {
                    '公交车': 403,
                    '出租车': 533,
                    '滴滴专车': 312,
                    '神州专车': 450,
                    '新能源租赁汽车': 550
                };
                let tBarChart = this.$echarts.init(document.getElementById('tBarChart'));
                // 绘制图表
                echartsUtil.drawTBar(tBarChart, data, '公共交通工具实时在线统计');
            },
        }
    }

</script>

<style scoped>

    .chart-container {
        width: 100%;
        float: left;
        background: #f0f2f5;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        /*padding: 30px 20px;*/
    }
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .chart-row {
        margin-bottom: 20px;
    }
    .box-card {
        border: none;
        box-shadow: none;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-right: 20px;
    }

</style>
