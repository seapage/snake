
var Board = (function () {
    function Board() {
        var handler = declareField($('body'));
        this.height = handler.height;
        this.width = handler.width;
        this.array_field = handler.array;
        this.cur_x;
        this.cur_y;
        this.directional = "down";
        this.length = 3;
    }





    function declareField(elem) {
        var width = $(window).width();
        var boxWidth = parseInt(width / 52);
        var height = $(window).height();
        var boxHeight = parseInt(height/52);
        var array_field = [];
        var area = "<table>";
        for( i = 1; i<=boxHeight;i++)
        {
            array_field[i] = [];
            area += "<tr>";
            for(x = 1; x<=boxWidth; x++)
            {
                array_field[i][x]=0;
                area += "<td></td>";
            }
            area += "</tr>";
        }
        area += "</table>"

        elem.html(area);
        return {height: boxHeight, width: boxWidth, array: array_field};


    }

    return Board;
}());

Board.prototype.is_busy = function (x, y) {
    if(x>this.width||x<=0||y>this.height||y<=0)
    {
        return 1;
    }
    if(this.array_field[y][x]=="point"){
        return "point";
    }
    if(this.array_field[y][x]!=0){
        return 1;
    }
    return 0;
}
Board.prototype.random_field = function () {
    var x;
    var y;
    do {
        x = Math.floor(Math.random() * (this.width-1))+1;
        y = Math.floor(Math.random() * (this.height-1))+1;
    }while(this.is_busy(x, y) != 0);
    //alert(x);
    //alert(y);
    this.array_field[y][x] = "point";
}
Board.prototype.render = function () {
    for(i = 1; i<=this.height; i++)
    {
        for(z=1; z<=this.width; z++)
        {
            if(this.array_field[i][z] == "point")
            {
                $("tr:nth-child("+i+") td:nth-child("+z+")").css("background","red");
                continue;
            }

            if(this.array_field[i][z] != 0)
            {
                $("tr:nth-child("+i+") td:nth-child("+z+")").css("background","black");
                continue;
            }

            if(this.array_field[i][z] == 0)
            {
                $("tr:nth-child("+i+") td:nth-child("+z+")").css("background","white");
                continue;
            }
        }
    }
}
Board.prototype.move = function () {


    var x = this.cur_x;
    var y = this.cur_y;
    if(this.directional == "down"){
        y++;
    }
    if(this.directional == "up"){
        y--;
    }
    if(this.directional == "right"){
        x++;
    }
    if(this.directional == "left"){
        x--;
    }

    if(this.is_busy(x,y)!="point"&&this.is_busy(x,y)!=0)
    {
        alert("Koniec gry");
        clearInterval(Interval);
        return;
    }
    if(this.is_busy(x,y)=="point")
    {
        for(i = 1; i<=this.height; i++)
        {
            for(z=1; z<=this.width; z++)
            {
                    if(this.array_field[i][z]!=0)
                        this.array_field[i][z]++;

            }
        }

        this.length++;
        this.array_field[y][x] = this.length;

        this.random_field();
    }

    for(i = 1; i<=this.height; i++)
    {
        for(z=1; z<=this.width; z++)
        {
            if(this.array_field[i][z] != "point")
            {
                if(this.array_field[i][z]!=0)
                    this.array_field[i][z]--;
            }

        }
    }
    if(this.is_busy(x,y)!="point"){
        this.array_field[y][x] = this.length;
    }
    this.cur_x = x;
    this.cur_y = y;
    this.render();
    return true;
}
Board.prototype.start = function () {
    var srodek = parseInt(this.width/2);
    for(i = 1; i<4; i++)
    {
        this.array_field[i][srodek] = i;
    }
    this.cur_x = srodek;
    this.cur_y = 3;
}
var GameController;
var Interval;
$( document ).ready(function() {
    GameController = new Board();
    GameController.random_field();
    GameController.start();
    GameController.render();
    Interval = window.setInterval(gameLoop, 150);
});

function gameLoop(){
    GameController.move();
}


$(document).on('keypress', function (e) {
    if (e.which === 119)
    {
        if(GameController.directional == "down")
            return 0;
        GameController.directional = "up";
    }
    if (e.which === 115)
    {
        if(GameController.directional == "up")
            return 0;
        GameController.directional = "down";
    }
    if (e.which === 97)
    {
        if(GameController.directional == "right")
            return 0;
        GameController.directional = "left";
    }
    if (e.which === 100)
    {
        if(GameController.directional == "left")
            return 0;
        GameController.directional = "right";
    }
});
