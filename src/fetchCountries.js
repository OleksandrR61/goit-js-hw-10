function fetchCountries(partOfName) {
    return fetch(`https://restcountries.com/v3.1/name/${partOfName}?fields=name,capital,population,flags,languages`)
}

export {fetchCountries};