function fetchCountries(partOfName) {
    return fetch(`https://restcountries.com/v3.1/name/${partOfName}?fields=name,capital,population,flags,languages`)
    .then(res => {
        if (res.status === 404) {
            throw new Error("Oops, there is no country with that name")
        };
        return res.json()})
}

export {fetchCountries};