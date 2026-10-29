import assert from 'node:assert/strict';
import {catalog,shops,updateBasket,basketLines,linePrice,estimate,compareShops} from '../src/automotive-data.js';
const get=id=>catalog.find(item=>item.id===id);
assert.deepEqual(updateBasket({},'sensor',1),{});
assert.deepEqual(updateBasket({},'oil',3),{oil:1});
assert.deepEqual(updateBasket({},'battery',200),{battery:5});
assert.deepEqual(updateBasket({oil:1},'oil',-1),{});
assert.deepEqual(updateBasket({oil:1},'oil',NaN),{});
assert.deepEqual(updateBasket({},'unknown',1),{});
assert.equal(estimate({oil:1,'cabin-filter':1},'sedan','downtown'),98);
assert.equal(linePrice(get('oil'),'suv','downtown'),82.88);
assert.equal(linePrice(get('battery'),'truck','downtown'),169);
assert.equal(estimate({tire:4},'sedan','downtown'),516);
assert.equal(estimate({sensor:1},'sedan','downtown'),0);
for(const vehicle of ['sedan','suv','truck'])for(const area of ['downtown','riverside','northside']){
 const basket={oil:1,battery:2,'brake-labor':1};
 const comparisons=compareShops(basket,vehicle,area);
 assert.equal(comparisons.length,3);
 assert.ok(comparisons[0].total<=comparisons[1].total&&comparisons[1].total<=comparisons[2].total);
 for(const shop of shops){const lines=basketLines(basket,vehicle,area,shop);assert.equal(estimate(basket,vehicle,area,shop),Math.round(lines.reduce((sum,line)=>sum+line.total,0)*100)/100);assert.equal(lines.reduce((sum,line)=>sum+line.quantity,0),4)}
}
assert.ok(compareShops({},'sedan','downtown').every(shop=>shop.total===0));
const itemWinners={oil:'copperline',rotate:'piston',diagnostic:'milepost',alignment:'piston','brake-labor':'piston','battery-labor':'milepost','cabin-filter':'copperline',wipers:'piston',battery:'piston','brake-pads':'milepost',tire:'copperline'};
for(const [id,winner] of Object.entries(itemWinners)){
 for(const vehicle of ['sedan','suv','truck'])for(const area of ['downtown','riverside','northside'])assert.equal(compareShops({[id]:1},vehicle,area)[0].id,winner,`${id} winner`);
}
assert.equal(compareShops({oil:1,'cabin-filter':1},'sedan','downtown')[0].id,'copperline');
assert.equal(compareShops({alignment:1,'brake-labor':1},'sedan','downtown')[0].id,'piston');
assert.equal(compareShops({diagnostic:1,'battery-labor':1},'sedan','downtown')[0].id,'milepost');
console.log('Passed: stock limits, service limits, removal, quantities, vehicle/area adjustments, itemized totals, empty baskets, and comparison sorting.');
