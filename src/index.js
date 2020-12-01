console.log('webpack4');

// import { abc } from './js/a.js'
import './css/index.css'
import './css/a.less'

import logo from './img/2.gif'
// import $ from 'jquery'
// import $ from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
// console.log('222222',$);
// console.log('333',jQuery);

// console.log('str',abc);

//es6语法

// let fn=()=>{
//   console.log('执行fn函数');
// }

// fn()

//class语法
// @log 
// class ABC {
//   a=1;
// }

// let ab=new ABC();
// console.log('ab',ab.a);

// function log(target){
//   console.log('target',target);
// }


let img=new Image()
img.src=logo

document.body.appendChild(img)
