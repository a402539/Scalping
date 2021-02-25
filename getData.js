state = null; // BTC // USD
high = null; low = null; toBuy = 0.1; toSell = -0.1;
balance = 100; delay=10000; iters = 60;
iter = 0; laststate = null; 
lastprice1 = null, lastprice2 = null; lastdeal = null;
price1 = null, price2 = null;
function getData() {
    iter += 1;
	let node = document.body.getElementsByClassName('trade-management__main-items--down')[0];
	node = node.children[node.children.length - 3];
	price1 = node.getAttribute('data-price');

	node = document.body.getElementsByClassName('trade-management__main-items--up')[0];
	node = node.children[0].children[0];
	price2 = node.getAttribute('data-price');

    
    deal = Number(document.getElementsByClassName('trade-management__main-price last-price-left')[0].innerText.replace(',', ''));
    deltaup = document.getElementsByClassName('trade-management__main-price-sum last-price-delta-left trade-delta-up');
    deltadown = document.getElementsByClassName('trade-management__main-price-sum last-price-delta-left trade-delta-down');
    delta = Number(deltaup.length ? deltaup[0].innerText : deltadown.length ? '-' + deltadown[0].innerText : '');
    deltaproc = delta/deal;
    
    //if (deal != lastdeal) console.log(iter, lastdeal, delta, deal);

    txt = '';
    if (price1!=lastprice1){
        txt = txt + 'buy ' + lastprice1 + '->' + price1 + ' (' + (100*price1 / lastprice1 - 100).toFixed(4) + '%) ';
        lastprice1 = price1;
    }
    if (price2 != lastprice2) {
        txt = txt + 'sell ' + lastprice2 + '->' + price2 + ' (' + (100*price2/lastprice2-100).toFixed(4) + '%) ';
        lastprice2 = price2;
    }
    if (deal != lastdeal) {
        txt = txt + 'deal ' + lastdeal + '->' + deal + ' delta =' + delta + ' (' + (100*deltaproc).toFixed(4) + '%) ';
        if (lastdeal && deal != lastdeal + delta) console.log(iter, 'error: lastdeal, delta, deal', lastdeal, delta, deal);
        lastdeal = deal;
    }
    if(iter>1 && txt != ''){
        console.log(iter, txt);
    }

    if (!state) {
            state = 'USD';
            low = price1;
            console.log('initialisation','state=',state,'low=',low,'delay=',delay,'iters=',iters);
        }
    else if (state == 'USD') {
            if (low){
                if (deltaproc > toBuy){ //(price1>low*toBuy){
                    state = 'BTC'; balance = balance / price1;
                    console.log(iter,'SWITCHed from USD to BTC, balance=', (balance*price2).toFixed(4));
                    //console.log('  state from USD to BTC, low->null; state, oldlow, balance', state, low, balance, (balance * price2).toFixed(4));
                    low = null;
                }
                else if (deal < low){ //(price1 < low) {
                    //console.log('  state=USD, low!=null, price1<low; price1, oldlow, newlow', price1, low,price1);
                    low = deal; //price1;
                }
                //else console.log('  state=USD, low!=null, price1>=low, price1<=low*toBuy; state, price1,low,low*toBuy', state, price1, low, (low * toBuy).toFixed(4));
            }
            else {
                //console.log('  state=USD, low!=null, price1>=low, price1<=low*toBuy; state,price1,low,newlow', state, price1, low, price1);
                low = deal; //price1;
            }
        }
    else {
        //console.log('state=',state,'high=',high);
        if (high){
            if (deltaproc < toSell){ //(price2<high*toSell){
                state = 'USD'; balance = balance * price2;
                console.log(iter, 'SWITCHed from BTC to USD, balance=', balance.toFixed(4));
                //console.log('  state=BTC, high!=null, price2<high*toSell; state, newstate, price2, high, toSell, high*toSell', state, 'USD', price2, high, toSell, high * toSell);
                high = null;
            }
            else if (deal > high){ // (price2 > high){
                //console.log('  state=BTC, high!=null, price2>high; state, price2, high, newhigh', state, price2, high, price2);
                high = deal; //price2;
            }
        }
        else {
            //console.log('  state=BTC, high!=null, price2>high; state, price2, high, newhigh', state, price2, high, price2);
            high = deal; //price2;
        }
    }
    newstate = [price1, price2, deal, high, low, balance.toFixed(8), state, state == 'BTC' ? (balance * price2).toFixed(4) : ''];
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
    console.log('stop', (state == 'BTC' ? balance * price2 : balance).toFixed(4));
}, iters*delay);