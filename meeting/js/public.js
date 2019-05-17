
window.onload=function(){
    var open_menu = document.getElementById('open_menu');
    var header_nav = document.getElementById('header_nav');
    open_menu.onclick=function(){
        console.log(this.className)
        if(!this.className){
            this.className = 'show';
            header_nav.className='inner show';
        }else {
            this.className = '';
            header_nav.className='inner';
        }
    };

};