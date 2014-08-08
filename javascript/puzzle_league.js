var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var cursor=document.getElementById('cursor')
var block_pics={
    'yellow':document.getElementById('yellow'),
    'blue':document.getElementById('blue'),
    'red':document.getElementById('red'),
    'black':document.getElementById('black'),
    'green':document.getElementById('green')
}
var block_types={
    0:'yellow',
    1:'blue',
    2:'red',
    3:'black',
    4:'green'
}
var Keys = {
32:false,
37:false,
38:false,
39:false,
40:false,
90:false,
80:false
}
//function clone(o){JSON.parse(JSON.stringify(o));}
var Keys_responded = {
32:false,
37:false,
38:false,
39:false,
40:false,
90:false,
80:false
}
function handle_key(num, response){
    //so each time you press the button only gets handled once.
    if(Keys[num]){
	if(!(Keys_responded[num])){
	    Keys_responded[num]=true;
	    response();
	}
    }else{
	Keys_responded[num]=false;
    }
}
function spacebar(board){
    handle_key(32, function(){
	p=board.p;
	c1=board.columns[p[0]]
	c2=board.columns[p[0]+1]
	b1=c1.length>p[1]
	b2=c2.length>p[1]
	if(b1 && b2){
	    holder=c1[p[1]];
	    c1[p[1]]=c2[p[1]];
	    c2[p[1]]=holder;
	}else if(b1){
	    c2.push(c1[p[1]]);
	    c1.splice(c1.indexOf(c1[p[1]]), 1);
	}else if(b2){
	    c1.push(c2[p[1]]);
	    c2.splice(c2.indexOf(c2[p[1]]), 1);	 
	}
    });
}
function right_arrow(board){
    handle_key(39, function(){
	if(board.p[0]<4){board.p[0]+=1;}
    });
}
function up_arrow(board){
    handle_key(38, function(){
	if(board.p[1]<11){board.p[1]+=1;}
    });
}
function left_arrow(board){
    handle_key(37, function(){
	if(board.p[0]>0){board.p[0]-=1;}
    });
}
function down_arrow(board){
    handle_key(40, function(){
	if(board.p[1]>0){board.p[1]-=1;}
    });
}
function add_row(board){
    board.columns.map(function(c){
	n=Math.floor(Math.random()*5);
	t=block_types[n]
	c.unshift(newblock(t));
    });
    if(board.p[1]<11){board.p[1]+=1; }
}
function z_key(board){
    handle_key(90, function(){
	add_row(board);
    });
}
function vertical_row(board){
    board.columns.map(function(col){
	for (i=0; i<col.length-2; i++){
	    a=col[i].type
	    b=col[i+1].type
	    d=col[i+2].type
	    b1=a==b;
	    b2=a==d;
	    b3=false;
	    b4=false;
	    if(i<col.length-3){
		e=col[i+3].type;
		b3=a==e;}
	    if(i<col.length-4){
		f=col[i+4].type;
		b4=a==f;}
	    if (b1 && b2){
		counter+=board.speed;
		board.score+=1;
		if(b3){ 
		    counter+=board.speed;
		    board.score+=1;
		    if (b4){
			board.score+=1;
			counter+=board.speed;
			col.splice(i, 5)
		    }else{
			col.splice(i, 4)
		    }
		}else{
		    col.splice(i, 3);
		}
	    }
	}
    });
}
function horizontal_row(board){
    cols=board.columns
    for(i=0;i<11;i++){
	for(c=0;c<4;c++){
	    if(cols[c].length>i && 
	       cols[c+1].length>i && 
	       cols[c+2].length>i){
		a=cols[c][i].type
		b=cols[c+1][i].type
		d=cols[c+2][i].type
		b1=a==b;
		b2=a==d;
		b3=false;
		b4=false;
		if(c<3 && cols[c+3].length>i){
		    e=cols[c+3][i].type;
		    b3=a==e;}
		if(c<2 && cols[c+4].length>i){
		    f=cols[c+4][i].type;
		    b4=a==f;}
		if (b1 && b2){
		    board.score+=1;
		    counter+=10;
		    cols[c].splice(i, 1);
		    cols[c+1].splice(i, 1);
		    cols[c+2].splice(i, 1);
		    if(b3){ 
			board.score+=1;
			counter+=10;
			cols[c+3].splice(i, 1);
			if (b4){
			    board.score+=1;
			    counter+=10;
			    cols[c+4].splice(i, 1);
			    }
		    }
		}
	    }
	}
    }
}
function end_game(board){
    cols=board.columns;
    for(i=0;i<6;i++){
	if(cols[i].length>12){
	    board.done=true;
	}
    }
}
		
var movement=[spacebar, right_arrow, up_arrow, left_arrow, down_arrow, z_key]
document.addEventListener('keyup', function(event) {Keys[event.keyCode]=false;}, false)
document.addEventListener('keydown', function(event) {
//console.log('pressed key: ' +event.keyCode);
Keys[event.keyCode]=true;}, false)

function newblock(color){
    return {img:block_pics[color], type:color}
}
function update_score(board){
    document.getElementById("score").innerHTML = board.score;
}
function empty_board(){
    b={columns:[[],[],[],[],[],[]],
       p:[0,0],
       img:cursor,
       done:false,
       speed:10,
       pause:false,
       score:0
      }
    add_row(b);
    add_row(b);
    add_row(b);
    b.p=[0,0];
    return b;
}
function draw(ctx, o){
    //console.log('o: ' +o)
return ctx.drawImage(o.img, 50*o.p[0], 550-50*o.p[1]);}
function pause(board){
    handle_key(80, function(){
	clearscreen(c, ctx);
	board.pause=!board.pause;
    });
}
function clearscreen(c, ctx){
    ctx.clearRect(0,0,c.width,c.height);
}
function doit(c, ctx){
    board=empty_board()
    counter=3*board.speed;
    var refreshIntervalID = setInterval(function(){
	if(board.done){
	    console.log('clear');
	    clearInterval(refreshIntervalID);
	    setTimeout(function(){
		doit(c, ctx);
	    }, 5000);
	}
	if(counter<0){
	    board.speed*=.98;
	    counter=3*board.speed;
	    add_row(board);
	}
	clearscreen(c, ctx);
	movement.map(function(f){f(board);});
	if(!(board.pause)){
	    counter-=1
	    vertical_row(board, counter);
	    horizontal_row(board, counter);
	    board.columns.map(function(c){
		c.map(function(r){
		    n={img:r.img, p:[board.columns.indexOf(c), c.indexOf(r)]};
		    draw(ctx, n);
		});
	    });
	}
	draw(ctx, board);
	end_game(board);
	update_score(board);
	pause(board, c, ctx);
    },1000/15);

}
doit(c, ctx);
