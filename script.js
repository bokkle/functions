'use strict';

// DEFAULT PARAMETERS
//sometimes useful to have functions where some params are set by default
//this way we don't have to pass them in manually

const bookings = [];
//just input the default values right with the parameter
//
const createBooking = (
  flightNum,
  numPassengers = 1,
  price = 199 * numPassengers
) => {
  // ES5
  // numPassengers = numPassengers || 1;
  // price = price || 199;

  //make sure obj & params have same order (flightNum, numPassengers, price)
  const booking = {
    flightNum,
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};
createBooking('LH123'); // {'LH123', 1, 199}

//passing price in overrides the default
createBooking('LH123', 2, 800); // {'LH123', 2, 800}

//price computed right when passed in
createBooking('LH123', 2); // {'LH123', 2, 398}
createBooking('LH123', 5); // {'LH123', 5, 995}

//cannot skip arguments when calling the function, the 2nd argument
//is always mapped to the 2nd paramerter
//just use UNDEFINED to skip. Same as not setting it
createBooking('LH123', undefined, 1000); // {'LH123', 1, 1000}

// --- HOW PASSING ARGS WORKS ---
// --- VALUE VS REFERENCE ---

const flight = 'LH234';
const mitch = {
  name: 'Mitch Oblock',
  passport: 1234567890,
};

const checkIn = (flightNum, passenger) => {
  flightNum === 'LH234' ? 'LH199' : 'Delayed';
  passenger.name = `Mr. ${passenger.name}`;

  if (passenger.passport === 1234567890) {
    console.log('Check in');
  } else {
    console.log('Wrong passport!');
  }
};
checkIn(flight, mitch);
// 'LH234' bc flightNum is only a copy of the flight value
// this is bc it is a primitive type
console.log(flight); // LH234
//this updates bc for OBJECTS (this includes arrays), passenger is not a copy
//you actually manipulate the mitch object
console.log(mitch); // Mr. Mitch Oblock

const newPassport = (person) => {
  return (person.passport = Math.trunc(Math.random() * 1000000000));
};
console.log(newPassport(mitch));
//since 2 functions are manipulating the same object,
//it is creating a problem (wrong passport)
checkIn(flight, mitch);

// passing by value vs passing by reference
// JS DOES NOT HAVE PASSING BY REFERENCE, ONLY VALUE
// primitive (strings, nums, etc) = pass by value
// objects/arrays = pass by sharing (origional is modified)

// --- FIRST CLASS FUNCTIONS VS HIGHER ORDER FUNCTIONS ---

// first class:
// -> functions are values
// higher order:
// -> func that receives a func, returns a func, or both
// -> ex. .addEventListener('click', greet)

// --- HIGHER ORDER EX ---

const oneWord = (str) => {
  return str.replace(/ /g, '').toLowerCase();
};

const upperFirstWord = (str) => {
  const [first, ...others] = str.split(' ');
  return [first.toUpperCase(), ...others].join(' ');
};

//higher order:
const transformer = (str, fn) => {
  console.log(`Original string: ${str}`);
  console.log(`Transformed string: ${fn(str)}`);
  console.log(`Transformed by: ${fn.name}`);
};
//just pass the callback in, do not call it!!!!
transformer('JavaScript is the best!', upperFirstWord);
transformer('JavaScript is the best!', oneWord);

//JS uses callbacks all the time
//makes it easy to split code into more reusable, interconnected parts
//callbacks allow us to create abstraction:
//hide the detail of some code implementation, delegating to lower funcs
const high5 = () => {
  console.log('SLAP');
};
document.body.addEventListener('click', high5);

['Mitch', 'Daryl', 'Matt'].forEach(high5);

// my own higher order example
const generateStrength = () => {
  //strength from 1-99
  const strength = Math.ceil(Math.random() * 99);
  return strength;
};

const generateDefence = () => {
  const defence = Math.ceil(Math.random() * 99);
  return defence;
};

const generateAtk = () => {
  const atk = Math.ceil(Math.random() * 99);
  return atk;
};

const buildCharStr = (strength, attack, defence) => {
  const charLvl = Math.trunc((strength + attack + defence) / 3);
  return `Character level: ${charLvl}
Strength: ${strength}
Attack: ${attack}
Defence: ${defence}
  `;
};
console.log(buildCharStr(generateStrength(), generateAtk(), generateDefence()));

// --- FUNCTIONS THAT RETURN NEW FUNCTIONS ---
const greet = (greeting) => {
  return (name) => {
    console.log(`${greeting} ${name}`);
  };
};

const greeterHey = greet('hey');
greeterHey('Mitch');
greeterHey('Chief Keef');

greet('Hello')('Sosa');

// THE CALL AND APPLY METHODS
const lufthansa = {
  airline: 'Lufthansa',
  iataCode: 'LH',
  bookings: [],

  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

lufthansa.book(239, 'Mitch');
lufthansa.book(635, 'Johnny Bravo');
console.log(lufthansa);

const eurowings = {
  airline: 'Eurowings',
  iataCode: 'EW',
  bookings: [],
};

const book = lufthansa.book;

//this is now considered a regular function, and not a method. Therefore,
//the 'this.' keyword inside of the function will point to UNDEFINED

// book(23, 'Sarah Lalee') //DOES NOT WORK

//how to fix?
//tell JS manually what the this. keyword should do
//CALL, APPLY, AND BIND
book.call(eurowings, 23, 'Sarah Lalee')
//the first arg above, tells the THIS keyword where to point
//the following 2 arguments are flightNum and name, respectively
console.log(eurowings)

book.call(lufthansa, 239, 'Patrizz')
console.log(lufthansa)

//the order of the property names dont have to be the same, but they
//should be
const swiss = {
    airline: 'Swiss Air',
    iataCode: 'SA',
    bookings: []
}

book.call(swiss, 116, 'Oblock Ocho')

//APPLY METHOD
//does basically the same thing as call()
//differece: doesnt take argument list after the first, rather, takes
//an array of the arguments
const flightData = [583, 'George Cooper']
book.apply(swiss, flightData)
console.log(swiss)