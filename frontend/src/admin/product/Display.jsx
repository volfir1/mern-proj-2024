import React from "react";

export default function Display({
    _id,
    product,
    name,
    price,
    rating,
    category,
    inStock,
}) {
    return (
        <div className="product-card" key={_id}>
            <h2 className="product-name">{name}</h2>
            <p className="product-description">{product}</p>
            <p className="product-price">
                Price: ${price ? price.toFixed(2) : "N/A"}
            </p>
            <p className="product-rating">
                Rating: {rating !== null ? rating : "N/A"} ⭐
            </p>
            <p className="product-stock">
                {inStock ? "In Stock" : "Out of Stock"}
            </p>
            <p className="product-category">Category: {category}</p>
        </div>
    );
}
