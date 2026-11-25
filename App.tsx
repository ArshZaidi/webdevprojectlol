import React, { useEffect, useMemo, useRef, useState } from 'react';
import heroImg from 'container:///mnt/data/src/assets/7ac31e2099af0ccf-image_search_0_campus_coffee_shop_interior_students.png';
import spiceImg from 'container:///mnt/data/src/assets/904b3db849937b19-image_search_1_indian_thali_food_plate.png';
import greenImg from 'container:///mnt/data/src/assets/ccf3eb4875270be8-image_search_2_healthy_salad_bowl_food.png';
import noodleImg from 'container:///mnt/data/src/assets/05431970f1f45e0d-image_search_3_asian_noodle_bowl_food.png';
import burgerImg from 'container:///mnt/data/src/assets/9cf7954785b43beb-image_search_4_gourmet_burger_food_photography.png';
import dolceImg from 'container:///mnt/data/src/assets/2cec38c01ee35370-image_search_5_dessert_pastry_cafe_food.png';

// ---------- API ----------
async function api(action:string, args:any){
  const res = await fetch("actions", {method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({action, args})});
  const j = await res.json().catch(()=>({}));
  if(!res.ok || j.error) throw new Error(j.error || `Request failed (${res.status})`);
  return j.data;
}
const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();

// ---------- DATA ----------
type Outlet={id:string;name:string;cuisine:string;location:string;open:boolean;base:number;rating:number;img:string;hours:string};
const OUTLETS:Outlet[]=[
 {id:'grind',name:'The Daily Grind',cuisine:'Coffee & Bakery',location:'North Quad, Block A',open:true,base:8,rating:4.6,img:heroImg,hours:'7:30 AM – 7:00 PM'},
 {id:'spice',name:'Spice Route',cuisine:'North Indian',location:'Central Court',open:true,base:14,rating:4.7,img:spiceImg,hours:'10:00 AM – 9:00 PM'},
 {id:'green',name:'Green Bowl',cuisine:'Healthy / Salads',location:'South Lawn',open:true,base:10,rating:4.5,img:greenImg,hours:'8:00 AM – 8:00 PM'},
 {id:'noodle',name:'Noodle House',cuisine:'Pan-Asian',location:'East Wing',open:true,base:12,rating:4.4,img:noodleImg,hours:'11:00 AM – 9:00 PM'},
 {id:'burger',name:'Burger Lab',cuisine:'Burgers & Fries',location:'West Block',open:false,base:11,rating:4.3,img:burgerImg,hours:'11:00 AM – 10:00 PM'},
 {id:'dolce',name:'Dolce',cuisine:'Desserts & Patisserie',location:'Library Corner',open:true,base:7,rating:4.8,img:dolceImg,hours:'9:00 AM – 8:00 PM'},
];
type Item={id:string;outletId:string;name:string;desc:string;price:number;category:string;dietary:string;available:boolean;prep:number;tags:string[];img:string};
const ITEMS:Item[]=[
 {id:'g1',outletId:'grind',name:'Cold Brew',desc:'Slow-steeped, smooth and chilled. Served over ice.',price:140,category:'Beverages',dietary:'Vegan',available:true,prep:4,tags:['Bestseller'],img:heroImg},
 {id:'g2',outletId:'grind',name:'Cappuccino',desc:'Double shot, velvety milk foam, dusted cocoa.',price:160,category:'Beverages',dietary:'Veg',available:true,prep:4,tags:[],img:heroImg},
 {id:'g3',outletId:'grind',name:'Butter Croissant',desc:'Flaky, golden, laminated layers. Baked this morning.',price:90,category:'Bakery',dietary:'Veg',available:true,prep:3,tags:['Bestseller'],img:heroImg},
 {id:'g4',outletId:'grind',name:'Paneer Tikka Sandwich',desc:'Smoky paneer, mint chutney, toasted sourdough.',price:180,category:'Mains',dietary:'Veg',available:false,prep:7,tags:['Spicy'],img:heroImg},
 {id:'s1',outletId:'spice',name:'Paneer Butter Masala + Naan',desc:'Creamy tomato gravy, two butter naans, onion salad.',price:220,category:'Mains',dietary:'Veg',available:true,prep:12,tags:['Bestseller'],img:spiceImg},
 {id:'s2',outletId:'spice',name:'Veg Biryani',desc:'Fragrant basmati, seasonal vegetables, raita.',price:190,category:'Mains',dietary:'Veg',available:true,prep:13,tags:[],img:spiceImg},
 {id:'s3',outletId:'spice',name:'Chole Bhature',desc:'Amritsari chole, fluffy bhature, pickled onion.',price:150,category:'Mains',dietary:'Veg',available:true,prep:10,tags:['Spicy'],img:spiceImg},
 {id:'s4',outletId:'spice',name:'Masala Chai',desc:'Slow-brewed with ginger, cardamom and lemongrass.',price:60,category:'Beverages',dietary:'Veg',available:true,prep:3,tags:[],img:spiceImg},
 {id:'gb1',outletId:'green',name:'Quinoa Power Bowl',desc:'Quinoa, roasted vegetables, chickpeas, tahini.',price:210,category:'Bowls',dietary:'Vegan',available:true,prep:8,tags:['Bestseller'],img:greenImg},
 {id:'gb2',outletId:'green',name:'Grilled Paneer Salad',desc:'Charred paneer, greens, cucumber, lemon dressing.',price:200,category:'Bowls',dietary:'Veg',available:true,prep:8,tags:[],img:greenImg},
 {id:'gb3',outletId:'green',name:'Avocado Toast',desc:'Sourdough, smashed avocado, chilli crunch, seeds.',price:170,category:'Mains',dietary:'Vegan',available:true,prep:6,tags:['New'],img:greenImg},
 {id:'gb4',outletId:'green',name:'Mango Smoothie',desc:'Mango, banana, oat milk, chia. No added sugar.',price:130,category:'Beverages',dietary:'Vegan',available:true,prep:4,tags:[],img:greenImg},
 {id:'n1',outletId:'noodle',name:'Veg Hakka Noodles',desc:'Wok-tossed noodles, spring onion, chilli oil.',price:160,category:'Mains',dietary:'Veg',available:true,prep:9,tags:['Bestseller'],img:noodleImg},
 {id:'n2',outletId:'noodle',name:'Paneer Chilli',desc:'Crisp paneer, peppers, soy-chilli glaze.',price:210,category:'Mains',dietary:'Veg',available:true,prep:10,tags:['Spicy'],img:noodleImg},
 {id:'n3',outletId:'noodle',name:'Veg Manchurian Bowl',desc:'Manchurian dumplings, fried rice, scallion.',price:180,category:'Bowls',dietary:'Vegan',available:true,prep:11,tags:[],img:noodleImg},
 {id:'n4',outletId:'noodle',name:'Thai Green Curry Rice',desc:'Coconut green curry, vegetables, jasmine rice.',price:230,category:'Mains',dietary:'Vegan',available:true,prep:12,tags:['New'],img:noodleImg},
 {id:'b1',outletId:'burger',name:'Classic Smash Burger',desc:'Double smash patty, cheddar, house sauce.',price:240,category:'Mains',dietary:'Contains Gluten',available:true,prep:10,tags:['Bestseller'],img:burgerImg},
 {id:'b2',outletId:'burger',name:'Paneer Crunch Burger',desc:'Crisp paneer, slaw, chipotle mayo.',price:200,category:'Mains',dietary:'Veg',available:true,prep:9,tags:[],img:burgerImg},
 {id:'b3',outletId:'burger',name:'Peri Peri Fries',desc:'Golden fries, peri peri dust, garlic dip.',price:120,category:'Mains',dietary:'Veg',available:true,prep:6,tags:[],img:burgerImg},
 {id:'b4',outletId:'burger',name:'Cold Coffee Shake',desc:'Espresso, vanilla ice cream, cold milk.',price:150,category:'Beverages',dietary:'Veg',available:true,prep:5,tags:[],img:burgerImg},
 {id:'d1',outletId:'dolce',name:'Chocolate Brownie',desc:'Warm, fudgy, walnut crunch. Best with coffee.',price:110,category:'Desserts',dietary:'Veg',available:true,prep:3,tags:['Bestseller'],img:dolceImg},
 {id:'d2',outletId:'dolce',name:'Blueberry Cheesecake',desc:'Baked cheesecake, blueberry compote.',price:180,category:'Desserts',dietary:'Veg',available:true,prep:4,tags:[],img:dolceImg},
 {id:'d3',outletId:'dolce',name:'Cinnamon Roll',desc:'Soft roll, cinnamon butter, cream glaze.',price:130,category:'Bakery',dietary:'Veg',available:true,prep:4,tags:['New'],img:dolceImg},
 {id:'d4',outletId:'dolce',name:'Tiramisu Cup',desc:'Coffee-soaked sponge, mascarpone, cocoa.',price:190,category:'Desserts',dietary:'Veg',available:true,prep:4,tags:[],img:dolceImg},
];
const VARIANTS=[{label:'Size S',delta:0},{label:'Size M',delta:30},{label:'Size L',delta:60}];
const ADDONS=[{label:'Extra Cheese',delta:40},{label:'Extra Paneer',delta:60},{label:'Oat Milk',delta:30}];
const REWARDS=[{id:'r1',name:'Free Cold Brew',cost:150,desc:'One Cold Brew at The Daily Grind.'},{id:'r2',name:'₹50 Off',cost:200,desc:'₹50 off your next order over ₹200.'},{id:'r3',name:'Free Brownie',cost:120,desc:'One Chocolate Brownie at Dolce.'}];
const TIMELINE=['Placed','Accepted','Preparing','Ready for pickup','Collected'];
const money=(n:number)=>`₹${Math.round(n)}`;
const round5=(n:number)=>Math.max(5,Math.round(n/5)*5);

type CartLine={key:string;itemId:string;name:string;variant:string;addOns:string[];unitPrice:number;qty:number;img:string};
type Cart={outletId:string;lines:CartLine[];coupon:string;slot:string};
type Order={recordId?:string;orderId:string;ticketCode:string;outletId:string;outletName:string;lines:CartLine[];subtotal:number;discount:number;total:number;slot:string;status:string;createdAt:number;rejectionReason?:string;loyaltyAwarded?:boolean;timeline:{status:string;at:number}[]};
type Review={recordId?:string;id:string;outletId:string;itemName:string;rating:number;comment:string;at:number};
type Prefs={cart:Cart;favOutlets:string[];favItems:string[];points:number;ledger:{label:string;pts:number;at:number}[];menuOverrides:Record<string,{available?:boolean;price?:number}>;outletOverrides:Record<string,{open?:boolean}>;redeemed:string[]};

const emptyCart:Cart={outletId:'',lines:[],coupon:'',slot:''};
const defaultPrefs:Prefs={cart:emptyCart,favOutlets:[],favItems:[],points:85,ledger:[{label:'Welcome bonus',pts:85,at:Date.now()}],menuOverrides:{},outletOverrides:{},redeemed:[]};

function slotsFor(){
  const out:string[]=[];
  const add=(d:Date,label:string)=>{
    for(let h=8;h<=20;h++) for(let m of [0,30]){
      const t=new Date(d); t.setHours(h,m,0,0);
      if(t.getTime()>Date.now()+25*60000) out.push(`${label} ${t.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})}`);
    }
  };
  add(new Date(),'Today'); const tm=new Date(); tm.setDate(tm.getDate()+1); add(tm,'Tomorrow');
  return out.slice(0,24);
}
function qrGrid(code:string){
  let seed=0; for(let c of code) seed=(seed*31 + c.charCodeAt(0))>>>0;
  const cells:boolean[]=[]; let x=seed||12345;
  for(let i=0;i<441;i++){ x=(x*1103515245+12345)&0x7fffffff; cells.push(x%100<46); }
  return cells;
}

// ---------- APP ----------
export default function App(){
  const [role,setRole]=useState<'student'|'outlet'|'admin'>('student');
  const [sView,setSView]=useState<'discover'|'favourites'|'orders'|'rewards'|'profile'>('discover');
  const [oTab,setOTab]=useState('queue');
  const [aView,setAView]=useState('overview');
  const [selectedOutlet,setSelectedOutlet]=useState<string|null>(null);
  const [outletFilter,setOutletFilter]=useState('grind');
  const [prefs,setPrefs]=useState<Prefs>(defaultPrefs);
  const [prefsId,setPrefsId]=useState<string|null>(null);
  const [orders,setOrders]=useState<Order[]>([]);
  const [reviews,setReviews]=useState<Review[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [apiDown,setApiDown]=useState(false);
  const [toasts,setToasts]=useState<{id:number;msg:string}[]>([]);
  const [search,setSearch]=useState(''); const [cat,setCat]=useState('All'); const [diet,setDiet]=useState('All'); const [priceF,setPriceF]=useState('All'); const [openOnly,setOpenOnly]=useState(false); const [sort,setSort]=useState('Popular');
  const [itemModal,setItemModal]=useState<Item|null>(null);
  const [variant,setVariant]=useState(VARIANTS[0]); const [addons,setAddons]=useState<string[]>([]); const [qty,setQty]=useState(1);
  const [cartOpen,setCartOpen]=useState(false); const [switchModal,setSwitchModal]=useState<Item|null>(null); const [checkoutOpen,setCheckoutOpen]=useState(false);
  const [couponInput,setCouponInput]=useState(''); const [couponMsg,setCouponMsg]=useState('');
  const [processing,setProcessing]=useState(false); const [checkoutErr,setCheckoutErr]=useState('');
  const [ticket,setTicket]=useState<Order|null>(null); const [trackingId,setTrackingId]=useState<string|null>(null);
  const [showReset,setShowReset]=useState(false); const [busy,setBusy]=useState(false); const [result,setResult]=useState<{saved:number;remaining:number;error:string|null;reloadError:string|null}|null>(null);
  const [rejectFor,setRejectFor]=useState(''); const [rejectReason,setRejectReason]=useState(''); const [verifyFor,setVerifyFor]=useState(''); const [verifyCode,setVerifyCode]=useState('');
  const [reviewForm,setReviewForm]=useState<{orderId:string;rating:number;comment:string}|null>(null);
  const [adminSearch,setAdminSearch]=useState(''); const [priceEdits,setPriceEdits]=useState<Record<string,string>>({});
  const toast=(msg:string)=>{const id=Date.now()+Math.random(); setToasts(t=>[...t,{id,msg}]); setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3600);};

  // Load
  async function reloadRecords(){
    const [p,o,r]=await Promise.all([api("records.list",{collection:"campusbite_prefs"}),api("records.list",{collection:"campusbite_orders"}),api("records.list",{collection:"campusbite_reviews"})]);
    if(p.records?.[0]){ setPrefs({...defaultPrefs,...p.records[0].value}); setPrefsId(p.records[0].id); }
    setOrders((o.records||[]).map((rec:any)=>({...rec.value,recordId:rec.id})).sort((a:any,b:any)=>b.createdAt-a.createdAt));
    setReviews((r.records||[]).map((rec:any)=>({...rec.value,recordId:rec.id})));
  }
  useEffect(()=>{ (async()=>{ try{ await reloadRecords(); }catch(e){ setApiDown(true); } finally{ setLoaded(true); } })(); },[]);
  async function savePrefs(next:Prefs){
    setPrefs(next);
    try{
      if(prefsId) await api("records.replace",{collection:"campusbite_prefs",id:prefsId,value:next});
      else { const rec=await api("records.create",{collection:"campusbite_prefs",value:next}); setPrefsId(rec.id); }
    }catch(e){ setApiDown(true); }
  }
  const updatePrefs=(patch:Partial<Prefs>)=>savePrefs({...prefs,...patch});
  const outlets=useMemo(()=>OUTLETS.map(o=>({...o,open:prefs.outletOverrides[o.id]?.open ?? o.open})),[prefs]);
  const items=useMemo(()=>ITEMS.map(i=>({...i,available:prefs.menuOverrides[i.id]?.available ?? i.available, price:prefs.menuOverrides[i.id]?.price ?? i.price})),[prefs]);
  const getOutlet=(id:string)=>outlets.find(o=>o.id===id) || outlets[0];
  const getItem=(id:string)=>items.find(i=>i.id===id);

  // Filters
  const filteredOutlets=useMemo(()=>{
    let list=[...outlets];
    const q=search.trim().toLowerCase();
    if(q) list=list.filter(o=>o.name.toLowerCase().includes(q)||o.cuisine.toLowerCase().includes(q)||o.location.toLowerCase().includes(q)||items.some(i=>i.outletId===o.id&&i.name.toLowerCase().includes(q)));
    if(openOnly) list=list.filter(o=>o.open);
    if(diet!=='All') list=list.filter(o=>items.some(i=>i.outletId===o.id&&i.dietary===diet));
    if(cat!=='All') list=list.filter(o=>items.some(i=>i.outletId===o.id&&i.category===cat));
    if(priceF==='Under ₹150') list=list.filter(o=>items.some(i=>i.outletId===o.id&&i.price<150));
    if(priceF==='₹150–200') list=list.filter(o=>items.some(i=>i.outletId===o.id&&i.price>=150&&i.price<=200));
    if(priceF==='₹200+') list=list.filter(o=>items.some(i=>i.outletId===o.id&&i.price>200));
    if(sort==='Rating') list.sort((a,b)=>b.rating-a.rating); if(sort==='Fastest') list.sort((a,b)=>a.base-b.base);
    return list;
  },[outlets,items,search,openOnly,diet,cat,priceF,sort]);
  const popular=useMemo(()=>[...items].filter(i=>i.available).sort((a,b)=>b.tags.includes('Bestseller')?1:0).slice(0,4),[items]);
  const cartCount=prefs.cart.lines.reduce((s,l)=>s+l.qty,0);
  const subtotal=prefs.cart.lines.reduce((s,l)=>s+l.unitPrice*l.qty,0);
  const discount=(()=>{ if(!prefs.cart.coupon) return 0; if(prefs.cart.coupon==='CAMPUS10') return subtotal*0.10; if(prefs.cart.coupon==='BITE20'&&subtotal>300) return subtotal*0.20; if(prefs.cart.coupon==='FIRSTBITE'&&subtotal>200) return 50; return 0; })();
  const total=Math.max(0,subtotal-discount);
  const slots=useMemo(()=>slotsFor(),[]);
  const queueFor=(oid:string)=>orders.filter(o=>o.outletId===oid&&['Placed','Accepted','Preparing'].includes(o.status)).length;
  const estimateFor=(oid:string)=>{ const o=getOutlet(oid); return round5(o.base + queueFor(oid)*4); };

  // Cart actions
  function openItem(it:Item){ setItemModal(it); setVariant(VARIANTS[0]); setAddons([]); setQty(1); }
  function addToCart(){
    if(!itemModal) return;
    if(prefs.cart.lines.length>0 && prefs.cart.outletId!==itemModal.outletId){ setSwitchModal(itemModal); return; }
    doAdd(itemModal);
  }
  function doAdd(it:Item){
    const unit=it.price+variant.delta+addons.reduce((s,a)=>s+(ADDONS.find(x=>x.label===a)?.delta||0),0);
    const key=`${it.id}|${variant.label}|${[...addons].sort().join(',')}`;
    const existing=prefs.cart.lines.find(l=>l.key===key);
    const lines=existing?prefs.cart.lines.map(l=>l.key===key?{...l,qty:l.qty+qty}:l):[...prefs.cart.lines,{key,itemId:it.id,name:it.name,variant:variant.label,addOns:addons,unitPrice:unit,qty,img:it.img}];
    updatePrefs({cart:{...prefs.cart,outletId:it.outletId,lines}});
    setItemModal(null); setSwitchModal(null); setCartOpen(true); toast(`${it.name} added to cart`);
  }
  function applyCoupon(){
    const code=couponInput.trim().toUpperCase();
    if(code==='CAMPUS10'){ updatePrefs({cart:{...prefs.cart,coupon:code}}); setCouponMsg('CAMPUS10 applied — 10% off.'); }
    else if(code==='BITE20'&&subtotal>300){ updatePrefs({cart:{...prefs.cart,coupon:code}}); setCouponMsg('BITE20 applied — 20% off over ₹300.'); }
    else if(code==='FIRSTBITE'&&subtotal>200){ updatePrefs({cart:{...prefs.cart,coupon:code}}); setCouponMsg('FIRSTBITE applied — ₹50 off over ₹200.'); }
    else setCouponMsg(code==='BITE20'?'BITE20 needs a subtotal over ₹300.':code==='FIRSTBITE'?'FIRSTBITE needs a subtotal over ₹200.':'That code is not valid. Try CAMPUS10.');
  }
  async function checkout(success:boolean){
    if(processing) return;
    const stale=prefs.cart.lines.some(l=>{const it=getItem(l.itemId); return !it||!it.available;});
    if(stale){ setCheckoutErr('One item in your cart is now sold out. Please remove it before checkout.'); return; }
    if(!prefs.cart.slot){ setCheckoutErr('Please choose a pickup slot first.'); return; }
    setProcessing(true); setCheckoutErr('');
    await new Promise(r=>setTimeout(r,900)); setProcessing(false);
    if(!success){ setCheckoutErr('Demo payment failed. No order was created. Your cart is preserved — you can try again.'); return; }
    const code=`CB-${uid()}`; const tcode=`T-${uid()}`;
    const order:Order={orderId:code,ticketCode:tcode,outletId:prefs.cart.outletId,outletName:getOutlet(prefs.cart.outletId).name,lines:prefs.cart.lines,subtotal,discount,total,slot:prefs.cart.slot,status:'Placed',createdAt:Date.now(),loyaltyAwarded:false,timeline:[{status:'Placed',at:Date.now()}]};
    try{ const rec=await api("records.create",{collection:"campusbite_orders",value:order,idempotency_key:`order-${code}`}); order.recordId=rec.id; }catch(e){ setCheckoutErr('Could not save this order. Please try again.'); return; }
    setOrders(o=>[order,...o]); updatePrefs({cart:emptyCart}); setCheckoutOpen(false); setCartOpen(false); setTicket(order); toast(`Order ${code} placed`);
  }

  // Order status
  async function setOrderStatus(order:Order,status:string,extra?:Partial<Order>){
    const next={...order,...extra,status,timeline:[...order.timeline,{status,at:Date.now()}]};
    if(status==='Collected' && !order.loyaltyAwarded){
      next.loyaltyAwarded=true;
      const np={...prefs,points:prefs.points+25,ledger:[...prefs.ledger,{label:`Collected ${order.orderId} — loyalty`,pts:25,at:Date.now()}]};
      setPrefs(np); savePrefs(np);
      toast('+25 points added for a collected order');
    }
    try{ if(order.recordId) await api("records.replace",{collection:"campusbite_orders",id:order.recordId,value:next}); }catch(e){}
    setOrders(os=>os.map(o=>o.orderId===order.orderId?next:o));
    toast(`${order.orderId} → ${status}`);
  }
  function cancelOrder(order:Order){ if(['Placed','Accepted'].includes(order.status)) setOrderStatus(order,'Cancelled'); }
  function reorder(order:Order){
    const missing:string[]=[]; const lines:CartLine[]=[];
    order.lines.forEach(l=>{const it=getItem(l.itemId); if(!it||!it.available) missing.push(l.name); else lines.push({...l,unitPrice:it.price + (VARIANTS.find(v=>v.label===l.variant)?.delta||0) + l.addOns.reduce((s,a)=>s+(ADDONS.find(x=>x.label===a)?.delta||0),0)});});
    if(lines.length===0){ toast('Those items are no longer available.'); return; }
    savePrefs({...prefs,cart:{outletId:order.outletId,lines,coupon:'',slot:''}});
    toast(missing.length?`Reordered. Unavailable and left out: ${missing.join(', ')}`:'Reordered — check your cart.');
    setCartOpen(true);
  }
  async function submitReview(){
    if(!reviewForm||!reviewForm.rating){ toast('Please choose a star rating.'); return; }
    const rev:Review={id:`RV-${uid()}`,outletId:orders.find(o=>o.orderId===reviewForm.orderId)?.outletId||'grind',itemName:'Order review',rating:reviewForm.rating,comment:reviewForm.comment.slice(0,300),at:Date.now()};
    try{ const rec=await api("records.create",{collection:"campusbite_reviews",value:rev}); rev.recordId=rec.id; }catch(e){ setApiDown(true); }
    setReviews(r=>[rev,...r]); setReviewForm(null); toast('Review saved. Thank you.');
  }
  async function deleteReview(id:string,recordId?:string){ if(recordId){ try{ await api("records.delete",{collection:"campusbite_reviews",id:recordId}); }catch(e){} } setReviews(r=>r.filter(x=>x.id!==id)); toast('Review deleted.'); }
  async function redeem(rw:{id:string;name:string;cost:number}){ if(prefs.points<rw.cost){ toast('Not enough points yet.'); return; } updatePrefs({points:prefs.points-rw.cost,ledger:[...prefs.ledger,{label:`Redeemed: ${rw.name}`,pts:-rw.cost,at:Date.now()}],redeemed:[...prefs.redeemed,rw.id]}); toast(`${rw.name} redeemed (demo).`); }

  async function resetDemo(){
    setBusy(true); let saved=0; let error:string|null=null;
    try{
      const rows: {collection:string;id:string}[]=[];
      const [p,o,r]=await Promise.all([api("records.list",{collection:"campusbite_prefs"}),api("records.list",{collection:"campusbite_orders"}),api("records.list",{collection:"campusbite_reviews"})]);
      [...(p.records||[]),...(o.records||[]),...(r.records||[])].forEach((rec:any)=>rows.push({collection:rec.id&&p.records?.includes(rec)?'campusbite_prefs':o.records?.includes(rec)?'campusbite_orders':'campusbite_reviews',id:rec.id}));
      for(const row of rows){ await api("records.delete",{collection:row.collection,id:row.id}); saved+=1; }
    }catch(e){ error=e instanceof Error?e.message:String(e); }
    let reloadError:string|null=null; try{ await reloadRecords(); }catch(e){ reloadError=e instanceof Error?e.message:String(e); }
    setResult({saved,remaining:0,error,reloadError}); setBusy(false);
    setPrefs(defaultPrefs); setPrefsId(null); setOrders([]); setReviews([]); setTicket(null); setShowReset(false); toast('Demo data reset.');
  }

  const favOutlets=outlets.filter(o=>prefs.favOutlets.includes(o.id));
  const favItems=items.filter(i=>prefs.favItems.includes(i.id));
  const outletOrders=orders.filter(o=>o.outletId===outletFilter);
  const detailOutlet=selectedOutlet?getOutlet(selectedOutlet):null;
  const detailItems=detailOutlet?items.filter(i=>i.outletId===detailOutlet.id):[];

  const outletTabOrders=(()=>{ if(oTab==='queue') return outletOrders.filter(o=>['Placed','Accepted'].includes(o.status)); if(oTab==='preparing') return outletOrders.filter(o=>o.status==='Preparing'); if(oTab==='ready') return outletOrders.filter(o=>o.status==='Ready for pickup'); if(oTab==='completed') return outletOrders.filter(o=>['Collected','Rejected','Cancelled'].includes(o.status)); return outletOrders; })();

  return (
  <div data-safe-area-inset-root style={{boxSizing:'border-box',paddingTop:'var(--safe-area-inset-top)',minHeight:'100vh',background:'var(--cloud)'}} className="text-[#1C1D20]">
    {/* HEADER */}
    <header data-safe-area-sticky-top style={{top:'var(--safe-area-inset-top)',position:'sticky',zIndex:40,background:'var(--graphite)',color:'#fff'}} className="sticky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
        <button onClick={()=>{setRole('student');setSView('discover');setSelectedOutlet(null);}} className="flex items-center gap-2 text-left" aria-label="CampusBite home">
          <span className="w-9 h-9 rounded-full bg-[var(--yellow)] text-black grid place-items-center font-black text-lg">B</span>
          <span className="font-display text-xl sm:text-2xl font-bold leading-none">CampusBite <span className="block text-[10px] font-sans font-bold tracking-[0.18em] text-[#FFC928]">CAMPUS FOOD • DEMO</span></span>
        </button>
        <div className="ml-auto flex items-center gap-2 flex-wrap" role="group" aria-label="Choose portal">
          {(['student','outlet','admin'] as const).map(r=><button key={r} onClick={()=>setRole(r)} aria-pressed={role===r} className={`px-3 py-2 rounded-full text-sm font-semibold capitalize ${role===r?'bg-[var(--yellow)] text-black':'bg-white/10 text-white'}`}>{r}</button>)}
        </div>
        {role==='student' && <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="bg-white/10 px-3 py-2 rounded-full text-sm font-semibold">⭐ {prefs.points} pts</span>
          <button onClick={()=>setCartOpen(true)} className="bg-[var(--yellow)] text-black px-4 py-2 rounded-full font-bold text-sm">Cart • {cartCount} • {money(total)}</button>
        </div>}
      </div>
      {role==='student' && <nav className="border-t border-white/10"><div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar py-2">{(['discover','favourites','orders','rewards','profile'] as const).map(v=><button key={v} onClick={()=>{setSView(v);setSelectedOutlet(null);}} className={`px-3 py-1.5 rounded-full text-sm capitalize whitespace-nowrap ${sView===v?'bg-[var(--yellow)] text-black font-bold':'text-white/80'}`}>{v}</button>)}</div></nav>}
      {role==='outlet' && <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap gap-2 items-center"><label className="text-sm text-white/80" htmlFor="outlet-select">Outlet</label><select id="outlet-select" value={outletFilter} onChange={e=>setOutletFilter(e.target.value)} className="text-[#1C1D20] bg-white rounded-lg px-3 py-2">{outlets.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select><span className="text-sm bg-white/10 px-3 py-1.5 rounded-full">Queue: {queueFor(outletFilter)} • Est. ~{estimateFor(outletFilter)} min</span></div>}
      {role==='admin' && <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 py-2 overflow-x-auto no-scrollbar">{(['overview','outlets','menu','orders'] as const).map(v=><button key={v} onClick={()=>setAView(v)} className={`px-3 py-1.5 rounded-full text-sm capitalize ${aView===v?'bg-[var(--yellow)] text-black font-bold':'text-white/80'}`}>{v}</button>)}</nav>}
    </header>

    {apiDown && <div className="bg-[#FFF3CD] border-b border-black/10 px-4 py-2 text-sm text-center">Demo data could not reach saved storage in this preview. Your changes still work in this session.</div>}

    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 text-[#1C1D20]">
    {role==='student' && selectedOutlet && detailOutlet ? (
      <section aria-label="Outlet detail" className="pt-6">
        <button onClick={()=>setSelectedOutlet(null)} className="px-4 py-2 rounded-full bg-white border font-semibold">← Back to Discover</button>
        <div className="mt-4 grid md:grid-cols-2 gap-6 items-start">
          <img src={detailOutlet.img} alt={detailOutlet.name} className="w-full aspect-[4/3] object-cover rounded-3xl border" />
          <div><p className="text-sm font-bold tracking-widest text-[#6B6E68]">DEMO OUTLET • {detailOutlet.cuisine.toUpperCase()}</p><h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">{detailOutlet.name}</h1><p className="mt-2 text-lg">{detailOutlet.location} • {detailOutlet.hours}</p><p className="mt-3 flex gap-2 flex-wrap"><span className="px-3 py-1 rounded-full bg-white border font-semibold">{detailOutlet.open?'● Open':'○ Closed — opens 11am'}</span><span className="px-3 py-1 rounded-full bg-white border">⭐ {detailOutlet.rating}</span><span className="px-3 py-1 rounded-full bg-[var(--yellow)] font-bold">~{estimateFor(detailOutlet.id)} min estimate</span></p><p className="mt-3 text-sm text-[#6B6E68]">Estimate = base prep + queue × 4 min. This is an estimate, not a guarantee.</p>
          <button onClick={()=>{const fav=prefs.favOutlets.includes(detailOutlet.id); updatePrefs({favOutlets:fav?prefs.favOutlets.filter(x=>x!==detailOutlet.id):[...prefs.favOutlets,detailOutlet.id]}); toast(fav?'Removed from favourites':'Saved to favourites');}} className="mt-4 px-4 py-2 rounded-full bg-black text-white font-semibold">{prefs.favOutlets.includes(detailOutlet.id)?'♥ Favourited':'♡ Add to favourites'}</button></div>
        </div>
        <div className="mt-8 flex gap-2 flex-wrap">{['All','Mains','Beverages','Bakery','Desserts','Bowls'].map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full border font-semibold ${cat===c?'bg-black text-white':'bg-white'}`}>{c}</button>)}</div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{detailItems.filter(i=>cat==='All'||i.category===cat).map(it=>(
          <article key={it.id} className="bg-white rounded-3xl overflow-hidden border relative">
            <button onClick={()=>openItem(it)} className="block w-full text-left"><div className="relative"><img src={it.img} alt={it.name} className="w-full aspect-[4/3] object-cover"/><div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-bold">{detailOutlet.name} • Menu item</div>{!it.available && <div className="absolute inset-0 bg-black/60 grid place-items-center text-white font-bold text-xl">Sold Out</div>}</div><div className="p-4"><h3 className="font-display text-xl">{it.name}</h3><p className="text-sm text-[#6B6E68] mt-1">{it.desc}</p><div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold"><span className="bg-[#F2F4F1] px-2 py-1 rounded-full">{it.dietary}</span><span className="bg-[#F2F4F1] px-2 py-1 rounded-full">{it.prep} min</span>{it.tags.map(t=><span key={t} className="bg-[var(--yellow)] px-2 py-1 rounded-full">{t}</span>)}</div><p className="mt-3 font-bold text-lg">{money(it.price)}</p></div></button>
            <div className="px-4 pb-4 flex gap-2"><button disabled={!it.available} onClick={()=>openItem(it)} className="flex-1 bg-[var(--yellow)] rounded-full py-2.5 font-bold disabled:opacity-40">{it.available?'Add to cart':'Sold out'}</button><button aria-label={`Favourite ${it.name}`} onClick={()=>{const fav=prefs.favItems.includes(it.id); updatePrefs({favItems:fav?prefs.favItems.filter(x=>x!==it.id):[...prefs.favItems,it.id]});}} className="w-11 h-11 rounded-full border grid place-items-center text-xl">{prefs.favItems.includes(it.id)?'♥':'♡'}</button></div>
          </article>))}
        </div>
        <section className="mt-10 bg-white rounded-3xl border p-5"><h2 className="font-display text-2xl">Reviews for {detailOutlet.name}</h2>{reviews.filter(r=>r.outletId===detailOutlet.id).length===0?<p className="text-sm mt-2">No reviews yet. Collect an order to leave the first review.</p>:reviews.filter(r=>r.outletId===detailOutlet.id).map(r=><div key={r.id} className="border-t mt-3 pt-3 flex justify-between gap-3"><div><p>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)} <span className="font-semibold">{r.itemName}</span></p><p className="text-sm">{r.comment||'No comment.'}</p></div><button onClick={()=>deleteReview(r.id,r.recordId)} className="text-sm underline shrink-0">Delete</button></div>)}</section>
      </section>
    ) : role==='student' && sView==='discover' ? (
      <>
        {/* HERO */}
        <section className="pt-6 sm:pt-10 grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6"><p className="inline-block bg-black text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest">DEMO • NO REAL ORDERS</p><h1 className="font-display text-[clamp(2.6rem,7vw,4.8rem)] leading-[0.95] font-black mt-4">Skip the queue.<br/>Pick up <span className="bg-[var(--yellow)] px-2 text-[#1C1D20]">hot.</span></h1><p className="text-lg mt-4 max-w-xl">Pre-order from your favourite campus outlets, choose a pickup slot, and collect without standing in line. A friendly simulation — no real money, no real food.</p><div className="mt-6 flex flex-wrap gap-3"><a href="#discover" className="bg-[var(--yellow)] px-6 py-3 rounded-full font-bold text-[#1C1D20]">Browse Outlets →</a><a href="#how" className="bg-white border border-[#1C1D20] px-6 py-3 rounded-full font-bold text-[#1C1D20]">How it works</a></div><div className="mt-8 flex gap-6 flex-wrap"><div><p className="font-display text-3xl font-bold">6 outlets</p><p className="text-sm">Across campus</p></div><div><p className="font-display text-3xl font-bold">~12 min</p><p className="text-sm">Average estimate</p></div><div><p className="font-display text-3xl font-bold">4.6 ★</p><p className="text-sm">Average rating</p></div></div></div>
          <div className="lg:col-span-6 relative"><div className="absolute -inset-2 bg-[var(--yellow)] rounded-[2rem] rotate-1" aria-hidden="true"/><img src={heroImg} alt="Students inside a campus coffee shop" className="relative w-full aspect-[4/3] object-cover rounded-[2rem] border-4 border-white shadow-xl"/><div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3 shadow flex gap-3"><span className="bg-[var(--yellow)] w-10 h-10 rounded-full grid place-items-center font-black">✓</span><div><p className="font-bold text-sm">Order placed — demo</p><p className="text-xs">Pickup Today 1:00 PM • The Daily Grind</p></div></div></div>
        </section>

        {/* DISCOVER */}
        <section id="discover" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold tracking-widest">01 — DISCOVER</p><h2 className="font-display text-3xl sm:text-4xl font-bold">What are you craving?</h2></div><p className="text-sm text-[#6B6E68]">Demo catalogue • Prices in ₹</p></div>
          <div className="mt-5 bg-white border rounded-3xl p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div><label className="text-xs font-bold" htmlFor="search">Search</label><input id="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Outlet, cuisine or dish…" className="mt-1 w-full border rounded-xl px-3 py-2.5 bg-[#F2F4F1]"/></div>
            <div><label className="text-xs font-bold" htmlFor="cat">Category</label><select id="cat" value={cat} onChange={e=>setCat(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2.5 bg-[#F2F4F1]"><option>All</option><option>Mains</option><option>Beverages</option><option>Bakery</option><option>Desserts</option><option>Bowls</option></select></div>
            <div><label className="text-xs font-bold" htmlFor="diet">Dietary</label><select id="diet" value={diet} onChange={e=>setDiet(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2.5 bg-[#F2F4F1]"><option>All</option><option>Veg</option><option>Vegan</option><option>Gluten-Free</option><option>Contains Gluten</option></select></div>
            <div><label className="text-xs font-bold" htmlFor="sort">Sort</label><select id="sort" value={sort} onChange={e=>setSort(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2.5 bg-[#F2F4F1]"><option>Popular</option><option>Rating</option><option>Fastest</option><option>Price low-high</option></select></div>
            <div className="flex gap-2 flex-wrap lg:col-span-4">{['All','Under ₹150','₹150–200','₹200+'].map(p=><button key={p} onClick={()=>setPriceF(p)} className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${priceF===p?'bg-black text-white':'bg-white'}`}>{p==='All'?'Any price':p}</button>)}<label className="flex items-center gap-2 text-sm font-semibold px-3"><input type="checkbox" checked={openOnly} onChange={e=>setOpenOnly(e.target.checked)}/> Open now</label><button onClick={()=>{setSearch('');setCat('All');setDiet('All');setPriceF('All');setOpenOnly(false);setSort('Popular');}} className="ml-auto underline text-sm">Clear filters</button></div>
          </div>
          {filteredOutlets.length===0 ? <div className="mt-6 bg-white border rounded-3xl p-8 text-center"><p className="text-4xl">🍽️</p><h3 className="font-display text-2xl mt-2">Nothing matches — yet.</h3><p className="text-sm mt-1">Try a broader search, or clear your filters to see all six demo outlets.</p><button onClick={()=>{setSearch('');setCat('All');setDiet('All');setPriceF('All');setOpenOnly(false);}} className="mt-4 bg-[var(--yellow)] px-5 py-2.5 rounded-full font-bold">Clear filters</button></div> :
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{filteredOutlets.map(o=>(
            <article key={o.id} className="bg-white rounded-3xl overflow-hidden border flex flex-col">
              <button onClick={()=>setSelectedOutlet(o.id)} className="text-left"><img src={o.img} alt={o.name} className="w-full aspect-[4/3] object-cover"/><div className="p-4"><div className="flex justify-between gap-2"><h3 className="font-display text-2xl leading-tight">{o.name}</h3><span className="text-sm font-bold">⭐ {o.rating}</span></div><p className="text-sm text-[#6B6E68]">{o.cuisine} • {o.location}</p><p className="mt-3 flex flex-wrap gap-2 text-xs font-bold"><span className={`px-2 py-1 rounded-full ${o.open?'bg-green-100':'bg-red-100'}`}>{o.open?'● Open':'○ Closed'}</span><span className="px-2 py-1 rounded-full bg-[#F2F4F1]">~{estimateFor(o.id)} min estimate</span><span className="px-2 py-1 rounded-full bg-[#F2F4F1]">{o.hours}</span></p></div></button>
              <div className="px-4 pb-4 mt-auto flex gap-2"><button onClick={()=>setSelectedOutlet(o.id)} className="flex-1 bg-[var(--yellow)] rounded-full py-2.5 font-bold">View menu →</button><button aria-label={`Favourite ${o.name}`} onClick={()=>{const f=prefs.favOutlets.includes(o.id); updatePrefs({favOutlets:f?prefs.favOutlets.filter(x=>x!==o.id):[...prefs.favOutlets,o.id]});}} className="w-11 h-11 rounded-full border grid place-items-center text-xl">{prefs.favOutlets.includes(o.id)?'♥':'♡'}</button></div>
            </article>))}
          </div>}
          <h3 className="font-display text-2xl mt-10">Popular this week</h3>
          <div className="mt-3 flex gap-4 overflow-x-auto pb-2 no-scrollbar">{popular.map(it=><button key={it.id} onClick={()=>openItem(it)} className="min-w-[220px] sm:min-w-[260px] bg-white border rounded-3xl overflow-hidden text-left shrink-0"><img src={it.img} alt={it.name} className="w-full aspect-[4/3] object-cover"/><div className="p-3"><p className="font-bold">{it.name}</p><p className="text-xs text-[#6B6E68]">{getOutlet(it.outletId).name}</p><p className="font-bold mt-1">{money(it.price)} • Bestseller</p></div></button>)}</div>
        </section>

        <section id="how" className="mt-14 grid md:grid-cols-3 gap-4">{[{n:'01',t:'Browse & pre-order',d:'Pick an outlet, customise your dish, and choose a pickup slot.'},{n:'02',t:'Pay (demo)',d:'Use the demo payment box. No real money, no card or UPI details.'},{n:'03',t:'Show QR & collect',d:'Show your ticket at the counter. The outlet verifies the code and hands over your order.'}].map(s=><div key={s.n} className="bg-white border rounded-3xl p-5"><p className="font-display text-4xl text-[#1C1D20] font-black">{s.n}</p><h3 className="font-display text-xl mt-2">{s.t}</h3><p className="text-sm mt-1">{s.d}</p></div>)}</section>
        <section className="mt-6 bg-[var(--graphite)] text-white rounded-[2rem] p-6 sm:p-8 grid md:grid-cols-2 gap-6 items-center"><div><p className="text-xs tracking-widest font-bold text-[#FFC928]">PICKUP TICKET • SAMPLE</p><h2 className="font-display text-3xl mt-2">One ticket. No confusion.</h2><p className="mt-2 text-white/80">Your ticket holds the order reference, outlet, slot and total. The QR visual contains only the order reference. Verification is simulated, not secure.</p><button onClick={()=>setSView('orders')} className="mt-4 bg-[var(--yellow)] text-black px-5 py-2.5 rounded-full font-bold">View my orders</button></div><div className="bg-white text-black rounded-3xl p-5 max-w-sm w-full mx-auto"><p className="flex justify-between font-bold"><span>CB-DEMO01</span><span>Placed</span></p><p className="text-sm mt-2">The Daily Grind • Today 1:00 PM</p><p className="text-sm">Cold Brew × 1 • Butter Croissant × 1</p><div className="mt-3 grid grid-cols-7 gap-[2px]">{Array.from({length:49}).map((_,i)=><span key={i} className={`aspect-square rounded-[2px] ${i%3===0?'bg-black':'bg-[#E5E7E2]'}`}/>)}</div><p className="text-center font-mono text-sm mt-2">T-DEMO01</p></div></section>
        <section className="mt-6 bg-white border rounded-3xl p-6 grid md:grid-cols-2 gap-4"><div><h2 className="font-display text-3xl">Scheduled pickup, honest waits.</h2><p className="mt-2">Estimate = outlet base prep + queue × 4 minutes. We round to the nearest 5 minutes and always label it an <strong>Estimate</strong> — not a guarantee.</p></div><div className="grid grid-cols-2 gap-3"><div className="bg-[#F2F4F1] rounded-2xl p-4"><p className="font-display text-3xl">~10 min</p><p className="text-sm">Green Bowl right now</p></div><div className="bg-[#F2F4F1] rounded-2xl p-4"><p className="font-display text-3xl">~20 min</p><p className="text-sm">Spice Route at lunch rush</p></div></div></section>
        <section className="mt-6 grid md:grid-cols-2 gap-4"><div className="bg-[var(--yellow)] rounded-3xl p-6"><h2 className="font-display text-3xl">Rewards that add up.</h2><p className="mt-2">Collect an order and earn +25 points. Redeem a Free Cold Brew at 150 points. All points are a local simulation.</p><button onClick={()=>setSView('rewards')} className="mt-4 bg-black text-white px-5 py-2.5 rounded-full font-bold">See rewards</button></div><div className="bg-white border rounded-3xl p-6"><h2 className="font-display text-3xl">Favourites & reorder.</h2><p className="mt-2">Heart outlets and dishes. Reorder a past order in one tap — we tell you if anything is unavailable instead of quietly dropping it.</p><button onClick={()=>setSView('favourites')} className="mt-4 bg-black text-white px-5 py-2.5 rounded-full font-bold">My favourites</button></div></section>
        <section className="mt-10 text-center bg-white border rounded-[2rem] p-8"><h2 className="font-display text-3xl sm:text-4xl">Hungry? Your next pickup is two taps away.</h2><button onClick={()=>document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})} className="mt-5 bg-[var(--yellow)] px-7 py-3 rounded-full font-bold">Browse outlets</button></section>
      </>
    ) : role==='student' && sView==='favourites' ? (
      <section className="pt-6"><h1 className="font-display text-4xl">Favourites</h1><p className="text-sm mt-1">Saved in this browser via the demo records store.</p><h2 className="font-bold mt-6">Outlets</h2>{favOutlets.length===0?<p className="bg-white border rounded-2xl p-5 mt-2">No favourite outlets yet. Tap ♡ on any outlet card.</p>:<div className="grid sm:grid-cols-2 gap-3 mt-2">{favOutlets.map(o=><div key={o.id} className="bg-white border rounded-2xl p-4 flex justify-between gap-3"><div><p className="font-bold">{o.name}</p><p className="text-sm">{o.cuisine} • {o.location}</p></div><button onClick={()=>setSelectedOutlet(o.id)} className="underline text-sm">View</button></div>)}</div>}<h2 className="font-bold mt-6">Items</h2>{favItems.length===0?<p className="bg-white border rounded-2xl p-5 mt-2">No favourite items yet.</p>:<div className="grid sm:grid-cols-2 gap-3 mt-2">{favItems.map(i=><div key={i.id} className="bg-white border rounded-2xl p-4 flex justify-between gap-3"><div><p className="font-bold">{i.name}</p><p className="text-sm">{getOutlet(i.outletId).name} • {money(i.price)}</p></div><button onClick={()=>openItem(i)} className="underline text-sm">View</button></div>)}</div>}</section>
    ) : role==='student' && sView==='orders' ? (
      <section className="pt-6"><h1 className="font-display text-4xl">Orders</h1><p className="text-sm mt-1">Live demo — changes made in the Outlet portal appear here in the same browser.</p>{orders.length===0?<div className="bg-white border rounded-3xl p-8 mt-5 text-center"><p className="text-3xl">🧾</p><h2 className="font-display text-2xl mt-2">No orders yet</h2><p className="text-sm">Browse outlets and place your first demo order.</p><button onClick={()=>setSView('discover')} className="mt-4 bg-[var(--yellow)] px-5 py-2.5 rounded-full font-bold">Browse outlets</button></div>:<div className="grid gap-3 mt-5">{orders.map(o=>(
        <article key={o.orderId} className="bg-white border rounded-3xl p-5"><div className="flex flex-wrap justify-between gap-2"><div><p className="font-bold">{o.orderId} • {o.outletName}</p><p className="text-sm">{o.slot} • {money(o.total)} • Ticket {o.ticketCode}</p></div><span className="bg-[var(--yellow)] px-3 py-1 rounded-full text-sm font-bold h-fit">{o.status}</span></div>
        <p className="text-sm mt-2">{o.lines.map(l=>`${l.name} × ${l.qty}`).join(' • ')}</p>
        <div className="mt-3 flex gap-1 flex-wrap">{TIMELINE.map((t,i)=>{const done=TIMELINE.indexOf(o.status)>=i || o.status==='Collected'; return <span key={t} className={`text-xs px-2 py-1 rounded-full ${done?'bg-black text-white':'bg-[#F2F4F1]'}`}>{t}</span>})}</div>
        {o.rejectionReason && <p className="text-sm mt-2 text-red-700">Rejected: {o.rejectionReason}</p>}
        <div className="mt-4 flex gap-2 flex-wrap"><button onClick={()=>setTrackingId(o.orderId)} className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">View tracking</button><button onClick={()=>reorder(o)} className="border px-4 py-2 rounded-full text-sm font-bold">Reorder</button>{['Placed','Accepted'].includes(o.status)&&<button onClick={()=>cancelOrder(o)} className="border px-4 py-2 rounded-full text-sm font-bold">Cancel order</button>}{o.status==='Collected'&&<button onClick={()=>setReviewForm({orderId:o.orderId,rating:0,comment:''})} className="bg-[var(--yellow)] px-4 py-2 rounded-full text-sm font-bold">Leave a review</button>}</div>
        {trackingId===o.orderId && <div className="mt-4 bg-[#F2F4F1] rounded-2xl p-4"><h3 className="font-bold">Tracking — {o.orderId}</h3><ol className="mt-2 space-y-2">{o.timeline.map((t,idx)=><li key={idx} className="text-sm">● {t.status} — {new Date(t.at).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})}</li>)}</ol><p className="text-sm mt-2">Pickup slot: <strong>{o.slot}</strong> • Ticket: <strong>{o.ticketCode}</strong></p></div>}
        </article>))}</div>}</section>
    ) : role==='student' && sView==='rewards' ? (
      <section className="pt-6"><h1 className="font-display text-4xl">Rewards</h1><div className="mt-4 bg-[var(--graphite)] text-white rounded-3xl p-6 flex justify-between flex-wrap gap-3"><div><p className="text-sm">Your balance</p><p className="font-display text-5xl">{prefs.points} <span className="text-xl">points</span></p></div><p className="max-w-sm text-white/80 text-sm">Earn +25 points when an order becomes Collected. Awarded once per order. Local simulation only.</p></div><div className="grid md:grid-cols-3 gap-4 mt-4">{REWARDS.map(r=><div key={r.id} className="bg-white border rounded-3xl p-5"><h3 className="font-bold text-lg">{r.name}</h3><p className="text-sm">{r.desc}</p><p className="font-bold mt-2">{r.cost} pts</p><button onClick={()=>redeem(r)} className="mt-3 bg-[var(--yellow)] px-4 py-2 rounded-full font-bold text-sm">Redeem</button></div>)}</div><h2 className="font-bold mt-6">History</h2><div className="bg-white border rounded-3xl p-4 mt-2">{prefs.ledger.slice().reverse().map((l,i)=><p key={i} className="py-2 border-b text-sm flex justify-between"><span>{l.label}</span><span className="font-bold">{l.pts>0?`+${l.pts}`:l.pts} pts</span></p>)}</div></section>
    ) : role==='student' && sView==='profile' ? (
      <section className="pt-6 max-w-3xl"><h1 className="font-display text-4xl">Profile & demo guide</h1><p className="mt-2">Demo student — no account, no sign-in. Role selection is not secure auth.</p><div className="bg-white border rounded-3xl p-5 mt-5"><h2 className="font-bold">How to demo in 2 minutes</h2><ol className="list-decimal ml-5 mt-2 space-y-1 text-sm"><li>Student: add a Cold Brew, use code <strong>CAMPUS10</strong>, choose a slot, Simulate Payment Success.</li><li>Switch to Outlet: Accept → Move to Preparing → Mark Ready.</li><li>Outlet: enter the ticket code and Verify & Collect.</li><li>Student: check +25 points in Rewards, then leave a review from Orders.</li></ol><p className="text-sm mt-3">Coupons: <strong>CAMPUS10</strong> (10% off) • <strong>BITE20</strong> (20% off over ₹300) • <strong>FIRSTBITE</strong> (₹50 off over ₹200).</p></div><div className="bg-white border rounded-3xl p-5 mt-4"><h2 className="font-bold">Demo data</h2><p className="text-sm mt-1">Your orders, favourites, cart and points are saved through the demo records store. Reset removes demo records.</p><button onClick={()=>setShowReset(true)} className="mt-3 bg-black text-white px-4 py-2 rounded-full font-bold text-sm">Reset demo data</button>{showReset && <div className="mt-3 bg-[#FFF3CD] border rounded-2xl p-4"><p className="font-bold">Reset all demo data?</p><p className="text-sm">This deletes saved demo orders, reviews and preferences.</p>{result && <p className="text-sm mt-2">Saved removed: {result.saved} • Remaining: {result.remaining} {result.error?`• Error: ${result.error}`:''}</p>}<div className="flex gap-2 mt-3"><button disabled={busy} onClick={resetDemo} className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm disabled:opacity-50">{busy?'Resetting…':'Yes, reset'}</button><button onClick={()=>setShowReset(false)} className="border px-4 py-2 rounded-full text-sm">Cancel</button></div></div>}</div></section>
    ) : role==='outlet' ? (
      <section className="pt-6"><div className="flex flex-wrap justify-between gap-3"><div><h1 className="font-display text-4xl">{getOutlet(outletFilter).name} — Kitchen</h1><p className="text-sm">Demo outlet portal. Actions update the student view in this browser.</p></div><span className="bg-[var(--yellow)] px-4 py-2 rounded-full font-bold h-fit">Est. ~{estimateFor(outletFilter)} min</span></div>
        <div className="mt-4 flex gap-2 flex-wrap">{[{k:'queue',l:'Live Queue'},{k:'preparing',l:'Preparing'},{k:'ready',l:'Ready'},{k:'completed',l:'Completed'},{k:'menu',l:'Menu'}].map(t=><button key={t.k} onClick={()=>setOTab(t.k)} className={`px-4 py-2 rounded-full font-bold text-sm ${oTab===t.k?'bg-black text-white':'bg-white border'}`}>{t.l} ({t.k==='menu'?items.filter(i=>i.outletId===outletFilter).length:outletOrders.filter(o=>t.k==='queue'?['Placed','Accepted'].includes(o.status):t.k==='preparing'?o.status==='Preparing':t.k==='ready'?o.status==='Ready for pickup':['Collected','Rejected','Cancelled'].includes(o.status)).length})</button>)}</div>
        {oTab==='menu' ? <div className="grid sm:grid-cols-2 gap-3 mt-4">{items.filter(i=>i.outletId===outletFilter).map(i=><div key={i.id} className="bg-white border rounded-3xl p-4 flex justify-between gap-3"><div><p className="font-bold">{i.name}</p><p className="text-sm">{money(i.price)} • {i.category}</p><p className="text-xs">{i.available?'Available':'Sold out'}</p></div><button onClick={()=>{const next={...prefs,menuOverrides:{...prefs.menuOverrides,[i.id]:{...prefs.menuOverrides[i.id],available:!i.available}}}; savePrefs(next); toast(`${i.name} is now ${!i.available?'available':'sold out'}`);}} className="bg-[var(--yellow)] px-4 py-2 rounded-full font-bold text-sm h-fit">{i.available?'Mark sold out':'Mark available'}</button></div>)}</div> :
        outletTabOrders.length===0 ? <div className="bg-white border rounded-3xl p-8 mt-4 text-center"><p className="text-3xl">🍳</p><h2 className="font-display text-2xl">No orders in this tab</h2><p className="text-sm">Place a demo order from the Student portal to see it here.</p><button onClick={()=>setRole('student')} className="mt-4 bg-[var(--yellow)] px-5 py-2 rounded-full font-bold">Go to Student portal</button></div> :
        <div className="grid gap-3 mt-4">{outletTabOrders.map(o=>(
          <article key={o.orderId} className="bg-white border rounded-3xl p-5"><div className="flex flex-wrap justify-between gap-2"><div><p className="font-bold">{o.orderId} • Ticket {o.ticketCode}</p><p className="text-sm">{o.slot} • {money(o.total)}</p></div><span className="bg-[var(--yellow)] px-3 py-1 rounded-full text-sm font-bold h-fit">{o.status}</span></div><ul className="mt-2 text-sm list-disc ml-5">{o.lines.map((l,idx)=><li key={idx}>{l.name} × {l.qty} — {l.variant}{l.addOns.length?` + ${l.addOns.join(', ')}`:''} • {money(l.unitPrice)} each</li>)}</ul>
          {o.status==='Placed' && <div className="mt-4 flex gap-2 flex-wrap"><button onClick={()=>setOrderStatus(o,'Accepted')} className="bg-[var(--yellow)] px-4 py-2 rounded-full font-bold text-sm">Accept → Accepted</button><button onClick={()=>setRejectFor(o.orderId)} className="border px-4 py-2 rounded-full text-sm font-bold">Reject</button></div>}
          {rejectFor===o.orderId && <div className="mt-3 bg-[#F2F4F1] rounded-2xl p-3"><label className="text-sm font-bold" htmlFor={`rej-${o.orderId}`}>Reason for rejection</label><input id={`rej-${o.orderId}`} value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="e.g. Out of stock" className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"/><div className="flex gap-2 mt-2"><button onClick={()=>{if(!rejectReason.trim()){toast('Please enter a reason.');return;} setOrderStatus(o,'Rejected',{rejectionReason:rejectReason}); setRejectFor(''); setRejectReason('');}} className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">Confirm rejection</button><button onClick={()=>setRejectFor('')} className="border px-4 py-2 rounded-full text-sm">Cancel</button></div></div>}
          {o.status==='Accepted' && <button onClick={()=>setOrderStatus(o,'Preparing')} className="mt-4 bg-black text-white px-4 py-2 rounded-full font-bold text-sm">Move to Preparing</button>}
          {o.status==='Preparing' && <button onClick={()=>setOrderStatus(o,'Ready for pickup')} className="mt-4 bg-[var(--yellow)] px-4 py-2 rounded-full font-bold text-sm">Mark Ready</button>}
          {o.status==='Ready for pickup' && <div className="mt-4"><button onClick={()=>setVerifyFor(o.orderId)} className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm">Verify & Collect</button>{verifyFor===o.orderId && <div className="mt-3 bg-[#F2F4F1] rounded-2xl p-3"><label className="text-sm font-bold" htmlFor={`ver-${o.orderId}`}>Enter ticket code</label><input id={`ver-${o.orderId}`} value={verifyCode} onChange={e=>setVerifyCode(e.target.value)} placeholder="e.g. T-XXXXXX" className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"/><button onClick={()=>{if(verifyCode.trim().toUpperCase()===o.ticketCode.toUpperCase()){setOrderStatus(o,'Collected'); setVerifyFor(''); setVerifyCode('');} else toast('That code does not match this Ready order. Check the ticket code and try again.');}} className="mt-2 bg-[var(--yellow)] px-4 py-2 rounded-full font-bold text-sm">Verify code</button></div>}</div>}
          {o.rejectionReason && <p className="text-sm mt-2">Reason: {o.rejectionReason}</p>}
          </article>))}</div>}
      </section>
    ) : role==='admin' ? (
      <section className="pt-6"><h1 className="font-display text-4xl">Admin — Demo oversight</h1><p className="text-sm mt-1">Demo metrics — local simulation only. No real revenue.</p>
        {aView==='overview' && <><div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-5">{[{l:'Total Orders',v:orders.length},{l:'Demo Revenue',v:money(orders.filter(o=>o.status!=='Cancelled'&&o.status!=='Rejected').reduce((s,o)=>s+o.total,0))},{l:'Avg Wait',v:`~${Math.round(outlets.reduce((s,o)=>s+o.base,0)/outlets.length)} min`},{l:'Active Outlets',v:outlets.filter(o=>o.open).length},{l:'Collected rate',v:orders.length?`${Math.round(orders.filter(o=>o.status==='Collected').length/orders.length*100)}%`:'0%'}].map(c=><div key={c.l} className="bg-white border rounded-3xl p-4"><p className="text-xs font-bold tracking-widest">{c.l.toUpperCase()}</p><p className="font-display text-3xl mt-1">{c.v}</p></div>)}</div>
        <div className="bg-white border rounded-3xl p-5 mt-4"><h2 className="font-bold">Recent orders</h2>{orders.length===0?<p className="text-sm mt-2">No orders yet.</p>:orders.slice(0,6).map(o=><p key={o.orderId} className="py-2 border-b text-sm flex justify-between gap-2"><span>{o.orderId} • {o.outletName}</span><span>{money(o.total)} • {o.status}</span></p>)}</div></>}
        {aView==='outlets' && <div className="bg-white border rounded-3xl overflow-hidden mt-5"><div className="overflow-x-auto"><table className="w-full text-sm min-w-[640px]"><thead><tr className="bg-[#F2F4F1] text-left"><th className="p-3">Outlet</th><th className="p-3">Location</th><th className="p-3">Status</th><th className="p-3">Rating</th><th className="p-3">Items</th><th className="p-3">Open toggle</th></tr></thead><tbody>{outlets.map(o=><tr key={o.id} className="border-t"><td className="p-3 font-bold">{o.name}</td><td className="p-3">{o.location}</td><td className="p-3">{o.open?'Open':'Closed'}</td><td className="p-3">⭐ {o.rating}</td><td className="p-3">{items.filter(i=>i.outletId===o.id).length}</td><td className="p-3"><button onClick={()=>{savePrefs({...prefs,outletOverrides:{...prefs.outletOverrides,[o.id]:{open:!o.open}}}); toast(`${o.name} ${!o.open?'opened':'closed'}`);}} className="bg-[var(--yellow)] px-3 py-1.5 rounded-full font-bold text-xs">{o.open?'Close outlet':'Open outlet'}</button></td></tr>)}</tbody></table></div></div>}
        {aView==='menu' && <div className="mt-5"><label className="text-sm font-bold" htmlFor="admin-search">Search menu</label><input id="admin-search" value={adminSearch} onChange={e=>setAdminSearch(e.target.value)} placeholder="Search items…" className="mt-1 w-full border rounded-xl px-3 py-2.5 bg-white"/><div className="grid sm:grid-cols-2 gap-3 mt-3">{items.filter(i=>i.name.toLowerCase().includes(adminSearch.toLowerCase())).map(i=><div key={i.id} className="bg-white border rounded-3xl p-4"><p className="font-bold">{i.name}</p><p className="text-sm">{getOutlet(i.outletId).name} • {i.available?'Available':'Sold out'}</p><div className="flex gap-2 mt-3 flex-wrap items-center"><label className="text-sm">Price ₹<input aria-label={`Price for ${i.name}`} value={priceEdits[i.id]??String(i.price)} onChange={e=>setPriceEdits(p=>({...p,[i.id]:e.target.value}))} className="w-20 border rounded-lg px-2 py-1 ml-1"/></label><button onClick={()=>{const v=Number(priceEdits[i.id]); if(!v||v<=0){toast('Enter a valid price over ₹0.');return;} savePrefs({...prefs,menuOverrides:{...prefs.menuOverrides,[i.id]:{...prefs.menuOverrides[i.id],price:v}}}); toast(`Price updated for ${i.name}`);}} className="bg-black text-white px-3 py-1.5 rounded-full text-sm font-bold">Save price</button><button onClick={()=>savePrefs({...prefs,menuOverrides:{...prefs.menuOverrides,[i.id]:{...prefs.menuOverrides[i.id],available:!i.available}}})} className="border px-3 py-1.5 rounded-full text-sm font-bold">Toggle availability</button></div></div>)}</div></div>}
        {aView==='orders' && <div className="bg-white border rounded-3xl overflow-hidden mt-5"><div className="overflow-x-auto"><table className="w-full text-sm min-w-[620px]"><thead><tr className="bg-[#F2F4F1] text-left"><th className="p-3">Order</th><th className="p-3">Outlet</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Slot</th></tr></thead><tbody>{orders.map(o=><tr key={o.orderId} className="border-t"><td className="p-3 font-bold">{o.orderId}</td><td className="p-3">{o.outletName}</td><td className="p-3">{money(o.total)}</td><td className="p-3">{o.status}</td><td className="p-3">{o.slot}</td></tr>)}{orders.length===0&&<tr><td className="p-3" colSpan={5}>No orders yet.</td></tr>}</tbody></table></div></div>}
      </section>
    ) : null}
    </main>

    <footer className="bg-[var(--graphite)] text-white mt-4"><div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-3 gap-6"><div><p className="font-display text-2xl">CampusBite</p><p className="text-sm text-white/70 mt-1">Demo — no real outlets, transactions or food. Role selection is not secure auth.</p></div><div><p className="font-bold">Coupons</p><p className="text-sm text-white/70 mt-1">CAMPUS10 • BITE20 (over ₹300) • FIRSTBITE (over ₹200)</p></div><div><p className="font-bold">How to demo</p><p className="text-sm text-white/70 mt-1">Order → Outlet Accept → Ready → Verify → Collect → +25 points → Review. Use Profile → Reset demo data to start over.</p></div></div></footer>

    {/* ITEM MODAL */}
    {itemModal && <div role="dialog" aria-modal="true" aria-label={itemModal.name} className="fixed inset-0 z-50 bg-black/60 grid place-items-end sm:place-items-center p-0 sm:p-4 overflow-y-auto"><div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden my-0 sm:my-6"><img src={itemModal.img} alt={itemModal.name} className="w-full aspect-[4/3] object-cover"/><div className="p-5"><div className="flex justify-between gap-3"><h2 className="font-display text-3xl">{itemModal.name}</h2><button onClick={()=>setItemModal(null)} className="w-10 h-10 rounded-full border text-xl shrink-0" aria-label="Close item details">×</button></div><p className="mt-1">{itemModal.desc}</p><p className="mt-2 text-sm font-semibold">{getOutlet(itemModal.outletId).name} • {itemModal.dietary} • {itemModal.prep} min prep</p>
      <fieldset className="mt-4"><legend className="font-bold text-sm">Size / variant</legend><div className="flex gap-2 flex-wrap mt-2">{VARIANTS.map(v=><label key={v.label} className={`px-4 py-2 rounded-full border cursor-pointer ${variant.label===v.label?'bg-black text-white':'bg-white'}`}><input type="radio" name="variant" className="sr-only" checked={variant.label===v.label} onChange={()=>setVariant(v)}/>{v.label} {v.delta?`+${money(v.delta)}`:''}</label>)}</div></fieldset>
      <fieldset className="mt-4"><legend className="font-bold text-sm">Add-ons</legend><div className="flex gap-2 flex-wrap mt-2">{ADDONS.map(a=><label key={a.label} className={`px-4 py-2 rounded-full border cursor-pointer ${addons.includes(a.label)?'bg-[var(--yellow)]':'bg-white'}`}><input type="checkbox" className="sr-only" checked={addons.includes(a.label)} onChange={()=>setAddons(x=>x.includes(a.label)?x.filter(y=>y!==a.label):[...x,a.label])}/>{a.label} +{money(a.delta)}</label>)}</div></fieldset>
      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap"><div className="flex items-center gap-2"><button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-10 h-10 rounded-full border font-bold" aria-label="Decrease quantity">−</button><span className="font-bold w-8 text-center">{qty}</span><button onClick={()=>setQty(q=>q+1)} className="w-10 h-10 rounded-full border font-bold" aria-label="Increase quantity">+</button></div><p className="font-bold text-xl">Total: {money((itemModal.price+variant.delta+addons.reduce((s,a)=>s+(ADDONS.find(x=>x.label===a)?.delta||0),0))*qty)}</p></div>
      <button disabled={!itemModal.available} onClick={addToCart} className="mt-4 w-full bg-[var(--yellow)] py-3.5 rounded-full font-bold disabled:opacity-40">{itemModal.available?`Add to cart • ${money((itemModal.price+variant.delta+addons.reduce((s,a)=>s+(ADDONS.find(x=>x.label===a)?.delta||0),0))*qty)}`:'Sold out'}</button><p className="text-center text-xs mt-2">Demo only — no real order is placed until checkout.</p></div></div></div>}

    {/* SWITCH CART MODAL */}
    {switchModal && <div role="dialog" aria-modal="true" aria-label="Switch cart" className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4"><div className="bg-white rounded-3xl p-6 max-w-md w-full"><h2 className="font-display text-2xl">Start a new cart?</h2><p className="mt-2">Your cart has items from <strong>{getOutlet(prefs.cart.outletId).name}</strong>. Start a new cart at <strong>{getOutlet(switchModal.outletId).name}</strong>?</p><p className="text-sm mt-1">This will clear your current cart. Your current items will not be saved.</p><div className="flex gap-2 mt-5"><button onClick={()=>{savePrefs({...prefs,cart:{outletId:'',lines:[],coupon:'',slot:''}}); setSwitchModal(null); toast('Cart cleared. Add the new item again.');}} className="flex-1 bg-black text-white py-3 rounded-full font-bold">Clear cart & switch</button><button onClick={()=>setSwitchModal(null)} className="flex-1 border py-3 rounded-full font-bold">Keep current cart</button></div></div></div>}

    {/* CART DRAWER */}
    {cartOpen && <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/50" onClick={()=>setCartOpen(false)}/><aside role="dialog" aria-modal="true" aria-label="Shopping cart" className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"><div className="p-5 flex justify-between items-center border-b"><h2 className="font-display text-2xl">Your cart</h2><button onClick={()=>setCartOpen(false)} className="w-10 h-10 rounded-full border text-xl" aria-label="Close cart">×</button></div><div className="flex-1 overflow-y-auto p-5">{prefs.cart.lines.length===0?<div className="text-center py-10"><p className="text-4xl">🛒</p><p className="font-bold mt-2">Your cart is empty</p><p className="text-sm">Browse outlets and add something tasty.</p><button onClick={()=>{setCartOpen(false);setSView('discover');setSelectedOutlet(null);}} className="mt-4 bg-[var(--yellow)] px-5 py-2.5 rounded-full font-bold">Browse outlets</button></div>:<><p className="font-bold">{getOutlet(prefs.cart.outletId).name} • Est. ~{estimateFor(prefs.cart.outletId)} min (estimate)</p>{prefs.cart.lines.map(l=><div key={l.key} className="flex gap-3 py-3 border-b"><img src={l.img} alt={l.name} className="w-16 h-16 rounded-xl object-cover"/><div className="flex-1 min-w-0"><p className="font-bold">{l.name}</p><p className="text-xs">{l.variant}{l.addOns.length?` • ${l.addOns.join(', ')}`:''}</p><p className="text-sm">{money(l.unitPrice)} each</p></div><div className="flex flex-col items-end gap-1"><button onClick={()=>updatePrefs({cart:{...prefs.cart,lines:prefs.cart.lines.filter(x=>x.key!==l.key)}})} className="text-xs underline">Remove</button><div className="flex items-center gap-1"><button aria-label={`Decrease ${l.name}`} onClick={()=>updatePrefs({cart:{...prefs.cart,lines:prefs.cart.lines.map(x=>x.key===l.key?{...x,qty:Math.max(1,x.qty-1)}:x)}})} className="w-8 h-8 border rounded-full">−</button><span className="w-6 text-center font-bold">{l.qty}</span><button aria-label={`Increase ${l.name}`} onClick={()=>updatePrefs({cart:{...prefs.cart,lines:prefs.cart.lines.map(x=>x.key===l.key?{...x,qty:x.qty+1}:x)}})} className="w-8 h-8 border rounded-full">+</button></div><p className="font-bold text-sm">{money(l.unitPrice*l.qty)}</p></div></div>)}
      <div className="mt-4"><label className="text-sm font-bold" htmlFor="coupon">Coupon code</label><div className="flex gap-2 mt-1"><input id="coupon" value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder="CAMPUS10" className="flex-1 border rounded-xl px-3 py-2.5"/><button onClick={applyCoupon} className="bg-black text-white px-4 rounded-xl font-bold text-sm">Apply</button></div>{couponMsg && <p className="text-sm mt-1">{couponMsg}</p>}<p className="text-xs mt-1">Try CAMPUS10 • BITE20 • FIRSTBITE</p></div>
      <div className="mt-4"><label className="text-sm font-bold" htmlFor="slot">Pickup slot</label><select id="slot" value={prefs.cart.slot} onChange={e=>updatePrefs({cart:{...prefs.cart,slot:e.target.value}})} className="mt-1 w-full border rounded-xl px-3 py-2.5"><option value="">Choose a future slot…</option>{slots.map(s=><option key={s} value={s}>{s}</option>)}</select><p className="text-xs mt-1">Future slots only. Past times are not offered.</p></div>
      </>}</div><div className="p-5 border-t bg-[#F2F4F1]"><div className="space-y-1 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></p><p className="flex justify-between"><span>Discount</span><span>− {money(discount)}</span></p><p className="flex justify-between font-bold text-lg"><span>Total</span><span>{money(total)}</span></p></div><button disabled={prefs.cart.lines.length===0} onClick={()=>{setCartOpen(false);setCheckoutOpen(true);}} className="mt-3 w-full bg-[var(--yellow)] py-3.5 rounded-full font-bold disabled:opacity-40">Proceed to checkout • {money(total)}</button></div></aside></div>}

    {/* CHECKOUT */}
    {checkoutOpen && <div role="dialog" aria-modal="true" aria-label="Checkout" className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-y-auto"><div className="bg-white rounded-3xl p-6 w-full max-w-lg my-6"><div className="flex justify-between"><h2 className="font-display text-3xl">Checkout</h2><button onClick={()=>setCheckoutOpen(false)} className="w-10 h-10 rounded-full border text-xl" aria-label="Close checkout">×</button></div><p className="text-sm mt-2"><strong>{getOutlet(prefs.cart.outletId).name}</strong> • Pickup: <strong>{prefs.cart.slot||'No slot selected'}</strong></p><ul className="mt-3 text-sm space-y-1">{prefs.cart.lines.map(l=><li key={l.key} className="flex justify-between"><span>{l.name} × {l.qty} — {l.variant}</span><span>{money(l.unitPrice*l.qty)}</span></li>)}</ul><div className="border-t mt-3 pt-3 text-sm space-y-1"><p className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></p><p className="flex justify-between"><span>Discount</span><span>− {money(discount)}</span></p><p className="flex justify-between font-bold text-lg"><span>Total</span><span>{money(total)}</span></p></div><div className="mt-4 bg-[#FFF8D6] border border-[#FFC928] rounded-2xl p-4"><p className="font-bold">DEMO PAYMENT — no real money</p><p className="text-sm mt-1">No card, UPI or credential fields are collected. Choose a simulated outcome below.</p></div>{checkoutErr && <p role="alert" className="mt-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-sm">{checkoutErr}</p>}<div className="grid sm:grid-cols-2 gap-2 mt-4"><button disabled={processing} onClick={()=>checkout(true)} className="bg-[var(--yellow)] py-3 rounded-full font-bold disabled:opacity-50">{processing?'Processing…':'Simulate Payment Success'}</button><button disabled={processing} onClick={()=>checkout(false)} className="border py-3 rounded-full font-bold disabled:opacity-50">{processing?'Processing…':'Simulate Payment Failure'}</button></div>{processing && <p className="text-center text-sm mt-3" role="status">Processing demo payment… please wait.</p>}</div></div>}

    {/* TICKET */}
    {ticket && <div role="dialog" aria-modal="true" aria-label="Pickup ticket" className="fixed inset-0 z-50 bg-[var(--graphite)]/95 overflow-y-auto p-4 grid place-items-center"><div className="bg-white rounded-[2rem] p-6 w-full max-w-md my-6"><p className="text-center text-xs font-bold tracking-widest">PICKUP TICKET • DEMO</p><h2 className="font-display text-3xl text-center mt-2">Order placed!</h2><p className="text-center text-sm mt-1">Show this ticket at the counter.</p><div className="mt-4 border rounded-2xl p-4"><p className="flex justify-between font-bold"><span>{ticket.orderId}</span><span>{ticket.status}</span></p><p className="text-sm mt-1">{ticket.outletName} • {ticket.slot}</p><p className="text-sm">{ticket.lines.map(l=>`${l.name} × ${l.qty}`).join(' • ')}</p><p className="font-bold mt-2">Total {money(ticket.total)}</p><div className="mt-3 grid grid-cols-21 gap-[2px]" style={{gridTemplateColumns:'repeat(21,1fr)'}}>{qrGrid(ticket.ticketCode).map((on,i)=><span key={i} className={`aspect-square ${on?'bg-black':'bg-[#E8EAE6]'}`}/>)}</div><p className="text-center font-mono font-bold mt-2">{ticket.ticketCode}</p><p className="text-center text-xs mt-1">QR contains only order reference. Verification is simulated, not secure.</p></div><div className="grid grid-cols-2 gap-2 mt-4"><button onClick={()=>{setTicket(null);setSView('orders');}} className="bg-[var(--yellow)] py-3 rounded-full font-bold">View Order Tracking</button><button onClick={()=>setTicket(null)} className="border py-3 rounded-full font-bold">Continue browsing</button></div></div></div>}

    {/* REVIEW MODAL */}
    {reviewForm && <div role="dialog" aria-modal="true" aria-label="Leave a review" className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4"><div className="bg-white rounded-3xl p-6 w-full max-w-md"><div className="flex justify-between"><h2 className="font-display text-2xl">Leave a review</h2><button onClick={()=>setReviewForm(null)} className="w-10 h-10 rounded-full border" aria-label="Close review">×</button></div><p className="text-sm mt-1">Only after Collected. Rating is required.</p><div className="flex gap-1 mt-4" role="radiogroup" aria-label="Star rating">{[1,2,3,4,5].map(n=><button key={n} role="radio" aria-checked={reviewForm.rating===n} aria-label={`${n} star${n>1?'s':''}`} onClick={()=>setReviewForm({...reviewForm,rating:n})} className="text-4xl">{reviewForm.rating>=n?'★':'☆'}</button>)}</div><label className="block text-sm font-bold mt-4" htmlFor="review-comment">Comment (optional, max 300)</label><textarea id="review-comment" value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm,comment:e.target.value.slice(0,300)})} className="mt-1 w-full border rounded-xl px-3 py-2" rows={3} placeholder="How was your pickup?"/><p className="text-xs text-right">{reviewForm.comment.length}/300</p><button onClick={submitReview} className="mt-2 w-full bg-[var(--yellow)] py-3 rounded-full font-bold">Submit review</button></div></div>}

    {/* TOASTS */}
    <div aria-live="polite" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">{toasts.map(t=><div key={t.id} className="bg-black text-white px-4 py-3 rounded-2xl shadow-xl text-sm text-center pointer-events-auto">{t.msg}</div>)}</div>
  </div>);
}
