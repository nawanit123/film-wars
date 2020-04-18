const autocompleteConfig = {
    renderOption(movie){
     const imgSrc = movie.Poster === "N/A" ? '':movie.Poster;
     return `
        <img src="${imgSrc}"/>
        ${movie.Title}      -    ${movie.Year}
    `;
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchTerm){
        const response =await axios.get("https://omdbapi.com",{
            params:{
                apikey:"89a8dbfc",
                s: searchTerm 
            }
        });
        if(response.data.Error) return [];
        return response.data.Search;
    }
}
createAutoComplete({
    ...autocompleteConfig,
    root:document.querySelector("#left-autocomplete"),
    onOptionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie,document.querySelector("#left-summary"),"left");
    }
});
createAutoComplete({
    ...autocompleteConfig,
    root:document.querySelector("#right-autocomplete"),
    onOptionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie,document.querySelector("#right-summary"),"right");
    }
});


let leftMovie;
let rightMovie;
const onMovieSelect= async(movie,summaryElement,side)=>{
    const {imdbID:id} = movie;
    const response =await axios.get("https://omdbapi.com",{
        params:{
            apikey:"thewdb",
            i: id
        }
    });
    if(response.data.Error) return [];
    summaryElement.innerHTML =movieTemplate(response.data);

    if(side === "left"){
        leftMovie = response.data;
    }
    else{
        rightMovie =response.data;
    }
    if(leftMovie && rightMovie){
        runComparison();
    }
};

const runComparison = ()=>{
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat,idx)=>{
        const rightStat = rightSideStats[idx];

        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);

        if(leftSideValue>rightSideValue){
            leftStat.classList.remove("is-warning");
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-primary");
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
        else if(isNaN(leftSideValue) || isNaN(rightSideValue)||leftSideValue===rightSideValue){
            leftStat.classList.remove("is-warning");
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-primary");

            rightStat.classList.remove("is-warning");
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-primary");
        }
        else{
            leftStat.classList.remove("is-primary");
            leftStat.classList.remove("is-warning");
            leftStat.classList.add("is-warning");
        }

    });
}

const movieTemplate = (movieDetail)=>{
    
    const {BoxOffice,Metascore,IMDBRating,IMDBVotes,Awards,Poster,Title,Genre,Plot}=bugFixes(movieDetail);


    const dollars = parseInt(BoxOffice.replace(/\$/g,"").replace(/,/g,""));
    const metaScore = parseInt(Metascore);
    const imdbRating = parseFloat(IMDBRating);
    const imdbVotes = parseInt(IMDBVotes.replace(/,/g,""));
    const awards = Awards.split(" ").reduce((accum,val)=>{
        val =parseInt(val);
        if(isNaN(val)){
            return accum;
        }else{
            return accum + val;
        } 
    },0);
    

    return `
    <article class="media">
    <div class="header-element">
      <figure class="media-left">
          <p class="image">
              <img src="${Poster}"/>
          </p>
      </figure>
      <div class="media-content">
          <div class="content">
              <h1>${Title}</h1>
              <h4>${Genre}</h4>
              <p>${Plot}</p>
          </div>
      </div>
    </div>
  </article>
  <article data-value = ${awards} class="notification is-primary">
    <div class="header-element">
      <p class="title">${Awards}</p>
      <p class="subtitle">Awards</p>
    </div>
  </article>
  <article data-value = ${dollars} class="notification is-primary">
    <div class="header-element">
      <p class="title">${BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </div>
  </article>
  <article data-value = ${metaScore} class="notification is-primary">
    <div class="header-element">
      <p class="title">${Metascore}</p>
      <p class="subtitle">Metascore</p>
    </div>
  </article>
  <article data-value = ${imdbRating} class="notification is-primary">
    <div class="header-element">
      <p class="title">${IMDBRating}</p>
      <p class="subtitle">imdb Rating</p>
    </div>
  </article>
  <article data-value = ${imdbVotes} class="notification is-primary">
    <div class="header-element">
      <p class="title">${IMDBVotes}</p>
      <p class="subtitle">imdbVotes</p>
    </div>
  </article>
  
    `;
}

function bugFixes(movieDetail) {
    const Poster=movieDetail.Poster==="N/A"||movieDetail.Poster===movieDetail.Title===undefined? "Unavailable":movieDetail.Poster;
    const Title=movieDetail.Title==="N/A"||movieDetail.Title===undefined? "Unavailable":movieDetail.Title;
    const Genre=movieDetail.Genre==="N/A"||movieDetail.Genre===undefined? "Unavailable":movieDetail.Genre;
    const Plot=movieDetail.Plot==="N/A"||movieDetail.Plot===undefined? "Unavailable":movieDetail.Plot;
    const Awards=movieDetail.Awards==="N/A"||movieDetail.Awards===undefined? "Unavailable":movieDetail.Awards;
    const BoxOffice=movieDetail.BoxOffice==="N/A"||movieDetail.BoxOffice===undefined? "Unavailable":movieDetail.BoxOffice;
    const Metascore=movieDetail.Metascore==="N/A"||movieDetail.Metascore===undefined? "Unavailable":movieDetail.Metascore;
    const IMDBRating=movieDetail.imdbRating==="N/A"||movieDetail.imdbRating===undefined? "Unavailable":movieDetail.imdbRating;
    const IMDBVotes=movieDetail.imdbVotes==="N/A"||movieDetail.imdbVotes===undefined? "Unavailable":movieDetail.imdbVotes;
    return {BoxOffice,Metascore,IMDBRating,IMDBVotes,Awards,Poster,Title,Genre,Plot};
}
