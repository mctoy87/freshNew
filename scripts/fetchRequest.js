const APIKey = '03d2a97359178956160c3d92d54cd4cc'



//1ый способ через async/await
const loadNews = async(cb) => {
  const response = await fetch('headlines.json', {
    method: 'GET',
    // body,
    headers: {
      'Content-Type': 'application/json '
    },
  });
  
  const data  = await response.json();
  // console.log('data: ', data);

  cb(data.articles);
};

// отображение новостей на сайте
const renderNews = (data) => {
  const cardsWrapper = document.createElement('div');
  cardsWrapper.className = 'cards';

  const news = data.map(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <img class="card__photo" src="${item.image}" alt="Логотип новостного портала">
    <h2 class="card__title">${item.title}</h2>
    <p class="card__description">${item.description}</p>
    <div class="card__wrap">
      <p class="card__data">${new Date(item.publishedAt).toLocaleDateString()}</p>
      <p class="card__time">${new Date(item.publishedAt).toLocaleTimeString()}</p>
      <p class="card__author">${item.source.name}</p>
    </div>

    `;
    return card;
  });

  cardsWrapper.append(...news);
  // console.log('cardsWrapper', cardsWrapper);
  const wrapper = document.querySelector('.page__cards-wrapper');
  wrapper.append(cardsWrapper);
};

//1ый способ через async/await
// Вызов функции способ через async/await
// loadNews(renderNews);

// 3ий вариант
// попытка в промисах ошибки считать
// const fetchRequest = async (
//   {
//     method = 'GET',
//     callback,
//     body,
//     headers,
//   }) => {
//     try {
//       const options = {
//         method,
//       };
  
//       if (body) options.body = JSON.stringify(body);
//       if (headers) options.headers = headers;
  
//       const response = await fetch(`${URL}`, options);
  
//       if (response.ok) {
//         const data = await response.json();
//         if (callback) return callback(null, data.articles);
//         return;
//       }
  
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     } catch (err) {
//       return callback(err);
//     }
//   };

//   const initGoods = async () => {
//     const goods = await fetchRequest({
//       callback: renderNews,
//     });
//     console.log(goods);
//   };

//   initGoods();

// 2ой способ через Promise
const getNews = (search, country, ) => {
  const URL = 'https://gnews.io/api/v4/search?q=' + search + '&country=' + country + '&apikey=' + APIKey;
  fetch(URL , {
  method: 'GET',
})
  .then(response => {
    if(response.status != 200) {
      throw Error(response.statusText);
    }
    // console.log('response в Промисах: ', response);
    return response.json();
  })
  .then(data=> {
    let dataNews = data.articles;
    console.log('dataNews:', data.articles);
    // отбираем новости кратно 4 без остатка
    // если не кратно 4, то убираем лишнее
    if((dataNews.length % 4) !== 0) {
      dataNews.length = dataNews.length - (dataNews.length % 4);
      return renderNews(dataNews);
    }
    renderNews(data.articles);
  })
  .catch(error => console.log(new Error(error))
  );
}

getNews('example', 'au');
    
  // получить страну и отобразить новости этой страны
  // let country = 
  const form = document.querySelector('.header__form');
  console.log('form: ', form.elements);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(form.elements.nav__headlines);
    const formData = new FormData(e.target);
    console.warn(Object.fromEntries(formData));
    const country = Object.fromEntries(formData).headlines;
    console.log(country);
    const search = Object.fromEntries(formData).search;
    console.log(search);
    const wrapper = document.querySelector('.page__cards-wrapper');
    wrapper.innerHTML ='';
    getNews(search, country);
  });

  form.elements.nav__headlines.addEventListener('change', (e) => {
    console.log(form.elements.nav__headlines.value);
    const wrapper = document.querySelector('.page__cards-wrapper');
    wrapper.innerHTML ='';
    const country = form.elements.nav__headlines.value;
    getNews(`example`, country);
  });