const fetchDataSearch = async(searchTerm)=>{
    const response =await axios.get("https://omdbapi.com",{
        params:{
            apikey:"thewdb",
            s: searchTerm
        }
    });
    if(response.data.Error) return [];
    return response.data.Search;
}

const input =document.querySelector("input");
const onInput =async(event)=>{
     const movies = await fetchDataSearch(event.target.value);
     for(let movie of movies){
         const div =document.createElement("div");
         div.innerHTML=`
            <img src="${movie.Poster}" />
            <h1>${movie.Title}</h1>
         `;
         document.querySelector("#target").appendChild(div);
     }
}

input.addEventListener("input",debounce(onInput));



