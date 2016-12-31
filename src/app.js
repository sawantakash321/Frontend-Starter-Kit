import './styles/global.css';

import { load } from './scripts';
import firebaseConfig from './assets/datas/firebase.config.json';

import luyou from './scripts/luyou';

import { home } from './pages/home';
import { about } from './pages/about';
import { contact } from './pages/contact';
import { error } from './pages/error';

Promise.all([
    load('https://fonts.googleapis.com/icon?family=Material+Icons')
  ])
  .then((result) => {
    const style = document.createElement('style');
    style.innerHTML = result[0];
    document.head.appendChild(style);
  });

firebase.initializeApp(firebaseConfig);

/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('service-worker.js')
    .then((registration) => {
      registration.onupdatefound = () => {
        if (navigator.serviceWorker.controller) {
          let installingWorker = registration.installing;

          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.log('New or updated content is available.');
                } else {
                  console.log('Content is now available offline!');
                }
                break;
              case 'redundant':
                throw new Error('The installing service worker became redundant.');
            }
          };
        }
      };
    });
}*/

home();
about();
contact();
error();
luyou();
