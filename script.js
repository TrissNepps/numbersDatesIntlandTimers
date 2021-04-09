'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-03-24T17:01:17.194Z',
    '2021-03-27T23:36:17.929Z',
    '2021-03-28T10:51:36.790Z',
    //edited two dates to my date to check for function working
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed2 = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed2(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0); //1 gets
    // const year = date.getFullYear();

    // return `${day}/${month}/${year}`; //this all being replaced with a new nicely formatted date
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value); //ths is a standalone reusable function that takes any value locale and currencey and returns the value nicely formatted for that locale and currency
};
// const displayMovements = function (movements, sort = false) {
//   containerMovements.innerHTML = ''; //besides just these movements we also want to display the time that they occurred but we are only passing in the movements array - however we also want the movementDates so best method is to pass in the entire account into the function like we do for calcdisplaybalance and summer. So the edited function above is below.

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // acc.movementsDates[i]//lets us loop over two arrays at once. We call foreach on one of them (movements) then we use the current index to get the data from some other array at the same position bc we are using the same index. So we need to create a new date out of that above as shown below:

    // const date = new Date(acc.movementsDates[i]); //this will give us a nicely formatted timestring thart we can use to create a new date object. We need the object so we can call our usual methods to get the day mont and yea. This is why we need to convert the strings back to a JS object bc only then can we work with the data

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0); //1 gets
    // const year = date.getFullYear();

    // const displayDate = `${day}/${month}/${year}`;
    // const calcDaysPassed2 = (date1, date2) =>
    //   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); //All of this from const date to this line are being cut and put into their own function
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
      // } ${type}</div>
      //     <div class="movements__date">${displayDate}</div>
      //     <div class="movements__value">${mov.toFixed(2)}€</div>

      //   </div>
    } ${type}</div>
  <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${formattedMov}</div>

</div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(Math.trunc(time % 60)).padStart(0, '0'); //this gives 40 as the remainder
    //then in each call print the remaining time to the UI,
    labelTimer.textContent = `${min}:${sec}`;

    //wehen time = 0, stop timer and log out user.
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrease 1 second each call
    time--;
  };
  //set time to 5 min,
  let time = 120;

  //then call timer every second,
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//Fake always LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//dexperimenting with the API
// const noww = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'numeric', //can also write long which writes the name of the month instead of the number. or 2-digit which gives 0#
//   year: 'numeric', //can also do 2-digit
//   weekday: 'long',
// };

// const locale = navigator.language;
// console.log(locale);//gives en-US bc that is where I am at

// labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(noww); //we want this to be set to a date so we will use the internationalization API//we need to pass in a local string containing the language and country as the argument like we did that will create a formatter for the language and country specified (en-US)        this creates a new formatter and on that we can call .format where we can pass the date we want to format! or 'ar-SY' which is arabic for Syria. To get different codes google iso language code table and use lingoes.net to find the country and code desired

//There is another way we can do this to add customiation options, such as diplaying time by adding an options object to the function (const options) then we have to provide that object as a 2nd argument in the DateTimeFormat method

//often time best to get the info about the time and language from the users browser directly instead of trying to input manually. const locale

// const noww = new Date();
// labelDate.textContent = noww; //dont use now as a const or let name. this gives us funy format but we want it in day/month/year format
//so we need vaariables for each
// const day = `${noww.getDate()}`.padStart(2, 0);
// const month = `${noww.getMonth() + 1}`.padStart(2, 0); //1 gets added bc it is 0 based and the padstart adds the 0 before the 3 to format months correctly
// const year = noww.getFullYear();
// const hour = noww.getHours();
// const minutes = noww.getMinutes();

// //Now we just need to build a string with the variables defined above
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`; //the time stays static until we get into timers

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // create current date and time
    const noww = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //can also write long which writes the name of the month instead of the number. or 2-digit which gives 0#
      year: 'numeric', //can also do 2-digit
      // weekday: 'long',
    };

    // const locale = navigator.language;
    // console.log(locale); //gives en-US bc that is where I am at

    // labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(
    //   noww
    // ); //now the date is only formatted when the user logs in. the accounts above were made to be one in us and one in portugal. so now we will use these locals to display jonas in portugese and jessica in american
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(noww); //now when I log into jonas it shows in portugese and jessica shows american but the rest of the user interface is still all in Egnlish. so we removed the weekday so the words went away but the date and time format is same as that country

    // labelDate.textContent = noww;
    // const day = `${noww.getDate()}`.padStart(2, 0);
    // const month = `${noww.getMonth() + 1}`.padStart(2, 0);
    // const year = noww.getFullYear();
    // const hour = `${noww.getHours()}`.padStart(2, 0);
    // const minutes = `${noww.getMinutes()}`.padStart(2, 0); //All of this block will be erased and replaced with the internationalization API that will do the formatting//move this outside the login so we can experiment with the API without having to always login

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    //This gives us the correct date and time ut if we try to transfer money the movement of the transfer gives Nan/Nan/Nan because that movement doesnt have any date so we need to fix so that whenever there is a new transfer or loan we need to not only push the new value into the movements array but also into the movements dates - we will fix this inside of transfer

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update /datetimes of transfers here
    currentAccount.movementsDates.push(new Date().toISOString()); //also add this to loan
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); //removes decimal from loan requests

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString()); //now we get dates for transfers and oans

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//Converting and Checking Numbers

//How to convert values to numbers, hw to check if values are numbers, and how to use numbers in JS

//In JS all numbers are represented internally as floated point numbers(always as decimals) no matter how we write them
console.log(23 === 23.0);

//also numbers represented internally in a 64 base 2 format which means they are always stored in a binarty format - only made of 0's and 1's   in this form it is hard to represent fractions which are easy to represent in the base 10 system we are used to (1-9) while binary is base 2 (0 - 1)

//Some numbers are hard to represent in base 2, like 0.1
console.log(0.1 + 0.2); //so you see all the repeating digits - in 0.1 an infinite fraction results in binary which makes the weird result like this one

//You cant do very scientific calculations in JS
console.log(0.1 + 0.2 === 0.3); //error in JS

//converting strings to numbers:
console.log(+'23'); //when JS sees the + sign it will do type coercion and convert the string to number. So now we will go through and refactor our code so that it matches this format

//Parsing - we can parse a number from a string - on the Number. object there are methods to do parsing. Now below we can specifiy a string and the string can have symbols to and JS will try to figure out the number in the string. For this to work the string needs to start with a number
console.log(Number.parseInt('30px'));
console.log(Number.parseInt('e30px')); //gives NaN

//also have parseFloat which reads the decimal number from the string as well where as parseInt would only take the 2
console.log(Number.parseFloat('2.5rem'));

//is Nan function can be used to check if a value is a number
console.log(Number.isNaN(20));
console.log(Number.isNaN('20')); //these are both asking is this not a number? gives false because there are not not a number - they are regular values - but if we try to convert a string to a number then this will be not a number so it is true
console.log(Number.isNaN(+'20X')); //this gives true because 20X is not a number

console.log(23 / 0); //this gives infinity which is also notNaN so we would get infinity here instead of true/false

//so isNaN is not the best method to check for numbers bc of these special cases so a better method exist below
console.log(Number.isFinite(20));
console.log(Number.isFinite('20')); //this gives false because it is not a number its a string

//so isFinite is best method for checking if a value is a number of not
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0)); //these gives false, even infinity because infinity is not finite. especially when working with floating point numbers.

//So use isNaN to check if a value is NaN

//to check if something is a number us isFinite unless using integers then you can use isInteger()

//New Section -- MAth and Rounding
////start with square root
console.log(Math.sqrt(25));

//cam do same using exponentiation operation as well
console.log(25 ** (1 / 2));
console.log(25 ** (1 / 3)); //for cubic roots or more!!!

//Max values
console.log(Math.max(5, 4, 77, '34', 244, 32)); //this uses type coercion but not parsing (so '34' woud work but not '34px')

//min
console.log(Math.min(4, 77, 6, 477, 4553, 34));

//claculatare radius of a circle with 10px
console.log(Math.PI * Number.parseFloat('10px') ** 2); //this calculates the area of a circle with this radius

console.log(Math.trunc(Math.random() * 6) + 1); //random number 1 - 6

//Now lets generalize this formula so we can use this to generate random integers between 2 values

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min; //this always gives a number between min and max
console.log(randomInt(10, 20)); //always gives results within range because Math.random() always gives a number between 0 and 1. So if we multiply this by (max - min) then we get a number between (max - min). Then if we add min to all of this then we to min to (max - min + min) which gives us between the min and max as specified

//What about rounding integers?
console.log(Math.trunc(23.3)); //removes the decimal to leave a whole number

//Also have round
console.log(Math.round(23.65));
console.log(Math.round(23.384));

//We have ceil which rounds up
console.log(Math.ceil(23.3, 23.9));

//flor rounds down
console.log(Math.floor(24.4, 24.9));

//for negative numbers trunc and floor do not work the same
console.log(Math.trunc(-23.65));
console.log(Math.floor(-23.384)); //floor works better than trunk no matter if pos or neg numbers

//decimals work differentl
console.log((2.7).toFixed(0)); //This converts to 3 a string. toFixed always returns a string.
console.log((2.7).toFixed(3)); //this added decimals until we had 3 slots filled
console.log((2.76775433).toFixed(2)); //rounds to only 2 decimal places. to conver to number can do like this
console.log(+(2.76775433).toFixed(2));

//boxing transforms to a number object so the method can be run and afterwards converts it back to a primitive

//Lets round the requested loan amount (150.42 -> 150

//then use toFix method to make our numbers look nicer so everything matches on the movements page -

//Next Section - The Remainder Operator
//this operator has some special use cases. This operator returns the remainder of a divison
console.log(5 % 2); //this gives us 1 because 1 is the remainder of 5 / 2

console.log(8 % 3); //gives 2

//can use to check if a number is even or odd as well - when is a number even? divisible by 2 with a remaider of 0
console.log(6 % 2); //gives 0

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(465789));

//Lets select all of the movement__row classes and then we will paint them based on some conditions
document.querySelectorAll('movements__row'); //this will return a node list so lets convert it to an array using the spread operator that will spread the elements into a new array. Then on that array we can call forEach.

//the code below has to be in a handller function because it will load right when the page loads but when we login then we override it - so we will activate it once we click balance.

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    //this is how we can color every 2nd row of the movements. check if current index is divisible by 2. If so then take the current row and change the style!

    //What if I wanted every third row another color?
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  }); //so whenever need to do something every n-th time then ramainer operator is good for that
});

//New Lesson - Working with BigInt
//bigInt is a special type of integer introcuded in ES2020. Numbers are represented internally as 64 bits which means either 64 1 or 0's to represent any number. Only 53 digits used to store the digits themselves the rest is for storing position of decimal point and sign.

//If only 53 bits available to store a number than that means there are limits on how big a number can be and we can calculate that
console.log(2 ** 53 - 1); //This gives the largest number than JS an safely represent

console.log(Number.MAX_SAFE_INTEGER); //this gives us the same number. Any integer larger than is is not safe and cant be duplicated accurately - so calculations with numbers bigger than these we lose precision

//This can be a problem in situations where we need big numbers like for database ID's or real 60 bit numbers. If an API gives us a number larger than that we cant store safely until now with bigInt and can be used to store numbers as large as we want
console.log(842349797592837735873297832879237898n); //the n transforms the regular number into a big int number - looks different in the console as well - so we can use big numbers now! Can also create bigints by using bigInt function

//What about operations with big ints? the usual operators still work the same
console.log(10000n + 10000n);
console.log(1065743553000n * 100034565234532450n);

//cannot mix bigInts with regular numbers
const huge = 483252376348762374628734n;
const numHH = 23;
console.log(huge * BigInt(numHH)); ///Gives error so first have to convert numHH to a big int

//compairson operators continue to work tho
console.log(20n > 15);
console.log(20n === 20); //false bc js doesnt do type coercion. 20n is a bigint and 20 is regular so they are not the same so they get false

//logical operators and string concatenations are exceptions
console.log(20n == 20);
console.log(huge + ` is REALLY big!!!`);

//MAth operations do not work with bigInt like below
// console.log(Math.sqrt(16n));//gives error

//What happens with divisions?
console.log(10n / 3n); //returns the closest bigInt which is 3n

//New Section - Creating Dates
//Dates and times can be messy and confusing. first we need to create a date of which tere are four ways
//1) use the new date constructor
const now = new Date();
console.log(now);

//2) you could also parse the date from a date string
console.log(new Date('on Mar 29 2021 12:43:58'));

//3) we could write the string ourself
console.log(new Date('December 24, 2015')); //generally not ao good idea to do this because not so reliable unless the string was created by JS

//in our account1 object we now have movement dates so lets try to parse the strings
console.log(new Date(account1.movements[0])); //this works bc JS created the date

//we can pass in year, month, day , hour and second
console.log(new Date(2037, 10, 19, 15, 23, 5)); //JS autocorrects the day
console.log(new Date(2037, 10, 31)); //This autocorrects to Dec 1st because november does not have 31 days. Remember it is november even though the month value is set to 10 because arrays start at 0

//4) can pass into the date constructor function the time of ms passed since Jan 1, 1970.
console.log(new Date(0)); //This gives us Dec 31, 1969. Now create a day three days later

console.log(new Date(3 * 24 * 60 * 60 * 1000)); //Gives us jan 03, 1970 which is 3 days later gives us a timestamp.

//These dates are a special type of object so they have their own methods that allow us to set or get components of a date

//Create a date below and store to variable
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);

console.log(future.getFullYear()); //this gives us the year only. Always use this one.

console.log(future.getMonth('November')); //remember this is 0 based so it gives 10 and not 11

console.log(future.getDate());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); //foollows an international standard - great for converting date objects into strings for storage

//we can also get timestamp for thae date which is the ms passed since jan 1, 1970

console.log(future.getTime());

console.log(new Date(2142274980000)); //gives the date

//time stamps very important so there is a method used to get it for current time
console.log(Date.now()); //This gives us the time stamp

//also set versions for these methods
future.setFullYear(2040);
console.log(future); //this sets the year to the future - have same for set month and set day and use auto correction

//New lossin - Adding Dates to Bankist App

//Now lets implement dates in the bankist app - first need to see where we have dates in our application - first under current balance and then also in each of the movements

//first we will take care of the date which goes underneath Current Balance. First we need to fake it that we are always logged int. it uses the class name date which is selected at labelDate.

//New Lesson - Operations with Dates
//we can do calculations with dates, like subtractions, to calculate how many days have passed - this works bc when we convert a date to a number we are given the time stamp in ms which can be used to then perform calculatons - so time stamps!

const futureA = new Date(2037, 10, 19, 15, 23);
console.log(Number(futureA));
console.log(+futureA); //same as above without using Number method

//if we subtract one date from another we get a timestamp in ms that we can then convert back to what we want

//LEts create a function that takes in two dates and returns the number of days that passed between the two dats

const calcDaysPassed = (date1, date2) =>
  (date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1); //this gives us 864000000 ms that we can then convert by assing / (1000 * 60 * 60 * 24) to convert the ms back into days like we desire which gives us 10 days
const days2 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
console.log(days2); //this gives - 10 days

//best method using Math.abs() is below
const calcDaysPassed2 = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const days3 = calcDaysPassed2(new Date(2037, 3, 14), new Date(2037, 3, 4));
console.log(days3); //this gives 10 without the minus

//If need very precise calculations then should use date library like moment.js which is available for free but for simple like this this should be fine.

//Add some hours and mnutes to the calcDaysPassed
const days4 = calcDaysPassed(
  new Date(2037, 3, 14),
  new Date(2037, 3, 24, 10, 8)
);
console.log(days4); //this gives 10.42 days which we may not want so can use math.round

//Now lets use this function we created to create nice formatted dates so that if the movement happened today the movement will display today instead of the regular date format. If it was yesterday then we write yesterday. If a couple days ago then 2 days or 5 days ago instead of the date. This is a nice use case of using a function like we have created. It was put in the displayMovements function above

//New class -- Internationalizing Dates (Intl)
//this is a new API which allows us to easily format numbers and strings according to different languages so our application can support different languages around the world - like currencies and dates which are shown differently around the world - this API can do a lot but we will just talk about formatting dates and numbers starting with dates

//we have dates in two places, under the current balance and alongside the movements - go to the place where the date under current balance is which is in the login handler function under create current date and time

//New Lesson - Internationalizing Numbers (Intl)
//experiments before we do application work
const numD = 34543454.23;

console.log('US: ', new Intl.NumberFormat('en-US').format(numD));
//this gives the nuber above formatted with commas like in the USA
console.log('Germany: ', new Intl.NumberFormat('de-DE').format(numD));
console.log('Syria: ', new Intl.NumberFormat('ar-SY').format(numD));
//so you can see how the numbers are formatted differently between different countries as shown

//to use the navigator local looks like this
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(numD)
); //this lets the browser detect which api style to use based on user login location

//lets deine an object now
const options = {
  style: 'unit', //change change to percent or currency too
  unit: 'mile-per-hour', //can change to celsius or others
  //currency: 'EUR', this must be included if you are doing currency as the unit
  // useGrouping: false,
};
console.log('US: ', new Intl.NumberFormat('en-US', options).format(numD));

console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(numD));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(numD));

console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(numD)
);

//now lets implement currencies in our application starting with in the movements function at display movements function where we did ${mov.toFixed(2)}E   the E was the euro sign we manually input but now we want the internationalization API to take care of all of so scroll up to see what was done   const formattedMovement =

//New Lesson - Timers: setTimeout and setInterval
//two kinds of timers as shown above - setTImeout runs once while setInterval keeps running until stopped

//settimeout good for exceuting some code in the future, like orderig a pizza which does not arrive right away but takes time

setTimeout(() => console.log(`Here is your Pixxa 💖`), 3000); //set timeout will call this callback function in the future - when? We have to specify in the second argument in ms which shows the message(runs the code) after 3 seconds - we scheduled the function call for 3 seconds later

//the code exuction does not stop at the setTimeout function point. It registers the callback function to be called later and the code execution continues on without waiting for the callback function

console.log(`waiting`); //the pizza call comes after! //this is called asyncronous JS

//what if we needed to pass arguments into the function? We are not calling the function ourselves using () so we cant pass arguments - however the setTimeout function has a solution wher all the arguments passed after the delay will be considered arguments of the function

setTimeout(
  (ing1, ing2) => console.log(`Here is your Pixxa 💖 with ${ing1} and ${ing2}`),
  3000,
  'olives',
  'spinach'
);
//You can cancel the timer until the delay before the 3 seconds have passed. Example below:
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your Pixxa 💖 with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); //since the array does contain spinach now you wont see the message printed to the console

//now lets go back to our application to simulate the approval of our loan since a bank usually takes time to decide if a loan will get approved so we will simulate it by taking 2 or 3 seconds.

//setTimeout callback function only called once - what if we want to rerun the function every 5 min or 10 sec?

//setInterval
setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000); //this gives us the current time to the console each second

//New Lesson - Implementing a Countdown Timer -- last part of Bankist app

//for security reasons bank apps logout customers after a period of inactivity - we will do that here using setInterval timer
