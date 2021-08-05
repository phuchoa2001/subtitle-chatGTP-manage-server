function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
function Rrandomnumber () {
  return s4() +  s4() + s4() + '-' + s4() +  s4() + s4() + '-' + s4() +  s4() + s4() + '-' + s4() +  s4() + s4() + '-'
 + s4() +  s4() + s4() + '-' + s4() +  s4() + s4() + '-' + s4() +  s4() + s4() + '-' + s4() +  s4() + s4() + '-'
} 
function resultRrandomnumber () { //Tạo ra Mẫu số từ nhiên
    const number = Rrandomnumber();
    return number;
}
module.exports = resultRrandomnumber;