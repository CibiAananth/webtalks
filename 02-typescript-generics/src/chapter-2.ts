// dynamic function parameter with generics. `whatIsPassesIn`

function whatIsPassesIn<T>(data: T) {
  return data;
}

// const whatIsPassesIn = <T>(data: T)=>{

// }

const string = whatIsPassesIn("data");
string.invalid(); // no error

const number = whatIsPassesIn(1);
number.toFixed();
