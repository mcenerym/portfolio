export const catalog=[
 {id:'oil',name:'Full synthetic oil change',kind:'Service',category:'Maintenance',price:74,duration:'45 min',stock:null,icon:'oil',description:'Includes up to 5 quarts of oil, a standard filter, and labor.',unit:'per visit',popular:true},
 {id:'rotate',name:'Tire rotation & balance',kind:'Service',category:'Tires & wheels',price:59,duration:'45 min',stock:null,icon:'tire',description:'Rotate and balance four existing wheels. Tires sold separately.',unit:'per vehicle'},
 {id:'diagnostic',name:'Diagnostic scan',kind:'Service',category:'Diagnostics',price:95,duration:'60 min',stock:null,icon:'scan',description:'Read fault codes and prepare an initial diagnostic report.',unit:'per visit'},
 {id:'alignment',name:'Four-wheel alignment',kind:'Service',category:'Tires & wheels',price:119,duration:'60 min',stock:null,icon:'wheel',description:'Check and adjust alignment. Replacement parts are not included.',unit:'per vehicle',popular:true},
 {id:'brake-labor',name:'Brake pad installation',kind:'Service',category:'Brakes',price:145,duration:'90 min',stock:null,icon:'brake',description:'Labor for one axle. Add a pad set separately; rotors are not included.',unit:'one axle'},
 {id:'battery-labor',name:'Battery installation',kind:'Service',category:'Electrical',price:35,duration:'30 min',stock:null,icon:'battery',description:'Installation labor only. Add a replacement battery separately.',unit:'per vehicle'},
 {id:'cabin-filter',name:'Cabin air filter',kind:'Part',category:'Maintenance',price:24,stock:12,icon:'filter',description:'Standard replacement cabin filter. Supply only; installation excluded.',unit:'each',sku:'TG-CF210'},
 {id:'wipers',name:'All-weather wiper set',kind:'Part',category:'Maintenance',price:38,stock:8,icon:'wiper',description:'A pair of all-weather blades. Supply only; fitment is illustrative.',unit:'per pair',sku:'TG-WP240'},
 {id:'battery',name:'12V premium battery',kind:'Part',category:'Electrical',price:169,stock:5,icon:'battery',description:'Standard 12V replacement battery. Supply only; no core charge in this demo.',unit:'each',sku:'TG-BT650'},
 {id:'brake-pads',name:'Ceramic brake pad set',kind:'Part',category:'Brakes',price:68,stock:6,icon:'brake',description:'One axle set. Installation labor is priced separately.',unit:'one axle set',sku:'TG-BP420'},
 {id:'tire',name:'Touring all-season tire',kind:'Part',category:'Tires & wheels',price:129,stock:16,icon:'tire',description:'Illustrative 205/55R16 tire. Supply only; mounting excluded.',unit:'per tire',sku:'TG-TS160'},
 {id:'sensor',name:'Oxygen sensor',kind:'Part',category:'Diagnostics',price:89,stock:0,icon:'scan',description:'Replacement sensor. Currently unavailable in the sample inventory.',unit:'each',sku:'TG-OS110'},
];
export const areas=[{id:'downtown',name:'Downtown',adjustment:1},{id:'riverside',name:'Riverside',adjustment:.96},{id:'northside',name:'Northside',adjustment:1.05}];
export const vehicleTypes=[{id:'sedan',name:'Sedan / compact',labor:1},{id:'suv',name:'SUV / crossover',labor:1.12},{id:'truck',name:'Pickup / light truck',labor:1.22}];
export const shops=[
 {id:'copperline',name:'Copperline Auto',distance:1.2,parts:1.06,labor:.94,overrides:{oil:.86,rotate:1.04,diagnostic:1.12,alignment:1.1,'brake-labor':1.05,'battery-labor':1.08,'cabin-filter':.89,wipers:1.03,battery:1.06,'brake-pads':1.08,tire:.91,sensor:1.04}},
 {id:'piston',name:'Piston & Pine Garage',distance:2.6,parts:.96,labor:1.08,overrides:{oil:1.08,rotate:.88,diagnostic:1.02,alignment:.89,'brake-labor':.9,'battery-labor':1.14,'cabin-filter':1.05,wipers:.87,battery:.94,'brake-pads':1.02,tire:1.06,sensor:1.09}},
 {id:'milepost',name:'Milepost Motor Works',distance:4.1,parts:1.12,labor:1.01,overrides:{oil:.98,rotate:1.1,diagnostic:.84,alignment:1.04,'brake-labor':1.12,'battery-labor':.8,'cabin-filter':.98,wipers:1.12,battery:1.01,'brake-pads':.88,tire:1.02,sensor:.9}},
];
export const usd=amount=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(amount);
export function quantityLimit(item){return item.kind==='Service'?1:item.stock}
export function updateBasket(basket,id,quantity){const item=catalog.find(i=>i.id===id);if(!item)return basket;const parsed=Number(quantity);const safe=Number.isFinite(parsed)?Math.max(0,Math.min(quantityLimit(item),Math.floor(parsed))):0;const next={...basket};if(safe)next[id]=safe;else delete next[id];return next}
export function linePrice(item,vehicleId='sedan',areaId='downtown',shop=null){const vehicle=vehicleTypes.find(v=>v.id===vehicleId)||vehicleTypes[0];const area=areas.find(a=>a.id===areaId)||areas[0];const vehicleFactor=item.kind==='Service'?vehicle.labor:1;const shopFactor=shop?(shop.overrides[item.id]??(item.kind==='Service'?shop.labor:shop.parts)):1;return Math.round(item.price*vehicleFactor*area.adjustment*shopFactor*100)/100}
export function basketLines(basket,vehicleId,areaId,shop=null){return catalog.filter(item=>basket[item.id]>0&&quantityLimit(item)>0).map(item=>{const quantity=Math.min(quantityLimit(item),Math.floor(basket[item.id]));const unitPrice=linePrice(item,vehicleId,areaId,shop);return {...item,quantity,unitPrice,total:Math.round(quantity*unitPrice*100)/100}})}
export function estimate(basket,vehicleId,areaId,shop=null){return Math.round(basketLines(basket,vehicleId,areaId,shop).reduce((sum,item)=>sum+item.total,0)*100)/100}
export function compareShops(basket,vehicleId,areaId){return shops.map(shop=>({...shop,total:estimate(basket,vehicleId,areaId,shop)})).sort((a,b)=>a.total-b.total)}
