import React, { useEffect, useState } from "react";
import Display from "./Display"; // Importing the Display component

export default function Products() {
    const [products, setProducts] = useState([]); // State to hold products
    const [error, setError] = useState(null); // State to hold error messages

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/prod-list"
                ); // Adjust URL if needed
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json(); // Parse JSON data
                console.log(data); // Log the fetched data for debugging
                if (Array.isArray(data.products)) {
                    // Assuming products is the key
                    setProducts(data.products); // Update state with the products array
                } else {
                    console.error("Expected an array but got:", data);
                    setError("Invalid data format.");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Error fetching products."); // Update error state if fetch fails
            }
        };

        fetchProducts(); // Call the fetch function
    }, []);

    return (
        <div>
            <h4>Products Ordered:</h4>
            <h5>The products:</h5>
            <ul className="product-grid">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map(
                        ({
                            _id,
                            product,
                            name,
                            price,
                            rating,
                            category,
                            inStock,
                        }) => (
                            <Display
                                key={_id}
                                product={product}
                                name={name}
                                price={price}
                                rating={rating}
                                category={category}
                                inStock={inStock}
                            />
                        )
                    )
                ) : (
                    <p>No products available.</p> // Message for no products
                )}
            </ul>
            {error && <p>{error}</p>} {/* Display error message if exists */}
        </div>
    );
}
