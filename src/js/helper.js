import { TIMEOUT_SECONDS } from './config.js';
import { key } from './config.js';
import { Fraction } from 'fractional';

//*timeout
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
//* from lesson 26 after refactoring getJson and sendJson function into just one function named ajax
export const ajax = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: `POST`,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

    const data = await res.json();

    //* for error handling (if the url we used inside the fetch method is wrong )
    if (!res.ok) throw new Error(`${data.message} ${data.status} 🔥🔥🔥`);
    return data; //* as getJson() is async function so this return data will be resolved value of the promise which will be returned by this async function so remember we need to await for it to access the resolved value from the promise.
  } catch (err) {
    throw err; //*now what are we going to do with the error here of course we could log it or alert it as always to the console but let's say we actually want to handle that error in the showRecipes(now controlRecipes) function so where we will actually use to getJson method , so that' why ne need to re throw this error so then if error happens then the error will be returned and then we will be able to catch this return error in the showRecipes(now controlRecipes) function.so we basically we propagated the error down from one async function to the other by re throwing the error here in this catch block.
  }
};
