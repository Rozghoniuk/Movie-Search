let data;
let totalPage;
let currentPage = 1;
let itemsPerPage = 5;

// ----------------SERVER----------------

const API = "http://www.omdbapi.com/";
const KEY = key;


function getData(api, key, value, page) { 
  movieBox.innerHTML = '<img class="spinner" src="./img/Spinner-1s-200px.png" alt="spinner">';
  let url = `${api}/?apikey=${key}&s=${value}&page=${page}`;
  const request = new XMLHttpRequest();
  request.responseType = 'json';
  request.open('GET', url);
  request.send();
  request.addEventListener("error", () => {
    console.log('ERROR - Something wrong!')
  });
  request.addEventListener('load', () => { 
    if (request.status === 200) { 
      if (request.response.Response !== "False") {
        console.log(request.response);
        data = request.response.Search;
        totalPage = Math.ceil(+request.response.totalResults / 10);
        renderMovies(data);
        renderPagination();
      }
      else { 
        movieBox.innerHTML = request.response.Error;
        
      }
    }
  })
}

// ----------------SEARCH---------------------------

let input = document.querySelector('input');
let button = document.querySelector('button');
let searchValue;

button.addEventListener('click', () => { 
  if (input.value) {
    input.placeholder = " Enter movie name";
    input.style.border = "none";
    searchValue = input.value;
    currentPage = 1;
    getData(API, KEY, searchValue, currentPage);
    input.value = "";
  } else { 
    input.placeholder = "You must write something";
    input.style.border = "1px solid red";
  }
  
})

// -----------------RENDER-------------------------

let movieBox = document.querySelector(".result .grid");

function renderMovies(arr) { 
  let template = "";
arr.forEach(element => {
  template += `<div class="card" data-key=${element.imdbID}>
            <div class="card_img">
              <img 
                src=${element.Poster}
                alt=${element.Title+"img"}
              />
            </div>
              <h5>${element.Title.length>25?element.Title.substring(0, 25)+"...":element.Title}</h5>
              <p>Year: ${element.Year}</p>
              <p>Type: ${element.Type}</p>
            </div>`;
});
  movieBox.innerHTML = template;
}

// ----------------PAGINATION---------------------

let ul = document.querySelector(".pagination ul");

ul.addEventListener("click", (ev) => { 
  if (ev.target.tagName === "LI") { 
    currentPage = +ev.target.innerText;
    ul.innerHTML = "";
    getData(API, KEY, searchValue, currentPage);
  }
})

function renderPagination() {
  let template = "";

  

  if (totalPage <= 7) {
    for (let i = 1; i <= totalPage; i++) {
      template += `<li class="${i===currentPage?'active_li':''}">${i}</li>`;
    }
  } else { 
    // -------выводим первые 5 стр + последняя-----------

  if (currentPage <= 3) {
    for (let i = 1; i <= Math.min(itemsPerPage, totalPage); i++) {
      template += `<li class="${i===currentPage?'active_li':''}">${i}</li>`;
    }
    template += "<span>...</span>";
    template += `<li>${totalPage}</li>`;
  } else if (currentPage >= totalPage - 2) {
    // --------выводим последние 5 стр----------------

    template += "<li>1</li>";
    template += "<span>...</span>";
    for (let i = totalPage - Math.min(itemsPerPage, totalPage) + 1; i <= totalPage; i++) {
      template += `<li class="${i===currentPage?'active_li':''}">${i}</li>`;
    }
  } else { 
    // ----------------выводим окруж текущую стр------------

    template += "<li>1</li>";
    template += "<span>...</span>";
    for (let i = currentPage - 1; i <= currentPage + 1; i++) { 
      template += `<li class="${i===currentPage?'active_li':''}">${i}</li>`;
    }
    template += "<span>...</span>";
    template += `<li>${totalPage}</li>`;

  }
  }

  

  ul.innerHTML = template;
}

// ------------MODAL----------------

let modal = document.querySelector(".modal");
let modalClose = document.querySelector(".modal_close");
let modalWraper = document.querySelector(".modal_wraper");
let objectId;

function getDataById(api, key, id) { 
  modalWraper.innerHTML = '<img class="spinner" src="./img/Spinner-1s-200px.png" alt="spinner">';
  let url = `${api}/?apikey=${key}&i=${id}`;
  const request = new XMLHttpRequest();
  request.responseType = 'json';
  request.open('GET', url);
  request.send();
  request.addEventListener("error", () => {
    console.log('ERROR - Something wrong!')
  });
  request.addEventListener('load', () => { 
    if (request.status === 200) { 
      objectId = request.response;
      renderMovieByID(objectId);
    }
  })
}

function renderMovieByID(object) {
  modalWraper.innerHTML=`<div class="info">
            <div class="row">
              <img src=${object.Poster} alt="${object.Title+"img"}" />
              <div class="info_main">
                <h3>${object.Title}</h3>
                <ul>
                  <li>Genre: ${object.Genre}</li>
                  <li>Actors: ${object.Actors}</li>
                  <li>Director: ${object.Director}</li>
                  <li>Country: ${object.Country}</li>
                  <li>Type: ${object.Type}</li>
                  <li>Year: ${object.Year}</li>
                </ul>
              </div>
            </div>
            <div class="info_plot">
              <p>Plot: ${object.Plot}</p>
            </div>
          </div>`
}

movieBox.addEventListener("click", (ev) => { 
  let clickCard = ev.target.closest(".card");
  if (clickCard) {
    getDataById(API, KEY, clickCard.dataset.key);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

  }
})

modalClose.addEventListener("click", () => { 
  modal.style.display = "none";
  document.body.style.overflow = "";
})
