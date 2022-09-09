
//Picture fragment
class Fragment {
   constructor(id, x, y, width, img, bgWidth){
      this.id = `fragment_${id}`;
      this.x = x;
      this.y = y;
      this.height = width;
      this.width = width;
      if (!img) {
         this.isBlank = true;
      }
      this.image = img;
      this.bgWidth = bgWidth;
      this.createEL();
   }
   createEL(){
      var transX = this.x*this.width;
      var transY = this.y*this.width;
      var el = $(`<div id="${this.id}" data-position="${this.x},${this.y}" class="fragment" style="width:${this.width}px;height:${this.height}px;transform: translate(${transX}px, ${transY}px);background: url(${this.image}) -${transX}px -${transY}px no-repeat;background-size: ${this.bgWidth}px ${this.bgWidth}px;"></div>`);
      $(".box").append(el);
   }
   moveTo(x, y){
      this.x = x;
      this.y = y;
      $(`#${this.id}`).css(`transform`,`translate(${this.x*this.width}px, ${this.y*this.width}px)`);
      $(`#${this.id}`).attr("data-position",x + "," + y);
   }
   delete(){
      $(`#${this.id}`).remove();
   }
}

class Game {
   BoxWidth = 480
   BaseNum = 2
   WinTip = "胜利!!!\n点击确定进入下一关~~"
   Ready = 0
   Win = 1
   Processing = 2
   _level = 1
   _frags = []
   _sw = 0
   _time = 0
   _img = null
   _state = this.Ready// 1 win
   getColumnNum(){
      return this.BaseNum + this._level;
   }
   getImg(){
      var num = this.getRandom(13) + 1;
      return `img/${num}.jpeg`;
   }
   clearFragment(){
      for (let index = 0; index < this._frags.length; index++) {
         const element = this._frags[index];
         element.delete();
      }
      this._frags = [];
   }
   createFragment(){
      var colNum = this.getColumnNum();
      this._img = this.getImg();
      var total = colNum * colNum;
      this.clearFragment();
      for (let index = 0; index < total; index++) {
         var y = Math.floor(index / colNum);
         var x = index % colNum;
         var width = this.BoxWidth / colNum;
         if (index == total - 1) {
            var temp = new Fragment(index, x, y, width);
            this._frags.push(temp);
         }
         else{
            var temp = new Fragment(index, x, y, width, this._img, this.BoxWidth);
            this._frags.push(temp);
         }
         
      }
      setTimeout(() => {
         this.randomOrder();
         this._state = this.Processing;
         $("#start").hide();
         $(".fragment").click(e => {
            var p = $(e.target).attr("data-position").split(",");
            var x = p[0];
            var y = p[1];
            this.click(x, y);
         });
      }, 300);
   }
   getRandom(max){
      return Math.floor(Math.random()*(max+1));
   }
   randomOrder(){
      var sourceArr = [];
      for (let index = 0; index < this._frags.length - 1; index++) {
         const element = this._frags[index];
         sourceArr.push({x:element.x,y:element.y});
      }
      var count = sourceArr.length;
      for (let index = 0; index < count; index++) {
         var targetIndex = this.getRandom(sourceArr.length - 1);
         var target = sourceArr[targetIndex];
         if (this._frags[index].x == target.x && this._frags[index].y == target.y) {
            sourceArr.splice(targetIndex,1);
            continue;
         }
         this._frags[index].moveTo(target.x, target.y);
         sourceArr.splice(targetIndex,1);
      }
   }
   initPreview(){
      $("#preview").css({background: `url(${this._img}) 0 0 no-repeat`, "background-size": "240px 240px"});
   }
   constructor(){

   }

   start(){
      this._state = this.Ready;
      this._time = 0;
      this.createFragment();
      this.initPreview();
      $("#level").text(this._level);
      this.startSW();
   }
   getTarget(x, y){
      for (let index = 0; index < this._frags.length; index++) {
         var tar = this._frags[index];
         if (tar.x == x && tar.y == y) {
            return tar;
         }
      }
   }
   checkWin(){
      var colNum = this.getColumnNum();
      for (let index = 0; index < this._frags.length; index++) {
         const element = this._frags[index];
         var y = Math.floor(index / colNum);
         var x = index % colNum;
         if (element.x != x || element.y != y) {
            return false;
         }
      }
      return true;
   }
   startSW(){
      var timeStr = this.formatSeconds(this._time);
      $("#time").text(timeStr);
      this._sw = setInterval(() => {
         this._time++;
         var timeStr = this.formatSeconds(this._time);
         $("#time").text(timeStr);
      }, 1000);
   }
   pauseSW(){
      this.stopSW();
   }
   stopSW(){
      clearInterval(this._sw);
   }
   formatSeconds(value) {
      let theTime = parseInt(value);
      let theTime1 = 0;
      let theTime2 = 0;
       
      if(theTime > 60) {
      theTime1 = parseInt(theTime/60);
      theTime = parseInt(theTime%60);
       
      if(theTime1 > 60) {
      theTime2 = parseInt(theTime1/60);
      theTime1 = parseInt(theTime1%60);
      }
      }
      let result = ''+parseInt(theTime)+' 秒';
      if(theTime1 > 0) {
      result = ''+parseInt(theTime1)+' 分 '+result;
      }
      if(theTime2 > 0) {
      result = ''+parseInt(theTime2)+' 小时 '+result;
      }
      return result;
   }
   click(x, y){
      if (this._state != this.Processing) {
         return;
      }
      x = parseInt(x);
      y = parseInt(y);
      var max = this.getColumnNum();
      var checkArr = [];
      if (x + 1 < max) {
         var right = {
            x: x + 1,
            y: y
         }
         checkArr.push(right);
      }
      if (x - 1 >= 0) {
         var left = {
            x: x - 1,
            y: y
         }
         checkArr.push(left);
      }
      if (y + 1 < max) {
         var down = {
            x: x,
            y: y + 1
         }
         checkArr.push(down);
      }
      if (y - 1 >= 0) {
         var up = {
            x: x,
            y: y - 1
         }
         checkArr.push(up);
      }
      for (let index = 0; index < this._frags.length; index++) {
         var frag = this._frags[index];
         for (let ind = 0; ind < checkArr.length; ind++) {
            var tar = checkArr[ind];
            if (tar.x == frag.x && tar.y == frag.y && frag.isBlank) {
               var blank = this.getTarget(x, y);
               blank.moveTo(frag.x, frag.y);
               frag.moveTo(x, y);
               if (this.checkWin()) {
                  this._state = this.Win;
                  this.stopSW();
                  setTimeout(() => {
                     alert(this.WinTip);
                     this._level++;
                     this.start();
                  }, 100);
               }
               return;
            }
         }
      }
   }
}

$(function() {
   var game = new Game();
   $("#start").click(e => {
      game.start();
   });
   $("#pause").click(e => {
      game.pauseSW();
      $("#pausepanel").show();
   });
   $("#restart").click(e => {
      game.stopSW();
      game.start();
   });
   $("#continue").click(e => {
      $("#pausepanel").hide();
      game.startSW();
   });
})