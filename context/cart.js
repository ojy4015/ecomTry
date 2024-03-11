// The Shopping Cart page lists all of the items that a customer added to their shopping cart.
// Cart is a array stored in loadStorage
// all the functionality of the cart

import { useState, createContext, useContext, useEffect } from "react";
import { useRef } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // state
  const [cartItems, setCartItems] = useState([]);

  // // localStorage에 cartItems는 JSON형태의 배열로 저장됨
  // // load cartItems from local storage on component mount
  // useEffect(() => {
  //   const storedCartItmes = JSON.parse(localStorage.getItem("cartItems")) || []; // 없으면 빈배열
  //   setCartItems(storedCartItmes);
  // }, []);

  // // save cart items to local storage when cart items change(save to the state)
  // //   so we can get cart items when come back later or page reload
  // useEffect(() => {
  //   localStorage.setItem("cartItems", JSON.stringify(cartItems));
  // }, [cartItems]);



  // solutin fro localStorage empty everytime i refresh the page (이해 안됨)

  const initialRender = useRef(true);
 
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("cartItems"))) {
      const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
      setCartItems([...cartItems, ...storedCartItems]);
    }
  }, []);
 
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // add to cart
  const addToCart = (product, quantity) => {
    // console.log("quantity --- --> ", quantity);
    // we need to find out if there are any existing products

    // console.log("product in addToCart --->  ", product);
    // console.log("cartItems in addToCart --->  ", cartItems);
    const existingProduct = cartItems.find(
      (item) => item?._id === product?._id
    );

    // console.log("existingProduct in addToCart ==>  ", existingProduct);

    // 해당 item의 quantity 1만큼 증가하고 나머지는 그대로
    if (existingProduct) {
      const updatedCartItems = cartItems.map((item) =>
        item?._id === product?._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(updatedCartItems);
      // console.log("after addToCart ==> ", cartItems);
    // update local storage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    } else {
      // console.log("product in addToCart in else block  --->  ", product);
      setCartItems([...cartItems, { ...product, quantity }]); // qnantity = 1(default)
      // console.log("after addToCart in else ==> ", cartItems);
    }
  };

//   // remove from cart
//   const removeFromCart = (product, quantity) => {
//     // console.log("quantity --- --> ", quantity);
//     // we need to find out if there are any existing products
//     const existingProduct = cartItems.find(
//       (item) => item?._id === product?._id
//     );

//     // 해당 item의 quantity 만큼 증가하고 나머지는 그대로
//     if (existingProduct) {
//       const updatedCartItems = cartItems.map((item) =>
//         item?._id === product?._id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//       setCartItems(updatedCartItems);
//     //   console.log("after addToCart ==> ", cartItems);
//     } else {
//       setCartItems([...cartItems, { ...product, quantity }]); // qnantity = 1(default)
//     //   console.log("after addToCart in else ==> ", cartItems);
//     }
//   };



  // remove product(통채로 전체) from cart
  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter(
      (item) => item?._id !== productId
    );
    setCartItems(updatedCartItems);
    // console.log("after removeFromCart ==> ", cartItems);

    // update local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  // update quantity
  const updateQuantity = (product, quantity) => {
 
    // 해당 item의 quantity를 원하는 수로 수정
      const updatedCartItems = cartItems.map((item) =>
        item?._id === product?._id
          ? { ...item, quantity }
          : item
      );
      setCartItems(updatedCartItems);
    //   console.log("after updateToCart ==> ", cartItems);
    // update local storage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

//   // add or subtract(quantity 가 마이너스) to cart
//   const updateToCart = (product, quantity = 1) => {
//     console.log("quantity --- --> ", quantity);
//     // default quantity = 1
//     // we need to find out if there are any existing products
//     const existingProduct = cartItems.find(
//       (item) => item?._id === product?._id
//     );

//     // 해당 item의 quantity 만큼 증가하고 나머지는 그대로
//     if (existingProduct) {
//       const updatedCartItems = cartItems.map((item) =>
//         item?._id === product?._id
//           ? { ...item, quantity: item.quantity + quantity }
//           : item
//       );
//       setCartItems(updatedCartItems);
//       console.log("after addToCart ==> ", cartItems);
//     } else {
//       setCartItems([...cartItems, { ...product, quantity }]); // qnantity : quantity 더한 새로운 product추가함
//       console.log("after addToCart in else ==> ", cartItems);
//     }
//     // update local storage
//     // if(typeof window !== "undefined") {
//     //     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     // }
//   };

//   // remove product(통채로 전체) from cart
//   const removeFromCart = (productId) => {
//     const updatedCartItems = cartItems.filter(
//       (item) => item?._id !== productId
//     );
//     setCartItems(updatedCartItems);
//     console.log("after removeFromCart ==> ", cartItems);

//     // update local storage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//     }
//   };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// const {
//  cartItems,
//  addToCart,
//  removeFromCart,
//  updateQuantity,
// } = useCart();







// localStorage
// Key : cartItems
// Value :
// [
// {
// "photos":[{"ETag":"\"693d532e0f2f19f721bb4598af037905\"","ServerSideEncryption":"AES256","Location":"https://hyung-aws-bucket.s3.amazonaws.com/9K0vo5-dszPoO0ONj5x17.jpeg","key":"9K0vo5-dszPoO0ONj5x17.jpeg","Key":"9K0vo5-dszPoO0ONj5x17.jpeg","Bucket":"hyung-aws-bucket"}],
// "isSold":false,
// "type":"House",
// "action":"Sell",
// "views":0,
// "ratingsAverage":3.8,
// "ratingsQuantity":3,
// "guides":[],
// "sold":3,
// "_id":"65505a68c96c5e39b8ee39ac",
// "price":5,
// "address":"Seoul National University, 관악로 관악구 서울특별시 대한민국",
// "bedrooms":5,
// "bathrooms":5,
// "carpark":4,
// "landsize":"500sqm",
// "name":"seoul house for selling hh",
// "description":"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
// "quantity":7,
// "categoryIn":"64dac71a40e0281b6473b270",
// "postedBy":"64f934a3d757d06f2c3c4792",
// "slug":"house-seoul-national-university-5-nd9bxo",
// "createdAt":"2023-11-12T04:54:00.752Z",
// "updatedAt":"2023-11-12T04:54:00.752Z",
// "__v":0,
// "durationWeeks":null,
// "id":"65505a68c96c5e39b8ee39ac"
// },
// {
// "photos":[{"ETag":"\"3b7c634d57dfc2d438b365250791feeb\"","ServerSideEncryption":"AES256","Location":"https://hyung-aws-bucket.s3.amazonaws.com/1ANebZ23M6k1q8Fcn7TO_.jpeg","key":"1ANebZ23M6k1q8Fcn7TO_.jpeg","Key":"1ANebZ23M6k1q8Fcn7TO_.jpeg","Bucket":"hyung-aws-bucket"}],
// "isSold":false,
// "type":"House",
// "action":"Sell",
// "views":0,
// "ratingsAverage":3.5,
// "ratingsQuantity":1,
// "guides":[],
// "sold":2,
// "_id":"654de9d3c2315962e44f6e98",
// "price":200000,
// "address":"Seoul Station (Airport Railway), 청파로 용산구 서울특별시 대한민국",
// "bedrooms":1,
// "bathrooms":2,
// "carpark":2,
// "landsize":"200sqm",
// "name":"seoul house for selling",
// "description":"kkkkkkkkkkkkkkkkkkkkkkkkkkk",
// "quantity":5,
// "categoryIn":"64dac71440e0281b6473b26f",
// "postedBy":"64fadac7d09a577998d41631",
// "slug":"house-seoul-station-(airport-railway)-200000-sbvdi1",
// "createdAt":"2023-11-10T08:29:07.686Z",
// "updatedAt":"2023-11-10T08:29:07.686Z",
// "__v":0,
// "durationWeeks":null,
// "id":"654de9d3c2315962e44f6e98"
// }
// ]

// // // [{"_id":"65bee79a936e6211bdd2a120","title":"Beaully Women's Flannel Plaid Shacket Long Sleeve Button Down Shirts Jacket Coats with Side Pockets","slug":"beaully-women's-flannel-plaid-shacket-long-sleeve-button-down-shirts-jacket-coats-with-side-pockets","description":"[Material]-The button up shirt made with high quality flannel. The flannel fabric is soft, wear-resistant, and has good warmth retention.soft to the touch and comfortable to wear.best for autumn and winter.\n[Feature]-The flannel jacket,Button front top,plaid print,Scoop hemline,Two flap chest pocket,Single button on cuff,Soft fabrication,Oversized fit,Drop shoulder,Unlined.\n[Flannel Plaid Shirts]-So versatile is our flannel button down pocket top that can be worn open as a jacket or closed as a shirt! oversized, loose fitting, casual style great to match with basic T-shirt, crop top, leggings, jeans, bodycon dress, sneakers or high heels for casual look that's easy to love all season long.\n[Brushed Plaid Shirts]-This color block plaid piece is designed with a collar, long sleeves and button cuffs. Finished to perfection with bust flap pockets. Our most requested fall/winter silhouette.\n[Occasion] -The fashion button down jacket is perfect choice for your daily wear, outdoor activities, shopping,Vacation, Travel, Hang out,club, party, dates.Package content: 1 X women's jacket.","price":25.46,"color":"blue","brand":"Beaully Store","stock":200,"shipping":true,"category":{"_id":"65af749979ebc932faa968e4","name":"Women's Fashion","slug":"women's-fashion"},"tags":[{"_id":"65b6426bc13dd08ee2d0fdc9","name":"Outerwear","slug":"outerwear"},{"_id":"65b64262c13dd08ee2d0fdc4","name":"Bottoms","slug":"bottoms"},{"_id":"65b6425bc13dd08ee2d0fdbf","name":"Tops","slug":"tops"},{"_id":"65b64253c13dd08ee2d0fdba","name":"Dresses","slug":"dresses"}],"images":[{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707009943/i4tzihedawinkbqcks3v.jpg","public_id":"i4tzihedawinkbqcks3v","_id":"65bee79a936e6211bdd2a121"},{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707009924/qklar1trkmotyxmspxpd.jpg","public_id":"qklar1trkmotyxmspxpd","_id":"65bee79a936e6211bdd2a122"}],"sold":0,"likes":["65a8800a8bce848edfdf2fa2","65ac66632f7298845d40bf97"],"ratings":[{"rating":2,"comment":"very good product!!!great","postedBy":"65a8800a8bce848edfdf2fa2","_id":"65cdaa366210e1fc86a854fc","createdAt":"2024-02-15T06:07:50.757Z","updatedAt":"2024-02-15T06:16:21.734Z"},{"rating":5,"comment":"wonderful","postedBy":"65a8a5a4fc1795ff1d33061c","_id":"65cdad156210e1fc86a8555d","createdAt":"2024-02-15T06:20:05.181Z","updatedAt":"2024-02-15T06:37:35.315Z"},{"rating":3,"comment":"great great !!!!!","postedBy":"65ac66632f7298845d40bf97","_id":"65d2b4a1bd61abd62660e8c2","createdAt":"2024-02-19T01:53:37.196Z","updatedAt":"2024-02-19T01:53:37.196Z"}],"createdAt":"2024-02-04T01:25:46.985Z","updatedAt":"2024-02-19T01:53:58.051Z","__v":3,"quantity":1},{"_id":"65bee715936e6211bdd2a114","title":"Dokotoo Women's Casual Crew Neck Sweatshirt Loose Soft Long Sleeve Pullover Tops","slug":"dokotoo-women's-casual-crew-neck-sweatshirt-loose-soft-long-sleeve-pullover-tops","description":"Women's Solid Color Long Sleeve Hoodie is made with lightweight and soft material that makes you feeling well for the soft skin.\nFeatures：Crewneck Sweatshirt, Women's Fashion Hoodies & Sweatshirts, Long Sleeve, Relaxed Fit, Classic Solid Color Pullover Tops, Side Splits.\nStyle: Our long sleeve sweatshirt makes the perfect casual&athleisure style. Easily pair it with jeans, shorts, leggings, skirts for a casual everyday look.\nOccasion: 2022 Latest Fashion Womens Sweatshirt are suitable for daily life, party, school, vacation, office, work, sportswear, home etc.\nPackage Content:1 x Womens Sweatshirts. Please Refer to the Dokotoo Size Chart before Ordering. Anyother questions, please contact us freely.","price":32.88,"color":"yellow","brand":"Dokotoo Store","stock":790,"shipping":true,"category":{"_id":"65af749979ebc932faa968e4","name":"Women's Fashion","slug":"women's-fashion"},"tags":[{"_id":"65b64253c13dd08ee2d0fdba","name":"Dresses","slug":"dresses"},{"_id":"65b6425bc13dd08ee2d0fdbf","name":"Tops","slug":"tops"},{"_id":"65b6426bc13dd08ee2d0fdc9","name":"Outerwear","slug":"outerwear"}],"images":[{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707009804/inb8dca7jfur9yjojgix.jpg","public_id":"inb8dca7jfur9yjojgix","_id":"65bee715936e6211bdd2a115"},{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707009783/qikth0itbviofsrtzytd.jpg","public_id":"qikth0itbviofsrtzytd","_id":"65bee715936e6211bdd2a116"}],"sold":0,"likes":[],"ratings":[],"createdAt":"2024-02-04T01:23:33.246Z","updatedAt":"2024-02-04T01:23:33.246Z","__v":0,"quantity":1},{"_id":"65bee821936e6211bdd2a12c","title":"LOMON Womens Fuzzy Sherpa Fleece Jacket Lightweight Vest Cozy Sleeveless Cardigan Zipper Waistcoat Outerwear with Pocket","slug":"lomon-womens-fuzzy-sherpa-fleece-jacket-lightweight-vest-cozy-sleeveless-cardigan-zipper-waistcoat-outerwear-with-pocket","description":"Features: Lightweight,Open vest with zipper closure, Stand collar, Faux fur lined, Sleeveless,Two hand pockets at waist side Outwear vest\nSoft and fluffy furry vest--The fuzzy vest feels like a cozy blanket on your body.It keep you warm on a chilly day.It's not lined, you can feel the soft material on the inside.You will be looking for every excuse to wear this cardigan.\nLightweight and warm sherpa vest--You can wear it with bright color shirt underneath.This vest is long enough to cover your torso.Very cute vest that adds a little extra fashionable element to any outfit.\nCute zipper fleece vest--The zipper don't get stuck.It have room enough for a warm sweater.It’s incredibly soft on the inside and outside.Perfect for daily life,party, beach, vacation,office or Any Special Occasions.Suitable for spring, autumn,winter.\nWarm Tip:1.Color disclaimer: Due to the monitor settings, the colors may look different. 2.Please check the size measurement in the left pictures or in the Product Descriptions.","price":26.39,"color":"white","brand":"LOMON Store","stock":26.39,"shipping":true,"category":{"_id":"65af749979ebc932faa968e4","name":"Women's Fashion","slug":"women's-fashion"},"tags":[{"_id":"65b6426bc13dd08ee2d0fdc9","name":"Outerwear","slug":"outerwear"},{"_id":"65b6425bc13dd08ee2d0fdbf","name":"Tops","slug":"tops"},{"_id":"65b64253c13dd08ee2d0fdba","name":"Dresses","slug":"dresses"}],"images":[{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707010078/h1t9a63aywet4occmtss.jpg","public_id":"h1t9a63aywet4occmtss","_id":"65bee821936e6211bdd2a12d"},{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707010059/urfxpq409xqblauujumw.jpg","public_id":"urfxpq409xqblauujumw","_id":"65bee821936e6211bdd2a12e"}],"sold":0,"likes":["65a8a5a4fc1795ff1d33061c","65a8800a8bce848edfdf2fa2"],"ratings":[],"createdAt":"2024-02-04T01:28:01.310Z","updatedAt":"2024-02-13T09:07:28.123Z","__v":0,"quantity":1},{"_id":"65d7f5a09b2b2db1a80a5397","title":"test1","slug":"test1","description":"test1 test1","price":100,"color":"red","brand":"brand","stock":100,"shipping":true,"category":{"_id":"65af749979ebc932faa968e4","name":"Women's Fashion","slug":"women's-fashion"},"tags":[{"_id":"65b64262c13dd08ee2d0fdc4","name":"Bottoms","slug":"bottoms"},{"_id":"65b64253c13dd08ee2d0fdba","name":"Dresses","slug":"dresses"}],"sold":0,"likes":[],"images":[],"ratings":[],"createdAt":"2024-02-23T01:32:16.673Z","updatedAt":"2024-02-23T01:32:16.673Z","__v":0,"quantity":1},{"_id":"65c4313dd887cef5f0471bc4","title":"test","slug":"test","description":"test test","price":100,"color":"red","brand":"brand","stock":200,"shipping":true,"category":{"_id":"65af749979ebc932faa968e4","name":"Women's Fashion","slug":"women's-fashion"},"tags":[{"_id":"65b6426bc13dd08ee2d0fdc9","name":"Outerwear","slug":"outerwear"},{"_id":"65b64262c13dd08ee2d0fdc4","name":"Bottoms","slug":"bottoms"}],"sold":0,"images":[],"likes":["65a8800a8bce848edfdf2fa2"],"ratings":[{"rating":3,"comment":"llllllllllllllllllllllllllllllllllllllllllllllllllll","postedBy":"65ac66632f7298845d40bf97","_id":"65cdcaa76210e1fc86a858de","createdAt":"2024-02-15T08:26:15.255Z","updatedAt":"2024-02-15T08:31:30.336Z"}],"createdAt":"2024-02-08T01:41:17.140Z","updatedAt":"2024-02-15T08:31:30.336Z","__v":1,"quantity":1},{"_id":"65bee90e936e6211bdd2a144","title":"Levi's Women's Low Pro Jeans","slug":"levi's-women's-low-pro-jeans","description":"Low Rise; Loose through hip and thigh\nTrue to Size\nNon-stretch","price":69.99,"color":"blue","brand":"Levi's Store","stock":700,"shipping":true,"category":{"_id":"65af749979ebc932faa968e4","name":"Women's Fashion","slug":"women's-fashion"},"tags":[{"_id":"65b64262c13dd08ee2d0fdc4","name":"Bottoms","slug":"bottoms"},{"_id":"65b64253c13dd08ee2d0fdba","name":"Dresses","slug":"dresses"}],"images":[{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707010314/ywefu4udbfjfxqs0dqwr.jpg","public_id":"ywefu4udbfjfxqs0dqwr","_id":"65bee90e936e6211bdd2a145"},{"secure_url":"https://res.cloudinary.com/dvzxrprzr/image/upload/v1707010296/noypkfwuet5qx5fjtaux.jpg","public_id":"noypkfwuet5qx5fjtaux","_id":"65bee90e936e6211bdd2a146"}],"sold":0,"likes":[],"ratings":[{"rating":4,"comment":"second comment2","postedBy":"65a8a5a4fc1795ff1d33061c","_id":"65cdb3cc6210e1fc86a85661","createdAt":"2024-02-15T06:48:44.689Z","updatedAt":"2024-02-15T06:49:57.270Z"},{"rating":1,"comment":"ttttttteeeee","postedBy":"65a8800a8bce848edfdf2fa2","_id":"65cdb42f6210e1fc86a856f4","createdAt":"2024-02-15T06:50:23.483Z","updatedAt":"2024-02-15T06:50:34.060Z"},{"rating":1,"comment":"great great","postedBy":"65ac66632f7298845d40bf97","_id":"65cdb50a6210e1fc86a8573c","createdAt":"2024-02-15T06:54:02.244Z","updatedAt":"2024-02-15T08:06:04.870Z"}],"createdAt":"2024-02-04T01:31:58.700Z","updatedAt":"2024-02-15T08:06:04.870Z","__v":3,"quantity":1}]
