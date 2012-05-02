window.xcanvas = function(){
	init();
};

function init(){
	if(typeof jQuery == "undefined"){
		console.log("recall init();");
		setTimeout(function(){init();}, 100);
		return;
	}

	$("#startbtn").on("click", start);

	var querylist = window.location.search.replace(/\?/, "").split("&");
	var queryhash = {};
	while(querylist.length != 0){
		var set = querylist.shift();
		var setlist = set.split("=");
		queryhash[setlist[0]] = setlist[1];
	}

	if(queryhash["w"]){
		$("#wrap").css({width: queryhash["w"]});
	}
	if(queryhash["h"]){
		$("#wrap").css({height: queryhash["h"]});
	}

	jQuery.extend({
		lg: {
			qh : queryhash,
			cba : new BitArray(),
			//pba : new BitArray(),
			jc : $("canvas#c1"),
			ctx: null,
			lci: null,
			w: 0,
			h: 0,
			fr: Number(queryhash["rl"]) || 1000,
			posu: function(pos){
				var size = jQuery.lg.cba.size();
				return (pos + size - jQuery.lg.w) % size;
			},
			posd: function(pos){
				var size = jQuery.lg.cba.size();
				return (pos + size + jQuery.lg.w) % size;
			},
			posl: function(pos){
				var size = jQuery.lg.cba.size();
				return (pos - pos % jQuery.lg.w) + (pos % jQuery.lg.w + jQuery.lg.w - 1);
			},
			posr: function(pos){
				var size = jQuery.lg.cba.size();
				return (pos - pos % jQuery.lg.w) + (pos % jQuery.lg.w + jQuery.lg.w + 1);
			}
		}

	});

	jQuery.lg.c = jQuery.lg.jc.get(0);

	if(jQuery.lg.c && jQuery.lg.c.getContext){
		jQuery.lg.ctx = jQuery.lg.c.getContext("2d");
		initdraw();
	}

}

function initdraw(){
	var ctx = jQuery.lg.ctx;

	resizer();
	$(window).resize(resizer);

	var img = ctx.createImageData(jQuery.lg.w, jQuery.lg.h);
	var imgdata = img.data;


	var w = jQuery.lg.w;
	var h = jQuery.lg.h;
	for(var i = 0; i < h; i++){
		for(var j = 0; j < w; j++){
			imgdata[(i * w + j) * 4 + 0] = (Math.random() * 128 + 64) << 0;
			imgdata[(i * w + j) * 4 + 1] = (Math.random() * 128 + 64) << 0;
			imgdata[(i * w + j) * 4 + 2] = (Math.random() * 128 + 64) << 0;
			if(Math.random() > 0.7){
				imgdata[(i * w + j) * 4 + 3] = 255;
			}
		}
	}
	ctx.putImageData(img, 0, 0);

}

function initdraw2(){
	//for test
	var ctx = jQuery.lg.ctx;
	resizer();
	$(window).resize(resizer);

	ctx.fillRect(1,1, 3,1);
	ctx.fillRect(1,2, 1,1);
	ctx.fillRect(2,3, 1,1);

}

function start(){
	$("#startbtn").css({display:"none"});
	console.log("start");

	draw();
}

function algo2(){
	var ctx = jQuery.lg.ctx;

	var w = jQuery.lg.w;
	var h = jQuery.lg.h;

	var liveflag = false;

	var newimg = ctx.createImageData(w, h);
	var newimgdata = newimg.data;

	for(var i = 0; i < h; i++){
		for(var j = 0; j < w; j++){

			var img = ctx.getImageData( j-1, i-1, 3, 3);
			var imgdata = img.data;

			if(i === 0 || j === 0 || i === h - 1 || j === w - 1){

				/*
				 * samples
				 imgdata[3] = ctx.getImageData((j + w - 1) % w,(i + h - 1) % h,1,1).data[3];
				 imgdata[7] = ctx.getImageData(j,(i + h - 1) % h,1,1).data[3];
				 imgdata[11] = ctx.getImageData((j + w + 1) % w,(i + h - 1) % h,1,1).data[3];
				 imgdata[15] = ctx.getImageData((j + w - 1) % w,i,1,1).data[3];
				 imgdata[19] = ctx.getImageData(j,i,1,1).data[3];
				 imgdata[23] = ctx.getImageData((j + w + 1) % w,i,1,1).data[3];
				 imgdata[27] = ctx.getImageData((j + w - 1) % w,(i + h + 1) % h,1,1).data[3];
				 imgdata[31] = ctx.getImageData(j,(i + h + 1) % h,1,1).data[3];
				 imgdata[35] = ctx.getImageData((j + w + 1) % w,(i + h + 1) % h,1,1).data[3];
				 */

				if( i===0 ){
					 imgdata[3] = ctx.getImageData((j + w - 1) % w,(i + h - 1) % h,1,1).data[3];
					 imgdata[7] = ctx.getImageData(j,(i + h - 1) % h,1,1).data[3];
					 imgdata[11] = ctx.getImageData((j + w + 1) % w,(i + h - 1) % h,1,1).data[3];
				}else if(i=== h - 1){
					 imgdata[27] = ctx.getImageData((j + w - 1) % w,(i + h + 1) % h,1,1).data[3];
					 imgdata[31] = ctx.getImageData(j,(i + h + 1) % h,1,1).data[3];
					 imgdata[35] = ctx.getImageData((j + w + 1) % w,(i + h + 1) % h,1,1).data[3];
				}

				if( j === 0){
					 imgdata[3] = ctx.getImageData((j + w - 1) % w,(i + h - 1) % h,1,1).data[3];
					 imgdata[15] = ctx.getImageData((j + w - 1) % w,i,1,1).data[3];
					 imgdata[27] = ctx.getImageData((j + w - 1) % w,(i + h + 1) % h,1,1).data[3];
				}else if( j === w - 1){
					imgdata[11] = ctx.getImageData((j + w + 1) % w,(i + h - 1) % h,1,1).data[3];
					imgdata[23] = ctx.getImageData((j + w + 1) % w,i,1,1).data[3];
					imgdata[35] = ctx.getImageData((j + w + 1) % w,(i + h + 1) % h,1,1).data[3];
				}

			}

			var nlc = 0; // near live cell
			for(var k = 0; k < imgdata.length / 4; k++){
				if(k * 4 + 3 !== 19){
					nlc += imgdata[k * 4 + 3] !== 0 ? 1 : 0;
				}
			}


			newimgdata[(i * w + j) * 4 + 0] = imgdata[16] || (Math.random() * 128 + 64) << 0;
			newimgdata[(i * w + j) * 4 + 1] = imgdata[17] || (Math.random() * 128 + 64) << 0;
			newimgdata[(i * w + j) * 4 + 2] = imgdata[18] || (Math.random() * 128 + 64) << 0;
			if(nlc === 3 || (nlc === 2 && imgdata[19] !== 0)){
				//live
				newimgdata[(i * w + j) * 4 + 3] = 255;
				liveflag = true;
			}else{
				//die
				newimgdata[(i * w + j) * 4 + 3] = 0;
			}

		}
	}

	ctx.putImageData(newimg, 0, 0);
	return liveflag;

}

function algo1(){
	var ctx = jQuery.lg.ctx;

	var w = jQuery.lg.w;
	var h = jQuery.lg.h;

	var liveflag = false;

	var imagedata = ctx.getImageData(0,0,w,h).data;

	for(var i = 0; i < h; i++){
		for(var j = 0; j < w; j++){
			//var c = [], u = [], d = [], l = [], r = [], ul = [], ur=[], dl=[], dr=[];
			var ux = (i + h - 1) % h;
			var dx = (i + h + 1) % h;
			var ly = (j + w - 1) % w;
			var ry = (j + w + 1) % w;

			var c = imagedata[( i * w + j) * 4 + 3];
			var u = imagedata[( ux * w + j) * 4 + 3];
			var d = imagedata[( dx * w + j) * 4 + 3];
			var l = imagedata[( i * w + ly) * 4 + 3];
			var r = imagedata[( i * w + ry) * 4 + 3];

			var ul = imagedata[( ux * w + ly) * 4 + 3];
			var ur = imagedata[( ux * w + ry) * 4 + 3];
			var dl = imagedata[( dx * w + ly) * 4 + 3];
			var dr = imagedata[( dx * w + ry) * 4 + 3];

			var nearcell = 0;
			nearcell += u != 0 ? 1 : 0;
			nearcell += d != 0 ? 1 : 0;
			nearcell += l != 0 ? 1 : 0;
			nearcell += r != 0 ? 1 : 0;
			nearcell += ul != 0 ? 1 : 0;
			nearcell += ur != 0 ? 1 : 0;
			nearcell += dl != 0 ? 1 : 0;
			nearcell += dr != 0 ? 1 : 0;


			if(nearcell == 3 || (nearcell == 2 && c[3] != 0)){
				//live
				ctx.putImageData(jQuery.lci, j, i);
				liveflag = true;
			}else{
				//kill
				ctx.clearRect(j, i, 1, 1);

			}
		}
	}

	return liveflag;
}

function algo3(){
	var ctx = jQuery.lg.ctx;

	var w = jQuery.lg.w << 0;
	var h = jQuery.lg.h << 0;

	var liveflag = false;
	var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	var alphalist = [];

	//harf transparent
	for(var i = 0; i < img.data.length/4; i++){
		alphalist.push(img.data[i*4+3] === 255 ? 100 : 0);
	}

	//near live cell adding
	for(i = 0; i < h; i++){
		for(var j = 0; j < w; j++){
			alphalist[i*w+j] += alphalist[i * w + (( j + w - 1) % w)] < 100 ? 0 : 10; // right 1px
			alphalist[i*w+j] += alphalist[i * w + (( j + w + 1) % w)] < 100 ? 0 : 10; // left 1px
			alphalist[i*w+j] += alphalist[((i + h - 1) % h) * w + j] < 100 ? 0 : 10; // down 1px
			alphalist[i*w+j] += alphalist[((i + h + 1) % h) * w + j] < 100 ? 0 : 10; // up 1px
			alphalist[i*w+j] += alphalist[((i + h - 1) % h) * w + (( j + w - 1) % w)] < 100 ? 0 : 10; // down right 1px
			alphalist[i*w+j] += alphalist[((i + h + 1) % h) * w + (( j + w - 1) % w)] < 100 ? 0 : 10; // up right 1px
			alphalist[i*w+j] += alphalist[((i + h - 1) % h) * w + (( j + w + 1) % w)] < 100 ? 0 : 10; // down left 1px
			alphalist[i*w+j] += alphalist[((i + h + 1) % h) * w + (( j + w + 1) % w)] < 100 ? 0 : 10; // up left 1px
		}
	}

	//live cell fix
	for(var i = 0; i < img.data.length/4; i++){
		if(alphalist[i] === 30){
			img.data[i*4+0] = (Math.random() * 128 + 64) << 0;
			img.data[i*4+1] = (Math.random() * 128 + 64) << 0;
			img.data[i*4+2] = (Math.random() * 128 + 64) << 0;
			img.data[i*4+3] = 255;
			liveflag = true;

		}else if(alphalist[i] === 130 || alphalist[i] === 120){
			img.data[i*4+3] = 255;
			liveflag = true;
		}else{
			img.data[i*4+3] = 0;
		}
	}

	ctx.putImageData(img, 0, 0);
	return liveflag;
}


function draw(){
	//console.log("draw");
	//init
	var ctx = jQuery.lg.ctx;
	ctx.save();

	var liveflag = false;

	liveflag = algo3();

	ctx.restore();

	if(liveflag){
		setTimeout(function(){ draw();}, jQuery.lg.fr);
	}else{
		console.log("fin");
	}
}

function resizer(){
	console.log("resize");
	var w = jQuery.lg.qh["w"] || $("#wrap").width();
	var h = jQuery.lg.qh["h"] || $("#wrap").height();
	var lci = jQuery.lg.ctx.getImageData(0, 0, w, h);
	jQuery.lg.jc.attr({width: w, height: h});
	jQuery.lg.ctx.putImageData(lci,0,0);
	jQuery.lg.w = w;
	jQuery.lg.h = h;
}
