
function createToaster(config){
    return function(str){
        let div= document.createElement("div");
        div.textContent=str;
        div.className=`inline-block ${config.theme==="dark"?"bg-gray-800 text-white":"bg-gray-800 text-black"} px-6 py-3 rounded shadow-lg pointer-events-none transition-opacity duration-300`;

        document.querySelector(".parent").appendChild(div);

        

        setTimeout(()=>{
            document.querySelector(".parent").removeChild(div);
        },config.duration *1000);
    }
}

let toaster= createToaster({
    positionX:"right",
    positionY:"top",
    theme:"dark",
    duration:3
});
toaster("notification 1");
setTimeout(()=>{
toaster("Notification 2")
}, 2000);
