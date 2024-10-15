const returnWhatIPassIn = (input: any) => {
  return input;
};
const str = returnWhatIPassIn("matt");
str.invalid(); // No error here!

const returnWhatIPassIn2 = <T>(input: any): T => {
  return input;
};

const str1 = returnWhatIPassIn2("str");
str1.charAt(1);

const returnWhatIPassIn3 = <T>(input: T): T => {
  return input;
};

const str3 = returnWhatIPassIn3("str");
str3.charAt(1);
