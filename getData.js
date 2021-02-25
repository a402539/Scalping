state = null; // BTC // USD
high = null; low = null; toBuy = 1.001; toSell = 1/1.001;
balance = 100; delay=1000; iters = 1200;
iter = 0; laststate = null;
function getData() {
    iter += 1;
	let node = document.body.getElementsByClassName('trade-management__main-items--down')[0];
	node = node.children[node.children.length - 3];
	let price1 = node.getAttribute('data-price');

	node = document.body.getElementsByClassName('trade-management__main-items--up')[0];
	node = node.children[0].children[0];
	let price2 = node.getAttribute('data-price');
    //console.log(iter);
    if (!state) {
            state = 'USD';
            low = price1;
            console.log('initialisation','state=',state,'low=',low);
        }
    else if (state == 'USD') {
            if (low){
                if (price1>low*toBuy){
                    state = 'BTC'; balance = balance / price1;
                    //console.log('  state from USD to BTC, low->null; state, oldlow, balance', state, low, balance, (balance * price2).toFixed(4));
                    low = null;
                }
                else if (price1 < low) {
                    //console.log('  state=USD, low!=null, price1<low; price1, oldlow, newlow', price1, low,price1);
                    low = price1;
                }
                //else console.log('  state=USD, low!=null, price1>=low, price1<=low*toBuy; state, price1,low,low*toBuy', state, price1, low, (low * toBuy).toFixed(4));
            }
            else {
                //console.log('  state=USD, low!=null, price1>=low, price1<=low*toBuy; state,price1,low,newlow', state, price1, low, price1);
                low = price1;
            }
        }
    else {
        //console.log('state=',state,'high=',high);
        if (high){
            if (price2<high*toSell){
                //console.log('  state=BTC, high!=null, price2<high*toSell; state, newstate, price2, high, toSell, high*toSell', state, 'USD', price2, high, toSell, high * toSell);
                state = 'USD'; balance = balance * price2;
                high = null;
            }
            else if (price2 > high){
                //console.log('  state=BTC, high!=null, price2>high; state, price2, high, newhigh', state, price2, high, price2);
                high = price2;
            }
        }
        else {
            //console.log('  state=BTC, high!=null, price2>high; state, price2, high, newhigh', state, price2, high, price2);
            high = price2;
        }
    }
    newstate = [price1, price2, high, low, balance.toFixed(8), state, state == 'BTC' ? (balance * price2).toFixed(4) : ''];
	//console.log(newstate);
    if (laststate)
        if (laststate!=newstate){
	        console.log(newstate, state == 'BTC' ? balance * price2 : '');
            laststate = newstate;}
    else {
        console.log(newstate, state == 'BTC' ? balance * price2 : '');
        laststate = newstate;
    }
}
let timerId = setInterval(getData, delay);
setTimeout(() => {
    clearInterval(timerId);
    console.log('stop');
}, iters*delay);