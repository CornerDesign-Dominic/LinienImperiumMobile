// New orders use the regional catalog; saved orders and their transport terms
// are deliberately not rewritten. Cargo names do not determine mechanics.
for(const customer of CUSTOMERS){
 const cargo=customerCargo.customers[customer.id];
 if(cargo)Object.assign(customer,{products:cargo.products,preciousCargo:cargo.precious});
}
const originalCargoCreateOrder=createOrder;
createOrder=(id,options={})=>{
 // Select unlocked customers without tying them to a transport category.
 // Once selected, normal customer orders independently roll their actual route.
 let actual=options;
 if((!options.kind||options.kind==='normal')&&!options.starter&&options.category!=='city'){
  let customer=options.customer;
  if(customer===undefined){const unlocked=CUSTOMERS.filter(c=>customerUnlocked(c.id));customer=unlocked.length&&Math.random()<CUSTOMER_OFFER_CHANCE?pick(unlocked).id:null;}
  actual={...options,customer,...(customer?{category:Math.random()<.5?'national':'international'}:{})};
 }
 const order=originalCargoCreateOrder(id,actual);
 const cargo=customerCargo.customers[order.customer];
 if(order.kind==='referral'&&cargo)order.cargo=cargo.precious;
 else if(['normal','special'].includes(order.kind)){
  const products=cargo?cargo.products:customerCargo.basic;
  order.cargo=options.starter?products[0]:pick(products);
 }
 return order;
};
