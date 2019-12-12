let key;

window.addEventListener("load", function() {    //För att html ska visas på sidan innan javascript

let getKeyButton = document.querySelector("#keyButton"); 
let addBooks = document.querySelector("#add-books");
let lista  = document.querySelector("#lista");
let getBooks = document.querySelector("#get-book") //Hämta böcker-knappen
let saveKeyButton = document.querySelector("#saveKey");
let inputElem = document.querySelector("#input-key");

    //Klick-funktion för att hämta nyckeln när man klickar på knappen
    getKeyButton.addEventListener("click", function(){
    
        getKey() //Funktion som hämtar nyckeln


    });

    //Klick-funktion för att spara nyckeln
    saveKeyButton.addEventListener("click", function() {    
        key = inputElem.value;
        console.log("Sparar nyckel: " + key);
    });

    
    //Klick-funktion som lägger till böcker
    addBooks.addEventListener("click", function(event){

        addBooksFunction() //Funktion som lägger till böcker
        
    });      



    //Klick-funktion som hämtar böcker när man klickar på knappen
    getBooks.addEventListener("click", function(){ 
          
        sendViewBooksRequest(5);    //Funktion som visar datan man lagt upp med 5 försök
    });



});
// Här slutar window load ---------------------------------------------------------------------------------

// Här är alla funktioner ---------------------------------------------------------------------------------



// En funktion som hämtar en nyckel, visar den och sparar värdet
function getKey(){
   

    $.get("https://www.forverkliga.se/JavaScript/api/crud.php?requestKey", function(data, status){

        console.log("Data: " + data + "\nStatus: " + status); 

        let jason = JSON.parse(data);
        key = jason.key;  
        
        document.querySelector("#input-key").value = key;
    });
}





//Funktion som lägger till böcker och en loop som försöker upp till 5 gånger
function addBooksFunction(){
    let title = document.querySelector("#title-input");
    let author  = document.querySelector("#author-input");
    let stopLoop = false;
    let counter = 0;
    
    while(!stopLoop && counter < 5) {
        $.ajax('https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=' + key +  '&title=' + title.value + '&author='+ author.value, {
            type: 'GET',  
            data: { title: title.value, author: author.value },  
            async: false,
            success: function (data, status) {
                let result = JSON.parse(data);
                if(result.status === "error") {
                    
                    counter++;
                    if(counter>=5) {
                        let errorFail = document.createElement('li');
                        errorFail.innerText = "Kunde inte lägga till boken, försök igen!"
                        lista.appendChild(errorFail);
                    }
                    console.log(result.status + ", message=" + result.message); 
                    console.log("Counter= " + counter);   
                }
                else if(result.status === "success") {
                    stopLoop = true;
                    
                    console.log("success!");
                }
            },
            error: function () {
                //Stoppar loopen pga fel
                stopLoop = true;
                
               
            }
        });
    }

}


// Funktion som hämtar böcker med en loop som försöker upp till 5 gånger
function sendViewBooksRequest(triesLeft) {

    $.ajax('https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=' + key, {
        type: 'GET',  
        success: function (data, status,) {
            let serverObject = JSON.parse(data);
            console.log(serverObject);
            if(serverObject.status === 'success') { //Om status från API visar success
                let books = serverObject.data; 

                printBooks(books); // Vid success anropas printBooks-funktionen
            }
            else if(triesLeft > 0) {    //Om anropet misslyckades försöker den igen
                sendViewBooksRequest(triesLeft - 1); // -1 för varje gång 
            }
            else {
                let errorMessege = document.createElement('li');
                errorMessege.innerText = "Kunde inte hämta böcker, försök igen!"
                lista.appendChild(errorMessege);
            }
            

        },
        error: function () {
            
            console.log("Fel i koden")
            
            
        }
    });

}

// Funktion som visar vilka böcker man lagt till. 

function printBooks(books){     //books = serverObject.data
    
    console.log(books);
    
    let clear = document.getElementById("lista")
    clear.innerHTML = "";

    for(let i = 0; i < books.length; i++) {

        let thisBook = document.createElement('li');
        let book = books[i];
        
        thisBook.innerText = "Titel: " + book.title + "\n Författare: " + book.author;
        lista.appendChild(thisBook);
    }
}