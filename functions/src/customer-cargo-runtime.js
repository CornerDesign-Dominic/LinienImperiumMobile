// New orders use the regional catalog; saved orders and their transport terms
// are deliberately not rewritten. Cargo names do not determine mechanics.
for(const customer of CUSTOMERS){
 const cargo=customerCargo.customers[customer.id];
 if(cargo)Object.assign(customer,{products:cargo.products,preciousCargo:cargo.precious});
}
const originalCargoCreateOrder=createOrder;
createOrder=(id,options={})=>{
 const order=originalCargoCreateOrder(id,options);
 const cargo=customerCargo.customers[order.customer];
 if(order.kind==='referral'&&cargo)order.cargo=cargo.precious;
 else if(['normal','special'].includes(order.kind)){
  const products=cargo?cargo.products:customerCargo.basic;
  order.cargo=options.starter?products[0]:pick(products);
 }
 return order;
};
