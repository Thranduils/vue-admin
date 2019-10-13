import liquidFill from '../../common/echarts-liquidfill/dist/echarts-liquidfill.js'
import echarts from 'echarts'

var DEGREE_CROWDING = [20,40,60,80];
var COLOR = ['#50a0ff', '#44cc52', '#ffb033', '#ff00f3', '#ff3820', '#6f55f9'];
export default {
    drawCircle: function (circleChart, rates, topLab, cenLab, botLab, title) {
        circleChart.setOption({
            title: {
                text: title,
                top: 'top',
                left: 'left',
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                },
            },
            series: [{
                type: 'liquidFill',
                name: 'Liquid Fill',
                data: rates,
                radius: '60%',
                label: {
                    normal: {
                        formatter: topLab,
                    },
                    color: '#444',
                    insideColor: '#fff',
                    fontSize: 14,
                    baseline: 'middle',
                    position: ['50%', '20%']
                }
            }, {
                type: 'liquidFill',
                data: rates,
                radius: '60%',
                label: {
                    normal: {
                        formatter: cenLab
                    },
                    fontSize: 28,
                    position: ['50%', '40%']
                }
            }, {
                type: 'liquidFill',
                data: rates,
                radius: '60%',
                label: {
                    normal: {
                        formatter: botLab
                    },
                    color: '#444',
                    insideColor: '#fff',
                    fontSize: 14,
                    baseline: 'middle',
                    position: ['50%', '80%']
                }
            },]
        });
    },
    drawGauge: function (gaugeChart, rate, title) {
        var _rate = rate * 100;
        // 绘制图表
        let option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            title: {
                text: title,
                top: 'top',
                left: 'left',
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                },
            },
            series: [
                {
                    name: title,
                    type: 'gauge',
                    radius: '60%',
                    min: 0,
                    max: 100,
                    startAngle: 135,
                    endAngle: 45,
                    splitNumber: 2,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 8,
                            color: [[rate, '#50a0ff'], [1, '#cccccc']]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 1,
                        length: 1,      // 属性length控制线长
                        lineStyle: {        // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        interval: 2,//坐标轴分割间隔
                        distance: 10, //文字离表盘的距离
                        textStyle: {       // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 10
                        },
                        formatter: function (value) {
                            switch (value) {
                                case DEGREE_CROWDING[0] :
                                    return '优';
                                case DEGREE_CROWDING[1] :
                                    return '良';
                                case DEGREE_CROWDING[2] :
                                    return '中';
                                case DEGREE_CROWDING[3] :
                                    return '差';
                            }
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 15,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width: 3,
                            color: '#50a0ff'
                        },
                        show: true,
                        interval: 2,//坐标轴分割间隔
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: false
                    }
                },
                {
                    name: title,
                    type: 'gauge',
                    radius: '60%',
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 8,
                            color: [[rate, '#50a0ff'], [1, '#cccccc']]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 1,
                        length: 1,      // 属性length控制线长
                        lineStyle: {        // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        interval: 2,//坐标轴分割间隔
                        distance: 10, //文字离表盘的距离
                        textStyle: {       // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            color: '#bbb'
                        },
                        formatter: function (value) {
                            switch (value) {
                                case DEGREE_CROWDING[0] :
                                    return '优';
                                case DEGREE_CROWDING[1] :
                                    return '良';
                                case DEGREE_CROWDING[2] :
                                    return '中';
                                case DEGREE_CROWDING[3] :
                                    return '差';
                            }
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 15,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width: 3,
                            color: '#50a0ff'
                        },
                        show: false
                    },

                    pointer: {
                        width: 5,
                        length: '60%',
                        color: '#50a0ff'

                    },
                    title: {
                        show: true,
                        offsetCenter: [0, '50%'],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#bbb',
                            fontSize: 16
                        }
                    },
                    detail: {
                        show: true,
                        // backgroundColor: 'rgba(0,0,0,0)',
                        // borderWidth: 1,
                        // borderColor: '#aaa',
                        offsetCenter: [0, '80%'],    // x, y，单位px
                        formatter: '{value}%',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontSize: 28,
                            color: '#000000'
                        }
                    },
                    // detail: {formatter:'{value}%'},
                    data: [{value: _rate, name: '拥挤指数'}]
                }
            ]

        };
        gaugeChart.setOption(option);
    },
    drawRingPie: function (ringPieChart, data, title) {
        var total = 0;
        data.forEach(function (obj) {
            total+=obj.value;
        });
        // 绘制图表
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                icon: 'circle',
                align:'left',
                // formatter:'{a|{name}b|{name}}',
                data: data.map(function(obj){
                    return obj.name
                }),

                formatter: function(name){
                    var arr = [];
                    data.forEach(function (obj) {
                        if (obj.name == name) {
                            arr = [
                                '{a|'+obj.name+'}',
                                '{b|'+obj.value+'}',
                            ]
                        }

                    });
                    // return name + ' ' + ((target/total)*100).toFixed(2) + '%';
                    return arr.join('  |  ')
                },
                textStyle:{
                    rich:{
                        a:{
                            /*                    fontSize:20,
                                                verticalAlign:'top',
                                                align:'center',
                                                padding:[0,0,28,0]*/
                            // fontWeight: 'normal',
                        },
                        b:{
                            /*                    fontSize:14,
                                                align:'center',
                                                padding:[0,10,0,0],
                                                lineHeight:25*/
                            fontWeight: 'bold',
                        }
                    }
                }
            },
            color: ['#50a0ff','#ffb033','#44cc52','#ff00f3','#ff3820','#6f55f9'],
            title: [{
                    text: title,
                    top: 'top',
                    left: 'left',
                    textStyle: {
                        color: '#333333',
                        fontSize: 16,
                        fontWeight: 'normal',
                    },
                },
                {
                    text: '总数',
                    subtext: total,
                    // sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
                    x: '39%',
                    y: '43%',
                    textAlign:'center',
                    itemGap: 5,
                    textStyle: {
                        color: '#555555',
                        fontSize: 12,
                        fontWeight: 'normal',
                    },
                    subtextStyle: {
                        color: '#000000',
                        fontSize: 16
                    }
                }
            ],
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['25%', '35%'],
                    center: ['40%', '50%'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data
                }
            ]
        };
        ringPieChart.setOption(option);
    },
    drawSeriesRingPie: function (seriesRingPieChart, datas, title) {
        // console.log(datas);
        // console.log('datas.length: ' + Object.keys(datas).length);

        var N_POINT = Object.keys(datas).length;

        var grids = [];
        var series = [];
        var titles = [];
        var count = 1;
        var legendData = [];
        echarts.util.each(datas, function (data, name) {
            // console.log(data);
            var total = 0;
            data.forEach(function (obj) {
                total += obj.value;
                legendData.push(obj.name);
            });
            var leftP = (100 / (N_POINT * 2) * (2 * (count - 1) + 1));
            grids.push({
                show: true,
                borderWidth: 0,
                backgroundColor: '#fff',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 0
            });
            series.push({
                name: name,
                type: 'pie',
                radius: ['25%', '35%'],
                center: [leftP + '%', '50%'],
                xAxisIndex: count,
                yAxisIndex: count,
                data: data,
                showSymbol: false,
                // animationEasing: name,
                // animationDuration: 1000,
                /*                label: {
                                    show: false,
                                }*/
                label: {
                    normal: {
                        show: false,
                        textStyle: {       // 属性lineStyle控制线条样式
                            // fontWeight: 'bolder',
                            color: '#444'
                        },
                        formatter: "{b} : {c}" + '家'
                    },

                },
            });
            titles.push({
                textAlign: 'center',
                text: name,
                textStyle: {
                    color: '#000000',
                    fontSize: 12,
                    fontWeight: 'normal'
                },
                x: leftP - 0.5 + '%',
                y: '68%',
                // center: [count*20+'%', '50%'],
            }, {
                text: '总数',
                subtext: total,
                textAlign: 'center',
                // sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
                x: leftP - 0.5 + '%',
                y: '44%',
                itemGap: 5,
                textStyle: {
                    color: '#555555',
                    fontSize: 12,
                    fontWeight: 'normal',
                },
                subtextStyle: {
                    color: '#000000',
                    fontSize: 16
                },

            });
            count++;
        });

        var rowNumber = Math.ceil(count);
        // console.log(rowNumber)
        echarts.util.each(grids, function (grid, idx) {
            grid.left = (100 / (N_POINT * 2) * (2 * (idx - 1) + 1)) + '%';
            grid.top = (Math.floor(idx / rowNumber) / rowNumber * 100 + 0.5) + '%';
            grid.width = 100 / (count - 1) + '%';
            grid.height = '100%';
        });
        legendData = legendData.slice(0, count - 2)
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: COLOR,
            legend: {
                // orient: 'vertical',
                x: 'center',
                y: '80%',
                itemGap: 80,
                icon: 'circle',
                data: legendData
            },
            title: titles.concat([{
                text: title,
                top: 'top',
                left: 'left',
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                },
            }]),
            grid: grids,
            series: series
        };
        seriesRingPieChart.setOption(option);
    },
    drawRose: function (circleChart, data, title) {
        var total = 0;
        data.forEach(function (obj) {
            total += obj.value;
        });
        let option = {
            title: [{
                text: title,
                top: 'top',
                left: 'left',
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                },
            },{
                text: '总数',
                subtext: total,
                x: 'center',
                y: '42%',
                itemGap: 10,
                textStyle: {
                    color: '#333333',
                    fontSize: 18,
                    fontWeight: 'normal',
                },

                subtextStyle: {
                    color: '#000000',
                    fontSize: 18,
                    fontWeight: 'bold'
                },
            }],
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            /*            toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType : {
                                    show: true,
                                    type: ['pie', 'funnel']
                                },
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },*/
            calculable: true,
            color: COLOR,
            series: [
                {
                    name: '半径模式',
                    type: 'pie',
                    radius: [40, 90],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    label: {
                        normal: {
                            show: true,
                            textStyle: {       // 属性lineStyle控制线条样式
                                // fontWeight: 'bolder',
                                color: '#444'
                            },
                            formatter: "{b} : {c}" + '家'
                        },

                    },
                    labelLine: {
                        normal: {
                            length: 5,
                            length2: 10
                        }
                    },
                    data: data
                }
            ]
        };
        circleChart.setOption(option);
    },
    drawLine: function (lineChart, datas, title) {
        var series = [];
        var legendData = [];
        var xData = Object.keys(datas[0].value);
        echarts.util.each(datas, function (data) {
            series.push({
                name: data.name,
                type: 'line',
                data: Object.values(data.value),
                //ECharts 提供的标记类型包括'emptyCircle', ' 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
                symbol: 'emptyCircle',     //设定为实心点
                symbolSize: 8,   //设定实心点的大小
            });
            legendData.push(data.name);
        });
        let option = {
            title: {
                text: title,
                x: 'top',
                y: 'top',
                itemGap: 10,
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData,
                top: '12%',
                icon: 'ract',
                itemWidth: 25,              // 图例宽度
                itemHeight: 3,              // 图例高度
                itemGap: 50,                //图例之间的间隔
            },
            grid: {
                top: '25%',
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#aaa',

                    }
                },
                axisLabel: {
                    color: '#333'
                },
                axisTick: {
                    alignWithLabel: true
                },
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        // color: ['#5f5', '#d0d'],
                        //分隔线线型
                        type: 'dashed',
                    }
                }
            },
            color: COLOR,
            series: series
        };
        lineChart.setOption(option);
    },
    drawSmoothLine: function(lineChart, data, title, areaFlag){
        var yData = Object.keys(data).map(function (key) {
            return data[key].value;
        });
        var minStr = Math.min.apply(null,yData) + '米';
        var maxStr = Math.max.apply(null, yData) + '米';
        // console.log(minStr + ' - ' + maxStr);
        var markPoint = {
            data: [
                {
                    name: minStr,
                    y: '11%',
                    x: '65%',
                    symbol : 'triangle',
                    symbolRotate: 180,
                    symbolSize: [8,10],
                    itemStyle:{
                        normal: {
                            color: 'lightgreen'
                        }
                    },
                    label: {
                        normal: {
                            formatter: minStr,
                            position: 'right',
                            color: 'black'
                        }
                    }

                }, {
                    name: maxStr,
                    y: '11%',
                    x: '80%',
                    symbol : 'triangle',
                    symbolSize: [8,10],
                    itemStyle:{
                        normal: {
                            color: 'red'
                        }
                    },
                    label: {
                        normal: {
                            formatter: maxStr,
                            position: 'right',
                            color: 'black'
                        },
                    }
                }
            ]
        };
        // console.log(markPoint);
        var series = [];
        var temp;
        if (areaFlag) {
            temp = {
                data: data,
                type: 'line',
                smooth: true,
                symbol: 'circle',     //设定为实心点
                symbolSize: 2,   //设定实心点的大小
                markPoint: markPoint,
                areaStyle: {normal: {}}
            };
        } else {
            temp = {
                data: data,
                type: 'line',
                smooth: true,
                symbol: 'circle',     //设定为实心点
                symbolSize: 2,   //设定实心点的大小
                markPoint: markPoint
            };
        }
        series.push(temp);
        let option = {
            color: COLOR,
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#aaa',
                    }
                },
                axisLabel: {
                    color: '#333'
                },
                axisTick: {
                    show: false
                },
                data: Object.keys(data).map(function (key) {
                    return data[key].name;
                })
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        // color: ['#5f5', '#d0d'],
                        //分隔线线型
                        type: 'dashed',
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            title: {
                text: title,
                x: 'top',
                y: 'top',
                itemGap: 10,
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                }
            },
            series: series
        };
        lineChart.setOption(option)
    },
    drawMultiBar: function (multiBarChart, datas, title, just) {
        var xData = Object.keys(datas[0].value);
        // console.log(xData)
        var series = [];
        var yAxis = [];
        var legendData = [];
        echarts.util.each(datas, function (data, id) {
            series.push({
                name: data.name,
                type: 'bar',
                data: Object.values(data.value),
                barWidth: 15,
                yAxisIndex: just ? null : id,
            });
            legendData.push(data.name);
            var max = Math.max.apply(null, Object.values(data.value));
            // console.log("max: "+max)
            yAxis.push(                {
                type: 'value',
                max: max,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false,
                }
            });
        });
        let option = {
            color: COLOR,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: legendData,
                icon: 'ract',
                top: '15%',
                itemWidth: 25,              // 图例宽度
                itemHeight: 3,              // 图例高度
                itemGap: 50,                //图例之间的间隔
            },
            grid: {
                top: '30%',
                // width: '50%',
                bottom: '5%',
                // left: '9%',
                containLabel: true
            },
            title: {
                text: title,
                x: 'top',
                y: 'top',
                itemGap: 10,
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                }
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: '#aaa',

                        }
                    },
                    axisLabel: {
                        color: '#333'
                    },
                    data: xData
                }
            ],
            yAxis: yAxis,
            series: series
        };
        multiBarChart.setOption(option);
    },
    drawBar: function (barChart, datas, title) {
        var xData = Object.keys(datas);
        var data = Object.values(datas);
        let option = {
            color: ['#50a0ff'],
            grid: {
                // top: '30%',
                // width: '50%',
                bottom: '5%',
                // left: '15%',
                // position: 'center',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                axisLabel: {
                    color: '#333'
                },
                axisTick: {
                    show: false,
                    // alignWithLabel: true
                },
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        // color: ['#5f5', '#d0d'],
                        //分隔线线型
                        type: 'dashed',
                    }
                }
            },
            title: {
                text: title,
                x: 'top',
                y: 'top',
                itemGap: 10,
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                }
            },
            series: [{
                data: data,
                type: 'bar',
                // color: '#50a0ff',
                barWidth: 15,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#333'
                    }
                },
                //平均值辅助线
                /*        markLine : {
                            data : [
                                {type : 'average', name : '平均值'}
                            ]
                        }*/
            }]
        };
        barChart.setOption(option);
    },
    drawNoBar: function (barChart, data, title) {
        var count = 10;
        var noData = [90,90,90,90,90,90,90,90,90,90];
        var yData = Object.keys(data);
        var temp = Object.keys(data).map(function (key) {
            return data[key];
        });
        var max = Math.max.apply(null,temp);
        let option = {
            tooltip: {},
            title: {
                text: title,
                x: 'top',
                y: 'top',
                itemGap: 10,
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                }
            },
            grid: [{
                // top: '2%',
                // width: '50%',
                // bottom: '45%',
                left: '9%',
                containLabel: true
            }, {
                // top: '2%',
                // width: '50%',
                // bottom: 0,
                left: '3%',
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: max,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel:{
                    show: false
                },
            }, {
                type: 'value',
                max: 1000,
                gridIndex: 1,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel:{
                    show: false
                },
            }],
            yAxis: [{
                type: 'category',
                data: yData,
                axisLabel: {
                    show: false,
                    interval: 0,
                    // rotate: 30
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            }, {
                gridIndex: 1,
                type: 'category',
                data: yData,
                axisLabel: {
                    // show: false,
                    interval: 0,
                    // rotate: 30
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            }],
            series: [
                {
                    type: 'bar',
                    // stack: 'chart',
                    color: ['#50a0ff'],
                    barWidth: 18,
                    z: 3,
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            color: '#333333'
                        }
                    },
                    data: Object.keys(data).map(function (key) {
                        return data[key];
                    })
                }, {
                    type: 'bar',
                    // stack: 'component',
                    color: ['#50a0ff'],
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    barWidth: 18,
                    silent: true,
                    z: 3,
                    label: {
                        normal: {
                            position: 'insideLeft',
                            show: true,
                            align: 'center',
                            offset: [4, 0],
                            formatter: function () {
                                return count--;
                            }
                        }
                    },
                    data: noData
                }]
        }
        barChart.setOption(option);
    },
    drawTBar: function (barChart, datas, title) {
        var xData = Object.keys(datas);
        var data = Object.values(datas);
        let option = {
            color: ['#50a0ff'],
            grid: {
                // top: '2%',
                // width: '50%',
                // bottom: '45%',
                // left: '10%',
                containLabel: true
            },
            yAxis: {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                axisLabel: {
                    color: '#333'
                },
                axisTick: {
                    show: false,
                    // alignWithLabel: true
                },
                data: xData
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            title: {
                text: title,
                x: 'top',
                y: 'top',
                itemGap: 10,
                textStyle: {
                    color: '#333333',
                    fontSize: 16,
                    fontWeight: 'normal',
                }
            },
            series: [{
                data: data,
                type: 'bar',
                barWidth: 18,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        color: '#333',
                        formatter: "{c}" + ' 辆'
                    }
                }
            }]
        };
        barChart.setOption(option);
    }
}