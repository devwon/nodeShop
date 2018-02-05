module.exports =function(){
    Array.prototype.removeByValue = function(search){
        var index = this.indexOf(search);
        if(index !== -1){
            this.splice(index,1);
        }
    };
};