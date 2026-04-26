import "./Whishlist.css";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../../component/Card/Card";
import { toast } from "react-toastify";

export default function Whishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];
    setWishlistItems(stored);
  }, []);

  const moveAllToBag = () => {
    if (!wishlistItems.length) return;

    const existingCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    const merged = [...existingCart];

    wishlistItems.forEach((item) => {
      const alreadyInCart = merged.some(
        (cartItem) => cartItem.id === item.id
      );
      if (!alreadyInCart) {
        merged.push({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
          img: item.img,
        });
      } 
    });

    localStorage.setItem("cartItems", JSON.stringify(merged));
    navigate("/cart");
  };

  const removeFromWishlist = (id) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
  };

  const addSingleToCart = (item) => {
    const existingCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    const alreadyInCart = existingCart.some(
      (cartItem) => cartItem.id === item.id
    );
    const merged = alreadyInCart
      ? existingCart
      : [
          ...existingCart,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty || 1,
            img: item.img,
          },
        ];

    localStorage.setItem("cartItems", JSON.stringify(merged));
    toast.success("Item added to cart");
  };

  return (
    <div className={"whishListPageLayout"}>
      <div className="centerHolder">
        <div className="headlinesStyle">
          <h1>Whishlist ({wishlistItems.length})</h1>
          <button onClick={moveAllToBag}>Move All To Bag</button>
        </div>

        {!wishlistItems.length && (
          <p className="text-center mt-4">
            You have no items in your wishlist yet.
          </p>
        )}

        <div className="cardsHolder">
          {wishlistItems.map((item) => (
            <Card
              key={item.id}
              imgSrc={item.img}
              prodName={item.name}
              finalPrice={item.price}
              originalPrice={item.originalPrice || undefined}
              salePercentage={item.salePercentage || undefined}
              del={true}
              onDelete={() => removeFromWishlist(item.id)}
              onAddToCart={() => addSingleToCart(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
