window.onerror = (message,source,lineno) => {
    console.log(`ErrMessage ${message}`);
    console.log(`Url ${source}`);
    console.log(`Error is on line ${lineno}`);
}

window.onload = () => {

    navigacija();
    index();
    movies();
    calendar();
    contact();
    orders();
    footer();
};

const base = 'assets/data/';

//pageLocation
const pageLoc = (page) => {

    let url = location.href;
    try{
        let arr = ['index.html','movies.html','calendar.html','contact.html','author.html','orders.html'];
        if(!arr.includes(page)){
            throw new Error(`Bad url input ${page}`);
        }
        return url.indexOf(page)!=-1;
    }
    catch(err){
        console.log(err);
    }
   
}

// local storage
const setLsItems = (data) => {
    let id = data.map(i=>i.id);
    localStorage.setItem('idFilm',JSON.stringify(id));
}
const setLs = (name, val) => {
    return localStorage.setItem(name,JSON.stringify(val));
}
const getLs = (lsName) => {
    return JSON.parse(localStorage.getItem(lsName));
}

// AJAX CALLBACK
const ajax = (url,success) =>{
    $.ajax({
        url: url,
        method: "get",
        dataType: "json",
        success: success,
        error:(xhr) => {
            console.log(xhr);
        } 
    });

}
//DYNAMIC PRINT 
const ispis = (div,html) => {
    try{ 
        document.querySelector(div).innerHTML=html;
    }
    catch(e){
        console.log(e);
    }
  
}

// navigacija
const navigacija = () => {

    //nav animacija
    const navScroll = () =>{

        let scrollTopPx = {
            bodyScrollTop : 50,
            documentElementScrollTop: 80
        };

        try{
            if (document.body.scrollTop > scrollTopPx.bodyScrollTop || document.documentElement.scrollTop > scrollTopPx.bodyScrollTop) {
                $('nav').css({
                    "transition":".5s ease",
                    "padding-bottom": "0px"
                });
                $('#logo a').css({
                    'font-size':'1.6em',
                    "transition":".3s ease",
                    "margin-bottom":"10px",
                    "margin-top":"-5px"
                });
                
                $('nav #links').css({
                    'transition':'.3s',
                    'margin-top':'0px'
                });
            }
            else{
                $('nav').css({
                    "padding-bottom": "15px"
                });
                $('#logo a').css({
                    'font-size':'1.8em',
                    "margin":"0px"
                });
                
                $('nav #links').css({
                    "margin":"10px 0px"
                });
            }  
        }
        catch(e){
            console.log(e);
        }  
    }
    $(document).scroll(navScroll);

    //prikaz navigacija za male ekrane
    const prikaziNavigaciju = () => {

        document.querySelector('#hamburger i').addEventListener('click',() => {
            document.querySelector('#links').classList.toggle('otvoriNav'); 
        });

    }
    prikaziNavigaciju();

    // dinamicki ispis navigacije
    const navigacijaIspis = () => {
        
        ajax(`${base}nav.json`, (data) => {
            const navFunc = nav(data);
            navFunc();
        })
    
        const nav = (data) => {

            let htmlLogo='';
            let htmlNav = '';
        
            data.logo.forEach(i => {
                htmlLogo+=`<a href="${i.href}">${i.prikaz}</a>`;
            })

            data.meni.forEach(nav => {
                htmlNav+=`<a href="${nav.href}" class="">${nav.prikaz}</a>`;
            });

            ispis('#logo',htmlLogo);
            ispis('#links',htmlNav);
        
            const active = () => {

                let url = window.location.pathname.slice(1);

                try{
                    $('#links').find('a').each(() => {
                        $(this).toggleClass('active', $(this).attr('href') == url);
                    });
                }
                catch(err){
                    console.log(err);
                }
              
            }
            return active;

        }
    }
    navigacijaIspis();
}

const index = () => {
    if(pageLoc('index.html')){
        
        const perks = () =>{

            ajax(`${base}perks.json`, (data) => {
                perksIspis(data);
            });

            const perksIspis = (data) =>{
                let htmlPerks='';
                
                data.forEach(i => {
                    htmlPerks+=`<div class="opcija">
                    <h3>${i.naslov}</h3>
                    <p>${i.tekst}</p>
                </div>`;
                });
                
                ispis("#opcije",htmlPerks);
            
            }
        }
        perks();

        const komentari = () => {
            
            let nizKomentari = ['I always had an issue with theaters because they are too loud. Not this one! It is by no means quiet, just perfectly set volumes.', 'I love the seat-warmers! Especially in winter! Genius innovation! ','Mesmerising visual quality. And finally some healthy snacks!'];

            let htmlKomentar = '';

            nizKomentari.forEach(i=>{
                htmlKomentar += `
                <div class="blokKomentar">
                    <p><span><i class="fas fa-quote-left"></i></span> ${i}<span><i class="fas fa-quote-left"></i></span></p>
                </div>
                `;
            });

            ispis('#blokoviKomentar',htmlKomentar);
        }

        komentari();
    }
}



const movies = () => {
    
      
    if(pageLoc('movies.html')){
        
        const sort = () => {
           
            // ispis sort ddl
            ajax(`${base}sort.json`,(data) => {
                sortIspis(data);
                
                let lsSort = getLs('sort');
                if(lsSort === null){
                    lsSort = '0';
                }
                document.querySelector('#sort').value = lsSort;
            });   

            const sortIspis = (data) => {

                htmlSort = `  <select id="sort">
                <option value="0">Sort by</option>`;

                data.forEach( i => {
                    htmlSort+=`<option value="${i.id}">${i.prikaz}</option>`
                });

                htmlSort+=`</select>`;

                ispis('#sortHtml',htmlSort);
                
            }
        }
        sort();
       
        const filter = () => {

            const filterChbLs = () => {
                let filterLs = getLs('filter');
                var checkbox = document.querySelectorAll("input[name=chb]");
                if(filterLs!=null){
                    console.log(filterLs);
                    
                    checkbox.forEach(i =>{
                        if(filterLs.includes(i.value)){
                            console.log(i.value);
                            i.checked = true;
                        }
                    });
                    
                }
            }
            const prikaziFilter = () =>{
                document.querySelector('#pocetniPrikazFilter').addEventListener('click',() => {
                    document.querySelector('#zanrovi').classList.toggle('prikazZanr');
                    
                });
            }

            prikaziFilter();

            ajax(`${base}filter.json`,(data) => {

                filterIspis(data);
                setFilterLogic(data);
                filterChbLs();
                
            });

            const filterIspis = (data) => {
                
                let htmlFilter = `<form>`;
                data.forEach(i => {
                    htmlFilter+=`<input type="checkbox" name="chb" id="${i.prikaz}" value="${i.id}" data-id="${i.id}"/class="zanrChb"><span>${i.prikaz.slice(0,1).toUpperCase() + i.prikaz.slice(1)}</span><br/>`;
                });
                htmlFilter+=`</form>`;
                ispis('#zanrovi',htmlFilter);

            }
            
            const setFilterLogic = (data) => {
                // filtriranje
                var checkbox = document.querySelectorAll("input[name=chb]");
                checkbox.forEach(i => {
                    i.addEventListener('change', filterLogic);

                });
               
            }
        }

        filter();

        //ispis filmova
        const filmovi = () => {
            
            ajax(`${base}filmovi.json`,(data) => {
                filmoviIspis(data);
                filtriraj(data);
            });
            
            const filtriraj = (data) => {
                let ls = localStorage.getItem('idFilm');
            
                if(ls!=null && ls.length!=0){
                
                    data.sort( (a,b) => {  
                        ls.indexOf(a.id) - ls.indexOf(b.id);
                    });

                    filmoviIspis(data);  
                    sortLogic();
                }
            }
        }

        filmovi();
        
        const filmoviIspis = (data) => {
                
            let htmlFilmovi = ``;
            data.forEach(i => {
                htmlFilmovi+=`<div class="film">
                <img src="${i.img.src}" alt="${i.img.alt}"/>
                <h2 class="naslov">${i.naslov}</h2>
                <div class="genre">`
                    for(let j of i.kategorija){
                        htmlFilmovi+=` <p>${j.naziv}</p>`
                        
                    }

                htmlFilmovi+=`
                </div>
                <p>Duration ${i.trajanje.ispis}</p>
                <p>Released ${i.datum.ispis}</p>
                <a href="#" class="get">Get Tickets</a>
            </div>`;
            });
            
            ispis('#filmovi',htmlFilmovi);

            const prikaziGetTicket = () => {

                let klasaGet = document.querySelectorAll('.get');
                // console.log(klasaGet);
            
                for(let i=0; i<klasaGet.length;i++){
                    klasaGet[i].addEventListener('click',(e) => {
                        e.preventDefault();
                        console.log(i);
                        document.querySelector('#getTicket').style.display='block';
                    });
                }
                document.querySelector('#gornjiGetTicket i').addEventListener('click',() => {
                    document.querySelector('#getTicket').style.display='none';
                });
            }
            prikaziGetTicket();
            
        }

        
        let arrChb = [];

        function filterLogic(){
           
            if(getLs('filter')){
                arrChb = getLs('filter');
            }

            let izabran = this.value;
            
            //ako postoji obrisi iz niza
            if(arrChb.includes(izabran)){
                arrChb=arrChb.filter(i=>{ 
                    return i!=izabran;
                });
            }
            // upisi u niz
            else{
                arrChb.push(izabran);
            }

            setLs('filter', arrChb);

            ajax('assets/data/filmovi.json',(data) => {
                    
                ispisFiltriranihFilmova(data);

            });

            const ispisFiltriranihFilmova = (data) =>{

                let ispis = [];
                ispis = data.filter( i => {
                    
                    if(arrChb.length!=0){
                        
                        for(let j of arrChb){
                            for(let k of i.kategorija)
                            if(j == k.idKat){
                                return true;
                            }
                        }

                    }
                    else{
                        // ako je niz prazan prikazi sve filmove
                        return true;
                    }
                });
                if(ispis.length === 0){
                    alert('There seems to be no movies for this type of filters');
                }
                filmoviIspis(ispis);
                setLsItems(ispis);

            }
        }
        
        function sortLogic(){
           
                let el = document.querySelector('#sort');
                console.log(el);
                let arr = [];
                ajax('assets/data/filmovi.json',(data) => {

                    setSortLogic(data);
                   
                });
                const setSortLogic = (data) => {

                    if(localStorage.getItem('idFilm')){
                        
                        let ls = localStorage.getItem('idFilm');
                        data = data.filter(i=>{
                            return localStorage.getItem('idFilm').includes(i.id);
                        });

                        data.sort((a, b)=>{  
                            return ls.indexOf(a.id) - ls.indexOf(b.id);
                        });
                    }

                    for(let i of data){
                        arr.push(i);  
                    }
                    
                    const sortiraj = (exec) => {
                        arr.sort(exec);
                    }

                    switch(el.value) {
                        case '0':
                            sortiraj(function(a,b){
                                return a.id-b.id;
                           });
                           break;
                        case '1':
                            sortiraj((a,b) => {
                                a = a.datum.date.split('.');
                                b = b.datum.date.split('.');
                                return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
                            });
                            break;
                        case '2':
                            sortiraj((a,b) => {
                                a = a.datum.date.split('.');
                                b = b.datum.date.split('.');
                                return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
                            });
                            break;
                        case '3':
                            sortiraj((a,b) =>{
                                return a.trajanje.vreme-b.trajanje.vreme;
                            });
                            break;
                        case '4':
                            sortiraj((a,b) => {
                                return b.trajanje.vreme - a.trajanje.vreme;
                             });
                             break;
                        default:
                            filmoviIspis(data);
                    }
                    
                    const setSortLs = () => {
                        let sortId =  document.querySelector('#sort');
                        sortId.addEventListener('change',()=>{
                             
                            let vrednost  =sortId.value;
                            setLs('sort',vrednost);
                            
                        });
                    }

                    setSortLs();
                    filmoviIspis(arr);
                    setLsItems(arr);
                }
     
        }
        $("body").on("change","#sort",sortLogic);
        
        
        const ticket = () => {
        
            let get = document.getElementsByClassName('get');
          
            for(let i of get){
                i.addEventListener('click',(e) => {
                    e.preventDefault();
                    
                });
            }
            ajax("assets/data/filmovi.json",(data) => {
                ispisForme(data);
                
            });
            const ispisForme = (data) =>{
                let html = '';
                
                html+=`<form action="#" method="POST" id="formaGetTicket">
                <div class="form-group">
                    <label for="imeFilm">Movie Name</label>
                    <!-- <input type="text" id="movieName" name="movieName" value="Naslov"/> -->
                    <select id="imeFilm">
                        <option value="0">Choose Movie</option>`
                        for(let i of data){
                            html+=`<option value="${i.id}">${i.naslov}</option>`
                        }
                        html+=`
                    </select>
                </div>
                <div class="form-group">
                    <label for="broj">Ticket Sum</label>
                    <input type="number" min="1" id="broj" name="broj" value="1">
                </div>
                <div class="form-group">
                    <label for="time">Screening time</label>
                    <select id="time">
                        <option value="0">Choose Screening Time</option>
                        
                        
                    </select>
                </div>
                <input type="submit" id="submitTicket" name="submitTicket" value="Order Ticket"/>
                </form>`
              
               
                document.querySelector('#donjiGetTicket').innerHTML=html;
                
                const ispisProjekcije = () =>{
                    let film = document.querySelector('#imeFilm');
                    film.addEventListener('change',() => {
                        if(film.value!=0){
                           
                            let izabran = film.value;
                            let izabranFilmJson = --izabran;
                            let htmlProjekcija = '';

                            for(let i of data[izabran].projekcija){
                                htmlProjekcija+=`<option value='${i.idProjekcija}'>${i.vremePrikazivanja}</option>`
                            }
                            ispis('#time',htmlProjekcija);
              
                        }
                        else{
                            htmlProjekcija = '';
                            ispis('#time',htmlProjekcija);
                        }
                    })
                }
                ispisProjekcije();
                
                const dohvatiPodatkeIzForme = () => {
                    const forma = document.querySelector('#formaGetTicket');
                    const film = document.querySelector('#imeFilm');
                    const brojKarte = document.querySelector('#broj');
                    const projekcija = document.querySelector('#time');
                    const submit = document.querySelector('#submitTicket');
                    
                    submit.addEventListener('click',(e) => {
                        e.preventDefault();
                        
                        if(film.value == 0){
                            alert('You must choose movie in dropdown list');
                            return false;
                        }

                        else{
                            
                            if(localStorage){
                                addToOrders();
                            }
                            else{
                                alert("Your Browser doesnt support localStorage");
                            }
                            
                            return true;
                        }

                    });  

                    
                    function addToOrders(){

                        let idFilmOrder = film.value;
                        let brojKarteLs = brojKarte.value;
                        let projekcijaLs = projekcija.value;

                        let movies=JSON.parse(localStorage.getItem("movieOrdersLs"));
                        
                        
                        if(movies){

                            if(movies.filter(movie=>movie.id==idFilmOrder).length){
                                //edit brKarte ili projekcije
                                for(let i in movies){
                                    if(movies[i].id == idFilmOrder) {
                                    
                                        movies[i].brKarte = brojKarteLs;
                                        movies[i].projekcija = projekcijaLs;
                                   
                                    }   
                                }
                                setLs('movieOrdersLs',movies);
                             
                            }
                            else{
                                // dodaj jos jedan film u ls ako postoji vec jedan
                                                    
                                movies.push({
                                    id : idFilmOrder,
                                    brKarte : brojKarteLs,
                                    projekcija: projekcijaLs
                                });
                         
                                setLs('movieOrdersLs',movies);
                            }
                           
                        }
                        else{
                            //dodaj film u ls
                            let movieOrder = [];
                                                
                            movieOrder[0] = {
                                id: idFilmOrder,
                                brKarte : brojKarteLs,
                                projekcija: projekcijaLs
                            };
                            setLs('movieOrdersLs',movieOrder);
                        }
                        
                        alert('Your order is in orders page');
                        location.reload();
                    }
                }
                dohvatiPodatkeIzForme();
            }
            

          
        }
        ticket();
     
    }
    
}

const calendar= () =>{
    if(pageLoc('calendar.html')){

        const datumi = () => {
            ajax(`${base}filmovi.json`,(data) => {
                datumiIspis(data);
                
            });
            const datumiIspis = (data) => {
                let htmlDatum = ``;
                data.forEach(i=>{
                    htmlDatum+=`
                    <div class="datum">
              
                    <div class="filmProjekcija">
                        <div class="linija"></div>
                        <h3>${i.naslov}</h3>
                        <div class="vremePrikaz">
                            `
                            for(let j of i.projekcija){
                              
                               htmlDatum+=` <p>${j.vremePrikazivanja}</p>`;
                              
                            }
                           
                            htmlDatum+=`
                        </div>
                        
                    </div>
                </div>
                    `;
                })
               
                ispis('#datumi',htmlDatum);
            }

            const danasnjiDan = () => {

                let datum = new Date();
                let dan = datum.getDate();
                let mesec  =datum.getMonth()+1;
                let godina = datum.getFullYear();
                let htmlDanasnjiDan = `${dan}.${mesec}.${godina}`;
    
                ispis('#podnaslovSpan',htmlDanasnjiDan);
            }
            danasnjiDan();
        }
        datumi();
    }
}
const contact = () =>{
    if(pageLoc('contact.html')){
        const forma = document.querySelector('#kontaktForma');
        const ime = document.querySelector('#ime');
        const email = document.querySelector('#email');
        const poruka = document.querySelector('#poruka');
        const submit = document.querySelector('#submit');
        let err=0;

        try{
            const greska = (input, vrednost) => {
                input.style.border = '2px solid red';
                let div = input.parentElement;
                let greskaPrikaz = div.querySelector('p');
                greskaPrikaz.innerHTML = vrednost;
                err=1;
            }
    
            const uspeh = (input) => {
                input.style.border = '2px solid #19B5FE';
            }
    
            const obaveznaPolja = (...args) => {
                args.forEach(i=>{
                    console.log(args);
                    if(i.value.trim()==''){
                        greska(i,`Field is required`);
                    }
                    else{
                        uspeh(i);
                        return true;
                    }
                });
            }
    
            const proveraDuzine = (input, min, max) => {
                if(input.value.length < min){
                    greska(input,`Field must contain min ${min} characters`);
                }
                else if(input.value.length > max){
                    greska(input,`Field must contain max ${max} characters`);
                }
                else{
                    uspeh(input);
                    return true;
                }
            }
    
            const regProvera = (input,reg,message) => {
                
                if(!reg.test(input.value)){
                    greska(input,message);
                }
                else{
                    uspeh(input);
                    return true;
                }
            }
            
            submit.addEventListener('click',(e) => {
                e.preventDefault();
                obaveznaPolja(ime,email,poruka);
           
                let a = proveraDuzine(ime,3,80);
                proveraDuzine(poruka,3,300);

                if(a){
                    regProvera(ime,/^[A-ZŠĐŽČĆ][a-zšđžčć]{2,15}(\s[A-ZŠĐŽČĆ][a-zšđžčć]{2,15})*$/,'Field musst start with uppercase');
                }
                
                if(!obaveznaPolja(email)){
                    regProvera(email,/^\w[.\d\w]*\@[a-z]{2,10}(\.[a-z]{2,3})+$/,'You must enter email format'); 
                }
               
                if(err==0){
                    alert("You've successfully sent us a message.");
                    location.reload();
                }
            });
        }
        catch(e){
            console.log(e);
        }
    }
}

const orders =() =>{

    if(pageLoc('orders.html')){

        const ispisMovieOrder = () => {

           
            let moviesBoocked = JSON.parse(localStorage.getItem('movieOrdersLs'));
        
            if(moviesBoocked.length != 0){
                ajax(`${base}filmovi.json`,(data) => {
                    ispisMovies(data);
                });
                
            }
            
           
            const ispisMovies = (data) => {
                let result = data.filter(i=> {
                    for(let movie of moviesBoocked){
                        if(i.id == movie.id){
                            return true;
                        }
                    }
                });
                console.log(result);
                ispisEl(result);
            }   

            const ispisEl = (data) =>{
                let html='';
             
                data.map(x => {
                    let idFilmaLs = moviesBoocked.find(y => y.id == x.id);
                    
                    x.quantity = parseInt(idFilmaLs.brKarte);

                    x.time = x.projekcija.find(p => p.idProjekcija == idFilmaLs.projekcija).vremePrikazivanja;
                })
       

                data.forEach(i=>{

                    html+=`
                    <div class="filmBooked">
                        <img src="${i.img.src}" alt="${i.img.alt}"/>
                        <h2>${i.naslov}</h2>
                        <p>Sum of booked tickets <span>${i.quantity}</span></p>
                        <p>Projection time <span>${i.time}</span></p>
                        <p class="izbrisiLs" onclick="izbrisiLs(${i.id})">Remove from orders</p>
                    </div>`;
                    
                });
                
                ispis('#orders',html);

            }
            const emptyOrder = () => {
                if(movies.length !== null){
                    let html = `<div class="prazanLs"><p> You havent't booked any movies</p>
                    <p>Go to our movies page so you can choose some movie to enjoy</p></div>`;
                   
                    ispis('#orders',html);
                }
            }
            emptyOrder();
        }
        
        ispisMovieOrder();
 
    }
    
}
const izbrisiLs = (id) => {

    try{
        let movies = JSON.parse(localStorage.getItem('movieOrdersLs'));
        let filtriraj = movies.filter(movie=>movie.id !=id);
        setLs('movieOrdersLs',filtriraj);
        orders();
        console.log(id);
        if(id == null || id == undefined || id == NaN || typeof(id)!='number'){
            throw(`Error: id -> ${id} is not in right format`);
        }
    }
    catch(e){
        console.log(e);
    }
    
}

// footer
const footer = () => {

    ajax(`${base}filmovi.json`,(data) => {
        ispisPrvihPetFilmova(data);
       
    });
    const ispisPrvihPetFilmova = (data) => {
        let broj = 0; 
        let htmlFooterFilmovi = '';
        try{
            for(let i of data){
                broj++;
                htmlFooterFilmovi +=`<a href="movies.html">${i.naslov}</a>` 
                if(broj==5){
                    break;
                }
            }
            ispis('#linksFoo',htmlFooterFilmovi);
        }
        catch(e){
            console.log(e);
        }
    }
}



