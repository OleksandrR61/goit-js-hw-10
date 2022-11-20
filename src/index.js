import './css/styles.css';
import {fetchCountries} from "./fetchCountries.js";
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

let inputRef = getRef("#search-box");
let countryListRef = getRef(".country-list");
let countryInfoRef = getRef(".country-info");

countryListRef.style.listStyleType = "none";
countryListRef.style.padding = "0"
countryListRef.style.margin = "0"

inputRef.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function getRef(selector) {
    return document.querySelector(selector);
}

function onSearch({target: {value}}) {
    value = value.trim();
    if (!value) {
        cleanMarkup();
        return;
    }

    fetchCountries(value)
    .then(res => {
        if (res.status === 404) {
            throw new Error("Oops, there is no country with that name")
        } else if (!res.ok) {
            throw new Error(response.statusText)
        };
        return res.json()})
    .then(data => showCountries(data))
    .catch(message => {
        cleanMarkup();
        Notify.failure(`${message}`.substring(7))
    });
}

function cleanMarkup() {
    showList({});
    showResult([]);
}

function showCountries(countries) {
    cleanMarkup();
    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length > 1) {
        showList(countries);
    } else {
        showResult(countries);
    }
}

function showList(countries) {
    let markup = "";
    if (countries.length) {
        countries.map(({flags: {svg: flag}, name: {official: name}}) => {
        markup += `<li><img src="${flag}" width="25" style="display:inline-block;"/> ${name}</li>`;
    })}
    countryListRef.innerHTML = markup;
}

function showResult(data) {
    let markup = "";
    if (data.length) {
        let {flags: {svg: flag}, name: {official: name}, capital, population, languages} = data[0];
        markup = `<img src="${flag}" width="50" style="display:inline-block;"/><b style="font-size:45px;"> ${name}</b></br>
        <b>Capital:</b> ${capital}</br>
        <b>Population:</b> ${population}</br>
        <b>Languages:</b> ` + Object.values(languages).join(", ");        
    }
    countryInfoRef.innerHTML = markup;
}