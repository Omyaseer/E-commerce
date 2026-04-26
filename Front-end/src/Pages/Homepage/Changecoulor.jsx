import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Changecoulor({ product }) {
  const [love, setLove] = useState(false);
  const [see, setSee] = useState(false);
  const navigate = useNavigate();

  const handleHeartClick = () => {
    setLove((prev) => {
      const nextLove = !prev;

      // If we have product data, sync with localStorage wishlist
      if (product) {
        const stored =
          JSON.parse(localStorage.getItem("wishlistItems")) || [];

        let updated = stored;

        if (nextLove) {
          const exists = stored.some((item) => item.id === product.id);
          if (!exists) {
            updated = [
              ...stored,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice || null,
                img: product.img,
                salePercentage: product.salePercentage || null,
                qty: product.qty || 1,
              },
            ];
          }
        } else {
          updated = stored.filter((item) => item.id !== product.id);
        }

        localStorage.setItem("wishlistItems", JSON.stringify(updated));
      }

      navigate("/Whishlist");
      return nextLove;
    });
  };

  return (
    <>
      <div
        className={`card-circle ${love ? "card-circle1 svg path" : ""}`}
        onClick={handleHeartClick}
        id="heartBtn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 48 48"
        >
          <path
            id="heartPath"
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M24.136 9.1c3.31-3.409 5.46-3.6 7.525-3.6c5.815 0 10.478 6.055 10.394 11.612c-.131 8.693-5.281 16.117-17.932 25.388C12.748 34.747 6.137 24.862 5.947 17.599C5.808 12.318 10.823 5.5 16.665 5.5c2.256 0 4.125.148 7.471 3.6"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div
        className={`card-circlev ${see ? "card-circlev2 svg g" : ""}`}
        onClick={() => setSee((e) => !e)}
        id="heartBtn1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            id="heartPath2"
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
            <path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7" />
          </g>
        </svg>
      </div>
    </>
  );
}

export default Changecoulor;
